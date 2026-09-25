// Fundo da hero, adaptado de elegant-dark-pattern (DarkGradientBg) para a paleta clara do site:
// base clareando a partir do canto superior esquerdo, faixas diagonais em azul da marca,
// granulado e grade de pontos. Só decoração; o conteúdo vem por "children".
export default function HeroBackground({ children }) {
  return (
    <div className="hero-backdrop">
      <div className="hero-backdrop-layers" aria-hidden="true">
        <div className="hero-streaks">
          <span className="hero-streak s1" />
          <span className="hero-streak s2" />
          <span className="hero-streak s3" />
          <span className="hero-streak s4" />
        </div>
        <div className="hero-grain" />
        <div className="hero-dots" />
      </div>
      {children}
    </div>
  );
}
