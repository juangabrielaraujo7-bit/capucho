import { createHash } from "node:crypto";
import { benefit, cents, discountInCents, money, normalizeCode, publishedCoupon } from "../shared/coupon.js";
import { sanityQuery, couponProjection } from "./sanity.js";
import { wa } from "../src/config.js";
import { assemblyBenefitsText, ownPartsAssemblyText } from "../shared/customer-care.js";

const steps = { cpu: "Processador", board: "Placa-mãe", ram: "Memória RAM", gpu: "Placa de vídeo", storage: "Armazenamento", cooler: "Cooler", psu: "Fonte", case: "Gabinete" };
const optionLabels = { help: "Quero indicação da Capucho", own: "Já tenho essa peça", none: "Sem placa de vídeo (vídeo integrado)", box: "Cooler que vem com o processador" };
export class OrderError extends Error { constructor(message) { super(message); this.status = 400; } }
export async function createQuote(body, query = sanityQuery) {
  if (!body || !Array.isArray(body.selections) || body.selections.length > 8 || (body.code != null && (typeof body.code !== "string" || body.code.length > 100))) throw new OrderError("Pedido inválido. Revise as peças escolhidas.");
  const seen = new Set();
  for (const selection of body.selections) {
    if (!selection || !Object.hasOwn(steps, selection.step) || seen.has(selection.step)) throw new OrderError("Cada etapa pode ter apenas uma escolha.");
    seen.add(selection.step);
    if (selection.productId) {
      if (typeof selection.productId !== "string" || !/^[a-zA-Z0-9_.-]{1,200}$/.test(selection.productId) || selection.option) throw new OrderError("Peça inválida.");
    } else if (!Object.hasOwn(optionLabels, selection.option) || (selection.option === "none" && selection.step !== "gpu") || (selection.option === "box" && selection.step !== "cooler")) throw new OrderError("Escolha inválida.");
  }
  const ids = body.selections.filter(s => s.productId).map(s => s.productId);
  // One published-content snapshot supplies both the promotion and current product prices.
  const data = await query(`{"coupon":${couponProjection},"items":*[_type == "peca" && _id in $ids && active != false && revisao != "pendente"]{_id,category,name,price}}`, { ids });
  if (!data || !Array.isArray(data.items)) throw new Error("Catálogo indisponível");
  let subtotalCents = 0;
  const items = Object.entries(steps).map(([step, label]) => {
    const selection = body.selections.find(s => s.step === step);
    if (!selection?.productId) return { step, label, name: selection ? optionLabels[selection.option] : "A definir", cents: null };
    const doc = data.items.find(p => p._id === selection.productId && p.category === step);
    if (!doc?.name) throw new OrderError("Uma peça não está mais disponível no catálogo. Atualize o catálogo e revise a montagem.");
    const price = doc.price == null ? null : cents(doc.price);
    const priceCents = price > 0 ? price : null;
    subtotalCents += priceCents || 0;
    if (!Number.isSafeInteger(subtotalCents)) throw new Error("Subtotal fora do limite monetário");
    return { step, label, productId: doc._id, name: doc.name, cents: priceCents, unpriced: priceCents === null };
  });
  const offer = publishedCoupon(data.coupon);
  const code = normalizeCode(body.code);
  const invalidCoupon = Boolean(code && (!offer || code !== offer.code));
  const coupon = code && !invalidCoupon ? offer : null;
  const discountCents = discountInCents(subtotalCents, coupon);
  const totalCents = subtotalCents - discountCents;
  const version = createHash("sha256").update(JSON.stringify({ items, coupon, subtotalCents, discountCents, totalCents })).digest("hex");
  const partial = items.some(item => item.unpriced);
  const quote = { items, subtotalCents, discountCents, totalCents, coupon, version, partial };
  const lines = [
    "Olá, Capucho! Montei um PC no site e quero um orçamento com a montagem:", "",
    ...items.map(item => `• ${item.label}: ${item.name}${item.productId ? ` — ${item.cents === null ? "Sob consulta" : money(item.cents)}` : ""}`), "",
    `Subtotal das peças: ${money(subtotalCents)}${partial ? " (sem peças sob consulta)" : ""}`,
    coupon ? `Cupom aplicado: ${coupon.code}` : "Cupom: não aplicado",
    coupon ? `Benefício: ${coupon.discountType === "percentage" ? "Porcentagem" : "Valor fixo"} — ${benefit(coupon)}` : null,
    `Desconto do cupom: ${money(discountCents)}`,
    `Total estimado${coupon ? " com desconto" : ""}: ${money(totalCents)}`,
    "Frete e serviços cobrados separadamente não entram no desconto.",
    assemblyBenefitsText, ownPartsAssemblyText,
    "Disponibilidade, valores, prazo e orçamento são confirmados pela Capucho.",
  ];
  return { quote, invalidCoupon, whatsappUrl: invalidCoupon ? null : wa(lines.filter(l => l !== null).join("\n")) };
}
