// Converte bruto.json (coletar.mjs) em documentos "peca" do painel Sanity, sem preço e ocultos.
//   node import/ciapc/normalizar.mjs [--teste]
// Gera normalizado.json (documentos) e relatorio.md (contagens, exclusões, campos ausentes).
// Regra: nada é inventado. Campo que a página do fornecedor não informa fica em branco e vira "pendência";
// faltando dado essencial para conferir a compatibilidade, a peça fica com revisao = "pendente".
import { readFileSync, writeFileSync } from "node:fs";

const TESTE = process.argv.includes("--teste");
const DIR = new URL("./", import.meta.url);
const bruto = JSON.parse(readFileSync(new URL(TESTE ? "bruto-teste.json" : "bruto.json", DIR), "utf8"));

export const SOCKETS = ["AM4", "AM5", "LGA1700", "LGA1851", "LGA1200"]; // plataformas do montador
// Campos sem os quais o montador não consegue conferir a compatibilidade (peça fica pendente de revisão).
export const ESSENCIAL = {
  cpu: ["socket", "tdp", "igpu"],
  board: ["socket", "memory", "form"],
  ram: ["memory", "gb", "modules"],
  gpu: ["vram", "psu", "length"],
  storage: ["gb", "iface"],
  cooler: ["sockets"],
  psu: ["watts"],
  case: ["forms"],
};
const ROTULO = {
  socket: "soquete", tdp: "TDP", igpu: "vídeo integrado", memory: "tipo de memória", form: "formato da placa-mãe",
  gb: "capacidade", modules: "quantidade de módulos", vram: "memória de vídeo", psu: "fonte recomendada", length: "comprimento da placa",
  iface: "interface", sockets: "sockets compatíveis", watts: "potência", forms: "formatos de placa-mãe aceitos",
  chipset: "chipset", height: "altura do cooler", maxGpu: "comprimento máximo da placa de vídeo", maxCooler: "altura máxima do cooler a ar",
  caseRadiator: "radiadores aceitos", pcie8: "conectores PCIe", boxCooler: "cooler incluso", m2Slots: "slots M.2", memSlots: "slots de memória",
  maxTdp: "TDP máximo do cooler", radiator: "tamanho do radiador", sataPorts: "portas SATA",
};

// ---------- utilidades ----------
const num = (s) => {
  if (s == null) return undefined;
  let t = String(s).trim().replace(/\s/g, "");
  if (/^\d{1,3}(\.\d{3})+(,\d+)?$/.test(t)) t = t.replace(/\./g, "").replace(",", ".");
  else t = t.replace(",", ".");
  const n = parseFloat(t);
  return Number.isFinite(n) ? n : undefined;
};
const first = (re, s) => (s ?? "").match(re)?.[1];
const strip = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

// Lê a descrição do fornecedor: linhas "- Chave: valor" agrupadas por seção.
function parseDesc(desc) {
  const lines = desc.split("\n").map((l) => l.trim()).filter(Boolean);
  const kv = []; // [chave, valor, seção]
  let section = "";
  for (const l of lines) {
    const m = l.match(/^-\s*([^:]{2,70}):\s*(.+)$/);
    if (m) kv.push([m[1].trim(), m[2].trim(), section]);
    else if (/^[^-].{0,60}:\s*$/.test(l)) section = l.replace(/:\s*$/, "");
    else if (/^-\s/.test(l)) kv.push(["", l.replace(/^-\s*/, ""), section]);
    else {
      const mm = l.match(/^([^:]{2,70}):\s*(.+)$/);
      if (mm) kv.push([mm[1].trim(), mm[2].trim(), section]);
    }
  }
  const body = desc.split(/\nGarantia:/)[0];
  const match = (m, x) => (typeof m === "function" ? m(x) : m.test(x));
  const get = (m) => kv.find(([k]) => match(m, strip(k)))?.[1];
  const sectionLines = (m) => kv.filter(([, , s]) => match(m, strip(s))).map(([k, v]) => (k ? `${k}: ${v}` : v));
  const rows = body.split("\n").map((l) => l.trim().replace(/^-\s*/, "")).filter(Boolean);
  const findAll = (m) =>
    rows
      .filter((r) => match(m, strip(r)))
      .map((r) => {
        const i = r.indexOf(":");
        return { label: i > 0 ? r.slice(0, i) : r, value: i > 0 ? r.slice(i + 1).trim() : r, line: r };
      });
  const find = (m) => findAll(m)[0];
  return { kv, get, sectionLines, body, rows, find, findAll };
}

const UPPER = new Set(["ASUS", "NZXT", "XPG", "EVGA", "ARGB", "WIFI", "WI-FI", "AIO", "LCD", "RGB", "ATX", "MATX", "DDR4", "DDR5", "SSD", "HDD", "USB", "PCIE", "CPU", "GPU", "RAM", "MSI", "AMD", "RTX", "GTX", "TUF", "ROG", "OC", "XT", "SFF", "TLC", "QLC", "ECC", "LED", "TI", "PRO", "MAX", "MAG", "PNY", "WD", "HDD", "XL", "II", "III", "IV", "RX", "GT"]);
const MIXED = { GEFORCE: "GeForce", RYZEN: "Ryzen", ASROCK: "ASRock", GIGABYTE: "Gigabyte", NVME: "NVMe", PCYES: "PCYes", DEEPCOOL: "DeepCool", CORSAIR: "Corsair", INTEL: "Intel", NVIDIA: "NVIDIA", RADEON: "Radeon", POWERCOLOR: "PowerColor", THERMALTAKE: "Thermaltake", HYPERX: "HyperX", SANDISK: "SanDisk", ADATA: "ADATA", MOTOSPEED: "Motospeed" };
function smartCase(s) {
  return s
    .split(/(\s+)/)
    .map((tok) => {
      if (/^\s+$/.test(tok) || !tok) return tok;
      const up = tok.toUpperCase();
      if (MIXED[up]) return MIXED[up];
      if (/^I[3579]$/.test(up)) return up.toLowerCase();
      const unit = tok.match(/^(\d+(?:[.,]\d+)?)(MHZ|GHZ|GB|TB|MB|W|MM)$/i);
      if (unit) return unit[1] + { MHZ: "MHz", GHZ: "GHz", GB: "GB", TB: "TB", MB: "MB", W: "W", MM: "mm" }[unit[2].toUpperCase()];
      if (UPPER.has(up) || /\d/.test(tok) || tok.length <= 2) return up;
      return up[0] + up.slice(1).toLowerCase();
    })
    .join("");
}

