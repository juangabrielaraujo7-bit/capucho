import { Link } from "react-router";

// Botão de "vidro líquido" (21st.dev, liquid-glass-button), reescrito sem Tailwind/shadcn:
// borda de vidro feita com sombras internas claras e o fundo atrás do botão distorcido por um
// filtro SVG (turbulência + deslocamento), como uma lente de vidro. Onde o navegador não aplica
// o filtro no backdrop-filter, fica só a borda de vidro sobre um véu translúcido.
export default function LiquidButton({ to, children }) {
  return (
    <Link className="liquid-button" to={to}>
      <span className="liquid-button-glass" aria-hidden="true" />
      <span className="liquid-button-rim" aria-hidden="true" />
      <span className="liquid-button-label">{children}</span>
      <svg className="liquid-button-filter" aria-hidden="true" focusable="false">
        <defs>
          <filter
            id="liquid-glass"
            x="0%"
            y="0%"
            width="100%"
            height="100%"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.05 0.05"
              numOctaves="1"
              seed="1"
              result="turbulence"
            />
            <feGaussianBlur in="turbulence" stdDeviation="2" result="blurredNoise" />
            <feDisplacementMap
              in="SourceGraphic"
              in2="blurredNoise"
              scale="70"
              xChannelSelector="R"
              yChannelSelector="B"
              result="displaced"
            />
            <feGaussianBlur in="displaced" stdDeviation="4" result="finalBlur" />
            <feComposite in="finalBlur" in2="finalBlur" operator="over" />
          </filter>
        </defs>
      </svg>
    </Link>
  );
}
