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
  PencilSimple,
  Screwdriver,
  Trash,
  Warning,
  WhatsappLogo,
  X,
} from "@phosphor-icons/react";
import { loadCatalog } from "../catalog";
import { asset } from "../config";
import CouponOffer, { useCouponOffer } from "../components/CouponOffer";
import useOrderQuote from "../useOrderQuote";
import { benefit, cents, money } from "../../shared/coupon.js";
import { assemblyBenefitsText, ownPartsAssemblyText } from "../../shared/customer-care.js";
import {
  HELP,
  OWN,
  NONE,
  BOX,
  brl,
  describe,
  find,
  incompatibility,
  parts,
  presets,
  skipOption,
  steps,
  unverified,
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

// Peça importada ainda sem preço definido aparece como "Sob consulta" e não entra na soma.
const priceLabel = (part) => (part?.price > 0 ? brl(part.price) : "Sob consulta");
const hasUnpriced = (pick) => steps.some((s) => { const part = find(s.id, pick[s.id]); return part && !(part.price > 0); });
const totalOf = (pick) =>
  steps.reduce((sum, s) => sum + cents(find(s.id, pick[s.id])?.price || 0), 0) / 100;

// Foto provisória usada em todas as peças até a Capucho enviar as fotos reais (campo "image" em gamer.js).
const PLACEHOLDER_IMAGE = "peca-modelo.webp";

const CUTOUT_MAX_SIZE = 360;

function colorDistance(data, index, background) {
  const red = data[index] - background[0];
  const green = data[index + 1] - background[1];
  const blue = data[index + 2] - background[2];
  return Math.sqrt(red * red + green * green + blue * blue);
}

function edgeBackground(data, width, height) {
  const buckets = new Map();
  const samples = [];
  const step = Math.max(1, Math.floor(Math.min(width, height) / 72));

  const collect = (x, y) => {
    const index = (y * width + x) * 4;
    if (data[index + 3] < 16) return;
    const key = `${data[index] >> 4}-${data[index + 1] >> 4}-${data[index + 2] >> 4}`;
    const bucket = buckets.get(key) ?? { count: 0, red: 0, green: 0, blue: 0 };
    bucket.count += 1;
    bucket.red += data[index];
    bucket.green += data[index + 1];
    bucket.blue += data[index + 2];
    buckets.set(key, bucket);
    samples.push(key);
  };

  for (let x = 0; x < width; x += step) {
    collect(x, 0);
    collect(x, height - 1);
  }
  for (let y = step; y < height - 1; y += step) {
    collect(0, y);
    collect(width - 1, y);
  }

  const dominant = [...buckets.values()].sort((a, b) => b.count - a.count)[0];
  if (!dominant || dominant.count / samples.length < 0.28) return null;
  return [
    dominant.red / dominant.count,
    dominant.green / dominant.count,
    dominant.blue / dominant.count,
  ];
}

function removeEdgeBackground(context, width, height) {
  const imageData = context.getImageData(0, 0, width, height);
  const { data } = imageData;
  const background = edgeBackground(data, width, height);
  if (!background) return;

  const neutral = Math.max(...background) - Math.min(...background) < 26;
  const threshold = neutral ? 54 : 40;
  const featherStart = threshold * 0.35;
  const pixelCount = width * height;
  const visited = new Uint8Array(pixelCount);
  const queue = new Int32Array(pixelCount);
  let start = 0;
  let end = 0;

  const enqueue = (pixel) => {
    if (visited[pixel]) return;
    const index = pixel * 4;
    if (data[index + 3] === 0 || colorDistance(data, index, background) <= threshold) {
      visited[pixel] = 1;
      queue[end] = pixel;
      end += 1;
    }
  };

  for (let x = 0; x < width; x += 1) {
    enqueue(x);
    enqueue((height - 1) * width + x);
  }
  for (let y = 1; y < height - 1; y += 1) {
    enqueue(y * width);
    enqueue(y * width + width - 1);
  }

  while (start < end) {
    const pixel = queue[start];
    start += 1;
    const x = pixel % width;
    const y = Math.floor(pixel / width);
    const index = pixel * 4;
    const distance = colorDistance(data, index, background);
    const opacity = distance <= featherStart
      ? 0
      : Math.round(255 * (distance - featherStart) / (threshold - featherStart));
    data[index + 3] = Math.min(data[index + 3], opacity);

    if (x > 0) enqueue(pixel - 1);
    if (x + 1 < width) enqueue(pixel + 1);
    if (y > 0) enqueue(pixel - width);
    if (y + 1 < height) enqueue(pixel + width);
  }

  context.putImageData(imageData, 0, 0);
}

function ProductCutout({ src, alt }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) return undefined;

    let cancelled = false;
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.decoding = "async";
    image.onload = () => {
      if (cancelled) return;
      const scale = Math.min(1, CUTOUT_MAX_SIZE / Math.max(image.naturalWidth, image.naturalHeight));
      const width = Math.max(1, Math.round(image.naturalWidth * scale));
      const height = Math.max(1, Math.round(image.naturalHeight * scale));
      canvas.width = width;
      canvas.height = height;
      context.clearRect(0, 0, width, height);
      context.drawImage(image, 0, 0, width, height);
      // External photos need CORS permission for pixel reads. Keep the original
      // photo visible if its host permits display but not background processing.
      try { removeEdgeBackground(context, width, height); } catch { /* original remains drawn */ }
      canvas.dataset.ready = "true";
    };
    image.onerror = () => {
      if (cancelled || image.crossOrigin === null) return;
      image.crossOrigin = null;
      image.src = src;
    };
    image.src = src;

    return () => {
      cancelled = true;
      image.onload = null;
      image.onerror = null;
    };
  }, [src]);

  return (
    <canvas
      ref={canvasRef}
      className="part-product-image"
      role="img"
      aria-label={alt}
      width="360"
      height="300"
    />
  );
}