// ---------- classificação ----------
const T = (p) => p.name.toUpperCase();

function motivoExclusao(p, cat) {
  const t = T(p);
  const full = `${t} ${p.url} ${p.breadcrumb.join(" ")}`.toUpperCase();
  if (/OPEN[ -]?BOX|SEMINOVO|USAD[OA]|REFURB|RECONDICION/.test(full) || (p.condition && p.condition !== "NewCondition")) return "produto usado/open box";
  if (cat === "cpu" && !/^PROCESSADOR/.test(t)) return "acessório, não é processador";
  if (cat === "board" && !/^PLACA[ -]M[ÃA]E/.test(t)) return "não é placa-mãe";
  if (cat === "ram") {
    if (/NOTEBOOK|SO-?DIMM|LAPTOP/.test(full)) return "memória de notebook (SO-DIMM)";
    if (!/^(KIT )?MEM[ÓO]RIA/.test(t)) return "não é módulo de memória";
    if (/RDIMM|ECC REG|SERVIDOR/.test(t)) return "memória de servidor";
  }
  if (cat === "gpu" && !/^(GPU|PLACA DE V[ÍI]DEO)/.test(t)) return "não é placa de vídeo";
  if (cat === "storage") {
    if (/EXTERNO|PORT[ÁA]TIL|USB|NOTEBOOK|ENCLOSURE|CASE /.test(t)) return "armazenamento externo/notebook";
    if (!/^(SSD|NVME|HD|M\.?2)/.test(t)) return "não é unidade de armazenamento";
    if (/\bSAS\b/.test(t) && !/SATA/.test(t)) return "interface SAS (servidor), incompatível com placas-mãe desktop";
  }
  if (cat === "cooler" && !/^(AIR COOLER|WATER COOLER|COOLER PARA PROCESSADOR|COOLER PROCESSADOR)/.test(t)) return "não é cooler de processador (ventoinha/acessório)";
  if (cat === "psu" && (!/^FONTE/.test(t) || /NOTEBOOK|ADAPTADOR|CARREGADOR|NOBREAK|UNIVERSAL/.test(t))) return "não é fonte de PC desktop";
  if (cat === "case" && (!/^GABINETE/.test(t) || /EXTERNO|\bHD\b/.test(t))) return "não é gabinete de PC";
  return null;
}

// ---------- parsers por categoria ----------
const SOCKET_RE = /\b(AM4|AM5|LGA ?(?:1851|1700|1200|1151|1150|1155|2066|2011))\b/;
const socketDe = (s) => {
  const m = (s ?? "").toUpperCase().match(SOCKET_RE);
  return m ? m[1].replace(" ", "") : undefined;
};

function cpu(p, d) {
  const t = T(p);
  const f = {};
  f.socket = socketDe(t) ?? socketDe(d.get((k) => /soquete|socket/.test(k)));
  f.brand = /INTEL/.test(t) ? "Intel" : /AMD|RYZEN/.test(t) ? "AMD" : undefined;
  const cores = num(first(/(\d+)\s*CORES?\b/, t)) ?? num(d.get((k) => /^(total de nucleos|n. de nucleos de cpu|nucleos)/.test(k)));
  const threads = num(first(/(\d+)\s*THREADS?\b/, t)) ?? num(d.get((k) => /(total de topicos|total de threads|n. de threads)/.test(k)));
  const boost = first(/([\d.,]+)\s*GHZ MAX TURBO/, t) ?? first(/([\d.,]+)\s*GHZ/, t);
  const tdpRow = d.find((x) => /(tdp|potencia (de |basica )?(base|basica) do processador|potencia basica|processor base power)/.test(x) && !/turbo/.test(x));
  f.tdp = num(first(/(\d{2,3})\s*(?:W\b|$)/i, tdpRow?.value));
  const turbo = num(first(/(\d+)\s*W/i, d.get((k) => /(potencia turbo maxima|maximum turbo power)/.test(k))));
  if (turbo) f.turbo = turbo;
  // vídeo integrado: só afirma com texto claro do fornecedor
  const txt = `${t} ${d.body}`.toUpperCase();
  const gpuLine = d.get((k) => /(nome da gpu|graficos integrados|grafico integrado|placa grafica|capacidade grafica|modelo grafico|graphics model|modelo da placa de video)/.test(k));
  if (/N[ÃA]O POSSUI V[ÍI]DEO INTEGRADO|SEM V[ÍI]DEO|REQUER PLACA DE V[ÍI]DEO|SEM GR[ÁA]FICOS|PLACA DE V[ÍI]DEO DIFERENCIADA/.test(txt)) f.igpu = false;
  else if (/C\/ V[ÍI]DEO|COM V[ÍI]DEO|RADEON GRAPHICS|GR[ÁA]FICOS UHD|INTEL UHD|INTEL ARC|GR[ÁA]FICOS INTEL/.test(txt) || (gpuLine && !/n[ãa]o|nenhum|requer/i.test(gpuLine))) f.igpu = true;
  // cooler na caixa
  const therm = d.get((k) => /(solucao termica|thermal solution)/.test(k));
  if (/SEM COOLER|S\/ COOLER|SEM DISSIPADOR/.test(t)) f.boxCooler = false;
  else if (/C\/ COOLER|COM COOLER/.test(t) || (therm && !/(nenhum|n[ãa]o|none)/i.test(therm))) f.boxCooler = true;
  const chips = d.get((k) => /supporting chipsets|chipsets compat/.test(k));
  if (chips) f.chipsets = [...new Set(chips.toUpperCase().match(/[ABHQWXZ]\d{3}E?/g) ?? [])];
  f.specs = [cores && threads ? `${cores} núcleos, ${threads} threads` : null, boost ? `até ${boost.replace(".", ",")} GHz` : null, f.igpu === true ? "vídeo integrado" : null, f.socket?.replace("LGA", "LGA ")].filter(Boolean).join(", ");
  return f;
}

