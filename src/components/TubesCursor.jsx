import { useEffect, useRef } from "react";

// Tubos de luz que seguem o cursor (21st.dev "tubes-curor", threejs-components/tubes1), reescrito
// para ficar dentro de uma seção: o canvas cobre só a faixa, atrás do conteúdo e sem capturar
// cliques. Sem o mouse em cima, os tubos passeiam sozinhos. O pacote (~770 KB, three.js) só é
// baixado quando a seção chega perto da tela. Não carrega em telas de toque nem com redução de
// movimento. Clicar na faixa troca as cores dos tubos, como no original, dentro da paleta roxa.
const palettes = [
  { tubes: ["#a855f7", "#7c3aed", "#e879f9"], lights: ["#c084fc", "#8b5cf6", "#f0abfc", "#a78bfa"] },
  { tubes: ["#d946ef", "#8b5cf6", "#6366f1"], lights: ["#f0abfc", "#a855f7", "#818cf8", "#e879f9"] },
  { tubes: ["#c084fc", "#ec4899", "#7c3aed"], lights: ["#f9a8d4", "#c084fc", "#a78bfa", "#f472b6"] },
];

export default function TubesCursor() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const skip =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!canvas || skip) return;

    let app = null;
    let disposed = false;
    let palette = 0;
    const section = canvas.parentElement;
    const onClick = () => {
      if (!app) return;
      palette = (palette + 1) % palettes.length;
      app.tubes.setColors(palettes[palette].tubes);
      app.tubes.setLightsColors(palettes[palette].lights);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        import("threejs-components/build/cursors/tubes1.min.js")
          .then(({ default: create }) => {
            if (disposed) return;
            app = create(canvas, {
              tubes: {
                colors: palettes[0].tubes,
                lights: { intensity: 200, colors: palettes[0].lights },
              },
            });
            section.addEventListener("click", onClick);
          })
          .catch(() => {});
      },
      { rootMargin: "200px" },
    );
    observer.observe(section);

    return () => {
      disposed = true;
      observer.disconnect();
      section.removeEventListener("click", onClick);
      app?.dispose?.();
    };
  }, []);

  return <canvas ref={canvasRef} className="tubes-cursor" aria-hidden="true" />;
}
