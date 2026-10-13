// Recorta os raios roxos dos JPGs recebidos (o "xadrez de transparência" ou o fundo branco vem desenhado
// na própria imagem) e gera WebP com transparência para a hero:
//   node scripts/raios-alpha.mjs <entrada.jpg> <saida.webp> [largura]
// Como funciona: descobre o fundo (xadrez de dois tons ou cor lisa) pelos cantos, tira o fundo com
// "cor para alfa" contra o tom do fundo em cada pixel e recupera o miolo branco do raio (igual ao fundo
// branco) quando ele está cercado de brilho roxo.
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const ffmpeg = require("ffmpeg-static");
const [, , input, output, width = "900"] = process.argv;

const probe = spawnSync(ffmpeg, ["-i", input], { encoding: "utf8" }).stderr;
const [W, H] = probe.match(/, (\d+)x(\d+)[, ]/).slice(1).map(Number);
const raw = spawnSync(ffmpeg, ["-loglevel", "error", "-i", input, "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], { maxBuffer: 1 << 28 }).stdout;
const px = (x, y) => raw.subarray((y * W + x) * 3, (y * W + x) * 3 + 3);
const luma = (x, y) => {
  const [r, g, b] = px(x, y);
  return 0.299 * r + 0.587 * g + 0.114 * b;
};
const sat = (x, y) => {
  const p = px(x, y);
  return Math.max(...p) - Math.min(...p);
};

// --- fundo: tons e grade do xadrez a partir de uma faixa neutra de um canto ---
function corner() {
  for (const [cx, cy] of [[2, 2], [W - 82, 2], [2, H - 82], [W - 82, H - 82]]) {
    let ok = true;
    for (let y = cy; y < cy + 80 && ok; y++) for (let x = cx; x < cx + 80; x++) if (sat(x, y) > 14) { ok = false; break; }
    if (ok) return [cx, cy];
  }
  return [2, 2];
}
const [cx, cy] = corner();
const tones = [];
for (let y = cy; y < cy + 80; y++) for (let x = cx; x < cx + 80; x++) tones.push(luma(x, y));
tones.sort((a, b) => a - b);
const lo = tones[Math.floor(tones.length * 0.1)];
const hi = tones[Math.floor(tones.length * 0.9)];
const checker = hi - lo > 6;
let period = 0, ox = 0, oy = 0;
if (checker) {
  const mid = (lo + hi) / 2;
  const flips = (fixed, horizontal) => {
    const out = [];
    let prev = null;
    for (let i = 0; i < 80; i++) {
      const v = horizontal ? luma(cx + i, fixed) > mid : luma(fixed, cy + i) > mid;
      if (prev !== null && v !== prev) out.push(i);
      prev = v;
    }
    return out;
  };
  const fx = flips(cy + 3, true);
  const fy = flips(cx + 3, false);
  period = Math.round((fx.at(-1) - fx[0]) / Math.max(1, fx.length - 1));
  ox = cx + fx[0];
  oy = cy + fy[0];
}
// cor de cada tom do fundo (média dos pixels do canto)
const toneColor = (bright) => {
  const acc = [0, 0, 0];
  let n = 0;
  for (let y = cy; y < cy + 80; y++)
    for (let x = cx; x < cx + 80; x++) {
      const l = luma(x, y);
      if (checker ? (bright ? l > (lo + hi) / 2 : l <= (lo + hi) / 2) : true) {
        const p = px(x, y);
        acc[0] += p[0], acc[1] += p[1], acc[2] += p[2], n++;
      }
    }
  return acc.map((v) => v / n);
};
const brightTone = toneColor(true);
const darkTone = checker ? toneColor(false) : brightTone;
let fit = { score: -1 };
if (checker) {
  const mid = (lo + hi) / 2;
  const sample = [];
  for (let y = 0; y < H; y += 3) for (let x = 0; x < W; x += 3) if (sat(x, y) < 8) sample.push([x, y, luma(x, y) > mid]);
  for (let p = period - 1.5; p <= period + 1.5; p += 0.25)
    for (let gx = 0; gx < p * 2; gx += 1)
      for (let gy = 0; gy < p * 2; gy += 1) {
        let score = 0;
        for (let k = 0; k < sample.length; k += 4) {
          const [x, y, b] = sample[k];
          const cell = (Math.floor((x - gx) / p) + Math.floor((y - gy) / p)) & 1;
          if ((cell === 0) === b) score++;
        }
        if (score > fit.score) fit = { score, p, gx, gy, of: Math.ceil(sample.length / 4) };
      }
}
const bg = (x, y) => {
  if (!checker) return brightTone;
  const cell = (Math.floor((x - fit.gx) / fit.p) + Math.floor((y - fit.gy) / fit.p)) & 1;
  return cell === 0 ? brightTone : darkTone;
};

// --- cor para alfa contra o fundo de cada pixel ---
const A = new Float32Array(W * H);
const C = new Float32Array(W * H * 3);
for (let y = 0; y < H; y++)
  for (let x = 0; x < W; x++) {
    const p = px(x, y);
    // Com xadrez, a borda das células borra no JPEG: usa o tom do fundo que explica melhor o pixel
    // (o que dá menos alfa). Só escurecimento conta; o miolo branco é recuperado depois.
    const alphaFor = (t) => Math.max(...[0, 1, 2].map((c) => (t[c] - p[c]) / Math.max(t[c], 1)), 0);
    const cands = checker ? [bg(x, y), brightTone, darkTone] : [brightTone];
    let b = cands[0];
    let a = alphaFor(b);
    for (const t of cands) if (alphaFor(t) < a) (a = alphaFor(t)), (b = t);
    a = Math.min(1, a);
    const i = y * W + x;
    // tira o ruído da compressão JPEG e da marca d'água cinza (sem cor)
    if (a < 0.06 || sat(x, y) < 10) a = 0;
    A[i] = a;
    for (let c = 0; c < 3; c++) C[i * 3 + c] = a ? Math.max(0, Math.min(255, (p[c] - (1 - a) * b[c]) / a)) : 0;
  }

// --- miolo branco: claro, quase sem cor, com brilho roxo forte em volta ---
const R = 5;
const out = Buffer.alloc(W * H * 4);
for (let y = 0; y < H; y++)
  for (let x = 0; x < W; x++) {
    const i = y * W + x;
    let a = A[i];
    let col = [C[i * 3], C[i * 3 + 1], C[i * 3 + 2]];
    if (luma(x, y) > 225 && sat(x, y) < 40) {
      let sum = 0, n = 0, dirs = 0;
      const hits = [];
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        let hit = false;
        for (let k = 1; k <= R; k++) {
          const xx = x + dx * k, yy = y + dy * k;
          if (xx < 0 || yy < 0 || xx >= W || yy >= H) break;
          sum += A[yy * W + xx], n++;
          if (A[yy * W + xx] > 0.2) hit = true;
        }
        hits.push(hit);
        if (hit) dirs++;
      }
      const opposite = (hits[0] && hits[1]) || (hits[2] && hits[3]);
      if (opposite && sum / n > 0.12) {
        a = 1;
        const p = px(x, y);
        col = [p[0], p[1], p[2]];
      }
    }
    const peak = Math.max(col[0], col[1], col[2], 1);
    if (a < 1) col = col.map((v) => (v * 255) / peak);
    out[i * 4] = col[0], out[i * 4 + 1] = col[1], out[i * 4 + 2] = col[2], out[i * 4 + 3] = Math.round(a * 255);
  }

const enc = spawnSync(ffmpeg, ["-loglevel", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgba", "-s", `${W}x${H}`, "-i", "-", "-vf", `scale='min(${width},iw)':-2`, "-c:v", "libwebp", "-lossless", "0", "-quality", "85", "-pix_fmt", "yuva420p", output], { input: out });
if (enc.status !== 0) throw new Error(enc.stderr.toString());
console.log(`${output}: ${W}x${H}, fundo ${checker ? `xadrez ${fit.p}px, ajuste ${Math.round((fit.score / fit.of) * 100)}%` : "liso"}`);
