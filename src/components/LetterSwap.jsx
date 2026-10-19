// Frases alternadas com letras que entram e saem em uma ordem embaralhada.
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

export default function LetterSwap({ phrases, stagger = 0.025, cycle = 6, className = "" }) {
  return (
    <span className={`letter-swap ${className}`} aria-label={phrases.join(" ")} style={{ "--swap-cycle": `${cycle}s` }}>
      {phrases.map((phrase, phraseIndex) => {
        const letters = [...phrase];
        const order = shuffledOrder(letters.length);
        return (
          <span className="letter-swap-phrase" aria-hidden="true" key={phrase}>
            {letters.map((char, i) => (
              <span className="letter-swap-cell" key={i}>
                <span className="letter-swap-inner" style={{ animationDelay: `${order.indexOf(i) * stagger - phraseIndex * cycle / phrases.length}s` }}>
                  {char}
                </span>
              </span>
            ))}
          </span>
        );
      })}
    </span>
  );
}
