// Leva normalizado.json (normalizar.mjs) para o painel Sanity da Capucho, sem tocar no que é do dono.
//
//   node import/ciapc/importar.mjs                       simulação: lê o painel, escreve plano-importacao.json, não grava nada
//   SANITY_TOKEN=... node import/ciapc/importar.mjs --aplicar   grava de verdade (token de edição do projeto)
//   SANITY_DATASET=teste ...                             usa outro dataset (ex.: um de testes)
//
// Regras (rodar de novo nunca duplica nem sobrescreve decisões do dono):
//  - peça nova  -> createIfNotExists com preço em branco, active=false e revisao calculada;
//  - peça já importada -> só atualiza o bloco "fornecedor" (cópia dos dados do fornecedor) e PREENCHE campos técnicos
//    que estejam vazios (setIfMissing). Preço, estoque, "Mostrar no site", foto, nome, resumo e revisão ficam como estão;
//  - peça importada que sumiu da coleta -> só marca fornecedor.situacao; nunca apaga;
//  - peças antigas da Capucho (sem fornecedor) nunca são alteradas; possíveis equivalentes só são listados.
import { readFileSync, writeFileSync } from "node:fs";
import { planejar } from "./plano.mjs";

const DIR = new URL("./", import.meta.url);
const PROJECT = "9in9aaz1";
const DATASET = process.env.SANITY_DATASET || "production";
const APPLY = process.argv.includes("--aplicar");
const TOKEN = process.env.SANITY_TOKEN;
const API = `https://${PROJECT}.api.sanity.io/v2025-02-19`;
const norm = JSON.parse(readFileSync(new URL("./normalizado.json", DIR), "utf8"));


async function query(groq) {
  const res = await fetch(`${API}/data/query/${DATASET}?query=${encodeURIComponent(groq)}`, TOKEN ? { headers: { authorization: `Bearer ${TOKEN}` } } : {});
  if (!res.ok) throw new Error(`consulta falhou: ${res.status}`);
  return (await res.json()).result;
}

const existentes = process.env.CIAPC_EXISTENTES
  ? JSON.parse(readFileSync(process.env.CIAPC_EXISTENTES, "utf8"))
  : await query(`*[_type == "peca"]`);
const { plano, mutacoes } = planejar(norm, existentes, DATASET);
writeFileSync(new URL("plano-importacao.json", DIR), JSON.stringify({ ...plano, mutacoes: mutacoes.length }, null, 1));
console.log(`Dataset ${DATASET}: ${plano.novas.length} peças novas, ${plano.atualizadas.length} atualizadas (${plano.camposTecnicosPreenchidos} campos técnicos vazios preenchidos), ${plano.semMudanca} sem mudança, ${plano.naoEncontradas.length} importadas antes e ausentes na coleta, ${plano.possiveisEquivalentes.length} possíveis equivalentes de peças antigas.`);
if (plano.rascunhosAbertos.length) console.log(`Atenção: ${plano.rascunhosAbertos.length} peças têm rascunho aberto no painel (alterações do dono ainda não publicadas); a importação não toca nos rascunhos.`);

if (!APPLY) {
  console.log("Simulação: nada foi gravado. Para gravar: SANITY_TOKEN=... node import/ciapc/importar.mjs --aplicar");
} else if (!TOKEN) {
  console.error("--aplicar exige SANITY_TOKEN (token de edição do projeto).");
  process.exitCode = 1;
} else {
  for (let i = 0; i < mutacoes.length; i += 50) {
    const res = await fetch(`${API}/data/mutate/${DATASET}`, {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${TOKEN}` },
      body: JSON.stringify({ mutations: mutacoes.slice(i, i + 50) }),
    });
    if (!res.ok) throw new Error(`gravação falhou (${res.status}): ${await res.text()}`);
    console.log(`gravadas ${Math.min(i + 50, mutacoes.length)}/${mutacoes.length}`);
  }
  console.log("Importação concluída.");
}
