import { useEffect, useState } from "react";
import { benefit } from "../../shared/coupon.js";
import "../coupon.css";

export function useCouponOffer() {
  const [state, setState] = useState({ offer: null, error: false });
  useEffect(() => {
    let alive = true, controller;
    async function refresh() {
      if (document.visibilityState === "hidden") return;
      controller?.abort();
      controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
      try {
        const response = await fetch("/api/coupon", { cache: "no-store", signal: controller.signal });
        if (!response.ok) throw new Error();
        const data = await response.json();
        if (alive) setState({ offer: data.offer || null, error: false });
      } catch { if (alive) setState({ offer: null, error: true }); }
      finally { clearTimeout(timeout); }
    }
    refresh();
    const interval = setInterval(refresh, 30000);
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refresh);
    return () => { alive = false; controller?.abort(); clearInterval(interval); window.removeEventListener("focus", refresh); document.removeEventListener("visibilitychange", refresh); };
  }, []);
  return state;
}

export default function CouponOffer({ offer }) {
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => { setCopied(false); setFailed(false); }, [offer?.code]);
  useEffect(() => { if (!copied) return; const timer = setTimeout(() => setCopied(false), 2000); return () => clearTimeout(timer); }, [copied]);
  if (!offer) return null;
  async function copy() {
    try { await navigator.clipboard.writeText(offer.code); setCopied(true); setFailed(false); }
    catch { setFailed(true); }
  }
  return <div className="coupon-offer"><p>Use <strong>{offer.code}</strong> e ganhe {benefit(offer)} de desconto.</p><button type="button" onClick={copy}>{copied ? "Copiado!" : "Copiar código"}</button><span className="visually-hidden" role="status">{copied ? "Código copiado." : failed ? `Não foi possível copiar. Digite ${offer.code} no campo de cupom.` : ""}</span>{failed && <small>Não foi possível copiar. Digite o código no campo de cupom.</small>}</div>;
}
