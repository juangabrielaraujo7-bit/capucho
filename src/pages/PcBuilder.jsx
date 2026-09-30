import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Circuitry,
  Cpu,
  DesktopTower,
  Fan,
  GraphicsCard,
  HardDrives,
  Lifebuoy,
  Lightning,
  ListChecks,
  MagnifyingGlass,
  Memory,
  Package,
  Screwdriver,
  Trash,
  WhatsappLogo,
} from "@phosphor-icons/react";
import { wa } from "../config";
import {
  HELP,
  OWN,
  brl,
  describe,
  find,
  incompatibility,
  parts,
  presets,
  skipOption,
  steps,
} from "../gamer";

// Montador de PC no estilo do "Monte seu PC" da KaBuM: etapas por categoria, só peças compatíveis
// selecionáveis, resumo com total estimado e envio da lista pelo WhatsApp para orçamento.

const icons = {
  cpu: Cpu,
  board: Circuitry,
  ram: Memory,
  gpu: GraphicsCard,
  storage: HardDrives,
  cooler: Fan,
  psu: Lightning,
  case: DesktopTower,
};
const REVIEW = steps.length;
const STORAGE_KEY = "capucho-monte-seu-pc";

// Remove escolhas que deixaram de combinar depois de uma troca (a etapa "keep" é mantida).
function sanitize(pick, keep) {
  const out = { ...pick };
  for (const { id: step } of steps) {
    const id = out[step];
    if (!id || step === keep || id === HELP || id === OWN) continue;
    const part = find(step, id);
    const valid = part
      ? !incompatibility(step, part, out)
      : skipOption(step, out)?.id === id;
    if (!valid) delete out[step];
  }
  return out;
}

const totalOf = (pick) =>
  steps.reduce((sum, s) => sum + (find(s.id, pick[s.id])?.price ?? 0), 0);

function message(pick) {
  const lines = steps.map(
    (s) => `• ${s.label}: ${describe(s.id, pick[s.id]) ?? "a definir"}`,
  );
  const total = totalOf(pick);
  return [
    "Olá, Capucho! Montei um PC no site e quero um orçamento com a montagem:",
    "",
    ...lines,
    "",
    total ? `Total estimado das peças: ${brl(total)}` : null,
    "Pode confirmar preços, disponibilidade e prazo?",
  ]
    .filter((l) => l !== null)
    .join("\n");
}

function PartCard({ part, selected, reason, onPick }) {
  return (
    <li>
      <button
        type="button"
        className={`part-card${selected ? " is-selected" : ""}`}
        aria-pressed={selected}
        disabled={Boolean(reason)}
        onClick={onPick}
      >
        <span className="part-tags">
          {part.brand && <span className="part-brand">{part.brand}</span>}
          <span className={part.stock ? "part-stock is-in" : "part-stock"}>
            {part.stock ? "Em estoque" : "Sob encomenda"}
          </span>
        </span>
        <strong className="part-name">{part.name}</strong>
        <span className="part-specs">{part.specs}</span>
        {reason ? (
          <span className="part-reason">{reason}</span>
        ) : (
          <span className="part-foot">
            <span className="part-price">
              <small>estimado</small>
              {brl(part.price)}
            </span>
            <span className="part-action">
              {selected ? (
                <>
                  <Check size={16} weight="bold" /> Selecionado
                </>
              ) : (
                "Selecionar"
              )}
            </span>
          </span>
        )}
      </button>
    </li>
  );
}

function OptionCard({ selected, title, note, icon: Icon, onPick }) {
  return (
    <li>
      <button
        type="button"
        className={`part-card is-option${selected ? " is-selected" : ""}`}
        aria-pressed={selected}
        onClick={onPick}
      >
        <Icon size={26} weight="duotone" />
        <strong className="part-name">{title}</strong>
        <span className="part-specs">{note}</span>
        <span className="part-action">
          {selected ? (
            <>
              <Check size={16} weight="bold" /> Selecionado
            </>
          ) : (
            "Selecionar"
          )}
        </span>
      </button>
    </li>
  );
}

