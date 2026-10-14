import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "@phosphor-icons/react";
import { asset } from "../config";

// Seção "Força sozinha não resolve.": Kratos (vídeo com fundo recortado) lança a lâmina contra
// a borda do card "Placa de vídeo" e o calor se espalha pelos seis cards de bordas queimadas.
//
// Vídeo: public/assets/kratos-corrente.webm, gerado por scripts/key-kratos.mjs +
// scripts/build-kratos-loop.mjs a partir do original de 8 s (24 fps). Trechos do arquivo:
//   A  0 → 8,000 s       arremesso completo (só na primeira vez)
//   B  8,000 → 11,542 s  o fim do arremesso invertido: a lâmina volta pela corrente
//   P  11,542 → 12,042 s pausa curta com a lâmina recolhida
//   C  12,042 → 15,583 s novo arremesso até a pose final
// Depois de C a reprodução volta para o começo de B (mesmo quadro: sem salto).
// Todos os efeitos são calculados a partir do tempo do vídeo, nunca de timers próprios.
export const kratosTiming = {
  graze: 1.99, // primeiro arremesso: a ponta raspa a borda do card (só o card atingido reage)
  strike: [4.933, 12.517], // ponta cruza a borda no arremesso final (em A e em C)
  propagation: 0.5, // tempo para o calor chegar ao último card
  coolStart: 10.375, // em B, Kratos começa a recolher a lâmina
  coolDuration: 0.65,
  loopFrom: 15.583, // fim do arquivo (fim de C)
  loopTo: 8.0, // começo de B
};

// Geometria do quadro do vídeo (1200 × 720 px). A ponta para em x=29 na pose final; no impacto
// ela cruza essa linha em y≈232 e sobe raspando a borda até y≈63, assentando em y≈120.
const frame = { w: 1200, h: 720, tipX: 29, contactY: 232, bodyRight: 1192, feet: 706 };

const HIT = 1; // índice do card "Placa de vídeo"
const SPARKS = [
  [-120, -150],
  [-170, -60],
  [-90, -210],
  [-200, -120],
  [-60, -90],
  [-150, -190],
];

const smooth = (x) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));

// Nível de calor de cada card e intensidade do impacto, em função do tempo do vídeo
export function heatAt(t, cards = 6) {
  const T = kratosTiming;
  const sustainPulse = 0.62 + 0.07 * Math.sin(((t - T.loopTo) / ((T.loopFrom - T.loopTo) / 4)) * 2 * Math.PI);
  const delay = (i) => (Math.abs(i - HIT) / (cards - 1)) * T.propagation;
  const strikeAt = (dt) => {
    const heat = [];
    for (let i = 0; i < cards; i++) {
      // O card atingido acende no instante do contato; os outros em seguida, em cascata
      const ramp = smooth((dt - delay(i)) / (i === HIT ? 0.06 : 0.25));
      heat.push(ramp * (i === HIT ? Math.max(sustainPulse + 0.18, 1 - dt * 0.3) : sustainPulse));
    }
    return { heat, impact: Math.max(0, 1 - dt / 0.6), dt };
  };
  if (t < T.strike[0]) {
    const dt = t - T.graze;
    const hit = dt < 0 ? 0 : Math.max(0, 0.75 * (1 - dt / 0.9));
    const heat = Array.from({ length: cards }, (_, i) => (i === HIT ? hit : 0));
    return { heat, impact: dt >= 0 && dt < 0.45 ? 0.6 * (1 - dt / 0.45) : 0, dt };
  }
  if (t < T.loopTo) return strikeAt(t - T.strike[0]);
  if (t < T.coolStart) return strikeAt(10);
  if (t < T.strike[1]) {
    const k = 1 - smooth((t - T.coolStart) / T.coolDuration);
    const base = strikeAt(10).heat;
    return { heat: base.map((h) => h * k), impact: 0, dt: -1 };
  }
  return strikeAt(t - T.strike[1]);
}

