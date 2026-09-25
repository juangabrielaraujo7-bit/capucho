import { Star } from "@phosphor-icons/react";

export default function Stars() {
  return (
    <div className="stars" role="img" aria-label="5 de 5 estrelas">
      {[0, 1, 2, 3, 4].map((n) => (
        <Star key={n} size={17} weight="fill" />
      ))}
    </div>
  );
}
