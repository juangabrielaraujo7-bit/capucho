import { useState } from "react";
import { Link } from "react-router";
import { ArrowRight, ArrowUpRight, List, X, Monitor, SpinnerGap, Warning, WhatsappLogo } from "@phosphor-icons/react";
import "@fontsource/bebas-neue/latin-400.css";
import { asset, business, maps, wa } from "../config";
import "../upgrade.css";

const upgradeContact = wa("Olá, Capucho! Quero fazer um upgrade no meu PC gamer. Gostaria de avaliar minha configuração e as peças compatíveis para melhorar o desempenho.");
const planningContact = wa("Olá, Capucho! Quero planejar um upgrade no meu PC. Podem me ajudar a definir por onde começar, de acordo com minha configuração e meu orçamento?");
const media = name => asset(`upgrade/${name}`);

const symptoms = [
  { title: "Quedas de FPS", text: "Menos fluidez durante as partidas.", icon: Monitor },
  { title: "Carregamentos lentos", text: "Mais espera para abrir jogos e programas.", icon: SpinnerGap },
  { title: "Travamentos", text: "Dificuldade ao usar várias tarefas.", icon: Warning },
];
const components = [
  { title: "Placa de vídeo", text: "Mais potencial gráfico.", image: "placa-video", height: 465 },
  { title: "Processador", text: "Equilíbrio para jogos e tarefas.", image: "processador", height: 484 },
  { title: "Memória RAM", text: "Mais espaço para trabalhar.", image: "memoria", height: 454 },
  { title: "SSD", text: "Agilidade para jogos e arquivos.", image: "ssd", height: 410 },
  { title: "Fonte", text: "Energia adequada ao conjunto.", image: "fonte", height: 464 },
  { title: "Refrigeração", text: "Temperaturas sob controle.", image: "refrigeracao", height: 485 },
];
const steps = ["Conte o que você quer melhorar", "Avaliamos sua configuração", "Você aprova o orçamento", "Instalamos e testamos"];

function UpgradeBrand() {
  return <Link to="/" className="up-brand" aria-label="Capucho Informática, página inicial"><span>CAPUCHO</span><small>INFORMÁTICA</small></Link>;
}

export function UpgradeHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="up-header">
      <div className="up-container up-header-inner">
        <UpgradeBrand />
        <button className="up-menu-toggle" type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="upgrade-nav" aria-label={open ? "Fechar menu" : "Abrir menu"}>{open ? <X size={26} /> : <List size={26} />}</button>
        <nav id="upgrade-nav" className={`up-nav${open ? " is-open" : ""}`} aria-label="Navegação de upgrades">
          <Link to="/gamer" onClick={() => setOpen(false)}>Área gamer</Link>
          <a href="#possibilidades" className="is-current" onClick={() => setOpen(false)}>Upgrades</a>
          <a href="#como-funciona" onClick={() => setOpen(false)}>Como funciona</a>
        </nav>
        <a className="up-header-contact" href={upgradeContact} target="_blank" rel="noopener noreferrer" aria-label="Falar sobre upgrade pelo WhatsApp"><WhatsappLogo size={21} /><span>WhatsApp</span></a>
      </div>
    </header>
  );
}

export function UpgradeFooter() {
  return (
    <footer className="up-footer">
      <div className="up-container">
        <UpgradeBrand />
        <p>Área gamer · {business.city}</p>
        <div className="up-footer-details">
          <a href={maps} target="_blank" rel="noopener noreferrer">{business.street} · {business.district}</a>
          <a href={upgradeContact} target="_blank" rel="noopener noreferrer">{business.phone}</a>
          <a href={business.instagram} target="_blank" rel="noopener noreferrer">Instagram <ArrowUpRight size={14} /></a>
        </div>
      </div>
    </footer>
  );
}