function board(p, d) {
  const t = T(p);
  const f = {};
  f.socket = socketDe(t) ?? socketDe(d.get((k) => /socket|soquete/.test(k))) ?? socketDe(d.body);
  f.brand = f.socket && /^AM/.test(f.socket) ? "AMD" : f.socket ? "Intel" : undefined;
  const mem = [...new Set(t.match(/DDR[45]/g) ?? [])];
  f.memory = mem.length === 1 ? mem[0] : undefined;
  const bodyMem = [...new Set(d.body.toUpperCase().match(/DDR[45]/g) ?? [])];
  if (f.memory && bodyMem.length === 1 && bodyMem[0] !== f.memory) {
    f.divergencias = [...(f.divergencias ?? []), `memória: título ${f.memory}, ficha técnica ${bodyMem[0]}`];
    f.memoryDivergente = true;
  }
  if (!f.memory) {
    const m = [...new Set((d.get((k) => /^memoria$|tipo de memoria/.test(k)) ?? "").toUpperCase().match(/DDR[45]/g) ?? [])];
    if (m.length === 1) f.memory = m[0];
  }
  const formOf = (txt) => {
    const u = txt.toUpperCase();
    if (/E-?ATX|EXTENDED/.test(u)) return "EATX";
    if (/M-?ATX|MICRO[ -]?ATX|MICROATX/.test(u)) return "mATX";
    if (/MINI[ -]?ITX|\bITX\b/.test(u)) return "mITX";
    if (/(^|[^A-Z-])ATX(?![A-Z])/.test(u)) return "ATX";
  };
  const specForm = d.kv
    .filter(([k, , sec]) => /(fator|formato|form factor)/.test(strip(sec)) || /^(fator|formato|form factor|arquitetura (micro|mini|atx|e-atx))/.test(strip(k)) || /^arquitetura (micro|mini|atx|e-atx)/.test(strip(`${k} ${p.name}`)))
    .map(([k, v]) => formOf(`${k} ${v}`))
    .find(Boolean);
  const titleForm = formOf(t.split(" - ")[0]);
  f.form = specForm ?? titleForm;
  if (specForm && titleForm && specForm !== titleForm) f.divergencias = [`formato: título do fornecedor ${titleForm}, ficha técnica ${specForm} (usado o da ficha)`];
  f.chipset =
    first(/\b([ABHQWXZ]\d{3}E?)\b/, d.sectionLines((s) => /^chipset/.test(s)).join(" ").toUpperCase()) ??
    first(/\bCHIPSET ([ABHQWXZ]\d{3}E?)\b/, t) ??
    first(/\b([ABHQWXZ]\d{3})(?:E|M)?\b/, t.split(" - ")[0].replace(/PLACA M[ÃA]E/, ""));
  const body = d.body;
  const slots = first(/(\d)\s*x\s*(?:slots? )?(?:DDR[45]\s+)?(?:UDIMM|DIMM)/i, body) ?? first(/(\d)\s*(?:slots?|x)\s*DDR[45]/i, body) ?? first(/(\d)\s*slots? (?:de )?mem[óo]ria/i, body);
  if (slots) f.memSlots = num(slots);
  const mx = num(first(/(?:m[áa]xim[ao]|at[ée]|up to)[^\n]{0,40}?(\d{2,3})\s*GB/i, body) ?? first(/(\d{2,3})\s*GB[^\n]{0,20}(?:m[áa]xim|max)/i, body));
  if (mx) f.memMax = mx;
  const labels = new Set([...body.matchAll(/\bM\.?2[_ ]?(\d)\b/gi)].map((m) => m[1]));
  const sumM2 = [...body.matchAll(/(\d)\s*x\s*(?:slots? )?M\.?2/gi)].reduce((a, m) => a + +m[1], 0);
  const m2 = labels.size || sumM2;
  if (m2) f.m2Slots = Math.min(m2, 6);
  const sata = [...body.matchAll(/(\d)\s*x\s*(?:portas? )?SATA/gi)].reduce((a, m) => a + +m[1], 0);
  if (sata) f.sataPorts = Math.min(sata, 12);
  const formTxt = { mITX: "Mini-ITX", mATX: "Micro-ATX", ATX: "ATX", EATX: "E-ATX" }[f.form];
  f.specs = [f.socket?.replace("LGA", "LGA "), f.memory, formTxt, f.chipset ? `chipset ${f.chipset}` : null, /WI-?FI/.test(t) ? "Wi-Fi" : null].filter(Boolean).join(", ");
  return f;
}

