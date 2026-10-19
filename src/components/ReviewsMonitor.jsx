import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, CaretLeft, CaretRight, Pause, Play } from "@phosphor-icons/react";
import { asset, maps } from "../config";
import Stars from "./Stars";

export default function ReviewsMonitor({ reviews }) {
  const slides = [
    { type: "profile", id: "profile" },
    ...reviews.slice(0, 4).map(review => ({ type: "review", id: review.name, review })),
    { type: "link", id: "google-link" },
  ];
  const total = slides.length;
  const root = useRef(null);
  const [index, setIndex] = useState(0);
  const [resetting, setResetting] = useState(false);
  const [paused, setPaused] = useState(false);
  const [interacting, setInteracting] = useState(false);
  const [visible, setVisible] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [pageOpen, setPageOpen] = useState(true);
  const active = index % total;

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
    if (paused || interacting || !visible || !pageOpen || reduceMotion || resetting) return;
    const timer = setTimeout(() => setIndex(i => i + 1), 2000);
    return () => clearTimeout(timer);
  }, [index, paused, interacting, visible, pageOpen, reduceMotion, resetting]);

  useEffect(() => {
    if (!resetting) return;
    let second;
    const first = requestAnimationFrame(() => {
      second = requestAnimationFrame(() => setResetting(false));
    });
    return () => { cancelAnimationFrame(first); cancelAnimationFrame(second); };
  }, [resetting]);

  const finishSlide = () => {
    if (index === total) {
      setResetting(true);
      setIndex(0);
    }
  };
  const navigate = direction => {
    setResetting(false);
    setIndex((active + direction + total) % total);
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
          <div className="reviews-monitor-window">
            <div className={`reviews-monitor-track${resetting ? " is-resetting" : ""}`}
              style={{ transform: `translateX(-${index * 100}%)` }} onTransitionEnd={finishSlide}>
              {[...slides, slides[0]].map((slide, i) => (
                <figure className={`reviews-monitor-slide is-${slide.type}`} key={`${slide.id}-${i}`} aria-hidden={i !== index} inert={i !== index}>
                  {slide.type === "profile" ? (
                    <a className="reviews-monitor-profile" href={maps} target="_blank" rel="noreferrer" aria-label="Ver o perfil da Capucho Informática no Google">
                      <img src={asset("google-monitor.webp")} width="1254" height="1254" alt="Perfil da Capucho Informática no Google Maps" />
                    </a>
                  ) : slide.type === "link" ? (
                    <div className="reviews-monitor-cta">
                      <img src={asset("google-reviews.webp")} width="400" height="164" alt="Google Reviews" />
                      <strong>Conheça a Capucho no Google</strong>
                      <a href={maps} target="_blank" rel="noreferrer">Ver o perfil no Google <ArrowUpRight size={18} /></a>
                    </div>
                  ) : (<>
                  <div className="reviews-monitor-heading"><strong>Capucho Informática</strong><span>Avaliações no Google</span></div>
                  <Stars />
                  <blockquote>“{slide.review.text}”</blockquote>
                  <figcaption><span className="reviews-monitor-avatar">{slide.review.initials}</span><div><strong>{slide.review.name}</strong><span>Avaliação no Google</span></div></figcaption>
                  </>)}
                </figure>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="reviews-monitor-controls">
        <button type="button" aria-label="Avaliação anterior" onClick={() => navigate(-1)}><CaretLeft size={18} /></button>
        <span className="reviews-monitor-count" aria-live={paused || interacting || reduceMotion ? "polite" : "off"}>{active + 1} / {total}</span>
        <button type="button" aria-label="Próxima avaliação" onClick={() => navigate(1)}><CaretRight size={18} /></button>
        {!reduceMotion && <button type="button" aria-label={paused ? "Reproduzir avaliações" : "Pausar avaliações"} aria-pressed={paused} onClick={() => setPaused(value => !value)}>{paused ? <Play size={16} /> : <Pause size={16} />}</button>}
      </div>
    </div>
  );
}
