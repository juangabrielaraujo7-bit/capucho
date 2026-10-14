// Recorta o fundo cinza-claro do vídeo do Kratos e exporta um WebM VP9 com canal alfa.
// Uso: node scripts/key-kratos.mjs <entrada.mp4> <saida.webm | pasta/%04d.png> [largura] [poster.png]
//
// O fundo é neutro (~232–237). Um pixel conta como fundo pela distância ao cinza somada à
// saturação (a pele clara é quente, não neutra). Só some o fundo ligado às bordas do quadro
// (flood-fill), mais os vãos internos quase idênticos ao fundo (entre os elos da corrente),
// então a pele e os reflexos claros do metal não são apagados. A borda ganha alfa suave e
// o cinza misturado nela é removido (despill).
import { spawn } from "node:child_process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const ffmpeg = require("ffmpeg-static");
const [input, output, outWidth = "1280", poster] = process.argv.slice(2);
const W = 1920;
const H = 1080;
const BG = 233;
const T_LO = 12; // abaixo disso: fundo
const T_HI = 36; // acima disso: personagem; entre os dois: borda semitransparente
const T_HOLE = 14; // vãos internos só somem se forem praticamente o próprio fundo
// Área útil: da borda esquerda (a lâmina passa de x=0 no impacto) até depois do pé direito
const CROP = "1800:1080:0:0";

// Distância ao fundo. Pixels mais claros que o fundo pesam pouco pela saturação: o vídeo tem
// um contorno claro e levemente quente (nitidez exagerada) que deve sumir junto com o fundo.
function metric(r, g, b) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const dark = Math.max(0, BG - min);
  return dark + (max > BG + 2 ? 0.6 : 2.2) * Math.max(0, max - min - 3);
}
// Métrica estrita (a original) para decidir vãos internos sem furar destaques da pele
function strict(r, g, b) {
  const lum = Math.max(Math.abs(r - BG), Math.abs(g - BG), Math.abs(b - BG));
  return lum + 2.2 * (Math.max(r, g, b) - Math.min(r, g, b));
}

