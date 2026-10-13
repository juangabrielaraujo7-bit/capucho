// Texto que "respira": cada letra varia o peso da fonte variável, com atraso escalonado a partir do centro.
export default function AnimatedText({ text, minWeight = 200, maxWeight = 800, duration = 1.5, delay = 0.12, className = "" }) {
  const letters = [...text];
  return (
    <p className={`animated-text ${className}`} aria-label={text}
      style={{ "--breath-min": minWeight, "--breath-max": maxWeight, "--breath-time": `${duration}s` }}>
      {letters.map((char, i) => (
        <span key={i} aria-hidden="true" style={{ animationDelay: `${(i - letters.length / 2) * delay}s` }}>{char}</span>
      ))}
    </p>
  );
}
