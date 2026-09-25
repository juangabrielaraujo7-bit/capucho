import { useEffect, useRef, useState } from "react";
import { asset } from "../config";

export default function HeroVideo() {
  const ref = useRef(null);
  const [failed, setFailed] = useState(false);
  // Sempre começa com autoplay no HTML gerado; o efeito respeita a redução de movimento no navegador.
  const [reduceMotion, setReduceMotion] = useState(false);
  // WebM com transparência preserva a tela branca do notebook. O Safari (e todo navegador no iOS)
  // não exibe essa transparência de forma confiável: lá usamos o MP4 com fundo branco + multiply.
  const [alpha, setAlpha] = useState(true);
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
      if (preference.matches) ref.current?.pause();
    };
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);
  return (
    <div className="hero-visual">
      {failed ? (
        <img
          src={asset("notebook-alpha.webp")}
          alt="Notebook Capucho Informática"
          width="960"
          height="540"
        />
      ) : (
        <video
          key={alpha ? "alpha" : "blend"}
          ref={ref}
          className={alpha ? undefined : "is-blend"}
          poster={asset("notebook-alpha.webp")}
          autoPlay={!reduceMotion}
          loop
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
      )}
    </div>
  );
}
