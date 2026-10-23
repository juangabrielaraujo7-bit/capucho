import test from "node:test";
import assert from "node:assert/strict";
import { cents, couponErrors, publishedCoupon } from "../shared/coupon.js";
import { createQuote } from "../server/quote.js";
import { sanityQuery } from "../server/sanity.js";
import couponHandler from "../api/coupon.js";
import quoteHandler from "../api/quote.js";
import { quoteNeedsReview } from "../shared/quote-snapshot.js";

const promotion = { active: true, code: "CAPUCHO10", discountType: "percentage", value: 12.5, _rev: "one" };
const product = { _id: "peca-cpu-cpu1", category: "cpu", name: "Processador de teste", price: 1000.01 };
const selections = [{ step: "cpu", productId: product._id }];
const calculate = (coupon = promotion, items = [product], body = {}) => createQuote({ selections, code: "CAPUCHO10", ...body }, async () => ({ coupon, items }));

test("schema starts disabled and has no implicit promotion", () => {
  assert.equal(publishedCoupon(null), null);
  assert.equal(publishedCoupon({ active: false }), null);
  assert.deepEqual(couponErrors({ active: false }), {});
  assert.ok(couponErrors({ active: true, discountType: "percentage", value: 10 }).code);
});
test("schema rejects invalid values and fixed precision", () => {
  for (const value of [0, -1, Infinity, NaN]) assert.ok(couponErrors({ ...promotion, value }).value);
  assert.ok(couponErrors({ ...promotion, value: 100.01 }).value);
  assert.ok(couponErrors({ ...promotion, discountType: "fixed", value: 1.001 }).value);
  assert.deepEqual(couponErrors({ ...promotion, discountType: "fixed", value: 1.01 }), {});
  assert.deepEqual(couponErrors({ ...promotion, value: 100 }), {});
});
test("integer cent rounding is consistent, including decimal boundaries", () => {
  assert.equal(cents(1.005), 101);
  assert.equal(cents(10.075), 1008);
  assert.equal(cents(0.29), 29);
});
test("percentage uses configured value, ignores code suffix, trims and ignores case", async () => {
  const { quote } = await calculate(promotion, [product], { code: "  capucho10  " });
  assert.equal(quote.coupon.value, 12.5);
  assert.equal(quote.subtotalCents, 100001);
  assert.equal(quote.discountCents, 12500);
  assert.equal(quote.totalCents, 87501);
});
test("fixed discount caps at subtotal and total never becomes negative", async () => {
  const { quote } = await calculate({ ...promotion, discountType: "fixed", value: 2000 });
  assert.equal(quote.discountCents, 100001);
  assert.equal(quote.totalCents, 0);
});
test("fixed discount preserves cents", async () => {
  const { quote } = await calculate({ ...promotion, discountType: "fixed", value: 100.27 });
  assert.equal(quote.discountCents, 10027);
  assert.equal(quote.totalCents, 89974);
});
test("100 percent and fractional cent rounding", async () => {
  assert.equal((await calculate({ ...promotion, value: 100 })).quote.totalCents, 0);
  assert.equal((await calculate({ ...promotion, value: 50 }, [{ ...product, price: .01 }])).quote.discountCents, 1);
});
test("invalid, inactive and unpublished coupons do not grant discounts", async () => {
  for (const [coupon, code] of [[promotion, "ERRADO"], [{ ...promotion, active: false }, "CAPUCHO10"], [null, "CAPUCHO10"]]) {
    const result = await calculate(coupon, [product], { code });
    assert.equal(result.invalidCoupon, true);
    assert.equal(result.whatsappUrl, null);
    assert.equal(result.quote.discountCents, 0);
  }
});
test("removing coupon restores subtotal and repeated calls do not accumulate", async () => {
  const first = await calculate(); const repeated = await calculate();
  assert.equal(first.quote.totalCents, repeated.quote.totalCents);
  const removed = await calculate(promotion, [product], { code: "" });
  assert.equal(removed.quote.discountCents, 0);
  assert.equal(removed.quote.totalCents, removed.quote.subtotalCents);
});
test("new prices, replaced/removed items and coupon edits recalculate and change version", async () => {
  const initial = await calculate();
  const priceChanged = await calculate(promotion, [{ ...product, price: 2000 }]);
  assert.equal(priceChanged.quote.discountCents, 25000);
  assert.notEqual(initial.quote.version, priceChanged.quote.version);
  const configChanged = await calculate({ ...promotion, value: 20, _rev: "two" });
  assert.notEqual(initial.quote.version, configChanged.quote.version);
  const removed = await calculate(promotion, [], { selections: [] });
  assert.equal(removed.quote.totalCents, 0);
});
test("unknown product, wrong category, duplicate step and malformed selections rejected", async () => {
  await assert.rejects(calculate(promotion, []), /disponível/);
  await assert.rejects(calculate(promotion, [{ ...product, category: "gpu" }]), /disponível/);
  await assert.rejects(calculate(promotion, [product], { selections: [...selections, ...selections] }), /apenas uma/);
  await assert.rejects(createQuote({ selections: [{ step: "shipping", productId: "x" }] }), /etapa/);
});
test("browser money, fees and discount data are ignored", async () => {
  const { quote } = await calculate(promotion, [product], { subtotal: 1, price: 1, discountCents: 999999, total: -1, shipping: 999, services: 999, coupon: { value: 100 } });
  assert.equal(quote.subtotalCents, 100001);
  assert.equal(quote.discountCents, 12500);
});
test("unpriced products are flagged, not claimed to be free; owned/help are excluded", async () => {
  const { quote } = await calculate(promotion, [{ ...product, price: null }], { selections: [...selections, { step: "gpu", option: "own" }, { step: "board", option: "help" }] });
  assert.equal(quote.partial, true);
  assert.equal(quote.subtotalCents, 0);
  assert.equal(quote.items[0].cents, null);
});
test("WhatsApp message includes authoritative items and each coupon amount", async () => {
  const result = await calculate();
  const text = new URL(result.whatsappUrl).searchParams.get("text");
  for (const required of [product.name, "Subtotal", "CAPUCHO10", "Porcentagem", "12,5%", "Desconto do cupom", "Total estimado com desconto", "Frete e serviços", "confirmados pela Capucho"]) assert.ok(text.includes(required), required);
});
test("upstream failures never produce a validated quote", async () => {
  await assert.rejects(createQuote({ selections }, async () => { throw new Error("unavailable"); }));
});
test("Sanity query bypasses CDN/cache, requests only published perspective", async () => {
  await sanityQuery("test", { ids: [product._id] }, async (url, options) => {
    assert.equal(url.hostname, "9in9aaz1.api.sanity.io");
    assert.equal(url.searchParams.get("perspective"), "published");
    assert.equal(options.cache, "no-store");
    return new Response(JSON.stringify({ result: null }));
  });
});
test("API methods, no-store and failures are safe", async () => {
  const response = () => ({ headers: {}, setHeader(k,v) { this.headers[k]=v; }, end(body) { this.body=JSON.parse(body); } });
  const res = response(); await couponHandler({ method: "POST" }, res);
  assert.equal(res.statusCode, 405); assert.match(res.headers["Cache-Control"], /no-store/);
  const bad = response(); await quoteHandler({ method: "POST", body: "invalid-json" }, bad); assert.equal(bad.statusCode, 400);
  const original = globalThis.fetch;
  globalThis.fetch = async () => { throw new Error("PRIVATE upstream error"); };
  try {
    const unavailable = response(); await couponHandler({ method: "GET" }, unavailable);
    assert.equal(unavailable.statusCode, 503); assert.equal(unavailable.body.offer, undefined);
    const failed = response(); await quoteHandler({ method: "POST", body: { selections } }, failed);
    assert.equal(failed.statusCode, 503); assert.doesNotMatch(JSON.stringify(failed.body), /PRIVATE/);
  } finally { globalThis.fetch = original; }
});
test("equal-subtotal item price changes after coupon removal require review", async () => {
  const ram = { _id: "peca-ram-r", category: "ram", name: "Memória", price: 100 };
  const picks = [...selections, { step: "ram", productId: ram._id }];
  const old = (await calculate(promotion, [product, ram], { selections: picks })).quote;
  const removed = { ...old, coupon: null, discountCents: 0, totalCents: old.subtotalCents, version: null };
  const current = (await calculate(promotion, [{ ...product, price: 950.01 }, { ...ram, price: 150 }], { selections: picks, code: "" })).quote;
  assert.equal(removed.totalCents, current.totalCents);
  assert.equal(quoteNeedsReview(removed, current, [], removed.totalCents), true);
  const unchanged = (await calculate(promotion, [product, ram], { selections: picks, code: "" })).quote;
  assert.equal(quoteNeedsReview(removed, unchanged, [], removed.totalCents), false);
});
test("first checkout also checks individual displayed prices and names", async () => {
  const current = (await calculate(promotion, [product], { code: "" })).quote;
  assert.equal(quoteNeedsReview(null, current, current.items, current.totalCents), false);
  const renamed = { ...current, items: current.items.map(item => item.productId ? { ...item, name: "Nome atualizado" } : item) };
  assert.equal(quoteNeedsReview(null, renamed, current.items, current.totalCents), true);
});
