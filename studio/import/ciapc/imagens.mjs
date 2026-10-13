// Baixa e otimiza as fotos dos produtos importados (uso autorizado pela Capucho, que é cliente da CIAPC).
//   node import/ciapc/imagens.mjs   -> public/assets/catalogo/<sku>.webp (480 px de largura máxima)
import { existsSync, mkdirSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
const require = createRequire(import.meta.url);
const ffmpeg = require("../../../node_modules/ffmpeg-static");
const norm = JSON.parse(readFileSync(new URL("./normalizado.json", import.meta.url), "utf8"));
const out = new URL("../../../public/assets/catalogo/", import.meta.url);
mkdirSync(out, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const ok = [], falha = [];
for (const d of norm.docs) {
  const url = d.fornecedor.imagem;
  const dest = new URL(`${d.fornecedor.sku}.webp`, out);
  if (!url) { falha.push(d._id); continue; }
  if (existsSync(dest)) { ok.push(d.fornecedor.sku); continue; }
  try {
    await sleep(300);
    const res = await fetch(url, { headers: { "user-agent": "Mozilla/5.0 (compatible; CapuchoCatalogImport/1.0)" } });
    if (!res.ok) throw new Error(res.status);
    const tmp = new URL(`${d.fornecedor.sku}.tmp`, out);
    writeFileSync(tmp, Buffer.from(await res.arrayBuffer()));
    const r = spawnSync(ffmpeg, ["-y", "-loglevel", "error", "-i", fileURLToPath(tmp), "-vf", "scale='min(480,iw)':-2", "-c:v", "libwebp", "-quality", "80", fileURLToPath(dest)]);
    rmSync(tmp);
    if (r.status !== 0) throw new Error("ffmpeg");
    ok.push(d.fornecedor.sku);
  } catch (e) { falha.push(`${d._id} ${e.message}`); }
}
writeFileSync(new URL("./imagens.json", import.meta.url), JSON.stringify({ ok, falha }));
console.log(`${ok.length} imagens, ${falha.length} falhas`, falha.slice(0, 5));
