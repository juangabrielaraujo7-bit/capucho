import { Link } from "react-router";
import { ArrowLeft, ArrowUpRight, InstagramLogo, TiktokLogo } from "@phosphor-icons/react";
import { HenriqueVideo } from "../components/AboutIntro";
import Stars from "../components/Stars";
import WhatsAppButton from "../components/WhatsAppButton";
import { asset, business, maps } from "../config";
import { aboutMedia, googleReputation } from "../about";
import { gamerBuilds } from "../gamer";
import { reviews, workVideos } from "../content";

function ProjectVideo({ file, title, light = false }) {
  return <video className="about-project-video" controls playsInline preload="none"
    src={asset(`${file}${light ? "-leve" : ""}.mp4`)} poster={asset(`${file}.webp`)} aria-label={title} />;
}

export default function AboutPage() {
  return (
    <div className="about-page">
      <section className="section about-page-opening">
        <div className="container">
          <Link className="text-link about-back" to="/#sobre"><ArrowLeft size={18} /> Voltar para a home</Link>
          <p className="eyebrow">Sobre a Capucho</p>
          <h1>5 anos no mercado.<br /><span>A melhor assistência técnica da região.</span></h1>
        </div>
      </section>
      <section id="henrique" className="section">
        <div className="container about-person-grid">
          <HenriqueVideo />
          <div className="about-person-copy">
            <h2>Henrique.<br />Quem faz acontecer.</h2>
            <dl className="about-principles">
              <div><dt>Diagnóstico</dt><dd>Investigar a causa antes de indicar o reparo.</dd></div>
              <div><dt>Conversa clara</dt><dd>Explicar o serviço e combinar o orçamento.</dd></div>
              <div><dt>Dedicação</dt><dd>Tratar cada computador com atenção.</dd></div>
            </dl>
          </div>
        </div>
      </section>
      <section id="instagram" className="section about-instagram-section">
        <div className="container">
          <div className="about-instagram-heading"><InstagramLogo size={44} /><span>@capucho_informatica</span></div>
          <h2>O próximo projeto.<br />O reparo de hoje.<br /><span>Tudo mais perto, no Instagram.</span></h2>
          <p>Acompanhe os bastidores da Capucho e conheça de perto o trabalho do Henrique.</p>
          <a className="button button-primary" href={business.instagram} target="_blank" rel="noreferrer">Seguir a Capucho no Instagram <ArrowUpRight size={20} /></a>
          <div className="about-instagram-gallery" aria-label="Registros do trabalho da Capucho">
            {[{ file: "pc-capucho-1", title: "PC gamer montado pela Capucho" }, { file: "reparo-placa", title: "Reparo de placa na bancada" }, { file: "limpeza", title: "Manutenção de notebook" }].map(item => <figure key={item.file}><img src={asset(`${item.file}.webp`)} alt={item.title} loading="lazy" width="540" height="960" /><figcaption>{item.title}</figcaption></figure>)}
          </div>
        </div>
      </section>
      <section id="projetos" className="section">
        <div className="container">
          <div className="about-section-heading"><h2>Projetos gamer.<br />Montados aqui.</h2></div>
          <div className="about-project-grid">{gamerBuilds.slice(0, 2).map(item => <article key={item.file}><ProjectVideo {...item} /><h3>{item.title}</h3></article>)}</div>
          <Link className="text-link about-after-grid" to="/gamer">Conhecer a área gamer <ArrowUpRight size={20} /></Link>
        </div>
      </section>
      <section id="consertos" className="section">
        <div className="container">
          <div className="about-section-heading"><h2>Na bancada,<br />o cuidado aparece.</h2></div>
          <div className="about-repair-grid">{[workVideos[0], workVideos[3], workVideos[1]].map(item => <article key={item.file}><ProjectVideo {...item} light /><h3>{item.title}</h3><p>{item.text}</p><Link className="text-link" to={item.link}>Sobre este serviço <ArrowUpRight size={18} /></Link></article>)}</div>
        </div>
      </section>
      <section id="tiktok" className="section">
        <div className="container about-tiktok-row"><TiktokLogo size={64} weight="duotone" /><div><h2>A Capucho também no TikTok.</h2></div>{aboutMedia.tiktok ? <a className="button button-outline" href={aboutMedia.tiktok} target="_blank" rel="noreferrer">Ver no TikTok <ArrowUpRight size={20} /></a> : <span className="about-pending-label">Perfil em breve</span>}</div>
      </section>
      <section id="reputacao" className="section about-google-section">
        <div className="container about-google-grid">
          <div><img className="about-google-logo" src={asset("google-reviews.webp")} width="400" height="164" loading="lazy" alt="Google Reviews" /><h2>A confiança de quem<br />já passou por aqui.</h2><div className="about-google-rating"><strong>{googleReputation.rating}</strong><div><Stars /><span>{googleReputation.count} avaliações no Google</span></div></div><a className="text-link" href={maps} target="_blank" rel="noreferrer">Conferir as avaliações no Google <ArrowUpRight size={20} /></a></div>
          <div className="about-quotes">{[reviews[3], reviews[5]].filter(Boolean).map(review => <figure key={review.name}><Stars /><blockquote>{review.text}</blockquote><figcaption>{review.name}<span>Avaliação no Google</span></figcaption></figure>)}</div>
        </div>
      </section>
      <section className="section">
        <div className="container about-close"><h2>Agora que você nos conhece,<br />conte o que seu PC precisa.</h2><WhatsAppButton /></div>
      </section>
    </div>
  );
}
