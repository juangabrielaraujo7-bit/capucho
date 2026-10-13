// Teste de integração painel -> montador, tudo local:
//   (build + preview em http://127.0.0.1:4173)  node import/ciapc/testar-montador.mjs
// 1. monta um "painel" em memória: peças antigas + peças importadas, com o dono definindo preço e ativando só algumas;
// 2. avalia a consulta GROQ REAL do site (src/catalog.js) sobre esse painel, com groq-js;
// 3. serve o resultado ao montador (?painel) e confere o que aparece, o que é bloqueado e o que o dono vê.
import { readFileSync } from "node:fs";
import { chromium } from "@playwright/test";
import { evaluate, parse } from "groq-js";

const BASE = process.env.BASE || "http://127.0.0.1:4173";
const norm = JSON.parse(readFileSync(new URL("./normalizado.json", import.meta.url), "utf8"));
const antigas = readFileSync(new URL("../catalogo-inicial.ndjson", import.meta.url), "utf8").trim().split("\n").map((l) => JSON.parse(l));
const catalogSrc = readFileSync(new URL("../../../src/catalog.js", import.meta.url), "utf8");
const groq = catalogSrc.match(/const query = `([\s\S]*?)`;/)[1];

let falhas = 0;
const ok = (cond, msg) => {
  console.log(`${cond ? "OK   " : "FALHA"} ${msg}`);
  if (!cond) falhas++;
};

// ---------- painel simulado ----------
const doc = (d) => structuredClone(d);
const importadas = norm.docs.map(doc);
const prontas = importadas.filter((d) => d.revisao === "ok");
const pend = importadas.filter((d) => d.revisao === "pendente");
const cat = (c, f = () => true) => prontas.filter((d) => d.category === c && f(d));

const ativadas = new Map(); // id -> papel
let preco = 500;
const ativa = (d, papel) => {
  if (!d) return null;
  d.price = (preco += 37);
  d.active = true;
  d.stock = true;
  ativadas.set(d._id, papel);
  return d;
};

const cpuA = ativa(cat("cpu", (d) => d.socket === "AM5" && d.tdp <= 105 && d.igpu)[0] ?? cat("cpu", (d) => d.socket === "AM5")[0], "cpu AM5");
const cpuL = ativa(cat("cpu", (d) => d.socket === "LGA1700")[0], "cpu LGA1700");
const board = ativa(cat("board", (d) => d.socket === "AM5" && d.form === "mATX" && d.memSlots && d.m2Slots)[0], "placa AM5 mATX");
const boardL = ativa(cat("board", (d) => d.socket === "LGA1700")[0], "placa LGA1700");
const ram5 = ativa(cat("ram", (d) => d.memory === "DDR5" && d.modules <= board.memSlots)[0], "memória DDR5");
const ram4 = ativa(cat("ram", (d) => d.memory === "DDR4")[0], "memória DDR4");
const gpuG = ativa(cat("gpu", (d) => d.length && d.psu && d.pcie8 >= 1 && d.length > 250)[0], "placa de vídeo");
const nvme = ativa(cat("storage", (d) => d.iface === "nvme")[0], "nvme");
const sata = ativa(cat("storage", (d) => d.iface === "sata")[0], "sata");
const coolerOk = ativa(cat("cooler", (d) => d.sockets?.includes("AM5") && d.radiator == null && d.height)[0], "cooler a ar AM5");
const coolerNoAm5 = ativa(cat("cooler", (d) => d.sockets && !d.sockets.includes("AM5"))[0], "cooler sem AM5");
const caseJusto = ativa(cat("case", (d) => d.maxGpu && d.maxGpu < gpuG.length && d.forms.includes("mATX"))[0], "gabinete curto");
const caseOk = ativa(cat("case", (d) => d.maxGpu >= gpuG.length && d.forms.includes("mATX") && (d.maxCooler ?? 999) >= (coolerOk?.height ?? 0))[0], "gabinete ok");
const caseSemMatx = ativa(cat("case", (d) => !d.forms.includes("mATX"))[0], "gabinete sem mATX");
const psuLow = ativa(cat("psu", (d) => d.watts < (gpuG.psu ?? 0))[0], "fonte fraca");
const psuOk = ativa(cat("psu", (d) => d.watts >= gpuG.psu + 100 && (d.pcie8 ?? 99) >= gpuG.pcie8)[0], "fonte ok");
const psuPoucosCabos = ativa(cat("psu", (d) => d.watts >= gpuG.psu + 100 && d.pcie8 != null && d.pcie8 < gpuG.pcie8)[0], "fonte com poucos cabos PCIe");
// armadilhas: nada disso pode aparecer no montador
const semPreco = cat("cpu").find((d) => !ativadas.has(d._id)); // ativo no papel, mas sem preço
if (semPreco) semPreco.active = true;
const comPrecoOculta = cat("ram").find((d) => !ativadas.has(d._id));
if (comPrecoOculta) Object.assign(comPrecoOculta, { price: 321, active: false });
const pendComPreco = pend[0];
Object.assign(pendComPreco, { price: 777, active: true });
const precoZero = cat("psu").find((d) => !ativadas.has(d._id));
if (precoZero) Object.assign(precoZero, { price: 0, active: true });

