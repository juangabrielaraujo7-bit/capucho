import { parts } from "./gamer";

// Catálogo do "Monte seu PC" vindo do painel Sanity (pasta studio/, https://capucho.sanity.studio).
// O Sanity é a fonte do catálogo. A lista de exemplo de gamer.js serve apenas para a importação inicial.
// Em falhas de rede, usa a última resposta válida deste navegador; nunca recupera preços de exemplo.
const projectId = "9in9aaz1";
const dataset = "production";
const CACHE_KEY = "capucho-catalogo";

for (const step of Object.keys(parts)) parts[step] = [];

// Só entra no montador a peça ativa e sem revisão técnica pendente. Peça sem preço aparece como "Sob consulta"
// e nunca conta como R$ 0 no total.
const query = `*[_type == "peca" && active != false && revisao != "pendente"] | order(price asc) {
  _id, category, name, brand, specs, price, stock, socket, memory, form, igpu, boxCooler,
  tdp, psu, maxTdp, radiator, watts, forms, caseRadiator, "image": image.asset->url, "imported": defined(fornecedor.sku), "supplierSku": fornecedor.sku,
  chipset, chipsets, memSlots, memMax, m2Slots, sataPorts, gb, modules, speed, length, vram, slots,
  pcie8, p16, iface, storageForm, sockets, height, maxGpu, maxCooler, psuForms, psuForm
}`;

// Campos técnicos extras (importação do fornecedor) que o montador usa nas conferências de compatibilidade.
const EXTRA = [
  "chipset", "chipsets", "memSlots", "memMax", "m2Slots", "sataPorts", "gb", "modules", "speed", "length",
  "vram", "slots", "pcie8", "p16", "iface", "storageForm", "sockets", "height", "maxGpu", "maxCooler",
  "psuForms", "psuForm",
];

// Converte um documento do Sanity no formato que src/gamer.js usa.
function toPart(doc) {
  const part = {
    // Peças importadas mantêm o id antigo (as configurações prontas dependem dele).
    id: doc._id.replace(/^peca-[a-z]+-/, ""),
    name: doc.name,
    specs: doc.specs ?? "",
    price: doc.price > 0 ? doc.price : undefined,
    stock: Boolean(doc.stock),
  };
  for (const key of ["brand", "socket", "memory", "form", "tdp", "psu", "maxTdp", "watts", ...EXTRA])
    if (doc[key] != null) part[key] = doc[key];
  if (doc.category === "cpu") {
    part.igpu = Boolean(doc.igpu);
    part.boxCooler = Boolean(doc.boxCooler);
  }
  if (doc.category === "cooler" && doc.radiator) part.radiator = doc.radiator;
  if (doc.category === "case") {
    part.forms = doc.forms ?? [];
    part.radiator = doc.caseRadiator ?? 0;
  }
  if (doc.imported) part.imported = true;
  // Peça importada sem foto enviada no painel usa a foto otimizada de public/assets/catalogo (studio/import/ciapc/imagens.mjs).
  if (!doc.image && doc.supplierSku) part.image = `catalogo/${doc.supplierSku}.webp`;
  if (doc.image) part.image = `${doc.image}?w=480&fit=max&auto=format`;
  return part;
}

function apply(docs) {
  if (!Array.isArray(docs) || docs.some((doc) => !doc || typeof doc._id !== "string"))
    throw new Error("Resposta de catálogo inválida");
  const next = Object.fromEntries(Object.keys(parts).map((step) => [step, []]));
  for (const doc of docs) if (next[doc.category] && doc.name) next[doc.category].push(toPart(doc));
  // Uma categoria vazia também é uma decisão do dono e substitui o catálogo anterior.
  for (const step of Object.keys(parts)) parts[step] = next[step];
}

// Informa a origem dos dados para o montador explicar falhas e uso de cache.
export async function loadCatalog() {
  if (typeof window === "undefined") return "unavailable";
  const url = `https://${projectId}.apicdn.sanity.io/v2025-02-19/data/query/${dataset}?query=${encodeURIComponent(query)}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) throw new Error(response.status);
    const { result } = await response.json();
    apply(result);
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(result));
    } catch {
      /* sem armazenamento */
    }
    return "live";
  } catch {
    try {
      const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || "null");
      if (cached) {
        apply(cached);
        return "cached";
      }
    } catch {
      /* sem armazenamento */
    }
    apply([]);
    return "unavailable";
  } finally {
    clearTimeout(timeout);
  }
}
