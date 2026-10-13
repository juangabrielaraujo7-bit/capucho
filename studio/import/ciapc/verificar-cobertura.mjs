// Confere se as listagens percorridas por coletar.mjs cobrem as categorias-pai do site:
// percorre as páginas-pai e lista produtos que não vieram da coleta.
//   node import/ciapc/verificar-cobertura.mjs
import { readFileSync } from "node:fs";
const BASE = "https://www.ciapc.com.br";
const UA = "Mozilla/5.0 (compatible; CapuchoCatalogImport/1.0; +https://capucho-8lk5.vercel.app)";
const bruto = JSON.parse(readFileSync(new URL("./bruto.json", import.meta.url), "utf8"));
const have = new Set(Object.keys(bruto.produtos));
const PARENTS = ["/processadores", "/placa-mae", "/hardware/memoria", "/hardware/memoria-para-desktop", "/placas-de-video", "/hardware/disco-rigido", "/hardware/armazenamento", "/hardware/cooler", "/hardware/fontes-de-alimentacao", "/perifericos/gabinetes", "/perifericos/gabinete"];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const missing = {};
for (const root of PARENTS) {
  let total = 0;
  const seen = new Set();
  for (let pg = 1; pg < 60; pg++) {
    await sleep(700);
    const res = await fetch(`${BASE}${root}${pg > 1 ? `?pg=${pg}` : ""}`, { headers: { "user-agent": UA } });
    if (!res.ok) {
      console.log(`${root}: HTTP ${res.status}`);
      break;
    }
    const html = new TextDecoder("windows-1252").decode(await res.arrayBuffer());
    const links = [...html.matchAll(/<a class="product-info" href="([^"]+)"/g)].map((m) => m[1]).filter((l) => !seen.has(l));
    if (!links.length) break;
    for (const l of links) seen.add(l);
    if (!html.includes(`pg=${pg + 1}`)) break;
  }
  const out = [...seen].filter((u) => !have.has(u));
  total = seen.size;
  missing[root] = out;
  console.log(`${root}: ${total} produtos listados, ${out.length} fora da coleta`);
}
for (const [root, list] of Object.entries(missing)) for (const u of list) console.log(`  [${root}] ${u.replace(BASE, "")}`);
