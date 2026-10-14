// Monta o vídeo da seção "Força sozinha não resolve." a partir dos quadros recortados por
// key-kratos.mjs (24 fps, 192 quadros do original de 8 s).
// Uso: node scripts/build-kratos-loop.mjs <pasta-dos-quadros> <saida.webm> <pose-final.webp>
//
// O original termina com a lâmina estendida e não tem recolhimento. O arquivo final tem:
//   A  quadros 0→191   arremesso completo (só na primeira vez)
//   B  quadros 191→107 o mesmo trecho invertido: a lâmina volta até o ponto mais recolhido
//                      (4,458 s no original, onde a velocidade já é quase zero)
//   P  quadro 107 × 12 pequena pausa antes do próximo arremesso
//   C  quadros 107→191 novo arremesso até a pose final
// A página repete B+P+C: o fim de C e o começo de B são o mesmo quadro, então não há salto.
// Os tempos usados pela página estão em src/pages/AssemblyPage.jsx (kratosTiming).
import { spawn } from "node:child_process";
import { copyFile, mkdir, rm } from "node:fs/promises";
import { createRequire } from "node:module";
import { join } from "node:path";

const require = createRequire(import.meta.url);
const ffmpeg = require("ffmpeg-static");
const [framesDir, output, poster] = process.argv.slice(2);
const LAST = 191;
const TURN = 107;
const PAUSE = 12;

const order = [];
for (let f = 0; f <= LAST; f++) order.push(f); // A
for (let f = LAST; f >= TURN; f--) order.push(f); // B
for (let i = 0; i < PAUSE; i++) order.push(TURN); // P
for (let f = TURN; f <= LAST; f++) order.push(f); // C

const seq = join(framesDir, "..", "loop-seq");
await rm(seq, { recursive: true, force: true });
await mkdir(seq, { recursive: true });
const name = (f) => `${String(f).padStart(4, "0")}.png`;
for (let i = 0; i < order.length; i++) await copyFile(join(framesDir, name(order[i])), join(seq, name(i)));

const run = (args) =>
  new Promise((resolve, reject) => {
    const p = spawn(ffmpeg, ["-loglevel", "error", "-y", ...args], { stdio: "inherit" });
    p.on("close", (code) => (code ? reject(new Error(`ffmpeg ${code}`)) : resolve()));
  });

const bStart = LAST + 1;
await run([
  "-framerate", "24", "-start_number", "0", "-i", join(seq, "%04d.png"),
  "-c:v", "libvpx-vp9", "-pix_fmt", "yuva420p", "-b:v", "0", "-crf", "38",
  "-row-mt", "1", "-auto-alt-ref", "0", "-g", "48",
  "-force_key_frames", `expr:eq(n,${bStart})`, "-an", output,
]);
await run(["-i", join(framesDir, name(LAST)), "-c:v", "libwebp", "-quality", "82", poster]);
console.log(`${order.length} quadros (${(order.length / 24).toFixed(3)} s); B começa em ${(bStart / 24).toFixed(3)} s`);
