// Coleta o catálogo público da CIAPC (https://www.ciapc.com.br) para o montador de PC.
//   node import/ciapc/coletar.mjs --teste     poucos produtos por etapa (validação)
//   node import/ciapc/coletar.mjs             todas as páginas pertinentes
// Só lê páginas públicas permitidas pelo robots.txt, com pausa entre pedidos e sem contornar bloqueios.
// Páginas baixadas ficam em .cache/ (não vai para o git); o resultado vai para bruto.json.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";

const BASE = "https://www.ciapc.com.br";
const DIR = new URL("./", import.meta.url);
const CACHE = new URL(".cache/", DIR);
mkdirSync(CACHE, { recursive: true });
const TESTE = process.argv.includes("--teste");
const PER_STEP = 4;
const PAUSE = 700; // ms entre pedidos
const UA = "Mozilla/5.0 (compatible; CapuchoCatalogImport/1.0; +https://capucho-8lk5.vercel.app)";

// Listagens públicas percorridas, por etapa do montador. A classificação final é feita em normalizar.mjs.
export const ROOTS = {
  cpu: ["/processadores/amd/socket-am4", "/processadores/amd/socket-am5", "/processadores/intel/socket-1700", "/processadores/intel/socket-1851", "/processadores/intel/socket-1200"],
  board: ["/placa-mae/socket-am4", "/placa-mae/amd/socket-am5", "/placa-mae/intel/socket-1700", "/placa-mae/intel/socket-1851", "/placa-mae/socket-1200"],
  ram: ["/hardware/memoria/ddr4", "/hardware/memoria/ddr5"],
  gpu: ["/placas-de-video/geforce", "/placas-de-video/ati"],
  storage: ["/hardware/disco-rigido/ssd", "/hardware/disco-rigido/nvme", "/hardware/disco-rigido/hd-para-pc"],
  cooler: ["/hardware/cooler/para-processador", "/hardware/cooler/watercooler"],
  psu: ["/hardware/fontes-de-alimentacao"],
  case: ["/perifericos/gabinetes"],
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let last = 0;
async function get(url, noCache = false) {
  const file = new URL(createHash("sha1").update(url).digest("hex") + ".html", CACHE);
  if (existsSync(file)) return readFileSync(file, "utf8");
  const wait = last + PAUSE - Date.now();
  if (wait > 0) await sleep(wait);
  last = Date.now();
  for (let attempt = 1; attempt <= 3; attempt++) {
    const res = await fetch(url, { headers: { "user-agent": UA, "accept-language": "pt-BR" } });
    if (res.status === 429 || res.status >= 500) {
      await sleep(4000 * attempt);
      continue;
    }
    if (!res.ok) throw new Error(`${res.status} ${url}`);
    const html = new TextDecoder("windows-1252").decode(await res.arrayBuffer());
    if (!noCache) writeFileSync(file, html);
    return html;
  }
  throw new Error(`falhou após tentativas: ${url}`);
}

const entities = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", ordm: "º", ordf: "ª", deg: "°" };
export function decode(s) {
  return s
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&([a-z]+);/gi, (m, n) => {
      if (entities[n]) return entities[n];
      const map = { aacute: "á", eacute: "é", iacute: "í", oacute: "ó", uacute: "ú", agrave: "à", acirc: "â", ecirc: "ê", ocirc: "ô", atilde: "ã", otilde: "õ", ccedil: "ç", Aacute: "Á", Eacute: "É", Iacute: "Í", Oacute: "Ó", Uacute: "Ú", Ccedil: "Ç", Atilde: "Ã", Otilde: "Õ", Acirc: "Â", Ecirc: "Ê", Ocirc: "Ô", uuml: "ü", reg: "®", trade: "™", copy: "©", times: "×", plusmn: "±", micro: "µ", sup2: "²", sup3: "³" };
      return map[n] ?? m;
    });
}

// Lista os produtos de uma listagem, seguindo a paginação (?pg=N) até acabar.
async function walk(root, limit) {
  const found = [];
  let pages = 0;
  for (let pg = 1; pg < 60; pg++) {
    const html = await get(`${BASE}${root}${pg > 1 ? `?pg=${pg}` : ""}`);
    pages++;
    const links = [...html.matchAll(/<a class="product-info" href="([^"]+)"/g)].map((m) => m[1]);
    const fresh = links.filter((l) => !found.includes(l));
    if (!fresh.length) break;
    found.push(...fresh);
    if (limit && found.length >= limit) break;
    if (!html.includes(`pg=${pg + 1}`)) break;
  }
  return { urls: limit ? found.slice(0, limit) : found, pages };
}