function Character({ name, alt, variant, hero = false }) {
  const ada = name.startsWith("ada");
  const large = ada ? 620 : 720;
  const small = ada ? 360 : 420;
  const height = name === "leon-jaqueta" ? 1080 : name === "leon-upgrade" ? 1167 : 1102;
  return (
    <div className={`up-character up-character--${variant}`}>
      <img src={media(`${name}-${large}.webp`)} srcSet={`${media(`${name}-${small}.webp`)} ${small}w, ${media(`${name}-${large}.webp`)} ${large}w`}
        sizes={hero ? "(max-width: 700px) 240px, 360px" : "(max-width: 700px) 210px, 340px"}
        width={large} height={height} alt={alt} loading={hero ? "eager" : "lazy"} fetchPriority={hero ? "high" : undefined} decoding="async" />
    </div>
  );
}

export default function UpgradePage() {
  return (
    <div className="upgrade-page">
      <section className="up-section up-hero" aria-labelledby="upgrade-title">
        <div className="up-container up-hero-grid">
          <div className="up-hero-copy">
            <h1 id="upgrade-title"><span>Seu PC ainda</span><span>tem muito</span><em>para entregar.</em></h1>
            <p>Mais desempenho começa com as peças certas.</p>
            <div className="up-actions">
              <a className="up-button up-button-primary" href={upgradeContact} target="_blank" rel="noopener noreferrer">Quero fazer um upgrade <ArrowRight size={20} /></a>
              <a className="up-button up-button-outline" href="#possibilidades">Ver possibilidades</a>
            </div>
          </div>
          <Character name="leon-jaqueta" variant="hero" hero alt="Leon Kennedy com jaqueta, à direita da apresentação de upgrades" />
        </div>
      </section>

      <section className="up-section up-signals" aria-labelledby="up-signals-title">
        <div className="up-container">
          <h2 id="up-signals-title">Seu PC está pedindo <em>reforços?</em></h2>
          <div className="up-signals-grid">
            <Character name="ada-sinais" variant="signals" alt="Ada Wong gesticulando em direção aos sinais de que o PC precisa de um upgrade" />
            <ul className="up-symptoms">
              {symptoms.map(({ title, text, icon: Icon }) => <li className="up-speech" key={title}><span className="up-symptom-icon" aria-hidden="true"><Icon size={48} weight="thin" /></span><div><h3>{title}</h3><p>{text}</p></div></li>)}
            </ul>
          </div>
        </div>
      </section>

      <section id="possibilidades" className="up-section up-components" aria-labelledby="up-components-title">
        <div className="up-container">
          <div className="up-components-heading"><h2 id="up-components-title">Escolha o próximo <em>upgrade.</em></h2><p>Cada peça precisa fazer sentido no conjunto.</p></div>
          <div className="up-components-grid">
            <ul className="up-part-grid">
              {components.map(({ title, text, image, height }) => <li className="up-part" key={title}><div className="up-part-image"><img src={media(`${image}-480.webp`)} width="480" height={height} alt="" loading="lazy" decoding="async" /></div><h3>{title}</h3><p>{text}</p></li>)}
            </ul>
            <Character name="leon-upgrade" variant="components" alt="Leon Kennedy em equipamento tático, apresentando as possibilidades de componentes" />
          </div>
        </div>
      </section>

      <section id="como-funciona" className="up-section up-process" aria-labelledby="up-process-title">
        <div className="up-container up-process-grid">
          <Character name="ada-etapas" variant="process" alt="Ada Wong de braços cruzados, ao lado das etapas do serviço" />
          <div className="up-process-copy">
            <h2 id="up-process-title">Cada peça no <em>seu lugar.</em></h2>
            <ol className="up-steps">{steps.map((step, index) => <li className="up-speech" key={step}><span className="up-step-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><span className="up-step-dash" aria-hidden="true" /><h3>{step}</h3></li>)}</ol>
            <p className="up-process-note">Compatibilidade, valores e prazos confirmados antes do serviço.</p>
          </div>
        </div>
      </section>

      <section className="up-section up-cta" aria-labelledby="up-cta-title">
        <div className="up-container">
          <h2 id="up-cta-title">Prepare seu PC<em>para o próximo desafio.</em></h2>
          <p>Fale com a Capucho e descubra por onde começar.</p>
          <a className="up-button up-button-primary" href={planningContact} target="_blank" rel="noopener noreferrer">Planejar meu upgrade <ArrowRight size={20} /></a>
        </div>
      </section>
    </div>
  );
}