export default function KratosStrike({ cards }) {
  const rootRef = useRef(null);
  const videoRef = useRef(null);
  const layerRef = useRef(null);
  const sparksRef = useRef(null);
  const [paused, setPaused] = useState(false);
  const [mode, setMode] = useState("static"); // static (SSR / movimento reduzido / sem alfa) | video
  const pausedRef = useRef(false);
  const syncRef = useRef(null);

  // Decide entre vídeo e pose estática. WebM VP9 com alfa não funciona no Safari/iOS.
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ua = navigator.userAgent;
    const webkitOnly = /iP(hone|ad|od)/.test(ua) || (/Safari\//.test(ua) && !/Chrome|Chromium|Edg|Firefox/.test(ua));
    setMode(reduce || webkitOnly ? "static" : "video");
  }, []);

  // Posiciona o vídeo para a ponta da lâmina cair na borda direita do card atingido
  useEffect(() => {
    const root = rootRef.current;
    const layer = layerRef.current;
    if (!root || !layer) return;
    const place = () => {
      const contact = window.matchMedia("(min-width: 1180px)").matches;
      root.classList.toggle("is-contact", contact);
      if (!contact) {
        layer.style.cssText = "";
        root.style.minHeight = "";
        return;
      }
      const hit = root.querySelectorAll(".asm-forge-card")[HIT];
      const box = root.getBoundingClientRect();
      const r = hit.getBoundingClientRect();
      const right = r.right - box.left;
      const contactY = r.top - box.top + r.height * 0.66;
      // Kratos pode avançar sobre a margem da página, sem encostar na borda da janela
      const limit = box.width + Math.max(0, Math.min(140, window.innerWidth - box.right - 24));
      const s = Math.min(0.78, Math.max(0.42, (limit - right) / (frame.bodyRight - frame.tipX)));
      const left = right - frame.tipX * s;
      const top = contactY - frame.contactY * s;
      layer.style.cssText = `left:${left}px;top:${top}px;width:${frame.w * s}px`;
      root.style.minHeight = `${Math.ceil(top + frame.feet * s + 56)}px`;
      root.style.setProperty("--contact-x", `${right}px`);
      root.style.setProperty("--contact-y", `${contactY}px`);
    };
    place();
    const ro = new ResizeObserver(place);
    ro.observe(root);
    window.addEventListener("resize", place);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", place);
    };
  }, [mode]);

  // Reprodução sincronizada: carrega perto da tela, toca visível, pausa fora dela
  useEffect(() => {
    if (mode !== "video") return;
    const root = rootRef.current;
    const video = videoRef.current;
    const cardEls = [...root.querySelectorAll(".asm-forge-card")];
    const sparkEls = sparksRef.current ? [...sparksRef.current.children] : [];
    let visible = false;
    let raf = 0;
    let vfc = 0;
    const T = kratosTiming;

    const render = (t) => {
      const { heat, impact, dt } = heatAt(t, cardEls.length);
      cardEls.forEach((el, i) => {
        el.style.setProperty("--heat", heat[i].toFixed(3));
        el.style.setProperty("--impact", i === HIT ? impact.toFixed(3) : "0");
      });
      // Brasas: poucas partículas saindo do ponto de contato logo após o impacto
      const life = 0.7;
      sparkEls.forEach((el, i) => {
        if (dt < 0 || dt > life || !root.classList.contains("is-contact")) {
          el.style.opacity = "0";
          return;
        }
        const [vx, vy] = SPARKS[i];
        const k = dt - i * 0.02;
        if (k < 0) return (el.style.opacity = "0");
        el.style.opacity = String(Math.max(0, 1 - k / life));
        el.style.transform = `translate(${vx * k}px, ${vy * k + 420 * k * k}px)`;
      });
    };
    const tick = (t) => {
      if (t >= T.loopFrom - 0.03) {
        video.currentTime = T.loopTo;
        return;
      }
      render(t);
    };
    const onFrame = (_, meta) => {
      tick(meta.mediaTime);
      vfc = video.requestVideoFrameCallback(onFrame);
    };
    const onRaf = () => {
      tick(video.currentTime);
      raf = requestAnimationFrame(onRaf);
    };
    if ("requestVideoFrameCallback" in HTMLVideoElement.prototype) vfc = video.requestVideoFrameCallback(onFrame);
    else raf = requestAnimationFrame(onRaf);
    const onEnded = () => {
      video.currentTime = T.loopTo;
      if (visible && !pausedRef.current) video.play().catch(() => {});
    };
    video.addEventListener("ended", onEnded);

    const sync = () => {
      if (visible && !document.hidden && !pausedRef.current) video.play().catch(() => {});
      else video.pause();
    };
    const near = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !video.src) {
          video.src = asset("kratos-corrente.webm");
          video.load();
        }
      },
      { rootMargin: "600px 0px" },
    );
    const seen = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        sync();
      },
      { threshold: 0.35 },
    );
    near.observe(root);
    seen.observe(root);
    document.addEventListener("visibilitychange", sync);
    render(0);
    syncRef.current = sync;
    return () => {
      near.disconnect();
      seen.disconnect();
      document.removeEventListener("visibilitychange", sync);
      video.removeEventListener("ended", onEnded);
      if (vfc && video.cancelVideoFrameCallback) video.cancelVideoFrameCallback(vfc);
      cancelAnimationFrame(raf);
      video.pause();
    };
  }, [mode]);

  const togglePause = () => {
    pausedRef.current = !pausedRef.current;
    setPaused(pausedRef.current);
    syncRef.current?.();
  };

  return (
    <div ref={rootRef} className={`asm-forge is-${mode}`}>
      <ul className="asm-forge-cards">
        {cards.map(([title, text], i) => (
          <li key={title} className={i === HIT ? "asm-say asm-forge-card is-hit" : "asm-say asm-forge-card"}>
            <span className="asm-burn" aria-hidden="true" />
            <span className="asm-burn-hot" aria-hidden="true" />
            <span className="asm-rune" aria-hidden="true" />
            <span className="asm-say-who">Kratos</span>
            <h3>{title}</h3>
            <p>“{text}”</p>
          </li>
        ))}
      </ul>
      <div ref={layerRef} className="asm-kratos" aria-hidden="true">
        {mode === "video" ? (
          <video
            ref={videoRef}
            muted
            playsInline
            preload="none"
            poster={asset("kratos-corrente-inicio.webp")}
            width={frame.w}
            height={frame.h}
          />
        ) : (
          <img src={asset("kratos-corrente-pose.webp")} alt="" width={frame.w} height={frame.h} loading="lazy" />
        )}
      </div>
      <div ref={sparksRef} className="asm-sparks" aria-hidden="true">
        {SPARKS.map((_, i) => (
          <span key={i} />
        ))}
      </div>
      {mode === "video" && (
        <button
          type="button"
          className="asm-kratos-toggle"
          onClick={togglePause}
          aria-pressed={paused}
        >
          {paused ? <Play size={16} weight="fill" /> : <Pause size={16} weight="fill" />}
          {paused ? "Retomar animação" : "Pausar animação"}
        </button>
      )}
    </div>
  );
}
