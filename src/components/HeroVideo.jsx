import { useEffect, useRef, useState } from "react";
import { asset } from "../config";
import { dustSwap } from "../vaporize";

// Hero: o notebook monta, fica um instante montado e dá lugar ao PC gamer (brilho roxo); o gamer monta
// e volta para o notebook (brilho azul). A troca segue o tempo real de cada vídeo: só começa depois
// que o equipamento termina de montar e quando o próximo vídeo já pode tocar. Os dois dividem o mesmo
// espaço (mesmo quadro 1280x720, enquadrados em scripts/gamer-alpha.mjs); o crossfade e o brilho
// são transições de CSS (styles.css, ".hero-visual"). A troca em si é uma nuvem de poeira num canvas
// (src/vaporize.js, adaptado do "vapour-text-effect" do 21st.dev): o notebook se desmancha da
// esquerda para a direita e a mesma poeira forma o gabinete gamer da direita para a esquerda; na
// volta, o caminho é o contrário.
const SETTLED = {
  notebook: 4.4, // o arquivo termina em 4,85 s; a base escura termina de aparecer por volta de 4,4 s
  gamer: 4.47, // painéis fechados (4,8 s na origem, que é cortada no quadro 8)
};
// Tempo montado antes da troca. O gabinete fica mais tempo na tela depois de fechar os painéis.
const HOLD = { notebook: 0.5, gamer: 1.8 };
const DUST_DURATION = 3.6; // troca em poeira, em segundos
// Cada equipamento tem a cor da sua poeira: o notebook no azul da marca, o gabinete no roxo do gamer.
const DUST_COLOR = { notebook: [74, 125, 255], gamer: [150, 82, 255] };
const WAIT_LIMIT = 4000; // se o próximo vídeo não carregar, o atual recomeça (como o loop antigo)

