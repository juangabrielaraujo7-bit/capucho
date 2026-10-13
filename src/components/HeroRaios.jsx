import { useEffect, useRef } from "react";
import { asset } from "../config";

// Raios roxos da hero no tema gamer. As fotos recortadas dos raios passam pelo MESMO movimento do fundo
// "Neuro Noise" da área gamer (GradientBand): o campo de ondulação sin/cos iterado, com os mesmos
// tempos, mais a ondulação sob o cursor. Cada raio nasce, brilha, pisca e some, e logo outro surge em
// outro ponto da hero. Pausa fora da tela e com a aba oculta; com redução de movimento fica um quadro fixo.

const IMAGES = ["raio-1", "raio-2", "raio-3", "raio-4"];
const MAX_SLOTS = 5;

const VERT = `attribute vec2 a_position;
void main() { gl_Position = vec4(a_position, 0.0, 1.0); }`;

const FRAG = `precision highp float;
uniform vec4 u_scene;        // resolution.xy, time, unused
uniform vec4 u_pos[${MAX_SLOTS}];   // centro x,y (px) e tamanho w,h (px)
uniform vec4 u_prm[${MAX_SLOTS}];   // rotação, alfa, índice da textura, semente
uniform vec2 u_flip[${MAX_SLOTS}];  // espelhamento x, y (+1 / -1)
uniform vec4 u_cursor;       // x, y (px), presença, raio (px)
uniform sampler2D u_tex0;
uniform sampler2D u_tex1;
uniform sampler2D u_tex2;
uniform sampler2D u_tex3;

vec4 pick(float idx, vec2 uv) {
  if (idx < 0.5) return texture2D(u_tex0, uv);
  if (idx < 1.5) return texture2D(u_tex1, uv);
  if (idx < 2.5) return texture2D(u_tex2, uv);
  return texture2D(u_tex3, uv);
}

// Mesmo campo de ondulação do shader da área gamer (shade): q desliza com sin/cos de frequências
// crescentes e o tempo de cada camada, realimentado e girado a cada passo.
vec2 warp(vec2 uv, float t, float seed) {
  vec2 q = (uv - 0.5) * 3.2;
  vec2 total = vec2(0.0);
  for (int i = 0; i < 5; i++) {
    float fi = float(i);
    vec2 d = vec2(
      sin(q.y * (1.7 + fi * 0.09) + t * (0.35 + fi * 0.04) + seed),
      cos(q.x * (1.5 + fi * 0.11) - t * (0.28 + fi * 0.03))
    ) * (0.22 + 0.52 * 0.14);
    q += d;
    total += d * (0.55 - fi * 0.07);
    q = q.yx * vec2(-1.08, 1.04);
  }
  return total * 0.055;
}

void main() {
  vec2 res = u_scene.xy;
  float t = u_scene.z;
  vec2 px = gl_FragCoord.xy;
  px.y = res.y - px.y;
  // ondulação sob o cursor (efeito "ripple" do original)
  if (u_cursor.z > 0.001) {
    vec2 delta = px - u_cursor.xy;
    float dist = length(delta);
    float mask = u_cursor.z * (1.0 - smoothstep(0.0, u_cursor.w, dist));
    float ripple = sin(dist / u_cursor.w * 18.0 - t * 12.0);
    px -= (delta / max(dist, 0.0001)) * ripple * mask * min(res.x, res.y) * 0.034;
  }
  vec3 light = vec3(0.0);
  for (int i = 0; i < ${MAX_SLOTS}; i++) {
    float alpha = u_prm[i].y;
    if (alpha < 0.002) continue;
    float c = cos(u_prm[i].x), s = sin(u_prm[i].x);
    vec2 d = px - u_pos[i].xy;
    d = vec2(c * d.x + s * d.y, -s * d.x + c * d.y);
    vec2 uv = d / u_pos[i].zw * u_flip[i] + 0.5;
    // margem para o brilho (halo) não ser cortado na borda do quadro
    if (uv.x < -0.12 || uv.x > 1.12 || uv.y < -0.12 || uv.y > 1.12) continue;
    vec2 w = warp(uv, t, u_prm[i].w);
    vec2 suv = uv + w;
    float idx = u_prm[i].z;
    vec4 core = vec4(0.0);
    if (suv.x >= 0.0 && suv.x <= 1.0 && suv.y >= 0.0 && suv.y <= 1.0) core = pick(idx, suv);
    // halo: média de amostras em volta (brilho roxo do raio)
    float halo = 0.0;
    float r = 0.03;
    for (int k = 0; k < 8; k++) {
      float a = float(k) * 0.7854;
      vec2 o = vec2(cos(a), sin(a)) * r * (k < 4 ? 1.0 : 2.1);
      vec2 hu = suv + o;
      if (hu.x >= 0.0 && hu.x <= 1.0 && hu.y >= 0.0 && hu.y <= 1.0) halo += pick(idx, hu).a;
    }
    halo /= 8.0;
    vec3 glow = vec3(0.66, 0.32, 1.0) * halo * 1.5;
    // miolo mais claro que o corpo do raio
    vec3 body = core.rgb * (1.0 + core.a * 0.25);
    light += (body + glow) * alpha;
  }
  gl_FragColor = vec4(clamp(light, 0.0, 1.0), 1.0);
}`;

