import { asset } from "../config";

export default function AssemblyParts({ cards }) {
  return (
    <div className="asm-forge">
      <ul className="asm-forge-cards">
        {cards.map(([title, text]) => (
          <li key={title} className="asm-say asm-forge-card">
            <span className="asm-burn" aria-hidden="true" />
            <span className="asm-burn-hot" aria-hidden="true" />
            <span className="asm-rune" aria-hidden="true" />
            <span className="asm-say-who">Kratos</span>
            <h3>{title}</h3>
            <p>“{text}”</p>
          </li>
        ))}
      </ul>
      <img
        className="asm-kratos"
        src={asset("kratos-orientando.webp")}
        srcSet={`${asset("kratos-orientando-360.webp")} 360w, ${asset("kratos-orientando-600.webp")} 600w, ${asset("kratos-orientando.webp")} 989w`}
        sizes="(max-width: 767px) 170px, (max-width: 1023px) 220px, (max-width: 1280px) 36vw, 440px"
        width="989"
        height="1591"
        alt="Kratos olhando e gesticulando para os cards de componentes à esquerda"
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}
