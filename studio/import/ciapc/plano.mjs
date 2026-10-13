// Planejamento puro da importação (sem rede): decide o que criar e o que atualizar, preservando o que é do dono.
// Usado por importar.mjs e testado em testar-importacao.mjs.
// Campos que o dono controla: nunca entram em patch de peça existente.
export const COMERCIAIS = new Set(["price", "stock", "active", "image", "name", "specs", "revisao"]);
const simples = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]/g, "");

export function planejar(norm, existentes, dataset = "production") {
  const publicados = new Map(existentes.filter((d) => !d._id.startsWith("drafts.")).map((d) => [d._id, d]));
  const rascunhos = new Set(existentes.filter((d) => d._id.startsWith("drafts.")).map((d) => d._id.replace("drafts.", "")));
  const antigas = [...publicados.values()].filter((d) => !d.fornecedor?.sku);
  const mutacoes = [];
const plano = { dataset, novas: [], atualizadas: [], semMudanca: 0, naoEncontradas: [], possiveisEquivalentes: [], camposTecnicosPreenchidos: 0, rascunhosAbertos: [] };


for (const doc of norm.docs) {
  const atual = publicados.get(doc._id);
  if (!atual) {
    mutacoes.push({ createIfNotExists: doc });
    plano.novas.push({ id: doc._id, categoria: doc.category, nome: doc.name, revisao: doc.revisao });
    const nome = simples(doc.name);
    for (const velha of antigas.filter((d) => d.category === doc.category)) {
      const v = simples(velha.name);
      if (v.length >= 6 && nome.includes(v)) plano.possiveisEquivalentes.push({ nova: doc._id, nomeNovo: doc.name, antiga: velha._id, nomeAntigo: velha.name });
    }
    continue;
  }
  const set = {};
  const setIfMissing = {};
  for (const [k, v] of Object.entries(doc.fornecedor)) {
    if (k === "complementos") continue;
    if (JSON.stringify(atual.fornecedor?.[k]) !== JSON.stringify(v)) set[`fornecedor.${k}`] = v;
  }
  for (const [k, v] of Object.entries(doc)) {
    if (k.startsWith("_") || k === "fornecedor" || COMERCIAIS.has(k) || k === "category") continue;
    if (atual[k] == null) setIfMissing[k] = v;
  }
  if (rascunhos.has(doc._id)) plano.rascunhosAbertos.push(doc._id);
  const mudou = Object.keys(set).length || Object.keys(setIfMissing).length;
  if (!mudou) {
    plano.semMudanca++;
    continue;
  }
  const patch = { id: doc._id };
  if (Object.keys(set).length) patch.set = set;
  if (Object.keys(setIfMissing).length) {
    patch.setIfMissing = setIfMissing;
    plano.camposTecnicosPreenchidos += Object.keys(setIfMissing).length;
  }
  mutacoes.push({ patch });
  plano.atualizadas.push({ id: doc._id, nome: atual.name, campos: [...Object.keys(set), ...Object.keys(setIfMissing)] });
}

// Peças importadas antes que não apareceram nesta coleta: só registra.
const idsColeta = new Set(norm.docs.map((d) => d._id));
const completa = !norm.teste && norm.coletadoEm;
for (const [id, d] of publicados) {
  if (!d.fornecedor?.sku || idsColeta.has(id) || d.fornecedor.fonte !== "ciapc") continue;
  plano.naoEncontradas.push({ id, nome: d.name });
  if (completa && d.fornecedor.situacao !== "nao-encontrado-na-ultima-coleta")
    mutacoes.push({ patch: { id, set: { "fornecedor.situacao": "nao-encontrado-na-ultima-coleta", "fornecedor.coletadoEm": norm.coletadoEm } } });
}


  return { plano, mutacoes };
}
