import { useEffect, useState } from "react";
import GradientBand from "./GradientBand";
import TubesCursor from "./TubesCursor";
import { HeroArcs } from "./HeroGamerFx";

// Fundo da hero, adaptado de elegant-dark-pattern (DarkGradientBg) para a paleta clara do site:
// base clareando a partir do canto superior esquerdo e faixas diagonais em azul da marca. Só decoração; o conteúdo vem por "children".
// "theme" acompanha o equipamento na tela: com o PC gamer, uma camada roxa escura cobre o fundo
// claro (com transição) e aparecem arcos elétricos curtos (HeroGamerFx.jsx).
export default function HeroBackground({ children, theme = "notebook" }) {
  // Os tubos de luz do cursor (three.js, ~770 KB) só carregam quando o PC gamer aparece pela primeira vez e
  // saem de cena logo depois que o fundo claro volta, para não rodar escondidos.
  const [tubes, setTubes] = useState(false);
  useEffect(() => {
    if (theme === "gamer") {
      setTubes(true);
      return;
    }
    const timer = setTimeout(() => setTubes(false), 1400);
    return () => clearTimeout(timer);
  }, [theme]);
  return (
    <div className="hero-backdrop" data-theme={theme}>
      <div className="hero-backdrop-layers" aria-hidden="true">
        <div className="hero-streaks">
          <span className="hero-streak s1" />
          <span className="hero-streak s2" />
          <span className="hero-streak s3" />
          <span className="hero-streak s4" />
        </div>
        {/* Mesmo fundo da hero da área gamer: shader de filamentos (GradientBand) e tubos de luz que seguem o cursor */}
        <div className="hero-gamer-light">
          <GradientBand className="hero-gamer-band" paused={theme !== "gamer"} />
          {tubes && <TubesCursor />}
        </div>
        <HeroArcs active={theme === "gamer"} />
      </div>
      {children}
    </div>
  );
}
