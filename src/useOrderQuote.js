import { useEffect, useRef, useState } from "react";
import { normalizeCode } from "../shared/coupon.js";
import { quoteNeedsReview } from "../shared/quote-snapshot.js";

// Every usable discount comes from the API, tied to the exact selected product IDs.
export default function useOrderQuote(selections, subtotalCents, displayedItems = [], context = {}) {
  const key = JSON.stringify({ selections, context });
  const [saved, setSaved] = useState(null);
  const [code, setCode] = useState("");
  const codeRef = useRef("");
  const lastRequestedCode = useRef("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const requestId = useRef(0);
  const controller = useRef(null);
  const previousKey = useRef(key);
  const quote = saved?.key === key ? saved.quote : null;

  function remove() {
    requestId.current++;
    controller.current?.abort();
    lastRequestedCode.current = "";
    codeRef.current = ""; setCode(""); setSaved(previous => previous?.key === key ? { key, quote: { ...previous.quote, coupon: null, discountCents: 0, totalCents: previous.quote.subtotalCents, version: null } } : null); setBusy(false); setError(""); setNotice("Cupom removido. Total sem desconto restaurado.");
  }
  async function validate(requestedCode, purpose = "apply") {
    lastRequestedCode.current = normalizeCode(requestedCode);
    const id = ++requestId.current;
    controller.current?.abort();
    const aborter = new AbortController(); controller.current = aborter;
    const timeout = setTimeout(() => aborter.abort(), 12000);
    setBusy(true); setError(""); setNotice("");
    try {
      const response = await fetch("/api/quote", { method: "POST", cache: "no-store", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...context, selections, code: requestedCode }), signal: aborter.signal });
      const data = await response.json();
      if (!response.ok || !data.quote) throw new Error(data.message || "Não foi possível validar o cupom. Tente novamente.");
      if (id !== requestId.current) return;
      const next = data.quote;
      setSaved({ key, quote: next });
      codeRef.current = next.coupon?.code || ""; setCode(codeRef.current);
      if (data.invalidCoupon) { setError("Cupom inválido ou desativado. O desconto foi removido; confira o resumo antes de continuar."); return; }
      const changed = purpose === "checkout" && (quoteNeedsReview(quote, next, displayedItems, subtotalCents) || (data.catalogChanged && quote?.version !== next.version));
      if (changed) { setNotice("Os preços ou a condição do cupom mudaram. Confira o resumo atualizado e clique novamente para enviar."); return; }
      if (purpose === "checkout") {
        if (!/^https:\/\/wa\.me\/5511947009632\?text=/.test(data.whatsappUrl || "")) throw new Error("Não foi possível preparar o envio. Tente novamente.");
        window.location.assign(data.whatsappUrl);
      } else setNotice(next.coupon ? (purpose === "recalculate" ? "Desconto recalculado para as peças atuais." : `Cupom ${next.coupon.code} aplicado.`) : "Orçamento atualizado.");
    } catch (failure) {
      if (id !== requestId.current) return;
      setSaved(null);
      setError(failure.name === "AbortError" ? "Não foi possível validar a tempo. Tente novamente." : failure instanceof TypeError || failure instanceof SyntaxError ? "Não foi possível validar o orçamento e o cupom. Tente novamente." : failure.message);
    } finally { clearTimeout(timeout); if (id === requestId.current) setBusy(false); }
  }
  useEffect(() => {
    if (previousKey.current === key) return;
    previousKey.current = key;
    requestId.current++; controller.current?.abort(); setSaved(null); setError(""); setNotice(""); setBusy(false);
    if (codeRef.current) validate(codeRef.current, "recalculate");
  }, [key]);
  useEffect(() => () => { requestId.current++; controller.current?.abort(); }, []);
  return { quote, code, notice, error, busy, remove, apply: value => normalizeCode(value) ? validate(value) : setError("Digite o código do cupom."), retry: () => validate(codeRef.current || lastRequestedCode.current, "recalculate"), checkout: () => validate(codeRef.current, "checkout") };
}
