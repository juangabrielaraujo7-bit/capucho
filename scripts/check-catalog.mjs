// Regressões do catálogo: usa respostas simuladas, sem ler ou alterar o Sanity real.
import assert from "node:assert/strict";
import { readFile, mkdir } from "node:fs/promises";
import { chromium } from "@playwright/test";

const base = process.env.PREVIEW_URL || "http://127.0.0.1:4173";
const docs = (await readFile(new URL("../studio/import/catalogo-inicial.ndjson", import.meta.url), "utf8"))
  .trim().split("\n").map(JSON.parse);
await mkdir(new URL("../.qa/", import.meta.url), { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: true });
const errors = [];
try {
  for (const viewport of [{ width: 1280, height: 900 }, { width: 390, height: 844 }]) {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    page.on("pageerror", (error) => errors.push(error.message));
    let result = docs;
    let offline = false;
    let invalid = false;
    await page.route("**/data/query/**", (route) => offline ? route.abort("failed") : route.fulfill({
      status: 200, contentType: "application/json", body: JSON.stringify({ result: invalid ? {} : result }),
    }));
    const reload = async () => {
      await page.goto(`${base}/gamer/monte-seu-pc`, { waitUntil: "networkidle" });
      await assert.doesNotReject(() => page.getByText("Carregando catálogo e preços…", { exact: true }).waitFor({ state: "hidden" }));
    };
    const clear = () => page.evaluate(() => localStorage.clear());
    await reload();
    assert.equal(await page.locator(".builder-presets li").count(), 3, "configurações completas disponíveis");

    result = docs.map((d) => d._id === "peca-cpu-r5-5500" ? { ...d, price: 987.65 } : d);
    await reload();
    assert.match(await page.locator(".part-card", { hasText: "AMD Ryzen 5 5500" }).innerText(), /987,65/, "preço publicado com centavos");
    await page.locator(".part-card", { hasText: "AMD Ryzen 5 5500" }).click();
    await reload();
    assert.match(await page.locator(".builder-summary").innerText(), /AMD Ryzen 5 5500/, "montagem salva é restaurada depois do catálogo");

    result = result.map((d) => d._id === "peca-cpu-r5-5500" ? { ...d, price: null } : d);
    await reload();
    assert.match(await page.locator(".builder-presets li").first().innerText(), /Preço sob consulta/, "configuração sem preço não mostra soma parcial");

    result = result.filter((d) => d._id !== "peca-cpu-r5-5500");
    await reload();
    assert.equal(await page.locator(".builder-presets li").count(), 2, "configuração com peça removida é ocultada");

    // A categoria inteira removida substitui inclusive uma lista que já estava em cache.
    result = result.filter((d) => d.category !== "cpu");
    await reload();
    assert.equal(await page.locator(".part-card:not(.is-option)").count(), 0, "categoria vazia não recupera peças de exemplo");
    assert.equal(await page.locator(".builder-presets").count(), 0, "sem configurações incompletas");
    await page.getByRole("button", { name: /Quero indicação/ }).click();
    assert.match(await page.locator(".builder-summary").innerText(), /Quero indicação/, "pedido de indicação funciona sem catálogo");

    result = [];
    await reload();
    assert.equal(await page.locator(".part-card:not(.is-option)").count(), 0, "catálogo totalmente vazio respeitado");
    await page.screenshot({ path: `.qa/catalogo-vazio-${viewport.width}.png` });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, "sem rolagem horizontal");

    offline = true;
    await reload();
    assert.match(await page.getByRole("status").innerText(), /última lista salva/, "falha informa uso de cache, inclusive cache vazio");
    await clear();
    await reload();
    assert.match(await page.getByRole("status").innerText(), /Não foi possível carregar/, "falha sem cache explicada");
    assert.equal(await page.locator(".part-card:not(.is-option)").count(), 0, "falha sem cache não inventa preços");

    offline = false;
    invalid = true;
    await reload();
    assert.match(await page.getByRole("status").innerText(), /Não foi possível carregar/, "resposta inválida tratada como falha");
    invalid = false;
    result = docs;
    await page.getByRole("button", { name: "Tentar atualizar catálogo" }).click();
    await page.locator(".part-card:not(.is-option)").first().waitFor();
    assert.equal(await page.locator(".builder-presets li").count(), 3, "nova tentativa recupera catálogo");
    await page.screenshot({ path: `.qa/catalogo-recuperado-${viewport.width}.png` });
    console.log(`OK catálogo, preços, configurações, cache e recuperação (${viewport.width}px)`);
    await context.close();
  }
  assert.deepEqual(errors, [], "sem erros de execução no navegador");
} finally {
  await browser.close();
}
