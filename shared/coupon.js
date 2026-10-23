// Shared by Studio and the server. No promotional defaults or browser-authoritative totals.
export const COUPON_ID = "cupom-desconto";
export const normalizeCode = value => typeof value === "string" ? value.trim().toUpperCase() : "";

function fraction(value) {
  if (!Number.isFinite(value) || value < 0) throw new Error("Valor monetário inválido");
  const [mantissa, exponent = "0"] = String(value).toLowerCase().split("e");
  const [whole, decimals = ""] = mantissa.split(".");
  const power = decimals.length - Number(exponent);
  const numerator = BigInt(whole + decimals);
  return power >= 0 ? [numerator, 10n ** BigInt(power)] : [numerator * 10n ** BigInt(-power), 1n];
}
const roundRatio = (numerator, denominator) => (numerator * 2n + denominator) / (denominator * 2n);
export function cents(value) {
  const [numerator, denominator] = fraction(value);
  const result = Number(roundRatio(numerator * 100n, denominator));
  if (!Number.isSafeInteger(result)) throw new Error("Valor fora do limite monetário");
  return result;
}
export function couponErrors(doc = {}) {
  const errors = {};
  if (doc.active && !normalizeCode(doc.code)) errors.code = "Informe o código para ativar o cupom.";
  if (doc.code != null && (typeof doc.code !== "string" || doc.code.trim().length > 80)) errors.code = "Use um código de até 80 caracteres.";
  if ((doc.active || doc.discountType != null) && !["percentage", "fixed"].includes(doc.discountType)) errors.discountType = "Escolha porcentagem ou valor fixo.";
  if (doc.active || doc.value != null) {
    if (!Number.isFinite(doc.value) || doc.value <= 0) errors.value = "Informe um valor maior que zero.";
    else if (doc.discountType === "percentage" && doc.value > 100) errors.value = "A porcentagem máxima é 100%.";
    else if (doc.discountType === "fixed") {
      const [n, d] = fraction(doc.value);
      if (n * 100n % d !== 0n) errors.value = "Use no máximo duas casas decimais.";
      else { try { cents(doc.value); } catch { errors.value = "Valor fora do limite monetário."; } }
    }
  }
  return errors;
}
export function publishedCoupon(doc) {
  if (!doc?.active) return null;
  if (Object.keys(couponErrors(doc)).length) throw new Error("Configuração do cupom inválida");
  return { code: normalizeCode(doc.code), discountType: doc.discountType, value: doc.value, revision: doc._rev || "" };
}
export function discountInCents(subtotal, coupon) {
  if (!Number.isSafeInteger(subtotal) || subtotal < 0) throw new Error("Subtotal inválido");
  if (!coupon) return 0;
  if (coupon.discountType === "fixed") return Math.min(subtotal, cents(coupon.value));
  const [n, d] = fraction(coupon.value);
  return Math.min(subtotal, Number(roundRatio(BigInt(subtotal) * n, d * 100n)));
}
export const money = value => (value / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
export const benefit = coupon => coupon.discountType === "percentage"
  ? `${coupon.value.toLocaleString("pt-BR")}%`
  : money(cents(coupon.value));
