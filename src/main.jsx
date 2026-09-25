import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import {
  IconContext,
  WhatsappLogo,
  ArrowUpRight,
  ArrowRight,
  ArrowLeft,
  MapPin,
  Truck,
  ChatCircleText,
  CheckCircle,
  Star,
  List,
  X,
  Play,
  Pause,
  Plus,
  GameController,
  DesktopTower,
  House,
  Globe,
  InstagramLogo,
  Clock,
  ShieldCheck,
} from "@phosphor-icons/react";
import "@fontsource-variable/sora";
import "@fontsource-variable/dm-sans";
import { services, faqs, reviews } from "./content";
import "./styles.css";

const wa = (
  message = "Olá, Capucho! Gostaria de solicitar atendimento para meu computador.",
) => `https://wa.me/5511947009632?text=${encodeURIComponent(message)}`;
const maps =
  "https://www.google.com/maps/search/?api=1&query=" +
  encodeURIComponent(
    "Rua Antônio de Couros, 461, Vila Palmeiras, São Paulo, SP, 02726-000",
  );
const asset = (name) => `/assets/${name}`;
const path = window.location.pathname.replace(/\/$/, "") || "/";
const current = services.find((s) => path === `/servicos/${s.slug}`);

function WhatsAppButton({
  message,
  children = "Falar no WhatsApp",
  secondary = false,
}) {
  return (
    <a
      className={`button ${secondary ? "button-outline" : "button-primary"}`}
      href={wa(message)}
      target="_blank"
      rel="noreferrer"
    >
      <WhatsappLogo size={22} />
      {children}
    </a>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <div className="container header-inner">
        <a
          href="/"
          className="brand"
          aria-label="Capucho Informática, página inicial"
        >
          <img
            src={asset("logo.webp")}
            alt="Capucho Informática"
            width="2048"
            height="698"
          />
        </a>
        <button
          className="menu-toggle"
          type="button"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          aria-controls="main-nav"
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <List />}
        </button>
        <nav
          id="main-nav"
          className={open ? "main-nav is-open" : "main-nav"}
          aria-label="Navegação principal"
        >
          {[
            ["Serviços", "servicos"],
            ["Área gamer", "gamer"],
            ["Avaliações", "avaliacoes"],
            ["Sobre a Capucho", "sobre"],
            ["Contato", "contato"],
          ].map(([label, id]) => (
            <a key={id} href={`/#${id}`} onClick={() => setOpen(false)}>
              {label}
            </a>
          ))}
          <WhatsAppButton />
        </nav>
      </div>
    </header>
  );
}

function ServiceCard({ service, products = false }) {
  const productMessage =
    "Olá, Capucho! Quero consultar computadores, peças e acessórios disponíveis.";
  return (
    <a
      className="service-card"
      href={products ? wa(productMessage) : `/servicos/${service.slug}`}
      {...(products ? { target: "_blank", rel: "noreferrer" } : {})}
    >
      <div className="service-image">
        <img
          src={asset(products ? "produtos.webp" : service.image)}
          alt=""
          loading="lazy"
          width="1536"
          height="1024"
        />
      </div>
      <div className="service-card-content">
        <h3>{products ? "Computadores, peças e acessórios" : service.title}</h3>
        <p>
          {products
            ? "Precisou de uma peça ou acessório? Consulte as opções com a gente."
            : service.description}
        </p>
        <span className="text-link">
          {products ? "Consultar produtos" : "Conhecer o serviço"}
          <ArrowUpRight size={21} />
        </span>
      </div>
    </a>
  );
}

function ServiceVideo({ file, title }) {
  const [started, setStarted] = useState(false);
  const [error, setError] = useState(false);
  const videoRef = React.useRef(null);
  async function start() {
    try {
      await videoRef.current.play();
      setStarted(true);
    } catch {
      setError(true);
    }
  }
  return (
    <article className="video-card">
      <div className="video-frame">
        <video
          ref={videoRef}
          src={asset(`${file}.mp4`)}
          poster={asset(`${file}.webp`)}
          muted
          playsInline
          controls={started}
          preload="none"
          aria-label={title}
          onEnded={() => setStarted(false)}
          onError={() => setError(true)}
        />
        {!started && !error && (
          <button
            className="play-button"
            onClick={start}
            aria-label={`Reproduzir: ${title}`}
          >
            <Play weight="fill" size={24} />
          </button>
        )}
        {error && (
          <div className="video-error">
            Não foi possível reproduzir.
            <a href={asset(`${file}.mp4`)}>Abrir o vídeo</a>
          </div>
        )}
      </div>
      <h3>{title}</h3>
    </article>
  );
}

