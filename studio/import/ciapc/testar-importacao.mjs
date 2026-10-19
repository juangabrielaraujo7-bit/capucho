// Teste de integração do importador, sem rede e sem gravar em lugar nenhum:
//   node import/ciapc/testar-importacao.mjs
// Simula um painel Sanity em memória, importa duas vezes, simula o dono editando preços/ativação e confere:
//  - idempotência (2ª rodada não cria nem altera nada);
//  - preço, estoque, ativação, nome e foto do dono preservados quando o fornecedor muda;
//  - peças antigas da Capucho intocadas; nada apagado quando um produto some da coleta;
//  - documentos aderentes ao schema (campos existentes, valores permitidos) e sem preço zero.
import { readFileSync } from "node:fs";
import { planejar } from "./plano.mjs";
import { peca } from "../../schemas/peca.js";

const norm = JSON.parse(readFileSync(new URL("./normalizado.json", import.meta.url), "utf8"));
const antigas = readFileSync(new URL("../catalogo-inicial.ndjson", import.meta.url), "utf8").trim().split("\n").map((l) => JSON.parse(l));
let falhas = 0;
const ok = (cond, msg) => {
  console.log(`${cond ? "OK   " : "FALHA"} ${msg}`);
  if (!cond) falhas++;
};

// A mesma regra usada pelo painel permite Sob consulta, mas rejeita preço inválido.
let validatePrice;
peca.fields.find((field) => field.name === "price").validation({
  custom: (validate) => { validatePrice = validate; },
});
ok(validatePrice(undefined) === true && validatePrice(null) === true, "painel permite publicar peça sem preço (Sob consulta)");
ok(validatePrice(987.65) === true, "painel aceita preço positivo com centavos");
ok([0, -1, NaN, Infinity].every((value) => validatePrice(value) !== true), "painel rejeita preço zero, negativo ou não finito");

// painel simulado
const db = new Map(antigas.map((d) => [d._id, structuredClone(d)]));
const aplicar = (mutacoes) => {
  for (const m of mutacoes) {
    if (m.createIfNotExists) {
      if (!db.has(m.createIfNotExists._id)) db.set(m.createIfNotExists._id, structuredClone(m.createIfNotExists));
    } else if (m.patch) {
      const d = db.get(m.patch.id);
      for (const [k, v] of Object.entries(m.patch.set ?? {})) {
        const [a, b] = k.split(".");
        if (b) (d[a] ??= {})[b] = v;
        else d[a] = v;
      }
      for (const [k, v] of Object.entries(m.patch.setIfMissing ?? {})) if (d[k] == null) d[k] = v;
    }
  }
};
const antesAntigas = JSON.stringify(antigas);

// 1ª importação
const r1 = planejar(norm, [...db.values()]);
aplicar(r1.mutacoes);
ok(r1.plano.novas.length === norm.docs.length, `1ª rodada cria as ${norm.docs.length} peças`);
const importadas = [...db.values()].filter((d) => d.fornecedor?.sku);
ok(importadas.length === norm.docs.length, "painel simulado tem todas as peças importadas");
ok(importadas.every((d) => d.active === false), "todas chegam ocultas (active = false)");
ok(importadas.every((d) => d.price === undefined && !("price" in d)), "nenhuma chega com preço (nem R$ 0)");
ok(importadas.every((d) => !("stock" in d)), "nenhuma chega marcada como em estoque");
ok(importadas.every((d) => d.fornecedor.imagemStatus.includes("autorizado") && !d.image), "origem da foto registrada; foto do painel (image) não é tocada");
ok(JSON.stringify(antigas) === antesAntigas && antigas.every((a) => JSON.stringify(db.get(a._id)) === JSON.stringify(a)), "peças antigas da Capucho intocadas");

// 2ª importação idêntica: nada muda
const r2 = planejar(norm, [...db.values()]);
ok(r2.mutacoes.length === 0, `2ª rodada idêntica não gera mutações (gerou ${r2.mutacoes.length})`);
ok(r2.plano.semMudanca === norm.docs.length, "2ª rodada: todas 'sem mudança'");

