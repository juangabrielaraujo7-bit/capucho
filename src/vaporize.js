// Troca em poeira, adaptada do "vapour-text-effect" (21st.dev) para a stack do site (sem Tailwind
// nem TypeScript) e aplicada a quadros de vídeo no lugar de um texto.
//
// A mesma nuvem faz as duas coisas: o equipamento que sai vira poeira numa direção e, enquanto ela
// ainda está no ar, a poeira se junta na direção contrária e forma o equipamento que entra. Cada
// partícula é solta (ou chamada de volta) por uma onda que atravessa a imagem, com folga aleatória
// para a frente da onda não ficar reta.

const TARGET_CELLS = 120000; // células amostradas; define o tamanho do grão da poeira
const DENSITY = 0.93; // partículas com movimento completo; o resto só apaga rápido
const OUT_WAVE = 0.42; // fração da duração em que a onda desmancha o equipamento
const IN_START = 0.3; // quando a poeira começa a se juntar de novo
const IN_WAVE = 0.44; // fração da duração em que a onda forma o próximo
const CONVERGE = 0.24; // tempo de cada partícula para chegar ao lugar, em fração da duração
const IN_END = IN_START + IN_WAVE + CONVERGE; // a última partícula chega aqui (precisa ser < 1)
const SCATTER = 170; // de quão longe a partícula vem, em pixels
const RAMP = 0.18; // folga aleatória na frente da onda, em fração da largura
const TINT_IN = 0.1; // tempo até a partícula solta assumir a cor da poeira, em fração da duração

const smooth = (t) => t * t * (3 - 2 * t);
const easeOut = (t) => 1 - (1 - t) ** 3;
const clamp01 = (t) => (t < 0 ? 0 : t > 1 ? 1 : t);

