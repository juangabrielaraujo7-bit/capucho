// Gera catalogo-inicial.ndjson a partir da lista fixa de ../../src/gamer.js, para importar no Sanity:
//   node import/gerar-catalogo.mjs && npx sanity dataset import import/catalogo-inicial.ndjson production --replace
// Os _id "peca-<etapa>-<id>" mantêm os ids antigos, usados pelas configurações prontas do site.
import { writeFileSync } from "node:fs";
import { parts } from "../../src/gamer.js";

const lines = [];
for (const [category, list] of Object.entries(parts)) {
  for (const p of list) {
    const doc = {
      _id: `peca-${category}-${p.id}`,
      _type: "peca",
      category,
      name: p.name,
      specs: p.specs,
      price: p.price,
      stock: Boolean(p.stock),
      active: true,
    };
    for (const key of ["brand", "socket", "memory", "form", "tdp", "psu", "maxTdp", "watts"])
      if (p[key] != null) doc[key] = p[key];
    if (category === "cpu") Object.assign(doc, { igpu: Boolean(p.igpu), boxCooler: Boolean(p.boxCooler) });
    if (category === "cooler" && p.radiator) doc.radiator = p.radiator;
    if (category === "case") Object.assign(doc, { forms: p.forms, caseRadiator: p.radiator });
    lines.push(JSON.stringify(doc));
  }
}
writeFileSync(new URL("./catalogo-inicial.ndjson", import.meta.url), lines.join("\n") + "\n");
console.log(`${lines.length} peças em import/catalogo-inicial.ndjson`);
