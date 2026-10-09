import { Link } from "react-router";
import {
  ArrowLeft,
  ArrowUpRight,
  CheckCircle,
  Globe,
  House,
  Info,
} from "@phosphor-icons/react";
import FaqList from "../components/FaqList";
import WhatsAppButton from "../components/WhatsAppButton";
import { asset, photoSrcSet } from "../config";
import { services } from "../content";

const bySlug = (slug) => services.find((s) => s.slug === slug);

// Página de um serviço: abertura → sinais percebidos → verificações e soluções → aviso (quando
// existe) → dúvidas → contato e serviços relacionados. Conteúdo em src/content.js.
export default function ServicePage({ service }) {
  const related = (service.related ?? []).map(bySlug).filter(Boolean);
  return (
    <>
      <section className="service-hero container">
        <Link className="back-link" to="/#servicos">
          <ArrowLeft />
          Todos os serviços
        </Link>
        <div className={service.image ? "service-hero-grid" : "service-hero-grid is-text"}>
          <div>
            <p className="eyebrow">Serviço</p>
            <h1>{service.title}</h1>
            <p className="hero-description">{service.intro}</p>
            <WhatsAppButton message={service.message} />
          </div>
          {service.image && (
            <div className={service.photo ? "service-hero-media is-photo" : "service-hero-media"}>
              <img
                src={asset(service.image)}
                srcSet={photoSrcSet(service.image)}
                sizes="(max-width: 1023px) calc(100vw - 40px), 50vw"
                alt={service.alt}
                width="1200"
                height="800"
                fetchPriority="high"
              />
            </div>
          )}
        </div>
      </section>

      {service.signs ? (
        <section className="section section-tint">
          <div className="container">
            <div className="signs-panel">
              <h2>{service.signsTitle}</h2>
              <ul>
                {service.signs.map(([title, text]) => (
                  <li key={title}>
                    <CheckCircle size={24} weight="fill" />
                    <div>
                      <h3>{title}</h3>
                      <p>{text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      ) : (
        <section className="section section-tint">
          <div className="container">
            <div className="section-heading">
              <h2>{service.heading}</h2>
            </div>
            <div className="support-grid">
              <article>
                <Globe size={36} />
                <h3>Suporte remoto</h3>
                <p>Atendimento à distância para clientes de todo o Brasil.</p>
                <ul>
                  <li>Instalação e configuração de programas</li>
                  <li>Erros do Windows e de aplicativos</li>
                  <li>Lentidão e remoção de vírus</li>
                  <li>Orientação de uso do computador</li>
                </ul>
                <WhatsAppButton message="Olá, Capucho! Preciso de suporte remoto. Gostaria de explicar meu problema.">
                  Pedir suporte remoto
                </WhatsAppButton>
              </article>
              <article>
                <House size={36} />
                <h3>Atendimento em casa</h3>
                <p>Uma visita com dia e horário combinados pelo WhatsApp.</p>
                <ul>
                  <li>Conte o que acontece com o equipamento</li>
                  <li>Envie seu CEP para consultar a cobertura</li>
                  <li>Confirme as condições e o valor da visita</li>
                  <li>Combine o melhor dia e horário</li>
                </ul>
                <WhatsAppButton message="Olá, Capucho! Quero consultar cobertura, valor e disponibilidade para atendimento em casa.">
                  Consultar visita em casa
                </WhatsAppButton>
              </article>
            </div>
            {service.note && <p className="service-note">{service.note}</p>}
          </div>
        </section>
      )}

      {service.checks && (
        <section className="section container">
          <h2 className="checks-title">{service.checksTitle}</h2>
          <ol className="checks-list">
            {service.checks.map(([title, text]) => (
              <li key={title}>
                <h3>{title}</h3>
                <p>{text}</p>
              </li>
            ))}
          </ol>
          {service.note && (
            <p className="service-note">
              <Info size={22} />
              <span>{service.note}</span>
            </p>
          )}
        </section>
      )}

      <section className="section section-tint">
        <div className="container faq-layout">
          <div>
            <h2>{service.faqTitle}</h2>
            <p className="service-local">{service.local}</p>
          </div>
          <FaqList items={service.faq} />
        </div>
      </section>

      <section className="section related-section">
        <div className="container">
          <div className="service-cta">
            <div>
              <h3>Quer um orçamento para {service.short.charAt(0).toLowerCase() + service.short.slice(1)}?</h3>
              <p>Você recebe o orçamento e aprova antes de o serviço começar.</p>
            </div>
            <WhatsAppButton message={service.message} />
          </div>
          {related.length > 0 && (
            <>
              <h2>Serviços relacionados</h2>
              <div className="related-grid">
                {related.map((s) => (
                  <Link to={`/servicos/${s.slug}`} key={s.slug}>
                    <span>{s.short}</span>
                    <ArrowUpRight />
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
