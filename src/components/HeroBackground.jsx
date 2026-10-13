import GradientBand from "./GradientBand";
import { HeroArcs } from "./HeroGamerFx";

// Fundo da hero, adaptado de elegant-dark-pattern (DarkGradientBg) para a paleta clara do site:
// base clareando a partir do canto superior esquerdo e faixas diagonais em azul da marca. Só decoração; o conteúdo vem por "children".
// "theme" acompanha o equipamento na tela: com o PC gamer, uma camada roxa escura cobre o fundo
// claro (com transição) e aparecem arcos elétricos curtos (HeroGamerFx.jsx).
export default function HeroBackground({ children, theme = "notebook" }) {
  return (
    <div className="hero-backdrop" data-theme={theme}>
      <div className="hero-backdrop-layers" aria-hidden="true">
        <div className="hero-streaks">
          <span className="hero-streak s1" />
          <span className="hero-streak s2" />
          <span className="hero-streak s3" />
          <span className="hero-streak s4" />
        </div>
        {/* Mesmo fundo animado da hero da área gamer (GradientBand); só anima no tema gamer */}
        <div className="hero-gamer-light">
          <GradientBand className="hero-gamer-band" paused={theme !== "gamer"} />
        </div>
        <HeroArcs active={theme === "gamer"} />
      </div>
      {children}
    </div>
  );
}
