import { useState } from "react";
import { Link } from "react-router";
import { ArrowRight, ArrowUpRight, Briefcase, Coins, GameController, Gear, Info, List, Monitor, WhatsappLogo, X } from "@phosphor-icons/react";
import "@fontsource-variable/cinzel";
import FaqList from "../components/FaqList";
import { asset, business, maps, wa } from "../config";
import "../assembly.css";

const builderPath = "/gamer/monte-seu-pc";
const helpLink = wa("Olá, Capucho! Quero ajuda para montar meu PC gamer. Gostaria de conversar sobre meus jogos, meu monitor e meu orçamento para definir uma configuração compatível.");
const media = name => asset(`assembly/${name}`);
const goals = [
  { title: "Seus jogos", text: "Quais jogos você quer rodar? Vamos começar por eles.", icon: GameController },
  { title: "Seu monitor", text: "Resolução e taxa de atualização ajudam a orientar as escolhas.", icon: Monitor },
  { title: "Além dos jogos", text: "Trabalho, estudo, edição ou lives também entram no plano.", icon: Briefcase },
  { title: "Seu orçamento", text: "Definimos as prioridades para o seu investimento.", icon: Coins },
];
const parts = [
  { title: "Processador", text: "Define o desempenho geral e precisa ser compatível com a placa-mãe.", image: "processador", height: 484 },
  { title: "Placa de vídeo", text: "Responsável pelos gráficos dos seus jogos; também exige compatibilidade.", image: "placa-video", height: 465 },
  { title: "Memória RAM", text: "Mais fluidez para jogos e outras tarefas, sempre na configuração ideal.", image: "memoria", height: 454 },
  { title: "SSD", text: "Deixa o sistema e os jogos muito mais rápidos, com o tipo e a capacidade certos.", image: "ssd", height: 410 },
  { title: "Fonte", text: "Fornece energia estável e segura para todo o sistema, com a potência adequada.", image: "fonte", height: 464 },
  { title: "Refrigeração e gabinete", text: "Mantêm as temperaturas ideais e garantem um conjunto bonito e bem ventilado.", image: "refrigeracao", height: 485 },
];
const steps = [
  ["Escolha seu caminho", "Use o montador ou peça ajuda para definir a configuração."],
  ["Confira o conjunto", "Confirmamos compatibilidade, disponibilidade, valor e prazo."],
  ["Aprove o orçamento", "A montagem começa com a sua aprovação."],
  ["Preparação e entrega", "Montamos e testamos o computador antes da entrega."],
];
// Condições já publicadas preservadas da implementação anterior.
const faq = [
  ["Posso levar peças que já comprei?", "Sim. A Capucho verifica a compatibilidade e as condições das peças antes de realizar a montagem."],
  ["Vocês me ajudam a escolher os componentes?", "Sim. Conte quais jogos e programas pretende usar, qual monitor tem e quanto quer investir. A gente ajuda a avaliar a configuração."],
  ["O preço do montador é definitivo?", "Não. Os valores são estimados. O orçamento final e a disponibilidade das peças são confirmados pelo WhatsApp antes da aprovação."],
  ["Qual é o prazo para a montagem?", "O prazo é informado junto com o orçamento, considerando a configuração e a disponibilidade das peças."],
  ["A montagem é cobrada à parte?", "Não, se você comprar as peças com a Capucho: nesse caso, a montagem é gratuita. Se você já tem os componentes, o valor da montagem é informado no orçamento."],
  ["O Windows e os programas já vêm instalados?", "Sim. O PC sai da loja com o Windows licenciado e os programas instalados, pronto para usar."],
];

function AssemblyBrand() {
  return <Link to="/" className="asm-brand" aria-label="Capucho Informática, página inicial"><img src={asset("logo-400.webp")} srcSet={`${asset("logo-400.webp")} 400w, ${asset("logo.webp")} 600w`} sizes="180px" width="600" height="204" alt="Capucho Informática" /></Link>;
}

export function AssemblyHeader() {
  const [open, setOpen] = useState(false);
  return <header className="asm-header"><div className="asm-container asm-header-inner">
    <AssemblyBrand />
    <button className="asm-menu-toggle" type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="assembly-nav" aria-label={open ? "Fechar menu" : "Abrir menu"}>{open ? <X size={26} /> : <List size={26} />}</button>
    <nav id="assembly-nav" className={`asm-nav${open ? " is-open" : ""}`} aria-label="Navegação da montagem de PC"><Link to="/gamer" onClick={() => setOpen(false)}>Área gamer</Link><a href="#montagem" onClick={() => setOpen(false)}>A montagem</a><a href="#como-funciona" onClick={() => setOpen(false)}>Como funciona</a></nav>
    <a className="asm-header-contact" href={helpLink} target="_blank" rel="noopener noreferrer" aria-label="Falar no WhatsApp sobre montagem"><WhatsappLogo size={20} /><span>Falar no WhatsApp</span></a>
  </div></header>;
}

export function AssemblyFooter() {
  return <footer className="asm-footer"><div className="asm-container"><AssemblyBrand /><p>Área gamer · {business.city}</p><div className="asm-footer-details"><a href={maps} target="_blank" rel="noopener noreferrer">{business.street} · {business.district}</a><a href={helpLink} target="_blank" rel="noopener noreferrer">{business.phone}</a><a href={business.instagram} target="_blank" rel="noopener noreferrer">Instagram <ArrowUpRight size={14} /></a></div></div></footer>;
}

