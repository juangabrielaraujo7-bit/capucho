import { Link } from "react-router";
import { ArrowRight, ArrowUpRight, GoogleLogo, InstagramLogo, TiktokLogo, VideoCamera } from "@phosphor-icons/react";
import { business, maps } from "../config";
import { aboutMedia, googleReputation } from "../about";
import "../about.css";

export function HenriqueVideo() {
  return (
    <div className="about-film">
      {aboutMedia.henriqueVideo ? (
        <video controls playsInline preload="none" src={aboutMedia.henriqueVideo}
          poster={aboutMedia.henriquePoster || undefined} aria-label="Henrique trabalhando na Capucho" />
      ) : (
        <div className="about-film-placeholder">
          <VideoCamera size={42} weight="light" />
          <strong>Henrique, na prática.</strong>
          <span>Espaço para o vídeo dele trabalhando na Capucho.</span>
        </div>
      )}
      <div className="about-film-caption"><span>Por trás de cada reparo</span><span>Dedicação em cada detalhe</span></div>
    </div>
  );
}

export function SocialBranches() {
  return (
    <div className="about-social-map">
      <div className="about-branch-space">
        {aboutMedia.branchesIllustration ? <img src={aboutMedia.branchesIllustration} alt="" loading="lazy" /> : (
          <div className="about-branch-placeholder"><span>CAPUCHO</span><small>Espaço para a ilustração dos ramos</small></div>
        )}
      </div>
      <div className="about-social-nodes">
        <a className="about-social-node about-social-node-main" href={business.instagram} target="_blank" rel="noreferrer">
          <InstagramLogo size={30} /><span>Instagram<small>Acompanhe de perto</small></span><ArrowUpRight size={19} />
        </a>
        {aboutMedia.tiktok ? <a className="about-social-node" href={aboutMedia.tiktok} target="_blank" rel="noreferrer"><TiktokLogo size={26} /><span>TikTok</span><ArrowUpRight size={18} /></a> :
          <div className="about-social-node about-social-pending"><TiktokLogo size={26} /><span>TikTok<small>Perfil em breve</small></span></div>}
        <a className="about-social-node" href={maps} target="_blank" rel="noreferrer"><GoogleLogo size={26} /><span>Google<small>{googleReputation.rating} · {googleReputation.count} avaliações</small></span><ArrowUpRight size={18} /></a>
      </div>
    </div>
  );
}

export default function AboutIntro() {
  return (
    <section id="sobre" className="section about-intro">
      <div className="container">
        <div className="about-intro-grid">
          <div className="about-intro-copy">
            <p className="eyebrow">Prazer, somos a Capucho</p>
            <h2>5 anos no mercado.<br /><span>A melhor assistência técnica da região.</span></h2>
            <p>Por trás da Capucho está o Henrique. Na bancada, nos projetos e no cuidado com cada computador.</p>
            <Link className="button button-primary" to="/sobre">Conheça a Capucho <ArrowRight size={20} /></Link>
          </div>
          <HenriqueVideo />
        </div>
        <div className="about-intro-social">
          <div><h3>Nosso trabalho, de perto.</h3><p>Veja os bastidores, os consertos e os projetos que passam por aqui.</p></div>
          <SocialBranches />
        </div>
      </div>
    </section>
  );
}