function HeroVideo() {
  const ref = React.useRef(null);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  React.useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      setReduceMotion(preference.matches);
      if (preference.matches) ref.current?.pause();
    };
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);
  async function toggle() {
    if (!ref.current) return;
    if (!ref.current.paused) ref.current.pause();
    else {
      try {
        await ref.current.play();
      } catch {
        setFailed(true);
      }
    }
  }
  return (
    <div className="hero-visual">
      {failed ? (
        <img
          src={asset("notebook.webp")}
          alt="Notebook Capucho Informática"
          width="1200"
          height="675"
        />
      ) : (
        <>
          <video
            ref={ref}
            src={asset("hero-montagem.mp4")}
            poster={asset("notebook.webp")}
            autoPlay={!reduceMotion}
            loop
            muted
            playsInline
            preload={reduceMotion ? "none" : "auto"}
            width="1920"
            height="1080"
            aria-label="Animação de montagem do notebook Capucho Informática"
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onError={() => setFailed(true)}
          />
          <button
            className="hero-video-toggle"
            type="button"
            onClick={toggle}
            aria-label={
              playing
                ? "Pausar vídeo de montagem"
                : "Reproduzir vídeo de montagem"
            }
          >
            {playing ? <Pause size={17} /> : <Play size={17} />}
            <span>{playing ? "Pausar vídeo" : "Reproduzir vídeo"}</span>
          </button>
        </>
      )}
    </div>
  );
}

