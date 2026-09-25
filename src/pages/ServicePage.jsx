import { Link } from "react-router";
import {
  ArrowLeft,
  ArrowUpRight,
  ChatCircleText,
  CheckCircle,
  DesktopTower,
  Globe,
  House,
  Plus,
} from "@phosphor-icons/react";
import WhatsAppButton from "../components/WhatsAppButton";
import { asset, photoSrcSet } from "../config";
import { services } from "../content";

export default function ServicePage({ service }) {
  return (
    <>
      <section className="service-hero container">
        <Link className="back-link" to="/#servicos">
          <ArrowLeft />
          Todos os serviços
        </Link>
        <div className="service-hero-grid">
          <div>
            <p className="eyebrow">Capucho cuida</p>
            <h1>{service.title}</h1>
            <p className="hero-description">{service.intro}</p>
            <WhatsAppButton message={service.message} />
          </div>
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
      </section>
      <section className="section section-tint">
        <div className="container">
          <div className="section-heading">
            <h2>{service.heading}</h2>
          </div>
          {service.slug === "suporte-e-atendimento" ? (
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
          ) : (
            <div className="problem-grid">
              {service.groups.map(([title, body]) => (
                <article key={title}>
                  <CheckCircle size={26} />
                  <div>
                    <h3>{title}</h3>
                    <p>{body}</p>
                  </div>
                </article>
              ))}
            </div>
          )}
          <p className="service-note">{service.note}</p>
        </div>
      </section>
      <section className="section container">
        <div className="section-heading">
          <h2>
            Sem complicação.
            <br />
            Tudo combinado com você.
          </h2>
        </div>
        <div className="process-grid">
          <article>
            <ChatCircleText />
            <h3>Conte o que precisa</h3>
            <p>
              Explique o problema ou o que você quer melhorar. Se souber, envie
              o modelo do computador.
            </p>
          </article>
          <article>
            <DesktopTower />
            <h3>A gente avalia</h3>
            <p>
              Entendemos o caso e explicamos o serviço indicado, com orçamento e
              prazo.
            </p>
          </article>
          <article>
            <CheckCircle />
            <h3>Você aprova, a gente cuida</h3>
            <p>
              O serviço começa com a sua aprovação. E você acompanha o
              atendimento pelo WhatsApp.
            </p>
          </article>
        </div>
        <div className="service-cta">
          <div>
            <h3>Vamos cuidar do seu computador?</h3>
            <p>O primeiro passo é uma conversa.</p>
          </div>
          <WhatsAppButton message={service.message} />
        </div>
      </section>
      <section className="section section-tint">
        <div className="container faq-layout">
          <div>
            <h2>{service.faqTitle}</h2>
            <p className="service-local">{service.local}</p>
          </div>
          <div className="faq-list">
            {service.faq.map(([q, a]) => (
              <details key={q}>
                <summary>
                  {q}
                  <Plus size={21} />
                </summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
      <section className="section related-section">
        <div className="container">
          <h2>Seu PC também pode precisar de…</h2>
          <div className="related-grid">
            {services
              .filter((s) => s.slug !== service.slug)
              .slice(0, 3)
              .map((s) => (
                <Link to={`/servicos/${s.slug}`} key={s.slug}>
                  <span>{s.short}</span>
                  <ArrowUpRight />
                </Link>
              ))}
          </div>
        </div>
      </section>
    </>
  );
}