function ram(p, d) {
  const t = T(p);
  const f = {};
  f.memory = first(/\b(DDR[345])\b/, t) ?? first(/\b(DDR[345])\b/, d.get((k) => /interface|tipo/.test(k)));
  const kit = t.match(/(\d)\s*X\s*(\d+)\s*GB/);
  const total = num(first(/(\d+)\s*GB/, t)) ?? num(first(/(\d+)\s*GB/, d.get((k) => /^capacidade/.test(k))));
  if (kit) {
    f.modules = +kit[1];
    f.perModule = +kit[2];
    f.gb = f.modules * f.perModule;
    if (total && total !== f.gb) f.gbDivergente = `${total} GB no título, ${f.gb} GB pelo kit`;
  } else if (total) {
    f.gb = total;
    f.modules = /\bKIT\b/.test(t) ? undefined : 1;
    if (f.modules) f.perModule = total;
  }
  f.speed = num(first(/(\d{3,5})\s*(?:MHZ|MT\/S)/, t)) ?? num(first(/(\d{3,5})\s*(?:MHZ|MT\/S)/i, d.get((k) => /frequencia|velocidade/.test(k))));
  f.specs = [f.gb ? `${f.gb} GB${f.modules > 1 ? ` (${f.modules}x ${f.perModule} GB)` : ""}` : null, f.memory, f.speed ? `${f.speed} MHz` : null].filter(Boolean).join(", ");
  return f;
}

function gpu(p, d) {
  const t = T(p);
  const f = {};
  f.brand = /RTX|GTX|GEFORCE|NVIDIA/.test(t) ? "NVIDIA" : /\bRX\b|RADEON/.test(t) ? "AMD" : /\bARC\b/.test(t) ? "Intel" : undefined;
  f.vram = num(first(/(\d+)\s*GB/, t)) ?? num(first(/(\d+)\s*GB/i, d.get((k) => /(tamanho da memoria|memoria de video|^memoria$)/.test(k))));
  const rec = d.find((x) => /((fonte|psu).{0,30}recomend|recomend.{0,30}(fonte|psu)|fonte (minima|de alimentacao) )/.test(x));
  f.psu = num(first(/(\d{3,4})\s*W/i, rec?.value));
  for (const cand of d.findAll((x) => /(tamanho do cartao|^dimensoes|^comprimento|dimensao do produto|tamanho do produto|tamanho da placa|card size|product size|^length)/.test(x))) {
    const dim = cand.line;
    const v =
      num(first(/\bC\s*=\s*(\d{2,3}(?:[.,]\d+)?)/i, dim)) ??
      num(first(/(\d{3}(?:[.,]\d+)?)\s*(?:mm)?\s*[x×]\s*\d{2,3}(?:[.,]\d+)?\s*(?:mm)?\s*[x×]\s*\d/i, dim)) ??
      num(first(/(?:comprimento|length)[^\d]{0,12}(\d{3}(?:[.,]\d+)?)\s*mm/i, dim));
    if (v != null && v >= 120 && v <= 450) {
      f.length = v;
      break;
    }
  }
  const pow = d.find((x) => /(conectores? de (energia|alimentacao)|power connectors?|^conector[: ]|^conector$)/.test(x))?.line ?? "";
  if (pow) {
    const p16 = /(?:16|12\+4)\s*(?:pinos?|-?pin)|12V-?2x6|12VHPWR/i.test(pow);
    const counts = [
      ...pow.matchAll(/(\d)\s*[x*]\s*(?:conector(?:es)?\s*)?(?:PCI-?E\s*)?8\s*-?\s*(?:\+\s*\d\s*)?-?\s*(?:pin|pinos)/gi),
      ...pow.matchAll(/8\s*-?\s*(?:pin|pinos?)\s*[*x]\s*(\d)/gi),
    ].map((m) => +m[1]);
    const n8 = counts.length ? Math.max(...counts) : undefined;
    if (p16) f.p16 = true;
    if (n8 != null) f.pcie8 = n8;
    else if (/(nenhum|sem conector|n[ãa]o possui)/i.test(pow)) f.pcie8 = 0;
    else if (/8\s*-?\s*pin|8\s*pinos?/i.test(pow)) f.pcie8 = 1;
    else if (/6\s*-?\s*pin|6\s*pinos?/i.test(pow)) f.pcie8 = 1;
    else if (p16) f.pcie8 = 0;
  }
  const slots = first(/(\d(?:[.,]\d)?)\s*slots?/i, d.rows.filter((r) => /slot/i.test(r) && !/pci|m\.2|express|expans/i.test(r.split(":")[0])).join(" "));
  if (slots) f.slots = num(slots);
  f.specs = [f.vram ? `${f.vram} GB` : null, first(/\b(GDDR\d\w?)\b/, t), first(/(\d{2,3})-?\s*BITS?/, t) ? `${first(/(\d{2,3})-?\s*BITS?/, t)} bits` : null, f.length ? `${f.length} mm` : null].filter(Boolean).join(", ");
  return f;
}