// o dono mexe no painel
const alvo = importadas.filter((d) => d.category === "cpu").slice(0, 3);
const [a, b] = alvo;
Object.assign(a, { price: 1234, stock: true, active: true, name: "Nome ajustado pelo dono" });
Object.assign(b, { price: 999, active: true, revisao: "ok" });
delete b.tdp; // campo técnico apagado por engano
// o fornecedor muda a disponibilidade e a descrição
const norm2 = structuredClone(norm);
const n2 = norm2.docs.find((d) => d._id === a._id);
n2.fornecedor.disponibilidade = "OutOfStock";
n2.fornecedor.especificacoes += "\n- linha nova";
n2.name = "Nome do fornecedor mudou";
n2.price = 1; // jamais deve ser aplicado
const r3 = planejar(norm2, [...db.values()]);
aplicar(r3.mutacoes);
ok(db.get(a._id).price === 1234 && db.get(a._id).stock === true && db.get(a._id).active === true, "preço, estoque e ativação do dono preservados");
ok(db.get(a._id).name === "Nome ajustado pelo dono", "nome editado pelo dono preservado");
ok(db.get(a._id).fornecedor.disponibilidade === "OutOfStock", "bloco do fornecedor atualizado (disponibilidade observada)");
ok(db.get(b._id).price === 999 && db.get(b._id).active === true, "segundo preço/ativação preservados");
ok(db.get(b._id).tdp === norm.docs.find((d) => d._id === b._id).tdp, "campo técnico vazio é preenchido de novo (setIfMissing)");
ok(r3.plano.atualizadas.length === 2, `só as 2 peças mexidas foram atualizadas (${r3.plano.atualizadas.length})`);

// produto some da coleta
const norm3 = structuredClone(norm);
const sumida = norm3.docs.pop();
const r4 = planejar(norm3, [...db.values()]);
aplicar(r4.mutacoes);
ok(db.has(sumida._id), "produto ausente da coleta continua no painel (nada é apagado)");
ok(db.get(sumida._id).fornecedor.situacao === "nao-encontrado-na-ultima-coleta", "produto ausente é só marcado para revisão");

// aderência ao schema
const campos = new Set(peca.fields.map((f) => f.name));
const lista = (nome) => peca.fields.find((f) => f.name === nome)?.options?.list?.map((o) => o.value ?? o);
const invalidos = [];
for (const d of norm.docs) {
  for (const k of Object.keys(d)) if (!k.startsWith("_") && !campos.has(k)) invalidos.push(`${d._id}: campo ${k} fora do schema`);
  if (d.socket && !lista("socket").includes(d.socket)) invalidos.push(`${d._id}: socket ${d.socket}`);
  if (d.memory && !lista("memory").includes(d.memory)) invalidos.push(`${d._id}: memory ${d.memory}`);
  if (d.form && !lista("form").includes(d.form)) invalidos.push(`${d._id}: form ${d.form}`);
  for (const x of d.forms ?? []) if (!lista("form").includes(x)) invalidos.push(`${d._id}: forms ${x}`);
  for (const x of d.sockets ?? []) if (!lista("socket").includes(x)) invalidos.push(`${d._id}: sockets ${x}`);
  if (d.category === "cpu" && (d.igpu == null || d.boxCooler == null)) invalidos.push(`${d._id}: cpu sem igpu/boxCooler`);
  if (d.revisao === "ok") {
    // peça liberada para o montador precisa ter os campos que ele usa
    const need = { cpu: ["socket", "tdp"], board: ["socket", "memory", "form"], ram: ["memory"], gpu: ["psu"], cooler: ["sockets"], psu: ["watts"], case: ["forms"] }[d.category] ?? [];
    for (const k of need) if (d[k] == null) invalidos.push(`${d._id}: revisão ok sem ${k}`);
  }
}
ok(invalidos.length === 0, `documentos aderentes ao schema (${invalidos.length} problemas)`);
if (invalidos.length) console.log(invalidos.slice(0, 15).join("\n"));
const ids = new Set(norm.docs.map((d) => d._id));
ok(ids.size === norm.docs.length, "ids únicos (nenhum produto duplicado)");
console.log(falhas ? `\n${falhas} falha(s)` : "\nTodos os testes passaram");
process.exitCode = falhas ? 1 : 0;