const dataset = [...antigas, ...importadas].map((d) => ({ ...d, _updatedAt: "2026-10-12T00:00:00Z" }));
const value = await evaluate(parse(groq), { dataset });
const result = await value.get();
const nomes = (c) => result.filter((d) => d.category === c).map((d) => d.name);

console.log(`papéis ausentes (sem dado nesta amostra): ${[...Object.entries({ cpuA, cpuL, board, boardL, ram5, ram4, gpuG, nvme, sata, coolerOk, coolerNoAm5, caseJusto, caseOk, caseSemMatx, psuLow, psuOk, psuPoucosCabos })].filter(([, v]) => !v).map(([k]) => k).join(", ") || "nenhum"}`);
ok(!semPreco || result.some((d) => d._id === semPreco._id), "importada ativa sem preço entra como Sob consulta");
ok(!result.some((d) => d._id === comPrecoOculta?._id), "importada com preço mas oculta não entra");
ok(!result.some((d) => d._id === pendComPreco._id), "importada com preço e ativa, mas revisão pendente, não entra");
ok(!precoZero || result.some((d) => d._id === precoZero._id), "preço zero vira Sob consulta");
ok(result.filter((d) => d.imported).every((d) => d._id.startsWith("ciapc-")), "só as peças importadas carregam a marca 'imported'");

// ---------- navegador ----------
const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await (await browser.newContext({ viewport: { width: 1280, height: 900 } })).newPage();
const erros = [];
page.on("pageerror", (e) => erros.push(String(e)));
page.on("console", (m) => m.type() === "error" && erros.push(m.text()));
await page.route("**/data/query/**", (route) => route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ result }) }));
await page.goto(`${BASE}/gamer/monte-seu-pc?painel`, { waitUntil: "networkidle" });
await page.evaluate(() => localStorage.clear());
await page.reload({ waitUntil: "networkidle" });

const cards = async () =>
  page.$$eval(".part-card:not(.is-option)", (els) =>
    els.map((el) => ({ name: el.querySelector(".part-name")?.textContent.trim(), disabled: el.disabled, reason: el.querySelector(".part-reason")?.textContent.trim() ?? "", price: el.querySelector(".part-price")?.textContent.replace(/\s+/g, " ").trim() ?? "" })),
  );
const nome = (d) => d.name;
const entre = (list, d) => list.find((c) => c.name === nome(d));
const escolher = async (d) => {
  await page.locator(".part-card:not(.is-option)", { has: page.locator(".part-name", { hasText: nome(d) }) }).filter({ hasText: nome(d) }).first().click();
};

let c = await cards();
ok(c.length === 9 + 1 + 1 || c.length >= 10, `etapa Processador lista as antigas + importadas ativadas (${c.length})`);
ok(entre(c, cpuA)?.price.includes("R$"), "CPU importada aparece com o preço definido pelo dono");
ok(!c.some((x) => /R\$\s*0\b/.test(x.price)), "nenhum card com R$ 0");
if (semPreco) ok(entre(c, semPreco)?.price === "" || /Sob consulta/.test(entre(c, semPreco)?.price ?? ""), "CPU sem preço aparece como Sob consulta, nunca R$ 0");
await escolher(cpuA);

