import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { ArrowUpRight } from "@phosphor-icons/react";
import { FX, between, bolt, contourArc, flash } from "../heroGamerFx";

// Efeitos elétricos do tema gamer da hero. Só rodam com o PC gamer na tela ("active", que vem da
// troca dos vídeos em HeroVideo), com a hero visível, a aba aberta e sem redução de movimento.
function useRunning(ref, active) {
  const [visible, setVisible] = useState(true);
  const [pageOpen, setPageOpen] = useState(true);
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    observer.observe(el);
    const onVisibility = () => setPageOpen(!document.hidden);
    onVisibility();
    document.addEventListener("visibilitychange", onVisibility);
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMotion = () => setReduce(motion.matches);
    onMotion();
    motion.addEventListener("change", onMotion);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      motion.removeEventListener("change", onMotion);
    };
  }, [ref]);
  return active && visible && pageOpen && !reduce;
}

const overlaps = (a, b) => a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;

// Arcos no fundo: atrás do gabinete e nas bordas da hero, longe do título e da descrição.
export function HeroArcs({ active }) {
  const svgRef = useRef(null);
  const running = useRunning(svgRef, active);

  useEffect(() => {
    const svg = svgRef.current;
    if (!running || !svg) return;
    let timer;
    const spawn = () => {
      const stage = svg.closest(".hero-backdrop");
      const box = stage.getBoundingClientRect();
      const copy = stage.querySelector(".hero-copy")?.getBoundingClientRect();
      const media = stage.querySelector(".hero-visual")?.getBoundingClientRect();
      if (!copy || !media || !box.width) return;
      const small = box.width < 768;
      const cfg = small ? FX.background.mobile : FX.background.desktop;
      svg.setAttribute("viewBox", `0 0 ${box.width} ${box.height}`);
      const keepOut = {
        left: copy.left - box.left - 28,
        right: copy.right - box.left + 28,
        top: copy.top - box.top - 28,
        bottom: copy.bottom - box.top + 28,
      };
      const cx = media.left - box.left + media.width / 2;
      const cy = media.top - box.top + media.height / 2;
      const count = Math.random() < cfg.pair ? 2 : 1;
      for (let n = 0; n < count; n++) {
        for (let tries = 0; tries < 12; tries++) {
          const len = between(cfg.length);
          let x1, y1, angle;
          if (Math.random() < 0.6) {
            // nasce atrás do gabinete e se afasta dele, para longe do texto
            angle = small ? between([0.15, Math.PI - 0.15]) : between([-1.35, 1.35]);
            x1 = cx + Math.cos(angle) * media.width * between([0.12, 0.3]);
            y1 = cy + Math.sin(angle) * media.height * between([0.12, 0.3]);
          } else {
            // entra pela borda direita ou de cima, na metade do gabinete
            if (Math.random() < 0.5) {
              x1 = box.width - 2;
              y1 = between([box.height * 0.08, box.height * 0.92]);
              angle = Math.PI + between([-0.6, 0.6]);
            } else {
              x1 = between([Math.max(box.width * 0.55, keepOut.right), box.width]);
              y1 = 2;
              angle = Math.PI / 2 + between([-0.7, 0.7]);
            }
          }
          const x2 = x1 + Math.cos(angle) * len;
          const y2 = y1 + Math.sin(angle) * len;
          const area = {
            left: Math.min(x1, x2) - 20,
            right: Math.max(x1, x2) + 20,
            top: Math.min(y1, y2) - 20,
            bottom: Math.max(y1, y2) + 20,
          };
          if (overlaps(area, keepOut)) continue;
          const branches = Math.round(between(cfg.branches));
          flash(svg, bolt(x1, y1, x2, y2, branches), {
            width: cfg.width,
            life: FX.background.life,
            reduce: small ? 0.75 : 1,
          });
          break;
        }
      }
      timer = setTimeout(spawn, between(cfg.every));
    };
    timer = setTimeout(spawn, 260);
    return () => {
      clearTimeout(timer);
      for (const a of svg.getAnimations({ subtree: true })) a.cancel();
    };
  }, [running]);

  return <svg ref={svgRef} className="hero-arcs" aria-hidden="true" focusable="false" />;
}

// Acesso "Área gamer" da hero: contorno que acende no tema gamer, pulso na entrada do PC e
// arcos curtos de tempos em tempos. O texto é o mesmo e o espaço ocupado não muda.
export function GamerLink({ active, variant = "hero", onClick }) {
  const linkRef = useRef(null);
  const svgRef = useRef(null);
  const running = useRunning(linkRef, active);
  const compact = variant === "nav";

  useEffect(() => {
    const svg = svgRef.current;
    const link = linkRef.current;
    if (!running || !svg || !link) return;
    let timer;
    const timers = [];
    const arc = () => {
      const { width, height } = svg.getBoundingClientRect();
      if (!width) return;
      svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
      flash(svg, contourArc(width, height, 8), {
        width: compact ? 1.6 : 2,
        life: 850,
        colors: { core: "#faf5ff", stroke: "#c084fc" },
        smooth: true,
      });
    };
    // Pulso de entrada
    const pulse = link.animate(
      [
        { opacity: 0 },
        { opacity: 1, offset: 0.32 },
        { opacity: 0 },
      ],
      { duration: 850, easing: "ease-out", pseudoElement: "::after" },
    );
    for (let i = 0; i < 3; i++) timers.push(setTimeout(arc, (compact ? 180 : 80) + i * 200));
    const next = () => {
      arc();
      timer = setTimeout(next, between(compact ? [1100, 1700] : [850, 1400]));
    };
    timer = setTimeout(next, compact ? 1200 : 900);
    return () => {
      clearTimeout(timer);
      timers.forEach(clearTimeout);
      pulse.cancel();
      for (const a of svg.getAnimations({ subtree: true })) a.cancel();
      svg.replaceChildren();
    };
  }, [running, compact]);

  return (
    <Link className={`${compact ? "nav-gamer" : "gamer-link"} electric-gamer-link`} data-energized={active ? "true" : "false"} to="/gamer" ref={linkRef} onClick={onClick}>
      <svg ref={svgRef} className="electric-gamer-arcs" aria-hidden="true" focusable="false" />
      Área gamer
      {!compact && <ArrowUpRight size={18} />}
    </Link>
  );
}