function Home() {
  return (
    <>
      <section className="hero container">
        <div className="hero-copy">
          <p className="eyebrow">Seu PC em boas mãos</p>
          <h1>
            Seu computador pronto pra <span>acompanhar você</span>
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
            <a className="gamer-link" href="#gamer">
              Área gamer
              <ArrowUpRight size={18} />
            </a>
          </div>
        </div>
        <HeroVideo />
      </section>
      <div className="benefits">
        <div className="container benefits-grid">
          <div>
            <MapPin />
            <span>Freguesia do Ó e região</span>
          </div>
          <div>
            <Truck />
            <span>Retirada e entrega sob consulta de CEP</span>
          </div>
          <div>
            <ChatCircleText />
            <span>Você acompanha pelo WhatsApp</span>
          </div>
        </div>
      </div>
      <section id="servicos" className="section section-tint">
        <div className="container">
          <div className="section-heading">
            <p className="eyebrow">Como podemos ajudar?</p>
            <h2>
              Do conserto ao upgrade,
              <br className="desktop-break" /> pode contar com a Capucho.
            </h2>
          </div>
          <div className="services-grid">
            {services.map((s) => (
              <ServiceCard key={s.slug} service={s} />
            ))}
            <ServiceCard products />
          </div>
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
        <div className="videos-grid">
          <ServiceVideo file="troca-tela" title="Troca de tela de notebook" />
          <ServiceVideo
            file="limpeza"
            title="Limpeza e manutenção de notebook"
          />
          <ServiceVideo
            file="montagem"
            title="Reparo de componentes e montagem"
          />
        </div>
      </section>
      <section id="gamer" className="container gamer-section">
        <div className="gamer-copy">
          <GameController size={38} />
          <h2>
            Seu próximo nível
            <br /> começa no PC.
          </h2>
          <p>
            Montagem, upgrades e cuidado com seu setup. Conte o que você joga e
            vamos conversar sobre as possibilidades.
          </p>
          <WhatsAppButton message="Olá, Capucho! Quero conversar sobre meu PC gamer.">
            Conversar sobre meu PC gamer
          </WhatsAppButton>
          <p className="small-note">
            A página da área gamer está em preparação. O atendimento já está
            disponível pelo WhatsApp.
          </p>
        </div>
        <img
          src={asset("upgrade.webp")}
          alt="Ilustração de PC com componentes para montagem e upgrade"
          width="1536"
          height="1024"
          loading="lazy"
        />
      </section>
      <section id="avaliacoes" className="section container">
        <div className="review-heading">
          <h2>
            Quem já contou com a<br className="desktop-break" /> Capucho, conta
            aqui.
          </h2>
          <div className="rating">
            <strong>5,0</strong>
            <div>
              <Stars />
              <span>366 avaliações no Google</span>
              <small>Dados recebidos em 25/09/2026</small>
            </div>
          </div>
        </div>
        <div className="reviews-grid">
          {reviews.map((r) => (
            <article className="review" key={r.name}>
              <Stars />
              <blockquote>“{r.quote}”</blockquote>
              <details className="review-detail">
                <summary>Ler mais do comentário</summary>
                <p>{r.detail}</p>
              </details>
              <div className="review-author">
                <span className="initials">{r.initials}</span>
                <div>
                  <strong>{r.name}</strong>
                  <span>Avaliação no Google</span>
                </div>
              </div>
            </article>
          ))}
        </div>
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
            <a className="phone-link" href="tel:+5511947009632">
              (11) 94700-9632
            </a>
          </div>
        </div>
        <iframe
          className="map"
          title="Localização da Capucho Informática no Google Maps"
          src={`https://maps.google.com/maps?q=${encodeURIComponent("Rua Antônio de Couros, 461, Vila Palmeiras, São Paulo")}&output=embed`}
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

function Stars() {
  return (
    <div className="stars" role="img" aria-label="5 de 5 estrelas">
      {[0, 1, 2, 3, 4].map((n) => (
        <Star key={n} size={17} weight="fill" />
      ))}
    </div>
  );
}

function ServicePage({ service }) {
  return (
    <>
      <section className="service-hero container">
        <a className="back-link" href="/#servicos">
          <ArrowLeft />
          Todos os serviços
        </a>
        <div className="service-hero-grid">
          <div>
            <p className="eyebrow">Capucho cuida</p>
            <h1>{service.title}</h1>
            <p className="hero-description">{service.intro}</p>
            <WhatsAppButton message={service.message} />
          </div>
          <img
            src={asset(service.image)}
            alt={service.alt}
            width="1536"
            height="1024"
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
      <section className="section related-section">
        <div className="container">
          <h2>Seu PC também pode precisar de…</h2>
          <div className="related-grid">
            {services
              .filter((s) => s.slug !== service.slug)
              .slice(0, 3)
              .map((s) => (
                <a href={`/servicos/${s.slug}`} key={s.slug}>
                  <span>{s.short}</span>
                  <ArrowUpRight />
                </a>
              ))}
          </div>
        </div>
      </section>
    </>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <a href="/" className="footer-brand">
            CAPUCHO<span>Informática</span>
          </a>
          <p>
            Seu computador pronto
            <br />
            pra acompanhar você.
          </p>
        </div>
        <div>
          <h3>Explore</h3>
          <a href="/#servicos">Serviços</a>
          <a href="/#gamer">Área gamer</a>
          <a href="/#sobre">Sobre a Capucho</a>
          <a href="/#avaliacoes">Avaliações</a>
        </div>
        <div>
          <h3>Fale com a gente</h3>
          <a href={wa()} target="_blank" rel="noreferrer">
            WhatsApp: (11) 94700-9632
          </a>
          <a
            href="https://www.instagram.com/capucho_informatica/"
            target="_blank"
            rel="noreferrer"
          >
            <InstagramLogo size={19} />
            capucho_informatica
          </a>
          <a href={maps} target="_blank" rel="noreferrer">
            Rua Antônio de Couros, 461
            <br />
            Vila Palmeiras, São Paulo - SP
          </a>
        </div>
      </div>
      <div className="container footer-bottom">
        © {new Date().getFullYear()} Capucho Informática. Todos os direitos
        reservados.
      </div>
    </footer>
  );
}

function App() {
  React.useEffect(() => {
    document.title = current
      ? `${current.title} | Capucho Informática`
      : "Capucho Informática | Seu computador pronto pra acompanhar você";
    if (current)
      document.querySelector('meta[name="description"]').content =
        current.intro;
    if (window.location.hash)
      requestAnimationFrame(() =>
        document
          .getElementById(window.location.hash.slice(1))
          ?.scrollIntoView(),
      );
  }, []);
  return (
    <IconContext.Provider value={{ size: 24, weight: "regular" }}>
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      <Header />
      <main id="conteudo">
        {current ? (
          <ServicePage service={current} />
        ) : path === "/" ? (
          <Home />
        ) : (
          <section className="container section not-found">
            <h1>Página não encontrada.</h1>
            <p>
              Encontre o atendimento que você precisa na nossa página inicial.
            </p>
            <a href="/" className="button button-primary">
              Voltar para o início
            </a>
          </section>
        )}
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

createRoot(document.getElementById("root")).render(<App />);
