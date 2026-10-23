import { faqs, legacyHubs, services } from "./content";
import { business, geo, maps } from "./config";

// Títulos com até ~60 caracteres para não serem cortados no Google.
const homeTitle =
  "Assistência técnica de computadores na Freguesia do Ó | Capucho";
const homeDescription =
  "Conserto, formatação, limpeza e upgrade de computadores e notebooks na Freguesia do Ó, em São Paulo. Suporte remoto para todo o Brasil. Fale com a Capucho pelo WhatsApp.";

export const routes = [
  "/",
  "/sobre",
  '/pc-office',
  '/pc-office/monte-seu-pc',
  '/pc-office/mini-pc',
  ...services.map((s) => `/servicos/${s.slug}`),
  "/gamer",
  "/gamer/monte-seu-pc",
  "/gamer/montagem-completa",
  "/gamer/upgrade-de-pecas",
  "/gamer/limpeza-e-pasta-termica",
  "/gamer/formatacao-e-programas",
];

// Endereços antigos mantidos como índice (pré-renderizados, mas fora do sitemap e com noindex).
export const hubRoutes = legacyHubs.map((h) => `/servicos/${h.slug}`);

const gamerPages = {
  '/pc-office': {title:'PC Office: computadores para trabalho | Capucho',description:'Monte seu computador para escritório ou conheça o Mini PC Office. Configurações e orçamento com a Capucho Informática em São Paulo.'},
  '/pc-office/monte-seu-pc': {title:'Monte seu PC Office | Capucho Informática',description:'Escolha processador Intel, placa-mãe DDR3, memória e SSD com verificação de compatibilidade. Solicite seu PC Office montado à Capucho.'},
  '/pc-office/mini-pc': {title:'Mini PC Office: Intel Core i3, i5 e i7 | Capucho',description:'Conheça as versões do Mini PC Office, confira a configuração disponível e peça seu orçamento pelo WhatsApp da Capucho Informática.'},
  "/gamer/formatacao-e-programas": {
    title: "Formatação e programas para PC gamer | Capucho",
    description: "Formatação do PC gamer com backup combinado, instalação do sistema, drivers e programas definidos no orçamento. Solicite uma avaliação à Capucho Informática.",
  },
  "/gamer/limpeza-e-pasta-termica": {
    title: "Limpeza e pasta térmica para PC gamer | Capucho",
    description: "Limpeza interna, pasta térmica, cuidados com a refrigeração e testes do seu PC gamer. Avaliação e orçamento com a Capucho antes do serviço, em São Paulo.",
  },
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
  "/gamer/montagem-completa": {
    title: "Montagem de PC gamer | Capucho Informática",
    description:
      "Escolha as peças do seu PC gamer ou conte com a Capucho para definir a configuração. Montagem e testes antes da entrega, com orçamento pelo WhatsApp.",
  },
  "/gamer/upgrade-de-pecas": {
    title: "Upgrade de peças para PC gamer | Capucho Informática",
    description:
      "Placa de vídeo, processador, memória, SSD, fonte e refrigeração para seu PC gamer. Planeje seu upgrade com a Capucho, com avaliação de compatibilidade e orçamento antes do serviço.",
  },
};

export function getSeo(pathname) {
  const path = pathname.replace(/\/$/, "") || "/";
  if (path === "/sobre") return {
    path,
    title: "Sobre a Capucho | 6 anos cuidando do seu computador",
    description: "Conheça Henrique, os projetos gamer, os consertos e a rotina da Capucho Informática. Acompanhe no Instagram e confira nossa reputação no Google.",
  };
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
  const hub = legacyHubs.find((h) => path === `/servicos/${h.slug}`);
  if (hub)
    return {
      path,
      title: `${hub.title} | Capucho Informática`,
      description: hub.intro,
      noindex: true,
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
    image: `${siteUrl}/assets/${s.image ?? "og-image.jpg"}`,
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
