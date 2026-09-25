import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "@phosphor-icons/react";
import { asset } from "../config";

export default function HeroVideo() {
  const ref = useRef(null);
  const [playing, setPlaying] = useState(false);
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
  async function toggle() {
    if (!ref.current) return;
    if (!ref.current.paused) ref.current.pause();
    else {
      try {
        await ref.current.play();
      } catch {
        setFailed(true);
      }
    }
  }
  return (
    <div className="hero-visual">
      {failed ? (
        <img
          src={asset("notebook.webp")}
          alt="Notebook Capucho Informática"
          width="1200"
          height="675"
        />
      ) : (
        <>
          <video
            ref={ref}
            src={asset("hero-montagem-agil.mp4")}
            poster={asset("notebook.webp")}
            autoPlay={!reduceMotion}
            loop
            muted
            playsInline
            preload={reduceMotion ? "none" : "auto"}
            width="1920"
            height="1080"
            aria-label="Animação de montagem do notebook Capucho Informática"
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onError={() => setFailed(true)}
          />
          <button
            className="hero-video-toggle"
            type="button"
            onClick={toggle}
            aria-label={
              playing
                ? "Pausar vídeo de montagem"
                : "Reproduzir vídeo de montagem"
            }
          >
            {playing ? <Pause size={17} /> : <Play size={17} />}
            <span>{playing ? "Pausar vídeo" : "Reproduzir vídeo"}</span>
          </button>
        </>
      )}
    </div>
  );
}
