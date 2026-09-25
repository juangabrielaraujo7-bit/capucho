import { useEffect } from "react";
import { useLocation } from "react-router";
import { getSeo } from "../seo";

// Rolagem para âncoras/topo e título/descrição ao navegar entre páginas.
// O HTML de cada rota já sai pronto do pré-render; aqui só mantemos a navegação no navegador em dia.
export default function RouteEffects() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    const seo = getSeo(pathname);
    document.title = seo.title;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", seo.description);
  }, [pathname]);
  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }
    document.getElementById(hash.slice(1))?.scrollIntoView();
  }, [pathname, hash]);
  return null;
}
