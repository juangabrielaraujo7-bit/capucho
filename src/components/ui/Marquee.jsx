// Adaptado do Marquee vertical 3D enviado pelo usuário para React e CSS nativo.
// Duas cópias de igual altura fecham o ciclo; a cópia decorativa não é lida duas vezes.
export default function Marquee({ children, reverse = false, duration = 40, className = "" }) {
  return (
    <div className={`testimonials-column ${className}`} data-reverse={reverse ? "true" : "false"}>
      <div className="testimonials-track" style={{ animationDuration: `${duration}s` }}>
        <ul className="testimonials-group">{children}</ul>
        <ul className="testimonials-group testimonials-copy" aria-hidden="true" inert>{children}</ul>
      </div>
    </div>
  );
}
