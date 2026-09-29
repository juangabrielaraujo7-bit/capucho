import { Link } from "react-router";

// Botão com efeito glitch "Spider-Verse" (21st.dev), reescrito sem Tailwind: no hover/foco o botão
// treme e duas cópias do texto (ciano e magenta) pulam em faixas. O "invólucro" com folga em volta
// mantém o hover estável enquanto o botão se mexe. Com redução de movimento, fica só o brilho.
// "to" navega dentro do site; "href" abre um link comum (ex.: WhatsApp).
export default function GlitchButton({ to, href, children, ...props }) {
  const content = (
    <>
      {children}
      <span className="glitch-layers" aria-hidden="true">
        <span className="glitch-layer glitch-layer-1">{children}</span>
        <span className="glitch-layer glitch-layer-2">{children}</span>
      </span>
      <span className="glitch-noise" aria-hidden="true" />
      <span className="glitch-slice" aria-hidden="true" />
    </>
  );
  return (
    <span className="glitch-wrap">
      {to ? (
        <Link className="glitch-button" to={to} {...props}>
          {content}
        </Link>
      ) : (
        <a className="glitch-button" href={href} {...props}>
          {content}
        </a>
      )}
    </span>
  );
}
