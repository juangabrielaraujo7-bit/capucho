import { useState } from "react";
import { Navigate, Route, Routes, useLocation, useParams } from "react-router";
import { IconContext, WhatsappLogo } from "@phosphor-icons/react";
import "@fontsource-variable/sora";
import "@fontsource-variable/dm-sans";
import "@fontsource-variable/montserrat";
import Header from "./components/Header";
import Footer from "./components/Footer";
import RouteEffects from "./components/RouteEffects";
import Home from "./pages/Home";
import AboutPage from "./pages/AboutPage";
import ServicePage from "./pages/ServicePage";
import ServiceHubPage from "./pages/ServiceHubPage";
import GamerPage from "./pages/GamerPage";
import PcBuilder from "./pages/PcBuilder";
import AssemblyPage from "./pages/AssemblyPage";
import UpgradePage, { UpgradeHeader, UpgradeFooter } from "./pages/UpgradePage";
import NotFound from "./pages/NotFound";
import { legacyHubs, redirects, services } from "./content";
import { wa } from "./config";
import "./styles.css";

function ServiceRoute() {
  const { slug } = useParams();
  const service = services.find((s) => s.slug === slug);
  if (service) return <ServicePage key={slug} service={service} />;
  const hub = legacyHubs.find((h) => h.slug === slug);
  if (hub) return <ServiceHubPage key={slug} hub={hub} />;
  // Endereço substituído (o 301 de verdade fica em vercel.json; aqui cobre a navegação no app).
  if (redirects[slug]) return <Navigate to={`/servicos/${redirects[slug]}`} replace />;
  return <NotFound />;
}

export default function App() {
  // No montador, a barra fixa de baixo já tem o envio pelo WhatsApp.
  const { pathname } = useLocation();
  const [heroEquipment, setHeroEquipment] = useState("notebook");
  const gamerAccent = pathname === "/" && heroEquipment === "gamer";
  const builder = pathname.startsWith("/gamer/monte-seu-pc");
  // Área gamer (/gamer e subpáginas) usa o tema escuro roxo, separado das cores do site principal.
  const gamer = /^\/gamer(\/|$)/.test(pathname);
  // Montagem completa tem tema próprio, claro e frio (assembly.css).
  const assembly = pathname.startsWith("/gamer/montagem-completa");
  const upgrade = pathname.startsWith("/gamer/upgrade-de-pecas");
  return (
    <IconContext.Provider value={{ size: 24, weight: "regular" }}>
      <div className={upgrade ? "site theme-upgrade" : assembly ? "site theme-assembly" : gamer ? "site theme-gamer" : "site"}>
        <RouteEffects />
        <a className="skip-link" href="#conteudo">
          Pular para o conteúdo
        </a>
        {upgrade ? <UpgradeHeader /> : <Header gamerActive={gamerAccent} />}
        <main id="conteudo">
          <Routes>
            <Route path="/" element={<Home gamerActive={gamerAccent} onEquipmentChange={setHeroEquipment} />} />
            <Route path="/sobre" element={<AboutPage />} />
            <Route path="/servicos/:slug" element={<ServiceRoute />} />
            <Route path="/gamer" element={<GamerPage />} />
            <Route path="/gamer/monte-seu-pc" element={<PcBuilder />} />
            <Route path="/gamer/montagem-completa" element={<AssemblyPage />} />
            <Route path="/gamer/upgrade-de-pecas" element={<UpgradePage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        {upgrade ? <UpgradeFooter /> : <Footer />}
        {!builder && !upgrade && (
          <a
            className="floating-whatsapp"
            href={wa()}
            aria-label="Falar com a Capucho pelo WhatsApp"
            target="_blank"
            rel="noreferrer"
          >
            <WhatsappLogo size={30} />
          </a>
        )}
      </div>
    </IconContext.Provider>
  );
}
