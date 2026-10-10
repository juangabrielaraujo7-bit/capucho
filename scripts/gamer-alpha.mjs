// Gera o vídeo do PC gamer da hero com fundo transparente (mesma ideia de hero-alpha.mjs).
// O fundo do vídeo é um estúdio cinza com degradê que muda um pouco durante a câmera: em cada
// quadro, um polinômio suave é ajustado ao fundo visível e cada pixel é dividido por ele (isso também
// desfaz o fade de entrada). Depois, "cor para alfa" sobre branco: preto e roxo ficam opacos, sombra e
// vidros ficam translúcidos.
// O trecho usado corta o fade do preto no começo e o fade para o preto no fim.
//
// Uso: node scripts/gamer-alpha.mjs [origem.mp4] [--debug]
//   gera public/assets/hero-gamer.webm, hero-gamer-720.webm (VP9 com alfa) e, para o Safari,
//   hero-gamer.mp4 / hero-gamer-720.mp4 sobre branco (o site aplica multiply, como no notebook).
import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import ffmpegPath from "ffmpeg-static";

const args = process.argv.slice(2);
const DEBUG = args.includes("--debug");
const MEASURE = args.includes("--measure"); // só mede a área ocupada em cada quadro (para o enquadramento)
const input = args.find((a) => !a.startsWith("--")) ?? "../pc-gamer-fechamento-agil.mp4";

const [SW, SH] = [1920, 1080]; // origem
const FIRST = 8; // primeiro quadro usado (fundo já a ~57% do brilho; a divisão pelo fundo compensa)
const LAST = 138; // último quadro antes do fade para o preto
const FPS = 24;
// Enquadramento no quadro 1280x720 do notebook: escala e posição do recorte da origem.
const [OW, OH] = [1280, 720];
// Medido com --measure: desmontado ocupa 1763x902 na origem e montado 795x995. Com 0,65, as alturas
// batem com as do notebook nas duas trocas (605 ↔ 586 e 649 ↔ 647) e as peças mais abertas
// (x 84–1884, y 66–1059) ficam dentro do quadro. O centro segue o do notebook montado (644, 370).
const SCALE = 0.65;
const [CX, CY] = [644, 370];
const [SRC_CX, SRC_CY] = [968, 560];
const FEATHER = 18; // a sombra no chão chega à borda de baixo da origem: some aos poucos, sem corte

const WHITE = 0.965; // o fundo ajustado vira branco pleno (absorve ruído de compressão)

// ---------- ajuste do fundo ----------
const GW = 96, GH = 54; // grade reduzida para o ajuste
const DEG = 4;
const terms = [];
for (let i = 0; i <= DEG; i++) for (let j = 0; j <= DEG - i; j++) terms.push([i, j]);

function solve(A, b) {
  const n = b.length;
  const M = A.map((row, i) => [...row, b[i]]);
  for (let c = 0; c < n; c++) {
    let p = c;
    for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;
    [M[c], M[p]] = [M[p], M[c]];
    const d = M[c][c] || 1e-12;
    for (let r = 0; r < n; r++) {
      if (r === c) continue;
      const f = M[r][c] / d;
      for (let k = c; k <= n; k++) M[r][k] -= f * M[c][k];
    }
  }
  return M.map((row, i) => row[n] / (row[i] || 1e-12));
}

function basis(u, v) {
  return terms.map(([i, j]) => u ** i * v ** j);
}