export default function PcBuilder() {
  const [pick, setPick] = useState({});
  const [current, setCurrent] = useState(0);
  const [brand, setBrand] = useState("");
  const [query, setQuery] = useState("");
  const mainRef = useRef(null);

  // Guarda a montagem só neste navegador, para quem voltar depois.
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      if (saved?.pick) setPick(sanitize(saved.pick));
    } catch {
      /* sem armazenamento: começa do zero */
    }
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ pick }));
    } catch {
      /* ignora */
    }
  }, [pick]);

  function go(index) {
    setCurrent(index);
    setBrand("");
    setQuery("");
    const top = mainRef.current?.getBoundingClientRect().top ?? 0;
    if (top < 0) mainRef.current.scrollIntoView({ block: "start" });
  }

  function choose(step, id) {
    setPick((prev) => sanitize({ ...prev, [step]: id }, step));
    go(Math.min(current + 1, REVIEW));
  }

  function loadPreset(preset) {
    setPick(sanitize(preset.picks));
    go(REVIEW);
  }

  const step = steps[current];
  const done = steps.filter((s) => pick[s.id]).length;
  const progress = Math.round((done / steps.length) * 100);
  const total = totalOf(pick);
  const sendHref = wa(message(pick));

  const list = useMemo(() => {
    if (!step) return [];
    const q = query.trim().toLowerCase();
    return parts[step.id]
      .filter((p) => !brand || p.brand === brand)
      .filter((p) => !q || `${p.name} ${p.specs}`.toLowerCase().includes(q))
      .map((p) => ({ part: p, reason: incompatibility(step.id, p, pick) }))
      .sort((a, b) => Boolean(a.reason) - Boolean(b.reason));
  }, [step, brand, query, pick]);
  const brands = step
    ? [...new Set(parts[step.id].map((p) => p.brand).filter(Boolean))]
    : [];
  const skip = step && skipOption(step.id, pick);

  return (
    <section className="builder container">
      <Link className="back-link" to="/gamer">
        <ArrowLeft />
        Área Gamer
      </Link>
      <div className="builder-head">
        <p className="eyebrow">Área Gamer</p>
        <h1>
          Monte seu <span className="gamer-accent">PC</span>
        </h1>
        <p>
          Escolha as peças etapa por etapa: o montador só libera o que é compatível com o que você já
          escolheu. No fim, envie a lista pelo WhatsApp e a Capucho confirma preços, disponibilidade e
          faz a montagem e os testes.
        </p>
      </div>

      <div className="builder-presets">
        <h2 className="eyebrow">Comece por uma configuração pronta</h2>
        <ul>
          {presets.map((preset) => (
            <li key={preset.id}>
              <button type="button" onClick={() => loadPreset(preset)}>
                <strong>{preset.name}</strong>
                <span>{preset.tagline}</span>
                <em>a partir de {brl(totalOf(preset.picks))}</em>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <nav className="builder-steps" aria-label="Etapas da montagem">
        <ol>
          {steps.map((s, i) => {
            const Icon = icons[s.id];
            return (
              <li key={s.id}>
                <button
                  type="button"
                  className={pick[s.id] ? "is-done" : ""}
                  aria-current={i === current ? "step" : undefined}
                  onClick={() => go(i)}
                >
                  <span className="builder-step-icon">
                    {pick[s.id] ? <Check size={18} weight="bold" /> : <Icon size={20} />}
                  </span>
                  {s.short}
                </button>
              </li>
            );
          })}
          <li>
            <button
              type="button"
              aria-current={current === REVIEW ? "step" : undefined}
              onClick={() => go(REVIEW)}
            >
              <span className="builder-step-icon">
                <ListChecks size={20} />
              </span>
              Revisão
            </button>
          </li>
        </ol>
      </nav>

      <div className="builder-layout">
        <div className="builder-main" ref={mainRef}>
          {step ? (
            <>
              <header className="builder-main-head">
                <div>
                  <p className="builder-count">
                    Etapa {current + 1} de {steps.length}
                  </p>
                  <h2>{step.label}</h2>
                </div>
                <div className="builder-filters">
                  {brands.length > 1 && (
                    <div className="builder-chips" role="group" aria-label="Filtrar por marca">
                      {["", ...brands].map((b) => (
                        <button
                          key={b || "todas"}
                          type="button"
                          aria-pressed={brand === b}
                          onClick={() => setBrand(b)}
                        >
                          {b || "Todas"}
                        </button>
                      ))}
                    </div>
                  )}
                  <label className="builder-search">
                    <MagnifyingGlass size={18} />
                    <span className="visually-hidden">Buscar {step.label.toLowerCase()}</span>
                    <input
                      type="search"
                      placeholder="Buscar peça"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                  </label>
                </div>
              </header>
              <ul className="part-grid">
                {skip && (
                  <OptionCard
                    selected={pick[step.id] === skip.id}
                    title={skip.label}
                    note={skip.note}
                    icon={Package}
                    onPick={() => choose(step.id, skip.id)}
                  />
                )}
                {list.map(({ part, reason }) => (
                  <PartCard
                    key={part.id}
                    part={part}
                    reason={reason}
                    selected={pick[step.id] === part.id}
                    onPick={() => choose(step.id, part.id)}
                  />
                ))}
                {list.length === 0 && (
                  <li className="part-empty">Nenhuma peça encontrada com esse filtro.</li>
                )}
                <OptionCard
                  selected={pick[step.id] === OWN}
                  title="Já tenho essa peça"
                  note="A Capucho confere a compatibilidade e o estado antes de montar"
                  icon={Screwdriver}
                  onPick={() => choose(step.id, OWN)}
                />
                <OptionCard
                  selected={pick[step.id] === HELP}
                  title="Quero indicação"
                  note="Não sabe qual escolher? A Capucho indica a melhor opção"
                  icon={Lifebuoy}
                  onPick={() => choose(step.id, HELP)}
                />
              </ul>
            </>
          ) : (
            <div className="builder-review">
              <p className="builder-count">Revisão</p>
              <h2>Confira sua montagem</h2>
              <ul>
                {steps.map((s, i) => {
                  const part = find(s.id, pick[s.id]);
                  return (
                    <li key={s.id}>
                      <span className="builder-review-label">{s.label}</span>
                      <span className={pick[s.id] ? "" : "is-missing"}>
                        {describe(s.id, pick[s.id]) ?? "Não escolhido"}
                      </span>
                      <span className="builder-review-price">
                        {part ? brl(part.price) : ""}
                      </span>
                      <button type="button" className="text-link" onClick={() => go(i)}>
                        {pick[s.id] ? "Trocar" : "Escolher"}
                      </button>
                    </li>
                  );
                })}
              </ul>
              <div className="builder-assembly">
                <Screwdriver size={28} weight="duotone" />
                <p>
                  <strong>Montagem e testes pela Capucho.</strong> O valor da montagem é confirmado
                  junto com o orçamento das peças.
                </p>
              </div>
            </div>
          )}
        </div>

        <aside className="builder-summary" aria-label="Minhas peças">
          <div className="builder-summary-head">
            <h2>Minhas peças</h2>
            <span>{progress}%</span>
          </div>
          <div
            className="builder-progress"
            role="progressbar"
            aria-label="Montagem concluída"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <span style={{ width: `${progress}%` }} />
          </div>
          <ul>
            {steps.map((s, i) => (
              <li key={s.id}>
                <button type="button" onClick={() => go(i)}>
                  <span>{s.short}</span>
                  <strong className={pick[s.id] ? "" : "is-missing"}>
                    {describe(s.id, pick[s.id]) ?? "Escolher"}
                  </strong>
                </button>
              </li>
            ))}
          </ul>
          <div className="builder-total">
            <span>Total estimado</span>
            <strong>{brl(total)}</strong>
          </div>
          <a className="button button-primary" href={sendHref} target="_blank" rel="noreferrer">
            <WhatsappLogo size={22} />
            Pedir orçamento
          </a>
          <p className="small-note">
            Valores estimados, sujeitos à confirmação de preço e disponibilidade. Montagem cobrada à
            parte.
          </p>
          {done > 0 && (
            <button type="button" className="builder-clear" onClick={() => { setPick({}); go(0); }}>
              <Trash size={16} />
              Limpar montagem
            </button>
          )}
        </aside>
      </div>

      <div className="builder-bar">
        <button
          type="button"
          className="button button-outline"
          disabled={current === 0}
          onClick={() => go(current - 1)}
        >
          <ArrowLeft size={18} />
          Voltar
        </button>
        <div className="builder-bar-total">
          <span>Total estimado</span>
          <strong>{brl(total)}</strong>
        </div>
        {current < REVIEW ? (
          <button type="button" className="button button-primary" onClick={() => go(current + 1)}>
            {current === REVIEW - 1 ? "Revisar" : "Avançar"}
            <ArrowRight size={18} />
          </button>
        ) : (
          <a className="button button-primary" href={sendHref} target="_blank" rel="noreferrer">
            <WhatsappLogo size={20} />
            Enviar
          </a>
        )}
      </div>
    </section>
  );
}