function Actions() {
  return <div className="asm-actions"><Link className="asm-button asm-button-primary" to={builderPath}>Escolher minhas peças <ArrowRight size={19} /></Link><a className="asm-button asm-button-ghost" href={helpLink} target="_blank" rel="noopener noreferrer">Quero ajuda para montar</a></div>;
}

function Ornament() {
  return <span className="asm-ornament" aria-hidden="true"><svg viewBox="0 0 240 14" fill="none"><path d="M0 7h14m8 0h218M18 1v12M12 7l6-5 6 5-6 5z" stroke="currentColor" strokeWidth="1" /></svg></span>;
}

function Atmosphere() {
  return <div className="asm-atmosphere" aria-hidden="true"><span className="asm-embers" /><span className="asm-ground-fog" /></div>;
}

function Character({ name, variant, alt, hero = false }) {
  const large = hero ? 800 : 640;
  const small = hero ? 480 : 360;
  return <div className={`asm-character asm-character--${variant}${hero ? " asm-hero-art" : ""}`}><img src={media(`${name}-${large}.webp`)} srcSet={`${media(`${name}-${small}.webp`)} ${small}w, ${media(`${name}-${large}.webp`)} ${large}w`} sizes={hero ? "(max-width: 600px) 280px, (max-width: 900px) 360px, 40vw" : "(max-width: 900px) 180px, 340px"} width={large} height={hero ? 667 : 960} alt={alt} loading={hero ? "eager" : "lazy"} fetchPriority={hero ? "high" : undefined} decoding="async" /><span className="asm-character-fog" aria-hidden="true" /></div>;
}

export default function AssemblyPage() {
  return <div className="assembly-page">
    <section className="asm-section asm-hero asm-dark" aria-labelledby="asm-hero-title"><Atmosphere /><div className="asm-container asm-hero-grid"><div className="asm-hero-copy">
      <nav className="asm-breadcrumb" aria-label="Caminho da página"><Link to="/gamer">Área gamer</Link><span aria-hidden="true">/</span><span>Montagem completa</span></nav>
      <h1 id="asm-hero-title"><span>Seu próximo PC</span><span>começa com as</span><em>escolhas certas.</em></h1><Ornament /><Actions /><p className="asm-perk"><Gear size={20} aria-hidden="true" /><span>Montagem grátis comprando as peças com a Capucho.</span></p>
    </div><Character name="dupla-hero" variant="hero" hero alt="Kratos de barba cheia e Atreus adolescente sem barba, juntos em uma pose natural" /></div></section>

    <section id="objetivos" className="asm-section asm-goals asm-light" aria-labelledby="asm-goals-title"><Atmosphere /><div className="asm-container asm-goals-grid"><div className="asm-goals-heading"><h2 id="asm-goals-title">Que jornada você quer encarar?</h2><Ornament /></div><Character name="atreus-objetivos" variant="goals" alt="Atreus adolescente sem barba, segurando a alça da roupa e olhando para os objetivos à direita" /><ul className="asm-goal-cards">{goals.map(({ title, text, icon: Icon }) => <li key={title}><Icon size={30} weight="regular" aria-hidden="true" /><h3>{title}</h3><p>{text}</p></li>)}</ul></div></section>

    <section id="montagem" className="asm-section asm-parts asm-dark" aria-labelledby="asm-parts-title"><Atmosphere /><div className="asm-container"><h2 id="asm-parts-title">Força sozinha <em>não resolve.</em></h2><Ornament /><div className="asm-parts-grid"><div className="asm-parts-content"><ul className="asm-part-cards">{parts.map(({ title, text, image, height }) => <li className="asm-forge-card" key={title}><div className="asm-part-image"><img src={asset(`upgrade/${image}-480.webp`)} width="480" height={height} alt="" loading="lazy" decoding="async" /></div><div><h3>{title}</h3><p>{text}</p></div></li>)}</ul><p className="asm-illustrative">Componentes ilustrativos, sem oferta de modelos específicos.</p></div><Character name="kratos-componentes" variant="parts" alt="Kratos com barba cheia em uma pose natural, à direita dos componentes" /></div></div></section>

    <section id="como-funciona" className="asm-section asm-process asm-light" aria-labelledby="asm-process-title"><Atmosphere /><div className="asm-container"><div className="asm-process-grid"><div className="asm-process-heading"><h2 id="asm-process-title"><span>Um plano claro</span><span>antes de começar.</span></h2><Ornament /></div><Character name="kratos-etapas" variant="process" alt="Kratos de barba cheia com a mão junto ao peito, em uma pose tranquila ao lado das etapas" /><div className="asm-process-copy"><ol className="asm-steps">{steps.map(([title, text], index) => <li key={title}><span className="asm-step-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><div><h3>{title}</h3><p>{text}</p></div></li>)}</ol><p className="asm-note"><Info size={18} aria-hidden="true" />Valores estimados. Confirmação final pelo WhatsApp.</p></div></div><div className="asm-faq" aria-labelledby="asm-faq-title"><h3 id="asm-faq-title">Antes de montar, tire suas dúvidas.</h3><FaqList items={faq} name="faq-montagem" /></div></div></section>

    <section className="asm-section asm-final asm-dark" aria-labelledby="asm-final-title"><Atmosphere /><div className="asm-container"><h2 id="asm-final-title"><span>Vamos montar</span><span>seu próximo PC?</span></h2><Ornament /><Actions /><p className="asm-perk"><Gear size={20} aria-hidden="true" /><span>Comprando as peças com a Capucho, a montagem não tem custo.</span></p></div></section>
  </div>;
}
