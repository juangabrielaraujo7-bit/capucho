import { Plus } from "@phosphor-icons/react";

// Perguntas frequentes em sanfona: abrir uma pergunta fecha a que estava aberta.
// O atributo "name" já faz isso nos navegadores novos; o onToggle cobre os demais.
function closeOthers(event) {
  const opened = event.currentTarget;
  if (!opened.open) return;
  opened.parentElement
    .querySelectorAll("details[open]")
    .forEach((d) => d !== opened && (d.open = false));
}

export default function FaqList({ items, name = "faq" }) {
  return (
    <div className="faq-list">
      {items.map(([q, a]) => (
        <details key={q} name={name} onToggle={closeOthers}>
          <summary>
            {q}
            <Plus size={21} />
          </summary>
          <p>{a}</p>
        </details>
      ))}
    </div>
  );
}