function storage(p, d) {
  const t = T(p);
  const f = {};
  const cap = t.match(/(\d+(?:[.,]\d+)?)\s*(TB|GB)\b/);
  if (cap) f.gb = Math.round(num(cap[1]) * (cap[2] === "TB" ? 1000 : 1));
  const iface = d.get((k) => /^interface/.test(k)) ?? "";
  const formTxt = d.get((k) => /(formato|fator)/.test(k)) ?? "";
  const whole = `${t} ${iface}`.toUpperCase();
  const m2 = /M\.?2/.test(whole);
  if (/NVME|PCIE|PCI-E/.test(whole)) f.iface = "nvme";
  else if (m2 && /SATA/.test(whole)) f.iface = "m2-sata";
  else if (/SATA/.test(whole)) f.iface = "sata";
  const form = first(/(2242|2260|2280|22110)/, whole);
  if (m2 || f.iface === "nvme") f.storageForm = form ? `M.2 ${form}` : "M.2";
  else if (/3[.,]5/.test(whole + formTxt)) f.storageForm = '3.5"';
  else if (/2[.,]5/.test(whole + formTxt)) f.storageForm = '2.5"';
  f.kind = /^HD /.test(t) ? "HD" : "SSD";
  const read = first(/LEIT[^\d]{0,5}(\d[\d.]*)\s*MB/i, t) ?? first(/(\d[\d.]*)\s*MB\/S/i, d.get((k) => /leitura/.test(k)));
  const rpm = first(/(\d{4,5})\s*RPM/, t);
  const tam = f.gb ? (f.gb >= 1000 ? `${f.gb / 1000} TB` : `${f.gb} GB`) : null;
  f.specs = [tam, f.kind, { nvme: "NVMe", sata: "SATA", "m2-sata": "M.2 SATA" }[f.iface], f.storageForm, rpm ? `${rpm} RPM` : null, read ? `leitura até ${read.replace(/\./g, "")} MB/s` : null].filter(Boolean).join(", ");
  return f;
}

function cooler(p, d) {
  const t = T(p);
  const f = {};
  const water = /^WATER COOLER/.test(t);
  if (water) f.radiator = num(first(/(\d{3})\s*MM?\b/, t));
  const comp = d.sectionLines((s) => /compatibilidade/.test(s)).join(" ") + " " + (d.get((k) => /^compatibilidade|compatible|suporte a soquete|sockets?/.test(k)) ?? "");
  const text = comp.toUpperCase();
  const found = new Set();
  for (const m of text.matchAll(/\bAM[45]\b/g)) found.add(m[0]);
  const intel = text.match(/(?:INTEL|LGA)[^\n]*/g)?.join(" ") ?? "";
  for (const n of ["1851", "1700", "1200"]) if (new RegExp(`\\b${n}\\b`).test(intel) || new RegExp(`LGA ?${n}`).test(text)) found.add("LGA" + n);
  if (/\b17XX\b/.test(text)) found.add("LGA1700");
  f.sockets = SOCKETS.filter((s) => found.has(s));
  if (!water) {
    // Altura só quando a ficha a identifica: "Altura: 155 mm", "156 (A)" ou "(CxLxA)". Medidas sem rótulo de eixo
    // não são adivinhadas: ficam só como dica na pendência.
    const alturas = [];
    for (const row of d.rows) {
      if (/(embalagem|peso|fan|ventilador|ventoinha|radiador)/i.test(strip(row.split(":")[0]))) continue;
      const rot = strip(row);
      let m;
      if ((m = row.match(/^(?:altura(?: do (?:dissipador|cooler|air cooler|produto))?|altura total)\s*:\s*(\d{2,3}(?:[.,]\d+)?)\s*mm/i))) alturas.push(num(m[1]));
      else if ((m = row.match(/(\d{2,3}(?:[.,]\d+)?)\s*\(\s*A\s*\)/))) alturas.push(num(m[1]));
      else if (/dimens/.test(rot) && /\(\s*[A-Z]\s*x\s*[A-Z]\s*x\s*A\s*\)/i.test(row) && (m = row.match(/(\d{2,3}(?:[.,]\d+)?)\s*[x×]\s*(\d{2,3}(?:[.,]\d+)?)\s*[x×]\s*(\d{2,3}(?:[.,]\d+)?)/))) alturas.push(num(m[3]));
    }
    if (alturas.length) f.height = Math.max(...alturas);
    else {
      const dica = d.rows.find((r) => /^dimens/.test(strip(r)) && /(dissipador|produto|cooler)/.test(strip(r.split(":")[0])) && /\d\s*[x×]\s*\d+\s*[x×]\s*\d/.test(r));
      if (dica) f.alturaDica = dica;
    }
  }
  const maxTdp = num(first(/(\d{2,3})\s*W/i, d.get((k) => /^tdp/.test(k))));
  if (maxTdp) f.maxTdp = maxTdp;
  f.water = water;
  const fan = first(/(\d{3})\s*MM/, t);
  f.specs = [water ? `Water cooler${f.radiator ? ` ${f.radiator} mm` : ""}` : `Cooler a ar${fan ? ` ${fan} mm` : ""}`, f.height ? `altura ${f.height} mm` : null, f.sockets.length ? f.sockets.map((s) => s.replace("LGA", "LGA ")).join(", ") : null].filter(Boolean).join(", ");
  return f;
}