function PartCard({ part, selected, reason, onPick }) {
  const imageSource = part.image?.startsWith("http")
    ? part.image
    : asset(part.image ?? PLACEHOLDER_IMAGE);

  return (
    <li>
      <button
        type="button"
        className={`part-card${selected ? " is-selected" : ""}`}
        aria-pressed={selected}
        disabled={Boolean(reason)}
        onClick={onPick}
      >
        <span className="part-image">
          <ProductCutout src={imageSource} alt={part.name} />
        </span>
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
              {priceLabel(part)}
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
  const [catalogVersion, setCatalogVersion] = useState(0);
  const [catalogStatus, setCatalogStatus] = useState("loading");
  const [catalogAttempt, setCatalogAttempt] = useState(0);
  const mainRef = useRef(null);
  const savedPickRef = useRef(null);
  const [couponInput, setCouponInput] = useState("");
  const { offer } = useCouponOffer();

  // Catálogo do painel Sanity (src/catalog.js). Ao chegar, refaz a lista e tira da montagem
  // salva o que não existe mais ou deixou de combinar.
  useEffect(() => {
    let alive = true;
    setCatalogStatus("loading");
    loadCatalog().then((status) => {
      if (!alive) return;
      setCatalogStatus(status);
      setCatalogVersion((v) => v + 1);
      const saved = savedPickRef.current;
      savedPickRef.current = null;
      setPick((prev) => sanitize(saved ?? prev));
    });
    return () => {
      alive = false;
    };
  }, [catalogAttempt]);

  // Guarda a montagem só neste navegador, para quem voltar depois.
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      // A validação espera o catálogo chegar para não apagar escolhas válidas durante o carregamento.
      if (saved?.pick && typeof saved.pick === "object" && !Array.isArray(saved.pick)) savedPickRef.current = saved.pick;
    } catch {
      /* sem armazenamento: começa do zero */
    }
  }, []);
  useEffect(() => {
    if (catalogStatus === "loading" || catalogStatus === "unavailable") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ pick }));
    } catch {
      /* ignora */
    }
  }, [pick, catalogStatus]);

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

  function remove(step) {
    setPick((prev) => {
      const { [step]: _, ...rest } = prev;
      return rest;
    });
  }

  function clearAll() {
    if (!window.confirm("Limpar todas as peças escolhidas e começar de novo?")) return;
    setPick({});
    go(0);
  }

  function loadPreset(preset) {
    setPick(sanitize(preset.picks));
    go(REVIEW);
  }

  const step = steps[current];
  const done = steps.filter((s) => pick[s.id]).length;
  const progress = Math.round((done / steps.length) * 100);
  const total = totalOf(pick);
  const selections = useMemo(() => steps.filter(s => pick[s.id]).map(s => {
    const id = pick[s.id];
    const option = { [HELP]: "help", [OWN]: "own", [NONE]: "none", [BOX]: "box" }[id];
    return option ? { step: s.id, option } : { step: s.id, productId: find(s.id, id)?.documentId || "invalid" };
  }), [pick, catalogVersion]);
  const displayedItems = selections.filter(selection => selection.productId).map(selection => {
    const part = find(selection.step, pick[selection.step]);
    return { ...selection, name: part?.name, cents: part?.price > 0 ? cents(part.price) : null };
  });
  const order = useOrderQuote(selections, cents(total), displayedItems);
  const estimatedTotal = order.quote?.totalCents ?? cents(total);
  const notes = useMemo(() => unverified(pick), [pick, catalogVersion]);

  const list = useMemo(() => {
    if (!step) return [];
    const q = query.trim().toLowerCase();
    return parts[step.id]
      .filter((p) => !brand || p.brand === brand)
      .filter((p) => !q || `${p.name} ${p.specs}`.toLowerCase().includes(q))
      .map((p) => ({ part: p, reason: incompatibility(step.id, p, pick) }))
      .sort((a, b) => Boolean(a.reason) - Boolean(b.reason));
  }, [step, brand, query, pick, catalogVersion]);
  const brands = step
    ? [...new Set(parts[step.id].map((p) => p.brand).filter(Boolean))]
    : [];
  const skip = step && skipOption(step.id, pick);
  // Só oferece configurações cujas peças continuam disponíveis e compatíveis no catálogo atual.
  const availablePresets = catalogStatus === "loading" ? [] : presets.filter((preset) => {
    const valid = sanitize(preset.picks);
    return steps.every(({ id }) => valid[id] && valid[id] === preset.picks[id]);
  });

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
        <div className="builder-assembly"><Screwdriver size={28} weight="duotone" /><p><strong>Benefícios de montar com a Capucho.</strong> {assemblyBenefitsText}</p></div>
      </div>

      <div role="status" aria-live="polite">
        {catalogStatus === "loading" && <p className="small-note">Carregando catálogo e preços…</p>}
        {catalogStatus === "cached" && <p className="small-note">Não foi possível atualizar o catálogo. Exibimos a última lista salva neste navegador; confirme preços e disponibilidade com a Capucho.</p>}
        {catalogStatus === "unavailable" && <p className="small-note">Não foi possível carregar o catálogo. Você pode pedir indicação de peças e um orçamento à Capucho.</p>}
      </div>
      {["cached", "unavailable"].includes(catalogStatus) && (
        <button type="button" className="text-link" onClick={() => setCatalogAttempt((v) => v + 1)}>Tentar atualizar catálogo</button>
      )}

      {availablePresets.length > 0 && <div className="builder-presets">
        <h2 className="eyebrow">Comece por uma configuração pronta</h2>
        <ul>
          {availablePresets.map((preset) => (
            <li key={preset.id}>
              <button type="button" onClick={() => loadPreset(preset)}>
                <strong>{preset.name}</strong>
                <span>{preset.tagline}</span>
                <em>{hasUnpriced(preset.picks) ? "Preço sob consulta" : `a partir de ${brl(totalOf(preset.picks))}`}</em>
              </button>
            </li>
          ))}
        </ul>
      </div>}

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
                  <li className="part-empty">{catalogStatus === "loading" ? "Carregando peças…" : parts[step.id].length === 0 ? "Nenhuma peça disponível nesta etapa. Escolha “Quero indicação” para receber uma sugestão da Capucho." : "Nenhuma peça encontrada com esse filtro."}</li>
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
                  const validated = order.quote?.items.find(item => item.step === s.id && item.productId);
                  return (
                    <li key={s.id}>
                      <span className="builder-review-label">{s.label}</span>
                      <span className={pick[s.id] ? "" : "is-missing"}>
                        {validated?.name ?? describe(s.id, pick[s.id]) ?? "Não escolhido"}
                      </span>
                      <span className="builder-review-price">
                        {validated ? validated.cents === null ? "Sob consulta" : money(validated.cents) : part ? priceLabel(part) : ""}
                      </span>
                      <span className="builder-review-actions">
                        <button type="button" className="text-link" onClick={() => go(i)}>
                          {pick[s.id] ? "Trocar" : "Escolher"}
                        </button>
                        {pick[s.id] && (
                          <button
                            type="button"
                            className="text-link is-remove"
                            onClick={() => remove(s.id)}
                          >
                            Remover
                          </button>
                        )}
                      </span>
                    </li>
                  );
                })}
              </ul>
              {notes.length > 0 && (
                <div className="builder-assembly">
                  <Warning size={28} weight="duotone" />
                  <p>
                    <strong>A Capucho confere estes pontos.</strong> Faltam dados das peças para o montador
                    garantir sozinho: {notes.join(" ")}
                  </p>
                </div>
              )}
              <div className="builder-assembly">
                <Screwdriver size={28} weight="duotone" />
                <p>
                  <strong>Montagem e testes pela Capucho.</strong> {assemblyBenefitsText} {ownPartsAssemblyText}
                </p>
              </div>
              <form className="builder-coupon" onSubmit={event => { event.preventDefault(); order.apply(couponInput); }} aria-busy={order.busy}>
                <label htmlFor="discount-code">Cupom de desconto</label>
                {order.code ? <><p className="coupon-feedback">{order.quote?.coupon ? `Aplicado: ${order.code} · ${benefit(order.quote.coupon)}` : `${order.code} · aguardando validação`}</p><button type="button" className="coupon-remove" onClick={order.remove} disabled={order.busy}>Remover cupom</button></> : <div className="builder-coupon-field"><input id="discount-code" value={couponInput} onChange={event => setCouponInput(event.target.value)} maxLength={80} autoComplete="off" autoCapitalize="characters" spellCheck={false} placeholder="Digite o código" disabled={order.busy} /><button type="submit" disabled={order.busy}>{order.busy ? "Validando…" : "Aplicar"}</button></div>}
                <p className="small-note">O benefício vale sobre as peças com preço informado. Frete e serviços à parte não entram no desconto.</p>
                <div role="status" aria-live="polite">{(order.busy || order.error || order.notice) && <p className={`coupon-feedback${order.error ? " is-error" : ""}`}>{order.busy ? "Validando valores e cupom…" : order.error || order.notice}</p>}{order.error && <button type="button" className="coupon-remove" onClick={order.retry} disabled={order.busy}>Tentar validar novamente</button>}</div>
              </form>
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
          {done > 0 && (
            <button type="button" className="builder-clear" onClick={clearAll}>
              <Trash size={16} />
              Limpar montagem
            </button>
          )}
          <ul>
            {steps.map((s, i) => (
              <li key={s.id} className={pick[s.id] ? "is-picked" : ""}>
                <button type="button" className="builder-summary-item" onClick={() => go(i)}>
                  <span>{s.short}</span>
                  <strong className={pick[s.id] ? "" : "is-missing"}>
                    {describe(s.id, pick[s.id]) ?? "Escolher"}
                  </strong>
                </button>
                {pick[s.id] && (
                  <span className="builder-item-actions">
                    <button
                      type="button"
                      aria-label={`Trocar ${s.label.toLowerCase()}`}
                      title="Trocar"
                      onClick={() => go(i)}
                    >
                      <PencilSimple size={16} />
                    </button>
                    <button
                      type="button"
                      className="is-remove"
                      aria-label={`Remover ${s.label.toLowerCase()}`}
                      title="Remover"
                      onClick={() => remove(s.id)}
                    >
                      <X size={16} />
                    </button>
                  </span>
                )}
              </li>
            ))}
          </ul>
          <CouponOffer offer={offer} />
          {current !== REVIEW && <button type="button" className="text-link" onClick={() => go(REVIEW)}>Tenho um cupom de desconto</button>}
          {order.code && <p className="coupon-feedback">Cupom {order.code}{order.quote?.coupon ? " aplicado" : " aguardando validação"} <button type="button" className="text-link" onClick={order.remove} disabled={order.busy}>Remover</button></p>}
          <dl className="builder-amounts">
            <div><dt>Subtotal das peças{hasUnpriced(pick) || order.quote?.partial ? " (sem peças sob consulta)" : ""}</dt><dd>{money(order.quote?.subtotalCents ?? cents(total))}</dd></div>
            <div><dt>Desconto do cupom</dt><dd>− {money(order.quote?.discountCents ?? 0)}</dd></div>
            <div className="is-total"><dt>{order.quote?.coupon ? "Total estimado com desconto" : "Total estimado"}</dt><dd>{money(estimatedTotal)}</dd></div>
          </dl>
          <div role="status" aria-live={current === REVIEW ? "off" : "polite"}>{order.busy && <p className="coupon-feedback">Validando valores e cupom…</p>}{order.notice && <p className="coupon-feedback">{order.notice}</p>}{order.error && <><p className="coupon-feedback is-error">{order.error}</p><button type="button" className="text-link" onClick={order.retry} disabled={order.busy}>Tentar validar novamente</button></>}</div>
          <button type="button" className="button button-primary" onClick={order.checkout} disabled={order.busy}>
            <WhatsappLogo size={22} />
            Pedir orçamento
          </button>
          <p className="small-note">
            Valores estimados, sujeitos à confirmação de preço e disponibilidade. {ownPartsAssemblyText}
          </p>
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
          <span>{order.quote?.coupon ? "Total com desconto" : "Total estimado"}</span>
          <strong>{money(estimatedTotal)}</strong>
        </div>
        {current < REVIEW ? (
          <button type="button" className="button button-primary" onClick={() => go(current + 1)}>
            {current === REVIEW - 1 ? "Revisar" : "Avançar"}
            <ArrowRight size={18} />
          </button>
        ) : (
          <button type="button" className="button button-primary" onClick={order.checkout} disabled={order.busy}>
            <WhatsappLogo size={20} />
            Enviar
          </button>
        )}
      </div>
    </section>
  );
}
