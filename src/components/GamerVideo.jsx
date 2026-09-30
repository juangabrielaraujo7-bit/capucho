import { useEffect, useRef, useState } from "react";
import { asset } from "../config";

// Setup gamer "ligando" na faixa gamer. O fundo preto do vídeo some com mix-blend-mode: screen,
// então o setup aparece direto sobre o shader roxo. Toca uma vez quando a faixa entra na tela
// e fica parado no último quadro (tudo aceso). Com redução de movimento, mostra só esse quadro.
// Atrás dele, uma sombra com o contorno do setup (gamer-setup-sombra.webp) deixa os monitores sólidos.
export default function GamerVideo() {
  const ref = useRef(null);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(preference.matches);
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const video = ref.current;
    if (!video || reduceMotion) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        video.play().catch(() => {});
      },
      { threshold: 0.25 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [reduceMotion]);

  return (
    <div className="gamer-media" aria-hidden="true">
      <div className="gamer-media-frame">
        {reduceMotion ? (
          <img src={asset("gamer-setup.webp")} alt="" width="900" height="540" />
        ) : (
          <video
            ref={ref}
            src={asset("gamer-setup.mp4")}
            poster={asset("gamer-setup-inicio.webp")}
            muted
            playsInline
            preload="metadata"
            width="900"
            height="540"
          />
        )}
      </div>
    </div>
  );
}
