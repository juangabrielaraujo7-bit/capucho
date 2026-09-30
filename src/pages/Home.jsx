import {
  ArrowRight,
  ArrowUpRight,
  ChatCircleText,
  CheckCircle,
  Clock,
  GameController,
  MapPin,
  Plus,
  ShieldCheck,
} from "@phosphor-icons/react";
import { Link } from "react-router";
import GamerVideo from "../components/GamerVideo";
import GlitchButton from "../components/GlitchButton";
import GradientBand from "../components/GradientBand";
import HeroBackground from "../components/HeroBackground";
import HeroVideo from "../components/HeroVideo";
import ServicesCarousel from "../components/ServicesCarousel";
import WorkShowcase from "../components/WorkShowcase";
import TestimonialsColumns from "../components/TestimonialsColumns";
import WhatsAppButton from "../components/WhatsAppButton";
import { asset, business, mapEmbed, maps } from "../config";
import { faqs, reviews, services, workVideos } from "../content";

export default function Home() {
  return (
    <>
      <HeroBackground>
        <section className="hero container">
          <div className="hero-copy">
            <h1>
              Seu computador em <span>boas mãos</span>
            </h1>
            <p className="hero-description">
              Do conserto ao upgrade, a Capucho cuida do seu computador com
              explicação clara e sem complicação.
            </p>
            <div className="hero-actions">
              <WhatsAppButton />
              <a className="button button-outline" href="#servicos">
                Ver serviços
                <ArrowRight size={20} />
              </a>
              <Link className="gamer-link" to="/gamer">
                Área gamer
                <ArrowUpRight size={18} />
              </Link>
            </div>
          </div>
          <HeroVideo />
        </section>
      </HeroBackground>
      <section id="servicos" className="section section-tint">
        <div className="container">
          <div className="section-heading">
            <h2 className="eyebrow section-label">Serviços</h2>
          </div>
          <ServicesCarousel services={services} />
        </div>
      </section>
      <section className="section container">
        <div className="section-heading">
          <h2>
            Quem cuida do seu PC
            <br className="desktop-break" /> mostra como faz.
          </h2>
          <p>Um pouco do cuidado que acontece por aqui, de perto.</p>
        </div>
        <WorkShowcase items={workVideos} />
      </section>
      <section id="gamer" className="gamer-band">
        <GradientBand>
          <div className="container gamer-section">
            <div className="gamer-copy">
              <GameController size={34} />
              <h2 className="gamer-title">
                Seu <span className="gamer-title-glass">setup gamer</span>
                <br /> começa aqui
              </h2>
              <p>PC gamer montado do seu jeito</p>
              <GlitchButton to="/gamer">
                Acessar Área Gamer
              </GlitchButton>
            </div>
          </div>
          <GamerVideo />
        </GradientBand>
      </section>
      <section id="avaliacoes" className="section container">
        <h2 className="eyebrow section-label is-framed">
          Os clientes dizem: Somos a melhor da região!
        </h2>
        <TestimonialsColumns reviews={reviews}>
          <div className="google-proof">
            <div className="google-badge-wrap">
              <a
                className="google-badge"
                href={maps}
                target="_blank"
                rel="noreferrer"
              >
                <img
                  src={asset("google-reviews.webp")}
                  alt="Avaliações no Google"
                  width="400"
                  height="164"
                  loading="lazy"
                />
              </a>
              <svg
                className="google-arrow"
                viewBox="0 0 170 120"
                aria-hidden="true"
                focusable="false"
              >
                <path d="M6 70 C 30 118, 78 112, 88 78 C 96 50, 66 40, 60 62 C 54 86, 100 104, 158 50" />
                <path d="M136 50 L 160 48 L 154 72" />
              </svg>
            </div>
            <div className="rating">
              <strong>5,0</strong>
              <span>368 avaliações no Google</span>
            </div>
            <a
              className="text-link"
              href={maps}
              target="_blank"
              rel="noreferrer"
            >
              Ver todas no Google
              <ArrowUpRight size={20} />
            </a>
          </div>
        </TestimonialsColumns>
      </section>
      <section id="sobre" className="section section-tint">
        <div className="container about-layout">
          <div>
            <p className="eyebrow">Prazer, somos a Capucho</p>
            <h2>
              Tecnologia faz parte
              <br /> da sua vida.
              <br />
              <span>A gente cuida dela.</span>
            </h2>
          </div>
          <div className="about-copy">
            <p>
              Tem computador que guarda trabalho. Tem notebook que acompanha os
              estudos. E tem aquele PC que é o seu momento de descanso.
            </p>
            <p>
              Aqui, o atendimento começa entendendo a sua rotina. A gente
              avalia, explica o que pode ser feito e conversa sobre o orçamento
              antes de colocar a mão na massa.
            </p>
            <div className="about-values">
              <div>
                <CheckCircle />
                <span>Orçamento aprovado por você</span>
              </div>
              <div>
                <ChatCircleText />
                <span>Explicação clara, do começo ao fim</span>
              </div>
              <div>
                <ShieldCheck />
                <span>Cuidado com cada equipamento</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="contato" className="section container">
        <div className="section-heading">
          <h2>
            Perto de você.
            <br />
            Pronto pra ajudar.
          </h2>
        </div>
        <div className="contact-layout">
          <figure className="storefront">
            <img
              src={asset("fachada.webp")}
              alt="Fachada da Capucho Informática, com a entrada da loja"
              width="1297"
              height="1212"
              loading="lazy"
            />
          </figure>
          <div className="contact-info">
            <h3>Vem falar com a Capucho.</h3>
            <div className="contact-row">
              <MapPin />
              <div>
                <strong>Nosso endereço</strong>
                <p>
                  Rua Antônio de Couros, 461
                  <br />
                  Vila Palmeiras, São Paulo - SP
                  <br />
                  CEP 02726-000
                </p>
                <a
                  className="text-link"
                  href={maps}
                  target="_blank"
                  rel="noreferrer"
                >
                  Como chegar
                  <ArrowUpRight />
                </a>
              </div>
            </div>
            <div className="contact-row">
              <Clock />
              <div>
                <strong>Horários de atendimento</strong>
                <dl className="hours">
                  <div>
                    <dt>Segunda e sábado</dt>
                    <dd>09h às 20h</dd>
                  </div>
                  <div>
                    <dt>Terça a sexta</dt>
                    <dd>09h às 22h</dd>
                  </div>
                  <div>
                    <dt>Domingo</dt>
                    <dd>Fechado</dd>
                  </div>
                </dl>
                <p className="small-note">
                  Confirme o horário pelo WhatsApp antes de vir.
                </p>
              </div>
            </div>
            <WhatsAppButton />
            <a className="phone-link" href={`tel:${business.phoneE164}`}>
              (11) 94700-9632
            </a>
          </div>
        </div>
        <iframe
          className="map"
          title="Localização da Capucho Informática no Google Maps"
          src={mapEmbed}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
        <p className="map-fallback">
          Não carregou o mapa?{" "}
          <a href={maps} target="_blank" rel="noreferrer">
            Veja a rota no Google Maps.
          </a>
        </p>
      </section>
      <section className="section section-tint">
        <div className="container faq-layout">
          <div>
            <h2>
              Ficou alguma
              <br /> dúvida?
            </h2>
            <p>Vamos deixar tudo combinado antes de começar.</p>
          </div>
          <div className="faq-list">
            {faqs.map(([q, a]) => (
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
    </>
  );
}
