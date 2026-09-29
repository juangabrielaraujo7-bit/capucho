// Botão com efeito glitch "Spider-Verse" (21st.dev), reescrito sem Tailwind: no hover/foco o botão
// treme e duas cópias do texto (ciano e magenta) pulam em faixas. O "invólucro" com folga em volta
// mantém o hover estável enquanto o botão se mexe. Com redução de movimento, fica só o brilho.
export default function GlitchButton({ href, children, ...props }) {
  return (
    <span className="glitch-wrap">
      <a className="glitch-button" href={href} {...props}>
        {children}
        <span className="glitch-layers" aria-hidden="true">
          <span className="glitch-layer glitch-layer-1">{children}</span>
          <span className="glitch-layer glitch-layer-2">{children}</span>
        </span>
        <span className="glitch-noise" aria-hidden="true" />
        <span className="glitch-slice" aria-hidden="true" />
      </a>
    </span>
  );
}
