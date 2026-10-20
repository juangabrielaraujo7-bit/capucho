import { useState } from "react";
import { Link } from "react-router";
import { ArrowRight, ArrowUpRight, Database, Gauge, List, LockKey, Warning, WhatsappLogo, X } from "@phosphor-icons/react";
import "@fontsource/bebas-neue/latin-400.css";
import { asset, business, maps, wa } from "../config";
import "../formatting.css";

const contact = wa("Olá, Capucho! Quero formatar meu PC gamer e instalar programas. Gostaria de combinar o backup dos meus arquivos, o sistema e os programas antes do serviço.");
const evaluation = wa("Olá, Capucho! Quero solicitar uma avaliação para formatação e instalação de programas no meu PC gamer. Podemos combinar backup, sistema, licenças e orçamento?");
const media = name => asset(`formatting/${name}`);
const symptoms = [
  { title: "Lentidão no dia a dia", text: "Programas demoram para abrir e responder.", icon: Gauge },
  { title: "Erros e travamentos", text: "Falhas atrapalham jogos, trabalho e estudo.", icon: Warning },
  { title: "Sistema desorganizado", text: "Arquivos e programas precisam de atenção.", icon: Database },
];
const services = [
  { title: "Backup combinado", text: "Definimos quais arquivos serão preservados.", image: "backup", height: 361 },
  { title: "Instalação do sistema", text: "Versão e licença alinhadas no orçamento.", image: "sistema", height: 367 },
  { title: "Drivers e atualizações", text: "Configuração conforme o equipamento.", image: "drivers", height: 403 },
  { title: "Programas essenciais", text: "Instalamos o que foi combinado.", image: "programas", height: 158 },
];
const steps = ["Entendemos o que você precisa", "Combinamos backup e programas", "Você aprova o orçamento", "Formatamos e conferimos o sistema"];

function FormattingBrand() {
  return <Link to="/" className="fm-brand" aria-label="Capucho Informática, página inicial"><span>CAPUCHO</span><small>INFORMÁTICA</small></Link>;
}

export function FormattingHeader() {
  const [open, setOpen] = useState(false);
  return <header className="fm-header"><div className="fm-container fm-header-inner">
    <FormattingBrand />
    <button className="fm-menu-toggle" type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="formatting-nav" aria-label={open ? "Fechar menu" : "Abrir menu"}>{open ? <X size={26} /> : <List size={26} />}</button>
    <nav id="formatting-nav" className={`fm-nav${open ? " is-open" : ""}`} aria-label="Navegação de formatação e programas">
      <Link to="/gamer" onClick={() => setOpen(false)}>Área gamer</Link>
      <a href="#servico" onClick={() => setOpen(false)}>O serviço</a>
      <a href="#etapas" onClick={() => setOpen(false)}>Como funciona</a>
    </nav>
    <a className="fm-header-contact" href={contact} target="_blank" rel="noopener noreferrer" aria-label="Falar sobre formatação pelo WhatsApp"><WhatsappLogo size={21} /><span>WhatsApp</span></a>
  </div></header>;
}

export function FormattingFooter() {
  return <footer className="fm-footer"><div className="fm-container"><FormattingBrand /><div className="fm-footer-details">
    <Link to="/gamer">Área gamer</Link><a href="#servico">O serviço</a><a href="#etapas">Como funciona</a>
    <a className="fm-footer-contact" href={contact} target="_blank" rel="noopener noreferrer"><WhatsappLogo size={18} /> WhatsApp</a>
  </div><div className="fm-footer-address"><a href={maps} target="_blank" rel="noopener noreferrer">{business.street} · {business.district} · {business.city}</a><span>{business.phone}</span><a href={business.instagram} target="_blank" rel="noopener noreferrer">Instagram <ArrowUpRight size={14} /></a></div></div></footer>;
}

function Environment() {
  return <div className="fm-environment" aria-hidden="true"><span className="fm-leaf fm-leaf--left" /><span className="fm-leaf fm-leaf--right" /><span className="fm-fog" /></div>;
}