function fitPlate(rgb) {
  // amostra reduzida (média de blocos)
  const bx = SW / GW, by = SH / GH;
  const small = [];
  for (let gy = 0; gy < GH; gy++)
    for (let gx = 0; gx < GW; gx++) {
      let r = 0, g = 0, b = 0, c = 0;
      for (let y = Math.floor(gy * by); y < Math.floor((gy + 1) * by); y += 2)
        for (let x = Math.floor(gx * bx); x < Math.floor((gx + 1) * bx); x += 2) {
          const i = (y * SW + x) * 3;
          r += rgb[i]; g += rgb[i + 1]; b += rgb[i + 2]; c++;
        }
      small.push({ u: (gx + 0.5) / GW, v: (gy + 0.5) / GH, r: r / c, g: g / c, b: b / c });
    }
  const lum = (p) => (p.r + p.g + p.b) / 3;
  const brightest = Math.max(...small.map(lum));
  let mask = small.map((p) => lum(p) > brightest * 0.55 && Math.max(p.r, p.g, p.b) - Math.min(p.r, p.g, p.b) < 18);
  let coef;
  for (let it = 0; it < 6; it++) {
    coef = ["r", "g", "b"].map((ch) => {
      const n = terms.length;
      const A = Array.from({ length: n }, () => new Array(n).fill(0));
      const y = new Array(n).fill(0);
      small.forEach((p, k) => {
        if (!mask[k]) return;
        const f = basis(p.u, p.v);
        for (let a = 0; a < n; a++) {
          y[a] += f[a] * p[ch];
          for (let c = 0; c < n; c++) A[a][c] += f[a] * f[c];
        }
      });
      for (let a = 0; a < n; a++) A[a][a] += 1e-6;
      return solve(A, y);
    });
    const fitL = small.map((p) => {
      const f = basis(p.u, p.v);
      return coef.reduce((s, c) => s + c.reduce((t, w, k) => t + w * f[k], 0), 0) / 3;
    });
    // fundo é o que fica perto do ajuste; sombras (abaixo) e reflexos (acima) saem
    const tol = it < 2 ? 14 : 7;
    mask = small.map((p, k) => Math.abs(lum(p) - fitL[k]) < tol && Math.max(p.r, p.g, p.b) - Math.min(p.r, p.g, p.b) < 18);
  }
  return coef;
}

function plateImage(coef) {
  // avalia o polinômio em grade e interpola (o fundo é suave)
  const plate = new Float32Array(SW * SH * 3);
  const step = 8;
  const cols = SW / step + 1, rows = Math.ceil(SH / step) + 1;
  const grid = new Float32Array(cols * rows * 3);
  for (let gy = 0; gy < rows; gy++)
    for (let gx = 0; gx < cols; gx++) {
      const f = basis((gx * step) / SW, (gy * step) / SH);
      for (let c = 0; c < 3; c++)
        grid[(gy * cols + gx) * 3 + c] = coef[c].reduce((t, w, k) => t + w * f[k], 0);
    }
  for (let y = 0; y < SH; y++) {
    const gy = Math.min(rows - 2, Math.floor(y / step)), fy = y / step - gy;
    for (let x = 0; x < SW; x++) {
      const gx = Math.min(cols - 2, Math.floor(x / step)), fx = x / step - gx;
      for (let c = 0; c < 3; c++) {
        const a = grid[(gy * cols + gx) * 3 + c], b = grid[(gy * cols + gx + 1) * 3 + c];
        const d = grid[((gy + 1) * cols + gx) * 3 + c], e = grid[((gy + 1) * cols + gx + 1) * 3 + c];
        plate[(y * SW + x) * 3 + c] = (a * (1 - fx) + b * fx) * (1 - fy) + (d * (1 - fx) + e * fx) * fy;
      }
    }
  }
  return plate;
}

// ---------- recorte ----------
function keyFrame(rgb) {
  const plate = plateImage(fitPlate(rgb));
  const n = SW * SH;
  const N = new Uint8ClampedArray(n * 3);
  const min = new Uint8Array(n);
  for (let i = 0; i < n; i++) {
    let m = 255;
    for (let c = 0; c < 3; c++) {
      const v = (255 * rgb[i * 3 + c]) / (Math.max(plate[i * 3 + c], 8) * WHITE);
      N[i * 3 + c] = v;
      if (N[i * 3 + c] < m) m = N[i * 3 + c];
    }
    min[i] = m;
  }
  // Cor para alfa sobre branco em todo o quadro: sobre o fundo claro do site o resultado é o
  // mesmo da origem; vidros e o fundo visto através deles ficam translúcidos, sem placas brancas.
  const out = Buffer.alloc(n * 4);
  for (let i = 0; i < n; i++) {
    const x = i % SW, y = (i - x) / SW;
    const edge = Math.min(1, Math.min(x, y, SW - 1 - x, SH - 1 - y) / FEATHER);
    const a = ((255 - min[i]) / 255) * edge;
    if (a <= 0) continue;
    const o = i * 4;
    const a0 = (255 - min[i]) / 255;
    for (let c = 0; c < 3; c++) out[o + c] = Math.round((N[i * 3 + c] - 255 * (1 - a0)) / a0);
    out[o + 3] = Math.round(a * 255);
  }
  return out;
}

