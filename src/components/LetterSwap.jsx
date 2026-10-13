// Letras que trocam de lugar em loop: cada uma desce e a cópia de cima ocupa o lugar, numa ordem embaralhada.
// A ordem é fixa (não aleatória) para o HTML pré-renderizado bater com o do navegador.
function shuffledOrder(length) {
  const order = Array.from({ length }, (_, i) => i);
  let seed = 7;
  for (let i = length - 1; i > 0; i--) {
    seed = (seed * 9301 + 49297) % 233280;
    const j = Math.floor((seed / 233280) * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}

export default function LetterSwap({ text, stagger = 0.05, cycle = 3, className = "" }) {
  const letters = [...text];
  const order = shuffledOrder(letters.length);
  return (
    <span className={`letter-swap ${className}`} aria-label={text} style={{ "--swap-cycle": `${cycle}s` }}>
      {letters.map((char, i) => (
        <span className="letter-swap-cell" aria-hidden="true" key={i}>
          <span className="letter-swap-inner" style={{ animationDelay: `${order.indexOf(i) * stagger}s` }}>
            {char}<span className="letter-swap-copy">{char}</span>
          </span>
        </span>
      ))}
    </span>
  );
}
