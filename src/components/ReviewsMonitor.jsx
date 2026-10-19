import { useEffect, useRef, useState } from "react";
import { CaretLeft, CaretRight, Pause, Play } from "@phosphor-icons/react";
import { asset } from "../config";
import Stars from "./Stars";

export default function ReviewsMonitor({ reviews }) {
  const root = useRef(null);
  const [index, setIndex] = useState(0);
  const [resetting, setResetting] = useState(false);
  const [paused, setPaused] = useState(false);
  const [interacting, setInteracting] = useState(false);
  const [visible, setVisible] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [pageOpen, setPageOpen] = useState(true);
  const active = index % reviews.length;

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.25 });
    observer.observe(root.current);
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setReduceMotion(motion.matches);
    const updateVisibility = () => setPageOpen(!document.hidden);
    updateMotion();
    updateVisibility();
    motion.addEventListener("change", updateMotion);
    document.addEventListener("visibilitychange", updateVisibility);
    return () => {
      observer.disconnect();
      motion.removeEventListener("change", updateMotion);
      document.removeEventListener("visibilitychange", updateVisibility);
    };
  }, []);

  useEffect(() => {
    if (paused || interacting || !visible || !pageOpen || reduceMotion || resetting || reviews.length < 2) return;
    const timer = setTimeout(() => setIndex(i => i + 1), 2000);
    return () => clearTimeout(timer);
  }, [index, paused, interacting, visible, pageOpen, reduceMotion, resetting, reviews.length]);

  useEffect(() => {
    if (!resetting) return;
    let second;
    const first = requestAnimationFrame(() => {
      second = requestAnimationFrame(() => setResetting(false));
    });
    return () => { cancelAnimationFrame(first); cancelAnimationFrame(second); };
  }, [resetting]);

  const finishSlide = () => {
    if (index === reviews.length) {
      setResetting(true);
      setIndex(0);
    }
  };
  const navigate = direction => {
    setResetting(false);
    setIndex((active + direction + reviews.length) % reviews.length);
  };

  return (
    <div className="reviews-monitor" ref={root} role="region" aria-label="Avaliações de clientes no monitor"
      onMouseEnter={() => setInteracting(true)} onMouseLeave={() => setInteracting(false)}
      onFocusCapture={() => setInteracting(true)}
      onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setInteracting(false); }}>
      <div className="reviews-monitor-frame">
        <img className="reviews-monitor-image" src={asset("google-monitor.webp")} width="1254" height="1254"
          alt="" loading="lazy" decoding="async" />
        <div className="reviews-monitor-screen">
          <div className="reviews-monitor-heading"><strong>Capucho Informática</strong><span>Avaliações no Google</span></div>
          <div className="reviews-monitor-window">
            <div className={`reviews-monitor-track${resetting ? " is-resetting" : ""}`}
              style={{ transform: `translateX(-${index * 100}%)` }} onTransitionEnd={finishSlide}>
              {[...reviews, reviews[0]].map((review, i) => (
                <figure className="reviews-monitor-slide" key={`${review.name}-${i}`} aria-hidden={i !== index}>
                  <Stars />
                  <blockquote>“{review.text}”</blockquote>
                  <figcaption><span className="reviews-monitor-avatar">{review.initials}</span><div><strong>{review.name}</strong><span>Avaliação no Google</span></div></figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="reviews-monitor-controls">
        <button type="button" aria-label="Avaliação anterior" onClick={() => navigate(-1)}><CaretLeft size={18} /></button>
        <span className="reviews-monitor-count" aria-live={paused || interacting || reduceMotion ? "polite" : "off"}>{active + 1} / {reviews.length}</span>
        <button type="button" aria-label="Próxima avaliação" onClick={() => navigate(1)}><CaretRight size={18} /></button>
        {!reduceMotion && <button type="button" aria-label={paused ? "Reproduzir avaliações" : "Pausar avaliações"} aria-pressed={paused} onClick={() => setPaused(value => !value)}>{paused ? <Play size={16} /> : <Pause size={16} />}</button>}
      </div>
    </div>
  );
}