function psu(p, d) {
  const t = T(p);
  const f = {};
  f.watts = num(first(/(\d{3,4})\s*W\b/, t)) ?? num(first(/(\d{3,4})\s*W\b/i, d.get((k) => /^potencia/.test(k))));
  let n8 = 0;
  for (const row of d.rows) {
    if (!/(pci-?e|pcie|vga|gpu)/i.test(row)) continue;
    if (/12V-?2x6|12VHPWR|12\s*\+\s*4|16\s*-?\s*(pin|pinos)/i.test(row)) {
      f.p16 = true;
      continue;
    }
    if (!/(6\s*\+\s*2|\b8\s*-?\s*(pin|pinos)|6\/8)/i.test(row)) continue;
    const lead = row.match(/^(\d+)\s*x\s/i)?.[1];
    const tail = row.match(/:\s*(\d+)\b/)?.[1];
    n8 += +(lead ?? tail ?? 0);
  }
  if (n8) f.pcie8 = n8;
  if (/SFX/.test(t)) f.psuForm = "SFX";
  else if (/\bTFX\b/.test(t)) f.psuForm = "TFX";
  const fmt = d.get((k) => /^(formato|padrao|tipo)$/.test(k)) ?? "";
  if (!f.psuForm && /^ATX$/i.test(fmt.trim())) f.psuForm = "ATX";
  const plus = first(/80\s*PLUS\s*(\w+)/, t);
  const mod = /FULL[ -]?MODULAR/.test(t) ? "full modular" : /SEMI[ -]?MODULAR/.test(t) ? "semi modular" : /N[ÃA]O MODULAR/.test(t) ? "não modular" : null;
  f.specs = [f.watts ? `${f.watts} W` : null, plus ? `80 Plus ${plus[0] + plus.slice(1).toLowerCase()}` : null, mod].filter(Boolean).join(", ");
  return f;
}

function pcCase(p, d) {
  const t = T(p);
  const f = {};
  const set = new Set();
  const FORMS = [
    ["EATX", /E-?ATX|EXTENDED[- ]ATX/],
    ["mATX", /M-?ATX|MICRO[ -]?ATX|MICROATX/],
    ["mITX", /MINI[ -]?ITX|\bITX\b/],
    ["ATX", /(^|[^A-Z-])ATX(?![A-Z])/],
  ];
  const tokens = (txt) => {
    const u = txt.toUpperCase();
    const out = [];
    for (const [id, re] of FORMS) {
      const clean = id === "ATX" ? u.replace(/E-?ATX|M-?ATX|MICRO[ -]?ATX|MICROATX|EXTENDED[- ]ATX/g, " ") : u;
      if (re.test(clean)) out.push(id);
    }
    return out;
  };
  for (const row of d.rows) {
    const r = strip(row);
    if (!/(placa|motherboard|mainboard|\bmb\b|compativel com (e-?atx|atx|m-?atx|micro|mini))/.test(r) || /(fonte|psu|slot|expans|traseir|conector|cooler|water|radiador|video|gpu|vga)/.test(r)) continue;
    // "Compatibilidade com placas mãe mATX: Sim" / "... ATX: Não"
    const yn = row.match(/^(.*?):\s*(sim|n[ãa]o|yes|no)\b/i);
    if (yn && tokens(yn[1]).length === 1) {
      if (/^(sim|yes)/i.test(yn[2])) set.add(tokens(yn[1])[0]);
      continue;
    }
    for (const x of tokens(row)) set.add(x);
  }
  f.forms = ["mITX", "mATX", "ATX", "EATX"].filter((x) => set.has(x));
  if (!f.forms.length) {
    // sem lista explícita: usa o formato do título e os menores que cabem na mesma furação ATX
    const base = tokens(t.split(" - ")[0]).pop();
    if (base) {
      const order = ["mITX", "mATX", "ATX", "EATX"];
      f.forms = order.slice(0, order.indexOf(base) + 1).filter((x) => x !== "EATX" || base === "EATX");
      f.formsDerivados = 'Formatos aceitos inferidos pelo padrão de furação ATX a partir de "' + base + '" no título';
    }
  }
  const mm = (txt, min, max) => {
    for (const m of txt.matchAll(/(\d{2,3})(?:[.,]\d+)?\s*mm/gi)) if (+m[1] >= min && +m[1] <= max) return +m[1];
  };
  const rads = [];
  let inRad = false;
  for (const row of d.rows) {
    const r = strip(row);
    if (/^[^:]+:\s*$/.test(row)) inRad = /(radiador|water ?cooler|refrigeracao)/.test(r);
    const line = /(radiador|radiator|water ?cooler|aio)/.test(r) || inRad ? row : "";
    for (const m of line.matchAll(/\b(120|140|240|280|360|420)\s*(?:mm)?/g)) rads.push(+m[1]);
  }
  if (rads.length) f.caseRadiator = Math.max(...rads);
  const after = (row) => row.slice(row.indexOf(":") + 1);
  const gpuRow = d.rows.find((row) => /(gpu|placa de video|vga|graphics card|placa grafica)/.test(strip(row)) && /(comprimento|tamanho|length|max|ate|espaco|limit)/.test(strip(row)) && mm(after(row), 150, 600));
  if (gpuRow) f.maxGpu = mm(after(gpuRow), 150, 600);
  const cpuRow = d.rows.find((row) => /(cooler|dissipador|cpu)/.test(strip(row.split(":")[0])) && /(altura|height|limit)/.test(strip(row)) && mm(after(row), 100, 220));
  if (cpuRow) f.maxCooler = mm(after(cpuRow), 100, 220);
  const pf = d.rows.find((row) => /(tipo da fonte|tipo de fonte|fonte suportada|fonte compat|suporte de fonte)/.test(strip(row)));
  if (pf && /\bATX\b/i.test(pf)) f.psuForms = ["ATX"];
  const fm = { mITX: "Mini-ITX", mATX: "Micro-ATX", ATX: "ATX", EATX: "E-ATX" };
  f.specs = [f.forms.length ? f.forms.map((x) => fm[x]).join(", ") : null, /VIDRO/.test(t) ? "vidro temperado" : null, f.caseRadiator ? "radiador até " + f.caseRadiator + " mm" : null, f.maxGpu ? "placa de vídeo até " + f.maxGpu + " mm" : null].filter(Boolean).join(", ");
  return f;
}

