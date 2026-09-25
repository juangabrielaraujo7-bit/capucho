// Gera versões do vídeo da hero com fundo transparente, preservando a tela branca do notebook.
// Em cada quadro, o branco ligado às bordas da imagem (fundo externo) vira transparência;
// a tela, cercada pela moldura escura, não é alcançada e continua branca e opaca.
// Tons claros do fundo (sombras) viram preto semitransparente, o mesmo resultado visual
// do antigo mix-blend-mode: multiply.
//
// O Safari não exibe VP9 com transparência de forma confiável; lá o site usa o MP4 com multiply.
//
// Uso: node scripts/hero-alpha.mjs  (gera public/assets/hero-montagem.webm e hero-montagem-720.webm)
import { spawn } from "node:child_process";
import ffmpegPath from "ffmpeg-static";

const input = "public/assets/hero-montagem-agil.mp4";
const [W, H] = [1280, 720];
const FPS = 30;
const EDGE = 200; // min(r,g,b) a partir do qual o pixel é "claro" e pode pertencer ao fundo
const CLEAR = 247; // acima disso o fundo fica totalmente transparente (ruído de compressão)

function decodeFrames() {
  const ff = spawn(ffmpegPath, [
    "-loglevel", "error", "-i", input,
    "-vf", `fps=${FPS},scale=${W}:${H}`,
    "-f", "rawvideo", "-pix_fmt", "rgb24", "-",
  ]);
  return ff.stdout;
}

function keyFrame(rgb) {
  const n = W * H;
  const out = Buffer.alloc(n * 4);
  const min = new Uint8Array(n);
  for (let i = 0; i < n; i++)
    min[i] = Math.min(rgb[i * 3], rgb[i * 3 + 1], rgb[i * 3 + 2]);
  // Preenchimento a partir das bordas pelos pixels claros
  const outside = new Uint8Array(n);
  const stack = new Int32Array(n);
  let top = 0;
  const push = (i) => {
    if (!outside[i] && min[i] >= EDGE) {
      outside[i] = 1;
      stack[top++] = i;
    }
  };
  for (let x = 0; x < W; x++) push(x), push((H - 1) * W + x);
  for (let y = 0; y < H; y++) push(y * W), push(y * W + W - 1);
  while (top) {
    const i = stack[--top];
    const x = i % W;
    if (x > 0) push(i - 1);
    if (x < W - 1) push(i + 1);
    if (i >= W) push(i - W);
    if (i < n - W) push(i + W);
  }
  for (let i = 0; i < n; i++) {
    const o = i * 4;
    if (outside[i]) {
      const a = min[i] >= CLEAR ? 0 : 255 - min[i];
      out[o] = out[o + 1] = out[o + 2] = 0;
      out[o + 3] = a;
    } else {
      out[o] = rgb[i * 3];
      out[o + 1] = rgb[i * 3 + 1];
      out[o + 2] = rgb[i * 3 + 2];
      out[o + 3] = 255;
    }
  }
  return out;
}

function encoder(args) {
  const ff = spawn(ffmpegPath, [
    "-y", "-loglevel", "error",
    "-f", "rawvideo", "-pix_fmt", "rgba", "-s", `${W}x${H}`, "-r", String(FPS), "-i", "-",
    ...args,
  ]);
  ff.stderr.pipe(process.stderr);
  return ff;
}

const outputs = [
  // VP9 com canal alfa: Chrome, Edge, Firefox
  encoder(["-vf", "scale=1280:-2", "-c:v", "libvpx-vp9", "-pix_fmt", "yuva420p", "-b:v", "0", "-crf", "40", "-row-mt", "1", "-an", "public/assets/hero-montagem.webm"]),
  encoder(["-vf", "scale=720:-2", "-c:v", "libvpx-vp9", "-pix_fmt", "yuva420p", "-b:v", "0", "-crf", "38", "-row-mt", "1", "-an", "public/assets/hero-montagem-720.webm"]),
];

const frameSize = W * H * 3;
let pending = Buffer.alloc(0);
let count = 0;
for await (const chunk of decodeFrames()) {
  pending = Buffer.concat([pending, chunk]);
  while (pending.length >= frameSize) {
    const frame = keyFrame(pending.subarray(0, frameSize));
    pending = pending.subarray(frameSize);
    for (const o of outputs)
      if (!o.stdin.write(frame)) await new Promise((r) => o.stdin.once("drain", r));
    count++;
  }
}
await Promise.all(
  outputs.map((o) => new Promise((r) => { o.on("close", r); o.stdin.end(); })),
);
console.log(`${count} quadros processados`);