export default function HeroVideo({ onThemeChange }) {
  const root = useRef(null);
  const notebook = useRef(null);
  const gamer = useRef(null);
  const canvasRef = useRef(null);
  // O tema da hero segue o equipamento: muda junto com o início da poeira.
  const themeRef = useRef(onThemeChange);
  themeRef.current = onThemeChange;
  const [failed, setFailed] = useState(false);
  const [gamerFailed, setGamerFailed] = useState(false);
  // Sempre começa com autoplay no HTML gerado; o efeito respeita a redução de movimento no navegador.
  const [reduceMotion, setReduceMotion] = useState(false);
  // WebM com transparência preserva a tela branca do notebook. O Safari (e todo navegador no iOS)
  // não exibe essa transparência de forma confiável: lá usamos o MP4 com fundo branco + multiply.
  const [alpha, setAlpha] = useState(true);
  // O gamer só começa a baixar depois que o notebook já pode tocar inteiro.
  const [gamerSrc, setGamerSrc] = useState(null);
  const [show, setShow] = useState("notebook");
  const [dust, setDust] = useState(null);
  const [glow, setGlow] = useState(null);

  useEffect(() => {
    const ua = navigator.userAgent;
    const webkitOnly =
      /iP(hone|ad|od)/.test(ua) || /^((?!chrome|chromium|android|edg).)*safari/i.test(ua);
    if (webkitOnly) setAlpha(false);
  }, []);
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      setReduceMotion(preference.matches);
      if (preference.matches) notebook.current?.pause();
    };
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);

  // Carrega o gamer depois do notebook.
  useEffect(() => {
    if (reduceMotion || failed) return;
    const nb = notebook.current;
    let idle;
    const start = () => {
      const small = window.matchMedia("(max-width: 767px)").matches;
      const name = `hero-gamer${small ? "-720" : ""}.${alpha ? "webm" : "mp4"}`;
      idle = setTimeout(() => setGamerSrc(asset(name)), 0);
    };
    if (nb.readyState >= 4) start();
    else nb.addEventListener("canplaythrough", start, { once: true });
    return () => {
      clearTimeout(idle);
      nb.removeEventListener("canplaythrough", start);
    };
  }, [reduceMotion, failed, alpha]);

  // Sequência
  useEffect(() => {
    if (reduceMotion || failed) return;
    const videos = { notebook: notebook.current, gamer: gamer.current };
    if (gamerFailed || !gamerSrc) {
      // Sem o gamer (ainda carregando ou com erro), o notebook segue como antes, em loop.
      const nb = videos.notebook;
      const restart = () => {
        nb.currentTime = 0;
        nb.play().catch(() => {});
      };
      nb.addEventListener("ended", restart);
      return () => nb.removeEventListener("ended", restart);
    }

    let current = "notebook";
    // Safari/iOS usa o vídeo sobre branco com multiply, que some sobre fundo escuro: lá o tema não muda.
    const setTheme = (name) => alpha && themeRef.current?.(name);
    setTheme("notebook");
    let pending = null;
    let pendingRevealed = () => false;
    let switching = false;
    let cancelDust = null;
    let onScreen = true;
    let pageVisible = !document.hidden;
    let holdTimer;
    let waitTimer;
    let frameHandle;
    let watched;
    const active = () => onScreen && pageVisible;
    const other = (name) => (name === "notebook" ? "gamer" : "notebook");
    const ready = (v) => v.readyState >= 3 && !v.seeking && v.currentTime < 0.05;

    function watch() {
      const v = (watched = videos[current]);
      if (v.requestVideoFrameCallback) {
        const tick = () => {
          if (v.currentTime >= SETTLED[current] + HOLD[current]) return requestSwitch();
          frameHandle = v.requestVideoFrameCallback(tick);
        };
        frameHandle = v.requestVideoFrameCallback(tick);
      } else {
        v.addEventListener("timeupdate", onTime);
      }
    }
    function unwatch() {
      for (const v of Object.values(videos)) v.removeEventListener("timeupdate", onTime);
      if (frameHandle !== undefined) watched?.cancelVideoFrameCallback?.(frameHandle);
      frameHandle = undefined;
    }
    function onTime() {
      if (videos[current].currentTime >= SETTLED[current] + HOLD[current]) requestSwitch();
    }
    // Quando o arquivo termina antes do tempo de espera, completa o tempo montado no último quadro.
    function onEnded(event) {
      if (event.target !== videos[current] || switching) return;
      const v = videos[current];
      const rest = Math.max(0, SETTLED[current] + HOLD[current] - v.duration) * 1000;
      clearTimeout(holdTimer);
      holdTimer = setTimeout(requestSwitch, rest);
    }

    function play(v) {
      if (active()) v.play().catch(() => {});
    }

    function requestSwitch() {
      if (switching) return;
      unwatch();
      clearTimeout(holdTimer);
      const out = videos[current];
      const next = other(current);
      const inc = videos[next];
      out.pause();
      if (!active()) return; // retoma quando a hero voltar a ficar visível
      if (!ready(inc)) {
        // Mantém o equipamento atual montado enquanto o próximo carrega.
        if (inc.currentTime >= 0.05 && !inc.seeking) inc.currentTime = 0;
        if (inc.preload !== "auto") inc.preload = "auto";
        const retry = () => {
          inc.removeEventListener("canplay", retry);
          inc.removeEventListener("seeked", retry);
          clearTimeout(waitTimer);
          if (ready(inc)) requestSwitch();
        };
        inc.addEventListener("canplay", retry);
        inc.addEventListener("seeked", retry);
        clearTimeout(waitTimer);
        waitTimer = setTimeout(() => {
          inc.removeEventListener("canplay", retry);
          inc.removeEventListener("seeked", retry);
          out.currentTime = 0;
          play(out);
          watch();
        }, WAIT_LIMIT);
        return;
      }
      switching = true;
      let revealed = false;
      pending = next;
      pendingRevealed = () => revealed;
      // O quadro montado vira poeira; no meio da dissolução o próximo equipamento começa a aparecer.
      setGlow(next === "gamer" ? "purple" : "blue");
      setDust(current);
      setTheme(next);
      cancelDust = dustSwap({
        canvas: canvasRef.current,
        from: out,
        to: inc,
        dpr: Math.min(window.devicePixelRatio || 1, 1.5),
        duration: DUST_DURATION,
        direction: next === "gamer" ? "left-to-right" : "right-to-left",
        tintFrom: DUST_COLOR[current],
        tintTo: DUST_COLOR[next],
        dropWhite: !alpha,
        onReveal: () => {
          revealed = true;
          setShow(next);
          play(inc);
        },
        onDone: () => {
          cancelDust = null;
          setDust(null);
          setGlow(null);
          // O que saiu volta ao começo, pausado, pronto para a próxima entrada.
          out.pause();
          out.currentTime = 0;
          current = next;
          pending = null;
          switching = false;
          if (inc.paused) play(inc);
          if (inc.ended) onEnded({ target: inc });
          else watch();
        },
      });
    }

    function resume() {
      if (switching) {
        if (pendingRevealed() && active()) play(videos[pending]);
        return;
      }
      if (!active()) return;
      const v = videos[current];
      if (v.ended || v.currentTime >= SETTLED[current] + HOLD[current]) requestSwitch();
      else {
        play(v);
        unwatch();
        watch();
      }
    }
    function pauseAll() {
      clearTimeout(holdTimer);
      clearTimeout(waitTimer);
      if (!switching) for (const v of Object.values(videos)) v.pause();
    }

    const observer = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      onScreen ? resume() : pauseAll();
    });
    observer.observe(root.current);
    const onVisibility = () => {
      pageVisible = !document.hidden;
      pageVisible ? resume() : pauseAll();
    };
    document.addEventListener("visibilitychange", onVisibility);
    for (const v of Object.values(videos)) v.addEventListener("ended", onEnded);

    videos.gamer.pause();
    if (videos.gamer.currentTime > 0) videos.gamer.currentTime = 0;
    resume();

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      for (const v of Object.values(videos)) v.removeEventListener("ended", onEnded);
      unwatch();
      cancelDust?.();
      themeRef.current?.("notebook");
      clearTimeout(holdTimer);
      clearTimeout(waitTimer);
    };
  }, [reduceMotion, failed, gamerFailed, gamerSrc, alpha]);

  const blend = alpha ? "" : " is-blend";
  return (
    <div className="hero-visual" ref={root} data-show={show}
      data-dust={dust ?? undefined}
      data-glow={glow ?? undefined}>
      {failed ? (
        <img
          src={asset("notebook-alpha.webp")}
          alt="Notebook Capucho Informática"
          width="960"
          height="540"
        />
      ) : (
        <>
          <video
            key={alpha ? "alpha" : "blend"}
            ref={notebook}
            className={`hero-media hero-notebook${blend}${dust === "notebook" ? " is-dust" : ""}`}
            poster={asset("notebook-alpha.webp")}
            autoPlay={!reduceMotion}
            muted
            playsInline
            preload={reduceMotion ? "none" : "auto"}
            width="1920"
            height="1080"
            aria-label="Animação de montagem do notebook Capucho Informática"
          >
            {/* Versão leve para celular; navegadores sem suporte a "media" usam a primeira. */}
            <source
              src={asset(`hero-montagem-720.${alpha ? "webm" : "mp4"}`)}
              type={alpha ? "video/webm" : "video/mp4"}
              media="(max-width: 767px)"
            />
            <source
              src={asset(alpha ? "hero-montagem.webm" : "hero-montagem-agil.mp4")}
              type={alpha ? "video/webm" : "video/mp4"}
              onError={() => setFailed(true)}
            />
          </video>
          {!reduceMotion && !gamerFailed && (
            <video
              key={`gamer-${alpha ? "alpha" : "blend"}`}
              ref={gamer}
              className={`hero-media hero-gamer${blend}${dust === "gamer" ? " is-dust" : ""}`}
              src={gamerSrc ?? undefined}
              muted
              playsInline
              preload={gamerSrc ? "auto" : "none"}
              width="1920"
              height="1080"
              aria-hidden={show !== "gamer"}
              aria-label="Animação de montagem de um PC gamer"
              onError={() => gamerSrc && setGamerFailed(true)}
            />
          )}
          <canvas
            ref={canvasRef}
            className={`hero-dust${blend}`}
            aria-hidden="true"
          />
        </>
      )}
    </div>
  );
}
