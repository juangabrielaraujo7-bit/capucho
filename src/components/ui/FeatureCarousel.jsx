import { useEffect, useRef, useState } from "react";
import { CaretLeft, CaretRight, Pause, Play } from "@phosphor-icons/react";
import InstagramReel from "../InstagramReel";

// Feature carousel enviado pelo usuário, adaptado às capas e aos vídeos da Capucho.
export default function FeatureCarousel({ items }) {
  const root = useRef(null);
  const [current, setCurrent] = useState(Math.floor(items.length / 2));
  const [paused, setPaused] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [interacting, setInteracting] = useState(false);
  const [available, setAvailable] = useState(false);
  useEffect(() => {
    let visible = false;
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setAvailable(visible && !document.hidden && !motion.matches);
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; update(); });
    observer.observe(root.current);
    document.addEventListener("visibilitychange", update);
    motion.addEventListener("change", update);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", update); motion.removeEventListener("change", update); };
  }, []);
  useEffect(() => {
    if (!available || paused || playing || interacting) return;
    const timer = setTimeout(() => setCurrent(index => (index + 1) % items.length), 4000);
    return () => clearTimeout(timer);
  }, [available, paused, playing, interacting, current, items.length]);
  const select = index => { setPlaying(false); setCurrent((index + items.length) % items.length); };
  return (
    <div ref={root} className="feature-carousel about-instagram-gallery" role="region" aria-roledescription="carrossel" aria-label="Vídeos da Capucho no Instagram"
      onMouseEnter={() => setInteracting(true)} onMouseLeave={() => setInteracting(false)}
      onFocusCapture={() => setInteracting(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setInteracting(false); }}
      onKeyDown={event => { if (event.target.closest("video")) return; if (event.key === "ArrowLeft" || event.key === "ArrowRight") { event.preventDefault(); select(current + (event.key === "ArrowRight" ? 1 : -1)); } }}>
      <div className="feature-carousel-stage">
        {items.map((item, index) => {
          let position = (index - current + items.length) % items.length;
          if (position > Math.floor(items.length / 2)) position -= items.length;
          const active = position === 0;
          return (
            <div key={item.file} className="feature-carousel-slide" data-active={active ? "true" : "false"} style={{ "--position": position }}>
              <div className="feature-carousel-media" inert={!active} aria-hidden={!active || undefined}>
                <InstagramReel {...item} active={active} onPlaybackChange={setPlaying} />
              </div>
              {!active && <button className="feature-carousel-select" type="button" onClick={() => select(index)} aria-label={`Selecionar vídeo: ${item.title}`} />}
            </div>
          );
        })}
        <button className="feature-carousel-arrow feature-carousel-prev" type="button" onClick={() => select(current - 1)} aria-label="Vídeo anterior"><CaretLeft size={22} /></button>
        <button className="feature-carousel-arrow feature-carousel-next" type="button" onClick={() => select(current + 1)} aria-label="Próximo vídeo"><CaretRight size={22} /></button>
      </div>
      <div className="feature-carousel-controls">
        <div className="feature-carousel-dots" aria-label="Escolher vídeo">
          {items.map((item, index) => <button key={item.file} type="button" aria-label={`Vídeo ${index + 1}: ${item.title}`} aria-current={index === current ? "true" : undefined} onClick={() => select(index)} />)}
        </div>
        <button className="feature-carousel-pause" type="button" onClick={() => setPaused(!paused)} aria-label={paused ? "Retomar carrossel de vídeos" : "Pausar carrossel de vídeos"} aria-pressed={paused}>{paused ? <Play size={16} /> : <Pause size={16} />}</button>
      </div>
    </div>
  );
}