const PARSERS = { cpu, board, ram, gpu, storage, cooler, psu, case: pcCase };

// ---------- nome ----------
const CATEGORY_WORDS = /^(PROCESSADOR|PLACA M[ÃA]E|PLACA-M[ÃA]E|KIT MEM[ÓO]RIA|MEM[ÓO]RIA|GPU|PLACA DE V[ÍI]DEO|GABINETE GAMER|GABINETE|FONTE|AIR COOLER|WATER COOLER|COOLER PARA PROCESSADOR)\s+/;
function nomeLimpo(p, cat, modelo) {
  const raw = p.name.replace(/\s+-\s+[^-]*$/, ""); // tira " - CÓDIGO"
  const upper = raw.split(",")[0].toUpperCase();
  const prefix = { cooler: /^WATER/.test(upper) ? "Water cooler " : "Cooler a ar ", case: "Gabinete ", psu: "Fonte ", board: "Placa-mãe ", ram: /^KIT/.test(upper) ? "Kit memória " : "Memória " }[cat] ?? "";
  const head = upper.replace(CATEGORY_WORDS, "").trim();
  const name = (prefix + smartCase(head)).replace(/Lian LI/g, "Lian Li").replace(/\s+/g, " ").trim();
  const mpn = modelo && !name.toUpperCase().includes(modelo.toUpperCase()) ? ` (${modelo})` : "";
  return (name + mpn).slice(0, 140);
}

// ---------- execução ----------
const docs = [];
const excluidos = [];
const duplicados = [];
const vistos = new Map(); // sku -> id
const porGtin = new Map();
const coleta = bruto.coletadoEm;

for (const p of Object.values(bruto.produtos)) {
  for (const cat of p.etapas) {
    const motivo = motivoExclusao(p, cat);
    if (motivo) {
      excluidos.push({ etapa: cat, nome: p.name, url: p.url, motivo });
      continue;
    }
    const d = parseDesc(p.description);
    const f = PARSERS[cat](p, d);
    if ((cat === "cpu" || cat === "board") && f.socket && !SOCKETS.includes(f.socket)) {
      excluidos.push({ etapa: cat, nome: p.name, url: p.url, motivo: `plataforma ${f.socket} fora do montador atual (${SOCKETS.join(", ")})` });
      continue;
    }
    if (vistos.has(p.sku)) {
      duplicados.push({ sku: p.sku, nome: p.name, motivo: `mesmo SKU já importado como ${vistos.get(p.sku)}` });
      continue;
    }
    const modelo = first(/^- Modelo:\s*(.+)$/m, p.description)?.trim() ?? p.name.split(" - ").pop().trim();
    if (p.gtin && porGtin.has(p.gtin + modelo)) {
      duplicados.push({ sku: p.sku, nome: p.name, motivo: `mesmo EAN/modelo de ${porGtin.get(p.gtin + modelo)}` });
      continue;
    }
    const id = `ciapc-${p.sku}`;
    vistos.set(p.sku, id);
    if (p.gtin) porGtin.set(p.gtin + modelo, id);

    const faltando = ESSENCIAL[cat].filter((k) => f[k] == null || (Array.isArray(f[k]) && !f[k].length));
    const desejaveis = [];
    if (cat === "board") for (const k of ["chipset", "m2Slots", "memSlots"]) if (f[k] == null) desejaveis.push(k);
    if (cat === "cooler") {
      if (!f.water && f.height == null) desejaveis.push("height");
      if (f.maxTdp == null) desejaveis.push("maxTdp");
    }
    if (cat === "cpu" && f.boxCooler == null) desejaveis.push("boxCooler");
    if (cat === "case") for (const k of ["maxGpu", "maxCooler", "caseRadiator"]) if (f[k] == null) desejaveis.push(k);
    if ((cat === "gpu" || cat === "psu") && f.pcie8 == null) desejaveis.push("pcie8");
    const pendencias = [...faltando.map((k) => `Falta (essencial): ${ROTULO[k] ?? k}`), ...desejaveis.map((k) => `Não informado: ${ROTULO[k] ?? k}`)];
    if (f.alturaDica) pendencias.push(`Dica (não confirmada, eixos sem rótulo na ficha): ${f.alturaDica}`);
    if (f.gbDivergente) pendencias.push(`Falta (essencial): capacidade divergente (${f.gbDivergente})`);
    if (f.memoryDivergente) pendencias.push(`Falta (essencial): tipo de memória divergente (${f.divergencias.join("; ")})`);
    else if (f.divergencias?.length) pendencias.push(...f.divergencias.map((x) => `Divergência corrigida: ${x}`));
    const complementos = f.formsDerivados ? [f.formsDerivados] : [];

    const doc = {
      _id: id,
      _type: "peca",
      category: cat,
      name: nomeLimpo(p, cat, modelo),
      specs: f.specs,
      active: false,
      revisao: faltando.length || f.gbDivergente || f.memoryDivergente ? "pendente" : "ok",
    };
    const campos = ["brand", "socket", "memory", "form", "igpu", "boxCooler", "tdp", "psu", "maxTdp", "watts", "radiator", "chipset", "chipsets", "memSlots", "memMax", "m2Slots", "sataPorts", "gb", "modules", "speed", "length", "vram", "slots", "pcie8", "p16", "iface", "storageForm", "sockets", "height", "maxGpu", "maxCooler", "psuForms", "psuForm", "forms", "caseRadiator"];
    for (const k of campos) if (f[k] != null && !(Array.isArray(f[k]) && !f[k].length)) doc[k] = f[k];
    if (cat === "cpu" && doc.igpu == null) doc.igpu = false; // nunca prometer vídeo integrado sem confirmação
    if (cat === "cpu" && doc.boxCooler == null) doc.boxCooler = false;
    if (cat === "case" && doc.caseRadiator == null) delete doc.caseRadiator;
    if (cat === "cooler" && f.water && doc.radiator == null) doc.radiator = undefined;
    doc.fornecedor = {
      fonte: "ciapc",
      sku: p.sku,
      modelo,
      ...(p.gtin ? { gtin: p.gtin } : {}),
      nomeOriginal: p.name,
      url: p.url,
      ...(p.image ? { imagem: p.image } : {}),
      imagemStatus: "Origem: CIAPC (fornecedor da Capucho). Uso no site autorizado pelo dono em 12/10/2026; foto otimizada em public/assets/catalogo.",
      disponibilidade: p.availability ?? "desconhecida",
      condicao: p.condition ?? "desconhecida",
      situacao: "encontrado",
      coletadoEm: coleta,
      pendencias,
      especificacoes: d.body.replace(/^.*\n/, "").slice(0, 6000),
      ...(complementos.length ? { complementos } : {}),
    };
    docs.push(JSON.parse(JSON.stringify(doc)));
  }
}

