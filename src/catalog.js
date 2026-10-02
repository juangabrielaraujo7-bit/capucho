import { parts } from "./gamer";

// Catálogo do "Monte seu PC" vindo do painel Sanity (pasta studio/, https://capucho.sanity.studio).
// Enquanto LIVE for false, o site no ar usa a lista fixa de src/gamer.js e o Sanity só é lido em
// testes: abrindo o montador com "?painel" no endereço (fica ligado até fechar a aba).
// Quando o cliente aprovar, basta trocar LIVE para true.
// Se o Sanity não responder, usa a última lista que funcionou neste navegador e, sem ela,
// a lista fixa: o montador nunca fica vazio.
const LIVE = false;
const projectId = "9in9aaz1";
const dataset = "production";
const CACHE_KEY = "capucho-catalogo";

const query = `*[_type == "peca" && active != false] | order(price asc) {
  _id, category, name, brand, specs, price, stock, socket, memory, form, igpu, boxCooler,
  tdp, psu, maxTdp, radiator, watts, forms, caseRadiator, "image": image.asset->url
}`;

// Converte um documento do Sanity no formato que src/gamer.js usa.
function toPart(doc) {
  const part = {
    // Peças importadas mantêm o id antigo (as configurações prontas dependem dele).
    id: doc._id.replace(/^peca-[a-z]+-/, ""),
    name: doc.name,
    specs: doc.specs ?? "",
    price: doc.price ?? 0,
    stock: Boolean(doc.stock),
  };
  for (const key of ["brand", "socket", "memory", "form", "tdp", "psu", "maxTdp", "watts"])
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
  if (doc.image) part.image = `${doc.image}?w=480&fit=max&auto=format`;
  return part;
}

function apply(docs) {
  const next = Object.fromEntries(Object.keys(parts).map((step) => [step, []]));
  for (const doc of docs) if (next[doc.category] && doc.name) next[doc.category].push(toPart(doc));
  // Etapa sem nenhuma peça cadastrada continua com a lista fixa.
  for (const step of Object.keys(parts)) if (next[step].length) parts[step] = next[step];
}

// Devolve true quando o catálogo mudou (o montador então se redesenha).
export async function loadCatalog() {
  if (typeof window === "undefined") return false;
  if (!LIVE) {
    let testing = new URLSearchParams(location.search).has("painel");
    try {
      if (testing) sessionStorage.setItem("capucho-painel", "1");
      else testing = sessionStorage.getItem("capucho-painel") === "1";
    } catch {
      /* sem armazenamento */
    }
    if (!testing) return false;
  }
  const url = `https://${projectId}.apicdn.sanity.io/v2025-02-19/data/query/${dataset}?query=${encodeURIComponent(query)}`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(response.status);
    const { result } = await response.json();
    apply(result);
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(result));
    } catch {
      /* sem armazenamento */
    }
    return true;
  } catch {
    try {
      const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || "null");
      if (cached) {
        apply(cached);
        return true;
      }
    } catch {
      /* sem armazenamento */
    }
    return false;
  }
}
