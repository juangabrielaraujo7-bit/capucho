import { Route, Routes, useParams } from "react-router";
import { IconContext, WhatsappLogo } from "@phosphor-icons/react";
import "@fontsource-variable/sora";
import "@fontsource-variable/dm-sans";
import Header from "./components/Header";
import Footer from "./components/Footer";
import RouteEffects from "./components/RouteEffects";
import Home from "./pages/Home";
import ServicePage from "./pages/ServicePage";
import NotFound from "./pages/NotFound";
import { services } from "./content";
import { wa } from "./config";
import "./styles.css";

function ServiceRoute() {
  const { slug } = useParams();
  const service = services.find((s) => s.slug === slug);
  return service ? <ServicePage key={slug} service={service} /> : <NotFound />;
}

export default function App() {
  return (
    <IconContext.Provider value={{ size: 24, weight: "regular" }}>
      <RouteEffects />
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      <Header />
      <main id="conteudo">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/servicos/:slug" element={<ServiceRoute />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <a
        className="floating-whatsapp"
        href={wa()}
        aria-label="Falar com a Capucho pelo WhatsApp"
        target="_blank"
        rel="noreferrer"
      >
        <WhatsappLogo size={30} />
      </a>
    </IconContext.Provider>
  );
}
