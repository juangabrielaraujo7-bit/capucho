import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "@phosphor-icons/react";
import Stars from "./Stars";
import Marquee from "./ui/Marquee";

function ReviewCard({ review }) {
  return (
    <li className="review testimonial-card">
      <Stars />
      <blockquote>“{review.text}”</blockquote>
      <div className="review-author">
        <span className="initials">{review.initials}</span>
        <div><strong>{review.name}</strong><span>Avaliação no Google</span></div>
      </div>
    </li>
  );
}

export default function TestimonialsColumns({ reviews, children }) {
  const windowRef = useRef(null);
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    let visible = false;
    const update = () => setRunning(visible && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; update(); });
    observer.observe(windowRef.current);
    document.addEventListener("visibilitychange", update);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", update); };
  }, []);
  const columns = [0, 1].map(c => reviews.filter((_, i) => i % 2 === c));
  return (
    <div className="testimonials">
      <div className="testimonials-aside">{children}</div>
      <div className="testimonials-motion" data-running={running && !paused ? "true" : "false"}>
        <div ref={windowRef} className="testimonials-window" role="region" aria-label="Depoimentos de clientes" tabIndex={0}>
          <div className="testimonials-stage">
            {columns.map((column, i) => (
              <Marquee key={i} className="testimonials-desktop" reverse={i === 1} duration={i === 0 ? 42 : 48}>
                {column.map(review => <ReviewCard key={review.name} review={review} />)}
              </Marquee>
            ))}
            <Marquee className="testimonials-mobile" duration={78}>
              {reviews.map(review => <ReviewCard key={review.name} review={review} />)}
            </Marquee>
          </div>
        </div>
        <button className="testimonials-pause" type="button" onClick={() => setPaused(!paused)} aria-label={paused ? "Retomar depoimentos" : "Pausar depoimentos"} aria-pressed={paused}>
          {paused ? <Play size={16} /> : <Pause size={16} />} {paused ? "Retomar" : "Pausar"}
        </button>
      </div>
    </div>
  );
}