function keyFrame(rgb) {
  const n = W * H;
  const d = new Float32Array(n);
  for (let i = 0, j = 0; i < n; i++, j += 3) d[i] = metric(rgb[j], rgb[j + 1], rgb[j + 2]);
  const bg = new Uint8Array(n); // 1 = fundo ligado à borda, 2 = vão interno de fundo
  const seen = new Uint8Array(n);
  const stack = new Int32Array(n);
  const flood = (start, mark, collect) => {
    let top = 0;
    seen[start] = 1;
    stack[top++] = start;
    const list = collect ? [] : null;
    while (top) {
      const i = stack[--top];
      if (mark) bg[i] = mark;
      if (list) list.push(i);
      const x = i % W;
      const nb = [x > 0 ? i - 1 : -1, x < W - 1 ? i + 1 : -1, i >= W ? i - W : -1, i < n - W ? i + W : -1];
      for (const k of nb) if (k >= 0 && !seen[k] && d[k] < T_HI) (seen[k] = 1), (stack[top++] = k);
    }
    return list;
  };
  // Fundo ligado às bordas
  for (let x = 0; x < W; x++) for (const i of [x, (H - 1) * W + x]) if (!seen[i] && d[i] < T_HI) flood(i, 1);
  for (let y = 0; y < H; y++) for (const i of [y * W, y * W + W - 1]) if (!seen[i] && d[i] < T_HI) flood(i, 1);
  // Vãos internos (entre braço, corpo e corrente): áreas fechadas, claras e neutras
  for (let i = 0; i < n; i++) {
    if (seen[i] || d[i] >= T_HI) continue;
    const list = flood(i, 0, true);
    if (list.length < 40) continue;
    let chroma = 0, low = 0, tight = 0;
    for (const k of list) {
      const j = k * 3;
      const r = rgb[j], g = rgb[j + 1], b = rgb[j + 2];
      chroma += Math.max(r, g, b) - Math.min(r, g, b);
      low += Math.min(r, g, b);
      if (strict(r, g, b) < T_HOLE * 2) tight++;
    }
    const m = list.length;
    if (chroma / m < 12 && low / m >= 222 && tight / m > 0.6) for (const k of list) bg[k] = 2;
  }
  // Miolo dos elos da corrente: manchas pequenas, claras e quase neutras, cercadas por metal
  // escuro. Brilhos da pele (cercados por pele quente) e do aço da lâmina (cercados por cinza
  // médio) não passam no teste do entorno.
  const linkLike = (i) => {
    const j = i * 3;
    const r = rgb[j], g = rgb[j + 1], b = rgb[j + 2];
    return Math.min(r, g, b) >= 208 && Math.max(r, g, b) - Math.min(r, g, b) <= 16;
  };
  const visited = new Uint8Array(n);
  for (let s = 0; s < n; s++) {
    if (visited[s] || bg[s] || !linkLike(s)) continue;
    const list = [];
    let top = 0;
    visited[s] = 1;
    stack[top++] = s;
    while (top) {
      const i = stack[--top];
      list.push(i);
      const x = i % W;
      for (const k of [x > 0 ? i - 1 : -1, x < W - 1 ? i + 1 : -1, i - W, i + W])
        if (k >= 0 && k < n && !visited[k] && !bg[k] && linkLike(k)) (visited[k] = 1), (stack[top++] = k);
    }
    if (list.length > 300 || list.length < 10) continue;
    let ring = 0, ringLum = 0, ringChroma = 0;
    for (const k of list) {
      for (const q of [k - 3, k + 3, k - 3 * W, k + 3 * W]) {
        if (q < 0 || q >= n || bg[q] || linkLike(q)) continue;
        const j = q * 3;
        const mx = Math.max(rgb[j], rgb[j + 1], rgb[j + 2]);
        ringLum += mx;
        ringChroma += mx - Math.min(rgb[j], rgb[j + 1], rgb[j + 2]);
        ring++;
      }
    }
    if (ring && ringLum / ring < 85 && ringChroma / ring < 26) for (const k of list) bg[k] = 3;
  }
  // Fundo dos vãos: some quase por inteiro, com a borda ainda suave
  for (let i = 0; i < n; i++) if (bg[i] === 3) d[i] = 0;
  const alpha = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const v = d[i];
    if (bg[i]) alpha[i] = v <= T_LO ? 0 : Math.min(1, (v - T_LO) / (T_HI - T_LO));
    else if (strict(rgb[i * 3], rgb[i * 3 + 1], rgb[i * 3 + 2]) < T_HOLE) alpha[i] = Math.max(0, (v - T_LO) / (T_HOLE - T_LO));
    else alpha[i] = 1;
  }
  // Remove o contorno claro: pixels claros e pouco saturados a até 3 px do fundo.
  // Bordas escuras (corrente, couro, lâmina) não são afetadas.
  let near = new Uint8Array(n);
  for (let i = 0; i < n; i++) near[i] = alpha[i] < 0.5 ? 1 : 0;
  for (let pass = 0; pass < 3; pass++) {
    const next = new Uint8Array(near);
    for (let i = W; i < n - W; i++) {
      if (near[i]) continue;
      if (near[i - 1] || near[i + 1] || near[i - W] || near[i + W]) next[i] = 1;
    }
    near = next;
  }
  for (let i = 0, j = 0; i < n; i++, j += 3) {
    if (!near[i] || alpha[i] === 0) continue;
    const r = rgb[j], g = rgb[j + 1], b = rgb[j + 2];
    const max = Math.max(r, g, b);
    if (max > BG - 4 && max - Math.min(r, g, b) < 40) alpha[i] = 0;
  }
  // Pontinhos claros soltos no fundo (ruído de compressão): componentes pequenas e claras.
  // Pedaços da corrente são escuros e continuam.
  const done = new Uint8Array(n);
  for (let s = 0; s < n; s++) {
    if (done[s] || alpha[s] < 0.3) continue;
    let top = 0;
    const list = [];
    done[s] = 1;
    stack[top++] = s;
    while (top && list.length <= 400) {
      const i = stack[--top];
      list.push(i);
      const x = i % W;
      if (x > 0 && !done[i - 1] && alpha[i - 1] >= 0.3) (done[i - 1] = 1), (stack[top++] = i - 1);
      if (x < W - 1 && !done[i + 1] && alpha[i + 1] >= 0.3) (done[i + 1] = 1), (stack[top++] = i + 1);
      if (i >= W && !done[i - W] && alpha[i - W] >= 0.3) (done[i - W] = 1), (stack[top++] = i - W);
      if (i < n - W && !done[i + W] && alpha[i + W] >= 0.3) (done[i + W] = 1), (stack[top++] = i + W);
    }
    if (top || list.length > 400) {
      // Componente grande: termina de marcar sem apagar
      while (top) {
        const i = stack[--top];
        const x = i % W;
        for (const k of [x > 0 ? i - 1 : -1, x < W - 1 ? i + 1 : -1, i - W, i + W])
          if (k >= 0 && k < n && !done[k] && alpha[k] >= 0.3) (done[k] = 1), (stack[top++] = k);
      }
      continue;
    }
    let low = 0;
    for (const k of list) low += Math.min(rgb[k * 3], rgb[k * 3 + 1], rgb[k * 3 + 2]);
    if (low / list.length > 170) for (const k of list) alpha[k] = 0;
  }
  // Suaviza 3×3 só na borda, para o contorno não serrilhar nem cintilar
  const soft = new Float32Array(alpha);
  for (let y = 1; y < H - 1; y++) {
    for (let x = 1; x < W - 1; x++) {
      const i = y * W + x;
      const a = alpha[i];
      if (a === 0 || a === 1) {
        const s = alpha[i - 1] + alpha[i + 1] + alpha[i - W] + alpha[i + W];
        if ((a === 0 && s === 0) || (a === 1 && s === 4)) continue;
      }
      let sum = 0;
      for (let dy = -W; dy <= W; dy += W) sum += alpha[i + dy - 1] + alpha[i + dy] + alpha[i + dy + 1];
      soft[i] = sum / 9;
    }
  }
  const rgba = Buffer.alloc(n * 4);
  let minX = W, minY = H, maxX = -1, maxY = -1;
  for (let i = 0, j = 0, k = 0; i < n; i++, j += 3, k += 4) {
    const a = soft[i] < 0.12 ? 0 : soft[i];
    let r = rgb[j], g = rgb[j + 1], b = rgb[j + 2];
    if (a > 0 && a < 1) {
      // Despill: tira o cinza do fundo que ficou misturado na borda
      r = (r - (1 - a) * BG) / a;
      g = (g - (1 - a) * BG) / a;
      b = (b - (1 - a) * BG) / a;
    }
    rgba[k] = Math.max(0, Math.min(255, r));
    rgba[k + 1] = Math.max(0, Math.min(255, g));
    rgba[k + 2] = Math.max(0, Math.min(255, b));
    rgba[k + 3] = Math.round(a * 255);
    if (a > 0.5) {
      const x = i % W, y = (i / W) | 0;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
  return { rgba, box: [minX, minY, maxX, maxY] };
}

async function run() {
  const dec = spawn(ffmpeg, ["-loglevel", "error", "-i", input, "-f", "rawvideo", "-pix_fmt", "rgb24", "-"]);
  // Saída "pasta/%04d.png" gera a sequência de quadros (usada por build-kratos-loop.mjs);
  // qualquer outra gera direto um WebM com alfa.
  const codec = output.includes("%")
    ? ["-c:v", "png", "-pix_fmt", "rgba", "-start_number", "0"]
    : ["-c:v", "libvpx-vp9", "-pix_fmt", "yuva420p", "-b:v", "0", "-crf", "34", "-row-mt", "1", "-auto-alt-ref", "0", "-an"];
  const enc = spawn(ffmpeg, [
    "-loglevel", "error", "-y",
    "-f", "rawvideo", "-pix_fmt", "rgba", "-s", `${W}x${H}`, "-r", "24", "-i", "-",
    "-vf", `crop=${CROP},scale=${outWidth}:-2:flags=lanczos`,
    ...codec, output,
  ]);
  enc.stderr.pipe(process.stderr);
  const frameSize = W * H * 3;
  let pending = Buffer.alloc(0);
  let frame = 0;
  let last = null;
  dec.stdout.on("data", (chunk) => {
    pending = Buffer.concat([pending, chunk]);
    while (pending.length >= frameSize) {
      const rgb = pending.subarray(0, frameSize);
      pending = pending.subarray(frameSize);
      const { rgba, box } = keyFrame(rgb);
      last = rgba;
      console.log(`frame ${frame} t=${(frame / 24).toFixed(3)} box=${box.join(",")}`);
      frame++;
      if (!enc.stdin.write(rgba)) dec.stdout.pause(), enc.stdin.once("drain", () => dec.stdout.resume());
    }
  });
  await new Promise((r) => dec.on("close", r));
  enc.stdin.end();
  await new Promise((r) => enc.on("close", r));
  if (poster && last) {
    // Pose final como PNG transparente (redução de movimento e navegadores sem VP9 alfa)
    const p = spawn(ffmpeg, [
      "-loglevel", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgba", "-s", `${W}x${H}`, "-i", "-",
      "-vf", `crop=${CROP},scale=${outWidth}:-2:flags=lanczos`, "-frames:v", "1", poster,
    ]);
    p.stdin.end(last);
    await new Promise((r) => p.on("close", r));
  }
}

run();