export function dustSwap({
  canvas,
  from,
  to,
  dpr = 1,
  duration = 2.5,
  direction = "left-to-right", // caminho da onda que desmancha; a que forma vai ao contrário
  tintFrom = [32, 69, 237], // cor da poeira de cada equipamento
  tintTo = [150, 82, 255],
  dropWhite = false, // Safari: o vídeo vem sobre branco, que aqui não vira poeira
  onReveal,
  onDone,
}) {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const finish = () => {
    onReveal?.();
    onDone?.();
  };
  if (!width || !height || !from?.videoWidth) {
    finish();
    return () => {};
  }

  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  const cw = Math.round(width * dpr);
  const ch = Math.round(height * dpr);
  canvas.width = cw;
  canvas.height = ch;

  const sample = (video) => {
    if (!video?.videoWidth) return null;
    ctx.clearRect(0, 0, cw, ch);
    // Mesmo enquadramento do vídeo na página (object-fit: contain).
    const fit = Math.min(cw / video.videoWidth, ch / video.videoHeight);
    const dw = video.videoWidth * fit;
    const dh = video.videoHeight * fit;
    try {
      ctx.drawImage(video, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
    } catch {
      return null;
    }
    const src = ctx.getImageData(0, 0, cw, ch).data;
    ctx.clearRect(0, 0, cw, ch);
    const step = Math.max(1, Math.round(Math.sqrt((cw * ch) / TARGET_CELLS)));
    const visible = (i) =>
      src[i + 3] >= 12 && (!dropWhite || Math.min(src[i], src[i + 1], src[i + 2]) < 243);

    let count = 0;
    for (let y = 0; y < ch; y += step)
      for (let x = 0; x < cw; x += step) if (visible((y * cw + x) * 4)) count++;
    if (!count) return null;

    const p = {
      count,
      step,
      x: new Float32Array(count),
      y: new Float32Array(count),
      baseX: new Float32Array(count),
      baseY: new Float32Array(count),
      wave: new Float32Array(count), // posição que a onda precisa alcançar
      vx: new Float32Array(count),
      vy: new Float32Array(count),
      alpha: new Float32Array(count),
      a0: new Float32Array(count),
      rgb: new Uint32Array(count), // 0x00bbggrr, pronto para o buffer de pixels
      tint: new Uint32Array(count), // a mesma partícula na cor da poeira
      r: new Uint8Array(count),
      g: new Uint8Array(count),
      b: new Uint8Array(count),
      tr: new Uint8Array(count),
      tg: new Uint8Array(count),
      tb: new Uint8Array(count),
      state: new Uint8Array(count),
      min: cw,
      max: 0,
    };
    let k = 0;
    for (let y = 0; y < ch; y += step)
      for (let x = 0; x < cw; x += step) {
        const i = (y * cw + x) * 4;
        if (!visible(i)) continue;
        p.x[k] = x;
        p.y[k] = y;
        p.baseX[k] = x;
        p.baseY[k] = y;
        p.a0[k] = src[i + 3] / 255;
        p.r[k] = src[i];
        p.g[k] = src[i + 1];
        p.b[k] = src[i + 2];
        p.rgb[k] = src[i] | (src[i + 1] << 8) | (src[i + 2] << 16);
        if (x < p.min) p.min = x;
        if (x > p.max) p.max = x;
        k++;
      }
    return p;
  };

  // A poeira ganha a cor do seu equipamento, mantendo claro o que era claro.
  const paintTint = (p, [tr, tg, tb]) => {
    if (!p) return;
    for (let i = 0; i < p.count; i++) {
      const luma = (0.299 * p.r[i] + 0.587 * p.g[i] + 0.114 * p.b[i]) / 255;
      const k = 0.52 + 0.48 * luma;
      p.tr[i] = tr * k;
      p.tg[i] = tg * k;
      p.tb[i] = tb * k;
      p.tint[i] = p.tr[i] | (p.tg[i] << 8) | (p.tb[i] << 16);
    }
  };

  const out = sample(from);
  const into = sample(to);
  paintTint(out, tintFrom);
  paintTint(into, tintTo);
  if (!out) {
    finish();
    return () => {};
  }

  // Onda: "wave" é o quanto a onda precisa andar para alcançar a partícula, de 0 a 1.
  const prepare = (p, leftToRight) => {
    const span = Math.max(1, p.max - p.min);
    const ramp = span * RAMP;
    for (let i = 0; i < p.count; i++) {
      const reach = leftToRight ? p.baseX[i] - p.min : p.max - p.baseX[i];
      p.wave[i] = (reach + Math.random() * ramp) / (span + ramp);
    }
  };
  const outLeftToRight = direction === "left-to-right";
  prepare(out, outLeftToRight);
  if (into) {
    prepare(into, !outLeftToRight);
    // Na poeira que entra, "wave" vira o instante em que a partícula começa a voltar ao lugar.
    for (let i = 0; i < into.count; i++) into.wave[i] = IN_START + IN_WAVE * into.wave[i];
  }

  // A poeira que entra vem de longe, na direção contrária à da onda que a traz.
  const scatter = SCATTER * dpr;
  if (into)
    for (let i = 0; i < into.count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const far = (0.45 + Math.random() * 0.55) * scatter;
      into.vx[i] = Math.cos(angle) * far + (outLeftToRight ? far * 0.8 : -far * 0.8);
      into.vy[i] = Math.sin(angle) * far * 0.6;
      into.alpha[i] = 0;
    }

  const buffer = ctx.createImageData(cw, ch);
  const pixels = new Uint32Array(buffer.data.buffer);
  const spread = 52 * dpr; // velocidade inicial da partícula que sai, em pixels por segundo
  const jitter = 300 * dpr; // tremor que dá o ar de poeira
  const push = (outLeftToRight ? 1 : -1) * 38 * dpr; // empurrão no sentido da onda
  const lift = 13 * dpr; // leve subida
  // A poeira demora a apagar: no meio da troca os dois equipamentos estão na mesma nuvem.
  const fade = 1 / (duration * 0.38);

  // O avanço segue o relógio, não a soma dos quadros: num aparelho mais lento a troca perde quadros
  // em vez de demorar mais. O "dt" da física continua limitado, para um engasgo não jogar a poeira longe.
  let revealed = false;
  const started = performance.now();
  let last = started;
  let raf = 0;

  // "mix" vai de 0 (cor real do equipamento) a 1 (cor da poeira).
  function paint(p, i, mix) {
    const x = p.x[i] | 0;
    const y = p.y[i] | 0;
    if (x < 0 || y < 0 || x >= cw || y >= ch) return;
    const a = Math.min(255, p.alpha[i] * 255) << 24;
    let color;
    if (mix <= 0) color = p.rgb[i] | a;
    else if (mix >= 1) color = p.tint[i] | a;
    else {
      const keep = 1 - mix;
      color =
        ((p.r[i] * keep + p.tr[i] * mix) | 0) |
        (((p.g[i] * keep + p.tg[i] * mix) | 0) << 8) |
        (((p.b[i] * keep + p.tb[i] * mix) | 0) << 16) |
        a;
    }
    const wide = Math.min(p.step, cw - x);
    const tall = Math.min(p.step, ch - y);
    for (let b = 0; b < tall; b++) {
      const row = (y + b) * cw + x;
      for (let a = 0; a < wide; a++) pixels[row + a] = color;
    }
  }

  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    const progress = (now - started) / 1000 / duration;
    const damp = Math.exp(-1.2 * dt);
    pixels.fill(0);

    // Sai: a onda solta cada partícula, que se espalha e apaga.
    const outFront = smooth(clamp01(progress / OUT_WAVE));
    for (let i = 0; i < out.count; i++) {
      if (out.alpha[i] <= 0 && out.state[i]) continue;
      if (!out.state[i]) {
        if (out.wave[i] > outFront) {
          out.alpha[i] = out.a0[i];
          paint(out, i, 0);
          continue;
        }
        const angle = Math.random() * Math.PI * 2;
        const speed = (0.5 + Math.random()) * spread;
        out.vx[i] = Math.cos(angle) * speed;
        out.vy[i] = Math.sin(angle) * speed;
        out.alpha[i] = out.a0[i];
        out.wave[i] = progress; // a partir daqui, "wave" guarda quando a partícula soltou
        out.state[i] = Math.random() > DENSITY ? 2 : 1;
      }
      if (out.state[i] === 2) {
        out.alpha[i] -= dt * fade * 2.5;
      } else {
        out.vx[i] = (out.vx[i] + (Math.random() - 0.5) * jitter * dt + push * dt) * damp;
        out.vy[i] = (out.vy[i] + (Math.random() - 0.5) * jitter * dt - lift * dt) * damp;
        out.x[i] += out.vx[i] * dt;
        out.y[i] += out.vy[i] * dt;
        out.alpha[i] -= dt * fade;
      }
      if (out.alpha[i] > 0) paint(out, i, clamp01((progress - out.wave[i]) / TINT_IN));
    }

    // Entra: a onda contrária chama a poeira de volta, que se junta e forma o próximo equipamento.
    if (into) {
      for (let i = 0; i < into.count; i++) {
        if (progress < into.wave[i]) continue;
        const t = easeOut(clamp01((progress - into.wave[i]) / CONVERGE));
        const wobble = (1 - t) * (1 - t);
        into.x[i] =
          into.baseX[i] + into.vx[i] * (1 - t) + (Math.random() - 0.5) * jitter * 0.02 * wobble;
        into.y[i] =
          into.baseY[i] + into.vy[i] * (1 - t) + (Math.random() - 0.5) * jitter * 0.02 * wobble;
        into.alpha[i] = into.a0[i] * Math.min(1, t * 1.25);
        paint(into, i, 1 - t);
      }
    }

    ctx.putImageData(buffer, 0, 0);

    // Troca para o vídeo de verdade quando a poeira já formou o equipamento.
    if (!revealed && (!into || progress >= IN_END)) {
      revealed = true;
      onReveal?.();
    }
    if (progress >= 1) {
      ctx.clearRect(0, 0, cw, ch);
      if (!revealed) onReveal?.();
      onDone?.();
      return;
    }
    raf = requestAnimationFrame(frame);
  }

  raf = requestAnimationFrame(frame);
  return () => {
    cancelAnimationFrame(raf);
    ctx.clearRect(0, 0, cw, ch);
  };
}
