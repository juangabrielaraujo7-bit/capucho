import { useEffect, useRef, useState } from "react";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { asset } from "../config";

// Carrossel dos PCs montados pela Capucho, adaptado do "feature-carousel" (21st.dev) sem Tailwind:
// o card do centro fica em destaque e os vizinhos aparecem menores, girados e desfocados.
// Como os itens são vídeos, o do centro toca sem som quando a seção está na tela e, ao terminar,
// passa para o próximo (no lugar do timer de 4 s do original, que cortaria os vídeos).
// Com redução de movimento nada toca sozinho: o vídeo do centro ganha controles.
export default function BuildCarousel({ items }) {
  const [current, setCurrent] = useState(Math.floor(items.length / 2));
  const [visible, setVisible] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const rootRef = useRef(null);
  const videos = useRef([]);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(preference.matches);
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      threshold: 0.35,
    });
    observer.observe(rootRef.current);
    return () => observer.disconnect();
  }, []);

  // Só o vídeo do centro toca, e só com a seção visível.
  useEffect(() => {
    videos.current.forEach((video, i) => {
      if (!video) return;
      if (i === current && visible && !reduceMotion) {
        video.play().catch(() => {});
      } else {
        video.pause();
        if (i !== current) video.currentTime = 0;
      }
    });
  }, [current, visible, reduceMotion]);

  const next = () => setCurrent((i) => (i + 1) % items.length);
  const prev = () => setCurrent((i) => (i - 1 + items.length) % items.length);

  return (
    <div className="build-carousel" ref={rootRef}>
      <div className="build-carousel-stage">
        {items.map((item, index) => {
          const total = items.length;
          let pos = (index - current + total) % total;
          if (pos > Math.floor(total / 2)) pos -= total;
          const isCenter = pos === 0;
          const isAdjacent = Math.abs(pos) === 1;
          return (
            <div
              key={item.file}
              className={`build-card${isCenter ? " is-center" : ""}`}
              style={{
                transform: `translateX(${pos * 45}%) scale(${isCenter ? 1 : isAdjacent ? 0.85 : 0.7}) rotateY(${pos * -10}deg)`,
                zIndex: isCenter ? 10 : isAdjacent ? 5 : 1,
                opacity: isCenter ? 1 : isAdjacent ? 0.4 : 0,
                filter: isCenter ? "none" : "blur(4px)",
                visibility: Math.abs(pos) > 1 ? "hidden" : "visible",
              }}
              onClick={isCenter ? undefined : () => setCurrent(index)}
              aria-hidden={!isCenter || undefined}
            >
              <video
                ref={(el) => (videos.current[index] = el)}
                src={asset(`${item.file}.mp4`)}
                poster={asset(`${item.file}.webp`)}
                muted
                playsInline
                preload={isCenter ? "metadata" : "none"}
                controls={isCenter && reduceMotion}
                aria-label={item.title}
                onEnded={isCenter ? next : undefined}
              />
            </div>
          );
        })}
      </div>
      <button
        type="button"
        className="build-carousel-nav is-prev"
        aria-label="PC anterior"
        onClick={prev}
      >
        <CaretLeft size={20} weight="bold" />
      </button>
      <button
        type="button"
        className="build-carousel-nav is-next"
        aria-label="Próximo PC"
        onClick={next}
      >
        <CaretRight size={20} weight="bold" />
      </button>
      <div className="build-carousel-dots">
        {items.map((item, index) => (
          <button
            key={item.file}
            type="button"
            className={index === current ? "is-active" : ""}
            aria-label={`Ver vídeo ${index + 1} de ${items.length}`}
            aria-current={index === current || undefined}
            onClick={() => setCurrent(index)}
          />
        ))}
      </div>
    </div>
  );
}