// ---------- relatório ----------
const cats = Object.keys(ESSENCIAL);
const nomes = { cpu: "Processador", board: "Placa-mãe", ram: "Memória RAM", gpu: "Placa de vídeo", storage: "Armazenamento", cooler: "Cooler", psu: "Fonte", case: "Gabinete" };
const coletadosPorCat = Object.fromEntries(cats.map((c) => [c, Object.values(bruto.produtos).filter((p) => p.etapas.includes(c)).length]));
const linhas = [];
linhas.push(`# Importação CIAPC${TESTE ? " (amostra de teste)" : ""}`, "", `Coleta: ${coleta}`, "");
linhas.push("## Listagens percorridas", "", "| Etapa | Listagem | Páginas | Produtos |", "|---|---|---|---|");
for (const l of bruto.listagens) linhas.push(`| ${nomes[l.etapa]} | ${l.listagem} | ${l.paginas} | ${l.produtos} |`);
linhas.push("", "## Resumo por categoria", "", "| Categoria | Encontrados | Preparados | Revisão ok | Pendentes de revisão | Excluídos |", "|---|---|---|---|---|---|");
for (const c of cats) {
  const ds = docs.filter((x) => x.category === c);
  linhas.push(`| ${nomes[c]} | ${coletadosPorCat[c]} | ${ds.length} | ${ds.filter((x) => x.revisao === "ok").length} | ${ds.filter((x) => x.revisao === "pendente").length} | ${excluidos.filter((x) => x.etapa === c).length} |`);
}
linhas.push(`| **Total** | ${Object.values(coletadosPorCat).reduce((a, b) => a + b, 0)} | ${docs.length} | ${docs.filter((x) => x.revisao === "ok").length} | ${docs.filter((x) => x.revisao === "pendente").length} | ${excluidos.length} |`);
linhas.push("", "## Excluídos", "");
for (const [m, l] of Object.entries(excluidos.reduce((a, e) => ((a[e.motivo] ??= []).push(e), a), {}))) {
  linhas.push(`- **${m}** (${l.length}): ${l.slice(0, 6).map((e) => e.nome.slice(0, 70)).join("; ")}${l.length > 6 ? "; …" : ""}`);
}
linhas.push("", "## Duplicados", "", duplicados.length ? duplicados.map((x) => `- ${x.nome.slice(0, 80)} — ${x.motivo}`).join("\n") : "Nenhum SKU/EAN repetido entre as categorias.");
linhas.push("", "## Campos técnicos ausentes", "", "| Categoria | Campo | Peças sem o dado | de |", "|---|---|---|---|");
for (const c of cats) {
  const ds = docs.filter((x) => x.category === c);
  const ausentes = (x) => x.fornecedor.pendencias.filter((q) => /^(Falta|Não informado)/.test(q));
  const campos = new Set(ds.flatMap((x) => ausentes(x).map((q) => q.replace(/^[^:]+: /, ""))));
  for (const campo of campos) {
    const n = ds.filter((x) => ausentes(x).some((q) => q.endsWith(`: ${campo}`))).length;
    const ess = ds.some((x) => x.fornecedor.pendencias.includes(`Falta (essencial): ${campo}`));
    linhas.push(`| ${nomes[c]} | ${campo}${ess ? " (essencial)" : ""} | ${n} | ${ds.length} |`);
  }
}
const dicas = docs.filter((x) => x.fornecedor.pendencias.some((q) => q.startsWith("Dica")));
const correcoes = docs.filter((x) => x.fornecedor.pendencias.some((q) => q.startsWith("Divergência")));
linhas.push("", "Observações:", "", `- ${dicas.length} coolers a ar têm a altura listada na ficha só como três medidas sem rótulo de eixo; a altura não foi preenchida (dica guardada em fornecedor.pendencias).`);
for (const x of correcoes) linhas.push(`- ${x.name}: ${x.fornecedor.pendencias.find((q) => q.startsWith("Divergência"))}`);
writeFileSync(new URL(TESTE ? "relatorio-teste.md" : "relatorio.md", DIR), linhas.join("\n") + "\n");
writeFileSync(new URL(TESTE ? "normalizado-teste.json" : "normalizado.json", DIR), JSON.stringify({ coletadoEm: coleta, teste: TESTE, docs, excluidos, duplicados }, null, 1));
console.log(linhas.slice(linhas.findIndex((l) => l.startsWith("## Resumo")), linhas.findIndex((l) => l.startsWith("## Excluídos"))).join("\n"));
