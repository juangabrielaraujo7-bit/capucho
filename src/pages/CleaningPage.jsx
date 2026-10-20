import { useState } from "react";
import { Link } from "react-router";
import { ArrowRight, ArrowUpRight, ChatCircle, ClipboardText, Fan, Gear, List, MagnifyingGlass, Thermometer, WhatsappLogo, Wind, X } from "@phosphor-icons/react";
import "@fontsource/alfa-slab-one/latin-400.css";
import { asset, business, maps, wa } from "../config";
import "../cleaning.css";

const contact = wa("Olá, Capucho! Quero cuidar do meu PC gamer com limpeza e pasta térmica. Gostaria de uma avaliação do equipamento e um orçamento do serviço.");
const booking = wa("Olá, Capucho! Quero agendar uma avaliação para limpeza e troca de pasta térmica do meu PC gamer. Como funciona o atendimento?");
const media = name => asset(`cleaning/${name}`);
const symptoms = [
  { title: "Temperatura elevada", text: "O PC esquenta mais durante o uso.", icon: Thermometer },
  { title: "Ventoinhas barulhentas", text: "O ruído aumenta durante jogos e tarefas.", icon: Fan },
  { title: "Poeira acumulada", text: "Entradas de ar e componentes precisam de atenção.", icon: Wind },
];
const care = [
  { title: "Limpeza interna", text: "Remoção cuidadosa da poeira.", image: "limpeza" },
  { title: "Troca de pasta térmica", text: "Aplicação conforme a necessidade do equipamento.", image: "pasta-termica" },
  { title: "Cuidados com a refrigeração", text: "Conferência de ventoinhas e circulação de ar.", image: "refrigeracao" },
  { title: "Testes após o serviço", text: "Verificação do funcionamento e das temperaturas.", image: "testes" },
];
const steps = [
  { text: "Conte o que está acontecendo", icon: ChatCircle },
  { text: "Avaliamos seu equipamento", icon: MagnifyingGlass },
  { text: "Você aprova o orçamento", icon: ClipboardText },
  { text: "Limpamos e conferimos o conjunto", icon: Gear },
];

function CleaningBrand() {
  return <Link to="/" className="cl-brand" aria-label="Capucho Informática, página inicial"><span>CAPUCHO</span><small>INFORMÁTICA</small></Link>;
}

export function CleaningHeader() {
  const [open, setOpen] = useState(false);
  return <header className="cl-header"><div className="cl-container cl-header-inner">
    <CleaningBrand />
    <button className="cl-menu-toggle" type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="cleaning-nav" aria-label={open ? "Fechar menu" : "Abrir menu"}>{open ? <X size={26} /> : <List size={26} />}</button>
    <nav id="cleaning-nav" className={`cl-nav${open ? " is-open" : ""}`} aria-label="Navegação de limpeza e pasta térmica">
      <Link to="/gamer" onClick={() => setOpen(false)}>Área gamer</Link>
      <a href="#cuidados" onClick={() => setOpen(false)}>O serviço</a>
      <a href="#etapas" onClick={() => setOpen(false)}>Como funciona</a>
    </nav>
    <a className="cl-header-contact" href={contact} target="_blank" rel="noopener noreferrer" aria-label="Falar sobre limpeza pelo WhatsApp"><WhatsappLogo size={21} /><span>WhatsApp</span></a>
  </div></header>;
}

export function CleaningFooter() {
  return <footer className="cl-footer"><div className="cl-container"><CleaningBrand /><p>Área gamer · {business.city}</p><div className="cl-footer-details">
    <a href={maps} target="_blank" rel="noopener noreferrer">{business.street} · {business.district}</a>
    <a href={contact} target="_blank" rel="noopener noreferrer">{business.phone}</a>
    <a href={business.instagram} target="_blank" rel="noopener noreferrer">Instagram <ArrowUpRight size={14} /></a>
  </div></div></footer>;
}

function Arthur({ name, variant, hero = false, alt }) {
  const large = hero ? 720 : 620;
  const small = hero ? 420 : 360;
  return <div className={`cl-character cl-character--${variant}`}>
    <img src={media(`${name}-${large}.webp`)} srcSet={`${media(`${name}-${small}.webp`)} ${small}w, ${media(`${name}-${large}.webp`)} ${large}w`} sizes={hero ? "(max-width: 700px) 220px, 380px" : "(max-width: 700px) 190px, 320px"} width={large} height={large * 1.5} alt={alt} loading={hero ? "eager" : "lazy"} fetchPriority={hero ? "high" : undefined} decoding="async" />
    <span className="cl-character-dust" aria-hidden="true" />
  </div>;
}