function text(html) {
  return decode(html.replace(/<br\s*\/?>/gi, "\n").replace(/<\/(p|li|div|tr|h\d)>/gi, "\n").replace(/<[^>]*>/g, "")).replace(/[ \t]+/g, " ").replace(/\n\s*\n+/g, "\n").trim();
}

async function getProduct(url) {
  const file = new URL("p-" + createHash("sha1").update(url).digest("hex") + ".json", CACHE);
  if (existsSync(file)) return JSON.parse(readFileSync(file, "utf8"));
  const p = parseProduct(await get(url, true), url);
  if (p) writeFileSync(file, JSON.stringify(p));
  return p;
}

// Extrai os dados estruturados e a descrição técnica de uma página de produto.
export function parseProduct(html, url) {
  const raw = [...html.matchAll(/<script type='application\/ld\+json'>([\s\S]*?)<\/script>/g)].map((m) => m[1]).find((t) => t.includes('"Product"'));
  if (!raw) return null;
  let ld;
  try {
    ld = JSON.parse(raw);
  } catch {
    // Aspas (polegadas) sem escape no nome quebram o JSON: lê os campos por expressão regular.
    const one = (re) => raw.match(re)?.[1];
    ld = {
      name: one(/"name"\s*:\s*"([\s\S]*?)",\s*\n\s*"sku"/),
      sku: one(/"sku"\s*:\s*"([^"]*)"/),
      description: one(/"description"\s*:\s*"([^\n]*)",\s*\n/) ?? "",
      image: one(/"image"\s*:\s*"([^"]*)"/),
      gtin: one(/"gtin"\s*:\s*"([^"]*)"/),
      brand: { name: one(/"brand"[\s\S]*?"name"\s*:\s*"([^"]*)"/) },
      offers: { url: one(/"url"\s*:\s*"([^"]*)"/), itemCondition: one(/"itemCondition"\s*:\s*"([^"]*)"/), availability: one(/"availability"\s*:\s*"([^"]*)"/) },
    };
    if (!ld.name || !ld.sku) return null;
  }
  const crumbs = [...html.matchAll(/<li class="breadcrumb-item[\s\S]*?<span itemprop="name">([^<]*)<\/span>/g)].map((m) => decode(m[1]).trim());
  const block = html.match(/<h2[^>]*>\s*Descri[\s\S]{0,400}?<\/h2>([\s\S]*?)(?:<\/section>|<div[^>]*id="avaliacoes|<div class="product-reviews)/i);
  const body = html.match(/(?:class="[^"]*product-description[^"]*"|id="descricao")[^>]*>([\s\S]*?)<\/div>\s*<\/div>/i);
  const desc = text((block?.[1] ?? body?.[1] ?? ld.description) || "").split(/\n\s*Formas de Pagamento/)[0].trim();
  return {
    url: ld.offers?.url || url,
    sku: String(ld.sku ?? ""),
    gtin: ld.gtin ? String(ld.gtin) : null,
    name: decode(ld.name).trim(),
    brand: ld.brand?.name ? decode(ld.brand.name) : null,
    image: ld.image || null,
    condition: ld.offers?.itemCondition?.split("/").pop() || null,
    availability: ld.offers?.availability?.trim().split("/").pop() || null,
    breadcrumb: crumbs,
    description: desc,
    ldDescription: decode(ld.description || ""),
  };
}

const out = { coletadoEm: new Date().toISOString(), teste: TESTE, listagens: [], produtos: {}, erros: [] };
for (const [step, roots] of Object.entries(ROOTS)) {
  for (const root of roots) {
    try {
      const { urls, pages } = await walk(root, TESTE ? PER_STEP : 0);
      out.listagens.push({ etapa: step, listagem: root, paginas: pages, produtos: urls.length });
      console.log(`${step.padEnd(8)} ${root}  páginas:${pages}  produtos:${urls.length}`);
      for (const url of urls) {
        const prev = out.produtos[url];
        if (prev) {
          prev.etapas.add(step);
          continue;
        }
        try {
          const p = await getProduct(url);
          if (!p) throw new Error("sem dados estruturados");
          out.produtos[url] = { ...p, etapas: new Set([step]), listagens: [root] };
        } catch (e) {
          out.erros.push({ url, erro: String(e.message ?? e) });
        }
      }
    } catch (e) {
      out.erros.push({ listagem: root, erro: String(e.message ?? e) });
      console.log(`ERRO ${root}: ${e.message}`);
    }
  }
}
for (const p of Object.values(out.produtos)) p.etapas = [...p.etapas];
writeFileSync(new URL(TESTE ? "bruto-teste.json" : "bruto.json", DIR), JSON.stringify(out, null, 1));
console.log(`\n${Object.keys(out.produtos).length} páginas de produto, ${out.erros.length} erros`);
