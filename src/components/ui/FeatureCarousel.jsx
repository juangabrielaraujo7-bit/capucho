import { useEffect, useRef, useState } from "react";
import { CaretLeft, CaretRight, Pause, Play } from "@phosphor-icons/react";
import InstagramReel from "../InstagramReel";
import { asset } from "../../config";

// Feature carousel enviado pelo usuário, adaptado às capas e aos vídeos da Capucho.
export default function FeatureCarousel({ items, label = "Vídeos da Capucho no Instagram", arrows = true, compact = false, gestures = false, initialIndex = Math.floor(items.length / 2) }) {
  const root = useRef(null);
  const gestureStart = useRef(null);
  const suppressClickUntil = useRef(0);
  const [current, setCurrent] = useState(initialIndex);
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
  useEffect(() => {
    if (!gestures) return;
    let lastWheel = 0;
    const element = root.current;
    const onWheel = event => {
      const delta = event.shiftKey ? event.deltaY : event.deltaX;
      if (Math.abs(delta) < 8 || (!event.shiftKey && Math.abs(delta) <= Math.abs(event.deltaY))) return;
      event.preventDefault();
      if (Date.now() - lastWheel < 500) return;
      lastWheel = Date.now();
      setPlaying(false);
      setCurrent(index => (index + (delta > 0 ? 1 : -1) + items.length) % items.length);
    };
    element.addEventListener("wheel", onWheel, { passive: false });
    return () => element.removeEventListener("wheel", onWheel);
  }, [gestures, items.length]);
  const select = index => { setPlaying(false); setCurrent((index + items.length) % items.length); };
  return (
    <div ref={root} className={`feature-carousel about-instagram-gallery${compact ? " feature-carousel-compact" : ""}`} role="region" aria-roledescription="carrossel" aria-label={label}
      onMouseEnter={() => setInteracting(true)} onMouseLeave={() => setInteracting(false)}
      onFocusCapture={() => setInteracting(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setInteracting(false); }}
      onPointerDown={event => { if (gestures && !event.target.closest("video")) gestureStart.current = { x: event.clientX, y: event.clientY }; }}
      onPointerCancel={() => { gestureStart.current = null; }}
      onPointerUp={event => {
        const start = gestureStart.current;
        gestureStart.current = null;
        if (!start) return;
        const dx = event.clientX - start.x;
        const dy = event.clientY - start.y;
        if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.3) {
          suppressClickUntil.current = Date.now() + 400;
          select(current + (dx < 0 ? 1 : -1));
        }
      }}
      onClickCapture={event => { if (Date.now() < suppressClickUntil.current) { event.preventDefault(); event.stopPropagation(); } }}
      onKeyDown={event => { if (event.target.closest("video")) return; if (event.key === "ArrowLeft" || event.key === "ArrowRight") { event.preventDefault(); select(current + (event.key === "ArrowRight" ? 1 : -1)); } }}>
      <div className="feature-carousel-stage">
        {items.map((item, index) => {
          let position = (index - current + items.length) % items.length;
          if (position > Math.floor(items.length / 2)) position -= items.length;
          if (items.length === 2) position = index - current;
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
        {items.length === 2 && items.map((item, index) => index !== current && (
          <button key={`preview-${item.file}`} className="feature-carousel-slide feature-carousel-preview" data-active="false" style={{ "--position": current - index }} type="button" onClick={() => select(index)} aria-label={`Selecionar vídeo: ${item.title}`}>
            <span className="instagram-reel"><img src={asset(`${item.file}.webp`)} alt="" width="360" height="640" loading="lazy" draggable="false" /><span className="instagram-reel-play"><Play size={26} weight="fill" aria-hidden="true" /></span></span>
          </button>
        ))}
        {arrows && <>
          <button className="feature-carousel-arrow feature-carousel-prev" type="button" onClick={() => select(current - 1)} aria-label="Vídeo anterior"><CaretLeft size={22} /></button>
          <button className="feature-carousel-arrow feature-carousel-next" type="button" onClick={() => select(current + 1)} aria-label="Próximo vídeo"><CaretRight size={22} /></button>
        </>}
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