function Character({ name, variant, alt, hero = false }) {
  const large = hero ? 800 : 640;
  const small = hero ? 480 : 360;
  return <div className={`fm-character fm-character--${variant}`}><img src={media(`${name}-${large}.webp`)} srcSet={`${media(`${name}-${small}.webp`)} ${small}w, ${media(`${name}-${large}.webp`)} ${large}w`} sizes={hero ? "(max-width: 700px) 250px, 430px" : "(max-width: 700px) 185px, 340px"} width={large} height={large * 1.5} alt={alt} loading={hero ? "eager" : "lazy"} fetchPriority={hero ? "high" : undefined} decoding="async" /><span className="fm-character-fog" aria-hidden="true" /></div>;
}

export default function FormattingPage() {
  return <div className="formatting-page">
    <section className="fm-section fm-hero" aria-labelledby="formatting-title"><Environment />
      <div className="fm-container fm-hero-grid"><div className="fm-hero-copy">
        <nav className="fm-breadcrumb" aria-label="Caminho da página"><Link to="/gamer">Área gamer</Link><span aria-hidden="true">/</span><span>Formatação e programas</span></nav>
        <h1 id="formatting-title"><span>Um novo</span><span>começo</span><em>para o seu PC.</em></h1>
        <p>Sistema organizado para voltar à sua rotina.</p>
        <div className="fm-actions"><a className="fm-button fm-button-primary" href={contact} target="_blank" rel="noopener noreferrer">Quero formatar meu PC <ArrowRight size={19} /></a><a className="fm-button fm-button-outline" href="#servico">Entenda o serviço <ArrowRight size={18} /></a></div>
        <p className="fm-hero-note"><LockKey size={17} aria-hidden="true" />Backup e instalação definidos antes do serviço.</p>
      </div><Character name="dupla-hero" variant="hero" hero alt="Joel e Ellie, personagens do jogo The Last of Us, juntos com suas mochilas" /></div>
    </section>

    <section className="fm-section fm-signals" aria-labelledby="fm-signals-title"><Environment />
      <div className="fm-container fm-signals-grid"><h2 id="fm-signals-title"><span>Seu PC está pedindo</span><span>um recomeço?</span></h2>
        <Character name="ellie-sinais" variant="signals" alt="Ellie com a mão na alça da mochila, voltada para os sinais do sistema" />
        <div className="fm-signals-copy"><ul className="fm-symptoms">{symptoms.map(({ title, text, icon: Icon }) => <li key={title}><Icon size={39} weight="light" aria-hidden="true" /><h3>{title}</h3><p>{text}</p><span className="fm-card-rule" aria-hidden="true" /></li>)}</ul><p className="fm-note">A avaliação identifica se a formatação é indicada.</p></div>
      </div>
    </section>

    <section id="servico" className="fm-section fm-services" aria-labelledby="fm-services-title"><Environment />
      <div className="fm-container"><div className="fm-services-heading"><h2 id="fm-services-title">Preservar o que <em>importa.</em></h2><p>Cada etapa começa com o que você precisa.</p></div>
        <div className="fm-services-grid"><ul className="fm-service-cards">{services.map(({ title, text, image, height }) => <li key={title}><div className="fm-object"><img src={media(`${image}-480.webp`)} width="480" height={height} alt="" loading="lazy" decoding="async" /></div><h3>{title}</h3><p>{text}</p><span className="fm-card-rule" aria-hidden="true" /></li>)}</ul><Character name="joel-servicos" variant="services" alt="Joel em uma pose natural segurando a alça da mochila" /></div>
      </div>
    </section>

    <section id="etapas" className="fm-section fm-process" aria-labelledby="fm-process-title"><Environment />
      <div className="fm-container fm-process-grid"><h2 id="fm-process-title">Um passo de cada vez.</h2><Character name="ellie-etapas" variant="process" alt="Ellie de braços cruzados, ao lado das etapas de formatação" /><div className="fm-process-copy"><ol className="fm-steps">{steps.map((text, index) => <li key={text}><span className="fm-step-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><h3>{text}</h3></li>)}</ol><p className="fm-note">Valores, licenças e prazo confirmados antes de começar.</p></div></div>
    </section>

    <section className="fm-section fm-cta" aria-labelledby="fm-cta-title"><Environment /><div className="fm-container"><h2 id="fm-cta-title">Pronto para um novo começo?</h2><p>Fale com a Capucho e organize o próximo passo.</p><a className="fm-button fm-button-primary" href={evaluation} target="_blank" rel="noopener noreferrer">Solicitar uma avaliação <ArrowRight size={19} /></a></div></section>
  </div>;
}
