import { useEffect, useRef, useState } from "react";
import { asset } from "../config";

export default function HeroVideo() {
  const ref = useRef(null);
  const [failed, setFailed] = useState(false);
  // Sempre começa com autoplay no HTML gerado; o efeito respeita a redução de movimento no navegador.
  const [reduceMotion, setReduceMotion] = useState(false);
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
          src={asset("notebook-720.webp")}
          alt="Notebook Capucho Informática"
          width="1200"
          height="675"
        />
      ) : (
        <video
          ref={ref}
          poster={asset("notebook-720.webp")}
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
            src={asset("hero-montagem-720.mp4")}
            type="video/mp4"
            media="(max-width: 767px)"
          />
          <source
            src={asset("hero-montagem-agil.mp4")}
            type="video/mp4"
            onError={() => setFailed(true)}
          />
        </video>
      )}
    </div>
  );
}