const rand = (a, b) => a + Math.random() * (b - a);

export default function HeroRaios({ active }) {
  const canvasRef = useRef(null);
  const activeRef = useRef(active);
  const syncRef = useRef(null);

  useEffect(() => {
    activeRef.current = active;
    syncRef.current?.();
  }, [active]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    if (!canvas || !host) return;
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false, premultipliedAlpha: false });
    if (!gl) return;

    const compile = (type, src) => {
      const sh = gl.createShader(type);
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      return sh;
    };
    const program = gl.createProgram();
    gl.attachShader(program, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const pos = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const loc = (n) => gl.getUniformLocation(program, n);
    const uScene = loc("u_scene");
    const uPos = loc("u_pos");
    const uPrm = loc("u_prm");
    const uFlip = loc("u_flip");
    const uCursor = loc("u_cursor");

    // texturas (carregam depois do primeiro uso); proporção de cada imagem para dimensionar o raio
    const textures = [];
    const aspects = IMAGES.map(() => 1);
    let loaded = 0;
    IMAGES.forEach((name, i) => {
      const tex = gl.createTexture();
      textures.push(tex);
      gl.activeTexture(gl.TEXTURE0 + i);
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 0]));
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.uniform1i(loc(`u_tex${i}`), i);
      const img = new Image();
      img.decoding = "async";
      img.onload = () => {
        gl.activeTexture(gl.TEXTURE0 + i);
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        aspects[i] = img.naturalWidth / img.naturalHeight;
        loaded++;
        draw(performance.now());
      };
      img.src = asset(`raios/${name}.webp`);
    });

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0;
    let inView = false;
    let size = { w: 1, h: 1 };
    const start = performance.now();
    let clock = 0; // segundos de animação (só avança enquanto roda)
    let last = null;
    const pointer = { x: 0, y: 0, presence: 0, target: 0 };

    // Cada "slot" é um raio vivo: nasce, brilha, pisca e some; ao sumir, outro nasce em outro ponto.
    const slots = Array.from({ length: MAX_SLOTS }, () => ({ born: 0, life: 0, gap: 0, tex: 0, x: 0, y: 0, w: 1, h: 1, rot: 0, fx: 1, fy: 1, peak: 0, seed: 0, flash: 0, nextFlash: 0 }));
    const count = () => (size.w < 768 ? 2 : MAX_SLOTS);

    const spawn = (s, i, now, initial) => {
      const n = count();
      let best = null;
      for (let tries = 0; tries < 10; tries++) {
        const h = rand(0.5, 0.9) * size.h * (size.w < 768 ? 0.8 : 1);
        const tex = Math.floor(Math.random() * IMAGES.length);
        const w = h * aspects[tex];
        const cand = { tex, h, w, x: rand(0.04, 0.96) * size.w, y: rand(0.18, 0.86) * size.h };
        // longe dos outros raios vivos
        let far = 1e9;
        for (let j = 0; j < n; j++) {
          if (j === i || slots[j].life === 0) continue;
          far = Math.min(far, Math.hypot(slots[j].x - cand.x, slots[j].y - cand.y));
        }
        cand.far = far;
        if (!best || cand.far > best.far) best = cand;
      }
      Object.assign(s, {
        tex: best.tex,
        w: best.w,
        h: best.h,
        x: best.x,
        y: best.y,
        rot: rand(-0.55, 0.55),
        fx: Math.random() < 0.5 ? 1 : -1,
        fy: Math.random() < 0.5 ? 1 : -1,
        // sobre o texto (lado esquerdo) a luz é mais fraca para não atrapalhar a leitura
        peak: rand(0.5, 0.85) * (best.x < size.w * 0.45 ? 0.5 : 1),
        seed: rand(0, 40),
        life: rand(5.5, 9.5),
        born: initial ? now - rand(0, 4) : now,
        nextFlash: now + rand(1.2, 3),
        flash: 0,
      });
    };

    const envelope = (s, now) => {
      const age = now - s.born;
      if (age < 0 || age > s.life) return 0;
      const fadeIn = Math.min(1, age / 1.5);
      const fadeOut = Math.min(1, (s.life - age) / 1.9);
      const smooth = (x) => x * x * (3 - 2 * x);
      let a = smooth(fadeIn) * smooth(fadeOut);
      // brilho respira devagar e dá um clarão curto de vez em quando
      a *= 0.78 + 0.22 * Math.sin(now * 1.7 + s.seed);
      if (now > s.nextFlash) {
        s.flash = now;
        s.nextFlash = now + rand(1.6, 4.2);
      }
      const f = now - s.flash;
      if (f >= 0 && f < 0.42) a *= 1 + 0.55 * Math.max(0, Math.sin((f / 0.42) * Math.PI * 3)) * (1 - f / 0.42);
      return a * s.peak;
    };

    let primed = false;
    const prime = () => {
      if (primed) return;
      primed = true;
      const n = count();
      for (let i = 0; i < MAX_SLOTS; i++) {
        spawn(slots[i], i, clock, true);
        // escalona: uns já em cena, outros chegam depois
        slots[i].born = clock - rand(0, 3.5) + i * 1.1;
        if (i >= n) slots[i].life = 0;
      }
    };

    const pbuf = new Float32Array(MAX_SLOTS * 4);
    const qbuf = new Float32Array(MAX_SLOTS * 4);
    const fbuf = new Float32Array(MAX_SLOTS * 2);
    const draw = (now) => {
      if (loaded === 0) return;
      prime();
      const n = count();
      for (let i = 0; i < MAX_SLOTS; i++) {
        const s = slots[i];
        let a = 0;
        if (i < n) {
          if (s.life > 0 && clock - s.born > s.life + s.gap) spawn(s, i, clock + rand(0.1, 1.1), false);
          a = reduce.matches ? (clock - s.born > 0 ? s.peak * 0.85 : 0) : envelope(s, clock);
          if (reduce.matches) a = s.life > 0 ? s.peak * 0.85 : 0;
        }
        pbuf.set([s.x, s.y, s.w, s.h], i * 4);
        qbuf.set([s.rot, a, s.tex, s.seed], i * 4);
        fbuf.set([s.fx, s.fy], i * 2);
      }
      const seconds = reduce.matches ? 10 : clock + 10;
      gl.uniform4f(uScene, canvas.width, canvas.height, seconds * 0.4, 0);
      gl.uniform4fv(uPos, pbuf);
      gl.uniform4fv(uPrm, qbuf);
      gl.uniform2fv(uFlip, fbuf);
      const k = canvas.width / size.w;
      gl.uniform4f(uCursor, pointer.x * k, pointer.y * k, reduce.matches ? 0 : pointer.presence, 0.46 * Math.min(canvas.width, canvas.height));
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    const loop = (now) => {
      const dt = last === null ? 0 : Math.min((now - last) / 1000, 0.1);
      last = now;
      clock += dt;
      const follow = 1 - Math.exp(-12 * dt);
      pointer.presence += (pointer.target - pointer.presence) * follow;
      draw(now);
      raf = requestAnimationFrame(loop);
    };
    const sync = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      last = null;
      const run = inView && !document.hidden && activeRef.current && !reduce.matches;
      if (run) raf = requestAnimationFrame(loop);
      else if (activeRef.current) draw(performance.now());
    };
    syncRef.current = sync;

    const resize = () => {
      const r = host.getBoundingClientRect();
      size = { w: Math.max(1, r.width), h: Math.max(1, r.height) };
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const k = Math.min(1, Math.sqrt(1_600_000 / Math.max(1, size.w * size.h * dpr * dpr)));
      canvas.width = Math.max(1, Math.round(size.w * dpr * k));
      canvas.height = Math.max(1, Math.round(size.h * dpr * k));
      gl.viewport(0, 0, canvas.width, canvas.height);
      primed = false;
      draw(performance.now());
    };
    const ro = new ResizeObserver(resize);
    ro.observe(host);
    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      sync();
    });
    io.observe(host);

    const area = host.closest(".hero-backdrop") ?? host;
    const onMove = (e) => {
      const r = host.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
      pointer.target = 1;
    };
    const onLeave = () => {
      pointer.target = 0;
    };
    area.addEventListener("pointermove", onMove, { passive: true });
    area.addEventListener("pointerleave", onLeave);
    reduce.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);

    return () => {
      cancelAnimationFrame(raf);
      syncRef.current = null;
      ro.disconnect();
      io.disconnect();
      area.removeEventListener("pointermove", onMove);
      area.removeEventListener("pointerleave", onLeave);
      reduce.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
      textures.forEach((t) => gl.deleteTexture(t));
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    };
  }, []);

  return <canvas ref={canvasRef} className="hero-raios-canvas" aria-hidden="true" />;
}