export default function CleaningPage() {
  return <div className="cleaning-page">
    <section className="cl-section cl-hero" aria-labelledby="cleaning-title">
      <div className="cl-container cl-hero-grid">
        <div className="cl-hero-copy">
          <nav className="cl-breadcrumb" aria-label="Caminho da página"><Link to="/gamer">Área gamer</Link><span aria-hidden="true">/</span><span>Limpeza e pasta térmica</span></nav>
          <h1 id="cleaning-title"><span>Até os mais fortes</span><span>precisam de</span><em>cuidado.</em></h1>
          <p>Limpeza e pasta térmica para cuidar do seu PC gamer.</p>
          <div className="cl-actions"><a className="cl-button cl-button-primary" href={contact} target="_blank" rel="noopener noreferrer">Quero cuidar do meu PC <ArrowRight size={20} /></a><a className="cl-button cl-button-outline" href="#cuidados">Entenda o serviço</a></div>
        </div>
        <Arthur name="arthur-hero" variant="hero" hero alt="Arthur Morgan de chapéu e jaqueta, ao lado da apresentação do serviço" />
      </div>
    </section>

    <section className="cl-section cl-signals" aria-labelledby="cl-signals-title">
      <div className="cl-container cl-signals-grid">
        <h2 id="cl-signals-title">O desgaste deixa <em>sinais.</em></h2>
        <Arthur name="arthur-sinais" variant="signals" alt="Arthur Morgan ao lado dos sinais de que o PC precisa de cuidados" />
        <div className="cl-signals-copy"><ul className="cl-symptoms">{symptoms.map(({ title, text, icon: Icon }) => <li key={title}><Icon className="cl-symptom-icon" size={48} weight="light" aria-hidden="true" /><div><h3>{title}</h3><p>{text}</p></div></li>)}</ul><p className="cl-note">Esses sinais também podem ter outras causas. A avaliação orienta o serviço.</p></div>
      </div>
    </section>

    <section id="cuidados" className="cl-section cl-care" aria-labelledby="cl-care-title">
      <div className="cl-container">
        <h2 id="cl-care-title">Cuidado em cada <em>detalhe.</em></h2>
        <div className="cl-care-grid">
          <div className="cl-care-content"><ul className="cl-care-cards">{care.map(({ title, text, image }) => <li key={title}><img src={media(`${image}-600.webp`)} srcSet={`${media(`${image}-360.webp`)} 360w, ${media(`${image}-600.webp`)} 600w`} sizes="(max-width: 480px) calc(100vw - 48px), (max-width: 700px) 42vw, 320px" width="600" height="450" alt="" loading="lazy" decoding="async" /><div><h3>{title}</h3><p>{text}</p></div></li>)}</ul><p className="cl-photo-note">Imagens ilustrativas dos cuidados realizados.</p></div>
          <Arthur name="arthur-cuidados" variant="care" alt="Arthur Morgan apresentando os cuidados com o computador" />
        </div>
      </div>
    </section>

    <section id="etapas" className="cl-section cl-process" aria-labelledby="cl-process-title">
      <div className="cl-container cl-process-grid">
        <h2 id="cl-process-title">Sem atalhos. Sem <em>descuido.</em></h2>
        <Arthur name="arthur-sinais" variant="process" alt="Arthur Morgan ao lado das etapas do atendimento" />
        <div className="cl-process-copy"><ol className="cl-steps">{steps.map(({ text, icon: Icon }, index) => <li key={text}><span className="cl-step-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><Icon size={25} weight="light" aria-hidden="true" /><h3>{text}</h3></li>)}</ol><p className="cl-note">Escopo, valor e prazo confirmados antes do serviço.</p></div>
      </div>
    </section>

    <section className="cl-section cl-cta" aria-labelledby="cl-cta-title"><div className="cl-container"><h2 id="cl-cta-title"><span>Pronto para</span><span>mais uma jornada?</span></h2><p>Cuide do seu PC antes da próxima partida.</p><a className="cl-button cl-button-primary" href={booking} target="_blank" rel="noopener noreferrer">Agendar uma avaliação <ArrowRight size={20} /></a></div></section>
  </div>;
}

