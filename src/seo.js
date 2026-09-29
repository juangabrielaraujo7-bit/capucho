import { faqs, services } from "./content";
import { business, geo, maps } from "./config";

// Títulos com até ~60 caracteres para não serem cortados no Google.
const homeTitle =
  "Assistência técnica de computadores na Freguesia do Ó | Capucho";
const homeDescription =
  "Conserto, formatação, limpeza e upgrade de computadores e notebooks na Freguesia do Ó, em São Paulo. Suporte remoto para todo o Brasil. Fale com a Capucho pelo WhatsApp.";

export const routes = [
  "/",
  ...services.map((s) => `/servicos/${s.slug}`),
  "/gamer",
  "/gamer/monte-seu-pc",
];

const gamerPages = {
  "/gamer": {
    title: "Área Gamer: PC gamer montado e upgrade | Capucho",
    description:
      "PC gamer montado, upgrade de peças, limpeza e formatação na Freguesia do Ó, em São Paulo. Monte seu PC no site e peça o orçamento pelo WhatsApp.",
  },
  "/gamer/monte-seu-pc": {
    title: "Monte seu PC gamer | Capucho Informática",
    description:
      "Escolha processador, placa de vídeo e demais peças com checagem de compatibilidade, veja o total estimado e peça o orçamento com montagem à Capucho.",
  },
};

export function getSeo(pathname) {
  const path = pathname.replace(/\/$/, "") || "/";
  if (path === "/")
    return { path, title: homeTitle, description: homeDescription };
  if (gamerPages[path]) return { path, ...gamerPages[path] };
  const service = services.find((s) => path === `/servicos/${s.slug}`);
  if (service)
    return {
      path,
      service,
      title: service.seoTitle || `${service.title} | Capucho Informática`,
      description: service.seoDescription || service.intro,
    };
  return {
    path,
    title: "Página não encontrada | Capucho Informática",
    description: homeDescription,
    noindex: true,
  };
}

// Dados estruturados (schema.org). Horários conforme o briefing (confirmar antes de publicar).
// Não incluímos nota/avaliações: o Google não exibe estrelas de avaliações publicadas pelo próprio negócio.
function localBusiness(siteUrl) {
  const hours = (days, opens, closes) => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: days,
    opens,
    closes,
  });
  return {
    "@type": "ComputerStore",
    "@id": `${siteUrl}/#empresa`,
    name: business.name,
    description: homeDescription,
    url: siteUrl + "/",
    image: siteUrl + "/assets/fachada.webp",
    logo: siteUrl + "/icon-512.png",
    telephone: business.phoneE164,
    hasMap: maps,
    geo: { "@type": "GeoCoordinates", ...geo },
    address: {
      "@type": "PostalAddress",
      streetAddress: business.street,
      addressLocality: business.city,
      addressRegion: business.state,
      postalCode: business.postalCode,
      addressCountry: "BR",
    },
    areaServed: [
      { "@type": "Place", name: "Freguesia do Ó, São Paulo" },
      { "@type": "Place", name: "Vila Palmeiras, São Paulo" },
      { "@type": "Country", name: "Brasil" },
    ],
    sameAs: [business.instagram, maps],
    openingHoursSpecification: [
      hours(["Monday", "Saturday"], "09:00", "20:00"),
      hours(["Tuesday", "Wednesday", "Thursday", "Friday"], "09:00", "22:00"),
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Serviços de informática",
      itemListElement: services.map((s) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          "@id": `${siteUrl}/servicos/${s.slug}#servico`,
          name: s.title,
        },
      })),
    },
  };
}

function serviceNode(siteUrl, s) {
  return {
    "@type": "Service",
    "@id": `${siteUrl}/servicos/${s.slug}#servico`,
    name: s.title,
    serviceType: s.short,
    description: s.seoDescription || s.intro,
    url: `${siteUrl}/servicos/${s.slug}`,
    image: `${siteUrl}/assets/${s.image}`,
    provider: { "@id": `${siteUrl}/#empresa` },
    areaServed:
      s.slug === "suporte-e-atendimento"
        ? { "@type": "Country", name: "Brasil" }
        : { "@type": "City", name: "São Paulo" },
  };
}

function faqPage(items) {
  return {
    "@type": "FAQPage",
    mainEntity: items.map(([q, a]) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
}

export function jsonLdFor(seo, siteUrl) {
  const graph = [localBusiness(siteUrl)];
  if (seo.path === "/") {
    graph.push(
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#site`,
        url: siteUrl + "/",
        name: business.name,
        inLanguage: "pt-BR",
        publisher: { "@id": `${siteUrl}/#empresa` },
      },
      faqPage(faqs),
    );
  }
  if (seo.service) {
    graph.push(serviceNode(siteUrl, seo.service), faqPage(seo.service.faq), {
      "@type": "BreadcrumbList",
      itemListElement: [
        ["Início", siteUrl + "/"],
        ["Serviços", siteUrl + "/#servicos"],
        [seo.service.short, `${siteUrl}${seo.path}`],
      ].map(([name, item], i) => ({
        "@type": "ListItem",
        position: i + 1,
        name,
        item,
      })),
    });
  }
  return { "@context": "https://schema.org", "@graph": graph };
}
