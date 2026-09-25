import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import ServiceCard from "./ServiceCard";

// Carrossel de serviços (adaptado de services-card / animated-service-card).
// Usa a rolagem nativa com scroll-snap: arrastar no celular, trackpad e teclado funcionam sem biblioteca.
export default function ServicesCarousel({ services }) {
  const wrapRef = useRef(null);
  const trackRef = useRef(null);
  const [atStart, setAtStart] = useState(true);
  const [reveal, setReveal] = useState("");

  const updateEdges = useCallback(() => {
    const el = trackRef.current;
    if (el) setAtStart(el.scrollLeft < 8);
  }, []);

  // Entrada escalonada dos cards, só se a seção ainda não estiver na tela
  // e se o dispositivo não pedir redução de movimento.
  useEffect(() => {
    const wrap = wrapRef.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!wrap || reduce || wrap.getBoundingClientRect().top < window.innerHeight)
      return;
    setReveal("is-armed");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setReveal("is-armed is-visible");
        observer.disconnect();
      },
      { threshold: 0.2 },
    );
    observer.observe(wrap);
    return () => observer.disconnect();
  }, []);

  function step(direction) {
    const el = trackRef.current;
    const slide = el?.querySelector(".services-slide");
    if (!el || !slide) return;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 8;
    if (direction > 0 && atEnd) el.scrollTo({ left: 0, behavior: "smooth" });
    else
      el.scrollBy({
        left: direction * (slide.offsetWidth + gap),
        behavior: "smooth",
      });
  }

  const cards = [
    ...services.map((s) => ({ key: s.slug, service: s })),
    { key: "produtos", products: true },
  ];

  return (
    <div
      ref={wrapRef}
      className={`services-carousel ${reveal}`}
      role="region"
      aria-roledescription="carrossel"
      aria-label="Serviços da Capucho"
    >
      <ul
        ref={trackRef}
        className="services-track"
        onScroll={updateEdges}
        tabIndex={0}
      >
        {cards.map((card, i) => (
          <li
            key={card.key}
            className="services-slide"
            style={{ "--i": i }}
          >
            <ServiceCard
              service={card.service}
              products={card.products}
              number={String(i + 1).padStart(2, "0")}
            />
          </li>
        ))}
      </ul>
      {!atStart && (
        <button
          type="button"
          className="carousel-button carousel-prev"
          onClick={() => step(-1)}
          aria-label="Serviços anteriores"
        >
          <ArrowLeft size={20} />
        </button>
      )}
      <button
        type="button"
        className="carousel-button carousel-next"
        onClick={() => step(1)}
        aria-label="Próximos serviços"
      >
        <ArrowRight size={20} />
      </button>
    </div>
  );
}
