import { services } from "./content";
import { business } from "./config";

const homeTitle =
  "Capucho Informática | Conserto e upgrade de computadores na Freguesia do Ó";
const homeDescription =
  "Conserto, formatação, limpeza e upgrade de computadores e notebooks na Freguesia do Ó, em São Paulo. Suporte remoto para todo o Brasil. Fale com a Capucho pelo WhatsApp.";

export const routes = ["/", ...services.map((s) => `/servicos/${s.slug}`)];

export function getSeo(pathname) {
  const path = pathname.replace(/\/$/, "") || "/";
  if (path === "/")
    return { path, title: homeTitle, description: homeDescription };
  const service = services.find((s) => path === `/servicos/${s.slug}`);
  if (service)
    return {
      path,
      title: `${service.title} na Freguesia do Ó | Capucho Informática`,
      description: service.seoDescription || service.intro,
    };
  return {
    path,
    title: "Página não encontrada | Capucho Informática",
    description: homeDescription,
    noindex: true,
  };
}

// Dados estruturados de negócio local. Horários conforme o briefing (confirmar antes de publicar).
export function localBusinessJsonLd(siteUrl) {
  const hours = (days, opens, closes) => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: days,
    opens,
    closes,
  });
  return {
    "@context": "https://schema.org",
    "@type": "ComputerStore",
    name: business.name,
    url: siteUrl + "/",
    image: siteUrl + "/assets/fachada.webp",
    logo: siteUrl + "/assets/logo.webp",
    telephone: business.phoneE164,
    address: {
      "@type": "PostalAddress",
      streetAddress: business.street,
      addressLocality: business.city,
      addressRegion: business.state,
      postalCode: business.postalCode,
      addressCountry: "BR",
    },
    areaServed: ["Freguesia do Ó", "Vila Palmeiras", "São Paulo"],
    sameAs: [business.instagram],
    openingHoursSpecification: [
      hours(["Monday", "Saturday"], "09:00", "20:00"),
      hours(["Tuesday", "Wednesday", "Thursday", "Friday"], "09:00", "22:00"),
    ],
    makesOffer: services.map((s) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: s.title,
        url: `${siteUrl}/servicos/${s.slug}`,
      },
    })),
  };
}