// ---------- entrada/saída ----------
const place = [
  `scale=${Math.round(SW * SCALE)}:${Math.round(SH * SCALE)}:flags=lanczos`,
  `pad=${OW}:${OH}:${Math.round(CX - SRC_CX * SCALE)}:${Math.round(CY - SRC_CY * SCALE)}:color=black@0`,
].join(",");

function encoder(outArgs) {
  const ff = spawn(ffmpegPath, [
    "-y", "-loglevel", "error",
    "-f", "rawvideo", "-pix_fmt", "rgba", "-s", `${SW}x${SH}`, "-r", String(FPS), "-i", "-",
    ...outArgs,
  ]);
  ff.stderr.pipe(process.stderr);
  return ff;
}

const over = (bg) => `,format=rgba,split[a][b];color=${bg}:s=${OW}x${OH}:r=${FPS}[bg];[bg][a]overlay=shortest=1,format=yuv420p`;

const outputs = DEBUG || MEASURE
  ? []
  : [
      encoder(["-vf", `${place},format=yuva420p`, "-c:v", "libvpx-vp9", "-pix_fmt", "yuva420p", "-b:v", "0", "-crf", "36", "-row-mt", "1", "-an", "public/assets/hero-gamer.webm"]),
      encoder(["-vf", `${place},scale=720:-2,format=yuva420p`, "-c:v", "libvpx-vp9", "-pix_fmt", "yuva420p", "-b:v", "0", "-crf", "36", "-row-mt", "1", "-an", "public/assets/hero-gamer-720.webm"]),
      // Safari: sobre branco, exibido com mix-blend-mode: multiply
      encoder(["-filter_complex", `[0:v]${place},format=rgba[k];color=white:s=${OW}x${OH}:r=${FPS}[w];[w][k]overlay=shortest=1,format=yuv420p`, "-c:v", "libx264", "-crf", "22", "-preset", "slow", "-movflags", "+faststart", "-an", "public/assets/hero-gamer.mp4"]),
      encoder(["-filter_complex", `[0:v]${place},format=rgba[k];color=white:s=${OW}x${OH}:r=${FPS}[w];[w][k]overlay=shortest=1,scale=720:-2,format=yuv420p`, "-c:v", "libx264", "-crf", "24", "-preset", "slow", "-movflags", "+faststart", "-an", "public/assets/hero-gamer-720.mp4"]),
    ];

const debugFrames = new Set([FIRST, 20, 50, 80, 110, LAST]);
if (DEBUG) mkdirSync(".qa/gamer", { recursive: true });

const ff = spawn(ffmpegPath, ["-loglevel", "error", "-i", input, "-f", "rawvideo", "-pix_fmt", "rgb24", "-"]);
const frameSize = SW * SH * 3;
let pending = Buffer.alloc(0);
let index = 0;
let written = 0;
for await (const chunk of ff.stdout) {
  pending = Buffer.concat([pending, chunk]);
  while (pending.length >= frameSize) {
    const frame = pending.subarray(0, frameSize);
    pending = pending.subarray(frameSize);
    if (MEASURE && index >= FIRST && index <= LAST) {
      const coef = fitPlate(frame);
      let x0 = SW, y0 = SH, x1 = 0, y1 = 0;
      for (let y = 0; y < SH; y += 3)
        for (let x = 0; x < SW; x += 3) {
          const f = basis(x / SW, y / SH);
          let m = 255;
          for (let c = 0; c < 3; c++) {
            const b = coef[c].reduce((t, w, k) => t + w * f[k], 0);
            m = Math.min(m, (255 * frame[(y * SW + x) * 3 + c]) / (Math.max(b, 8) * WHITE));
          }
          if (255 - m > 60) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
        }
      console.log(index, x0, y0, x1, y1);
    } else if (!MEASURE && index >= FIRST && index <= LAST && (!DEBUG || debugFrames.has(index))) {
      const keyed = keyFrame(frame);
      if (DEBUG) writeFileSync(`.qa/gamer/f${index}.rgba`, keyed);
      for (const o of outputs)
        if (!o.stdin.write(keyed)) await new Promise((r) => o.stdin.once("drain", r));
      written++;
    }
    index++;
  }
}
await Promise.all(outputs.map((o) => new Promise((r) => { o.on("close", r); o.stdin.end(); })));
console.log(`${written} quadros processados (${FIRST}–${LAST} de ${index})`);