c = await cards();
ok(entre(c, boardL)?.disabled && /Soquete LGA1700/.test(entre(c, boardL).reason), `placa LGA1700 bloqueada: "${entre(c, boardL)?.reason}"`);
ok(entre(c, board) && !entre(c, board).disabled, "placa AM5 importada liberada");
await escolher(board);

c = await cards();
ok(ram4 ? entre(c, ram4)?.disabled && /usa DDR5/.test(entre(c, ram4).reason) : true, `memória DDR4 bloqueada com placa DDR5: "${entre(c, ram4)?.reason}"`);
await escolher(ram5);

c = await cards();
await escolher(gpuG);

c = await cards();
await escolher(nvme);

c = await cards();
if (coolerNoAm5) ok(entre(c, coolerNoAm5)?.disabled && /soquete AM5/.test(entre(c, coolerNoAm5).reason), `cooler sem AM5 bloqueado: "${entre(c, coolerNoAm5)?.reason}"`);
await escolher(coolerOk);

c = await cards();
if (psuLow) ok(entre(c, psuLow)?.disabled, `fonte abaixo da recomendada bloqueada: "${entre(c, psuLow)?.reason}"`);
if (psuPoucosCabos) ok(entre(c, psuPoucosCabos)?.disabled && /conectores PCIe/.test(entre(c, psuPoucosCabos).reason), `fonte com menos conectores PCIe que a placa exige bloqueada: "${entre(c, psuPoucosCabos)?.reason}"`);
ok(entre(c, psuOk) && !entre(c, psuOk).disabled, "fonte adequada liberada");
await escolher(psuOk);

c = await cards();
if (caseJusto) ok(entre(c, caseJusto)?.disabled && /placa de vídeo de até/.test(entre(c, caseJusto).reason), `gabinete curto para a placa de vídeo bloqueado: "${entre(c, caseJusto)?.reason}"`);
if (caseSemMatx) ok(entre(c, caseSemMatx)?.disabled && /Não comporta placa/.test(entre(c, caseSemMatx).reason), `gabinete sem Micro-ATX bloqueado: "${entre(c, caseSemMatx)?.reason}"`);
ok(entre(c, caseOk) && !entre(c, caseOk).disabled, "gabinete adequado liberado");
await escolher(caseOk);

// revisão
await page.waitForSelector(".builder-review");
const review = await page.locator(".builder-review").innerText();
const totalCalc = [cpuA, board, ram5, gpuG, nvme, coolerOk, psuOk, caseOk].reduce((s, d) => s + d.price, 0);
const resumo = await page.locator(".builder-summary").innerText();
const fmt = totalCalc.toLocaleString("pt-BR");
ok(resumo.includes(fmt), `total do resumo (R$ ${fmt}) = soma dos preços definidos pelo dono`);
ok(!/R\$\s*0\b/.test(review + resumo), "revisão sem R$ 0");
ok(/A Capucho confere estes pontos/.test(review), "revisão avisa o que não pôde ser conferido (compatibilidade nunca apresentada como completa)");
console.log("   avisos:", (await page.locator(".builder-review .builder-assembly p").first().innerText()).slice(0, 400).replace(/\s+/g, " "));

// o dono muda preço e desativa uma peça: aparece/some no montador
const result2 = result.map((d) => (d._id === board._id ? { ...d, price: 4321 } : d)).filter((d) => d._id !== nvme._id);
await page.unroute("**/data/query/**");
await page.route("**/data/query/**", (route) => route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ result: result2 }) }));
await page.evaluate(() => localStorage.clear());
await page.reload({ waitUntil: "networkidle" });
await page.getByRole("button", { name: /Placa-mãe/ }).first().click();
c = await cards();
ok(entre(c, board)?.price.includes("4.321"), "preço alterado pelo dono aparece no montador");
await page.getByRole("button", { name: /Armazenamento/ }).first().click();
c = await cards();
ok(!entre(c, nvme), "peça desativada pelo dono some do montador");
ok(erros.length === 0, `sem erros no console (${erros.length}) ${erros.slice(0, 2).join(" | ")}`);
await browser.close();
console.log(falhas ? `\n${falhas} falha(s)` : "\nTodos os testes passaram");
process.exitCode = falhas ? 1 : 0;
