import { Fragment, useState } from "react";
import { Pause, Play } from "@phosphor-icons/react";
import Stars from "./Stars";

// Colunas de depoimentos em rolagem contínua (adaptado de testimonials-columns-1).
// A trilha repete a lista e desloca -50% em loop; só a primeira cópia fica acessível.
function ReviewCard({ review, hidden }) {
  return (
    <li className="review testimonial-card" aria-hidden={hidden || undefined}>
      <Stars />
      <blockquote>“{review.text}”</blockquote>
      <div className="review-author">
        <span className="initials">{review.initials}</span>
        <div>
          <strong>{review.name}</strong>
          <span>Avaliação no Google</span>
        </div>
      </div>
    </li>
  );
}

function TestimonialsColumn({ reviews, duration, repeat = 1, className = "" }) {
  // "repeat" garante que cada metade da trilha seja mais alta que a janela visível.
  const half = Array.from({ length: repeat }, () => reviews).flat();
  return (
    <div className={`testimonials-column ${className}`}>
      <ul
        className="testimonials-track"
        style={{ animationDuration: `${duration}s` }}
      >
        {[0, 1].map((copy) => (
          <Fragment key={copy}>
            {half.map((review, i) => (
              <ReviewCard
                key={`${copy}-${i}`}
                review={review}
                hidden={copy === 1 || i >= reviews.length}
              />
            ))}
          </Fragment>
        ))}
      </ul>
    </div>
  );
}

export default function TestimonialsColumns({ reviews }) {
  const [paused, setPaused] = useState(false);
  const columns = [0, 1, 2].map((c) => reviews.filter((_, i) => i % 3 === c));
  return (
    <div className={paused ? "testimonials is-paused" : "testimonials"}>
      <div
        className="testimonials-window"
        role="region"
        aria-label="Depoimentos de clientes"
      >
        {/* Celular e tablet: uma coluna com todos. Desktop: três colunas. */}
        <TestimonialsColumn
          reviews={reviews}
          duration={70}
          className="testimonials-narrow"
        />
        {columns.map((col, i) => (
          <TestimonialsColumn
            key={i}
            reviews={col}
            repeat={2}
            duration={[46, 56, 50][i]}
            className="testimonials-wide"
          />
        ))}
      </div>
      <button
        className="hero-video-toggle testimonials-toggle"
        type="button"
        onClick={() => setPaused(!paused)}
        aria-pressed={paused}
      >
        {paused ? <Play size={17} /> : <Pause size={17} />}
        <span>{paused ? "Continuar rolagem" : "Pausar depoimentos"}</span>
      </button>
    </div>
  );
}
