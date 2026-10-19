import { Link } from "react-router";
import { ArrowLeft, ArrowUpRight, TiktokLogo } from "@phosphor-icons/react";
import Stars from "../components/Stars";
import ReviewsMonitor from "../components/ReviewsMonitor";
import FeatureCarousel from "../components/ui/FeatureCarousel";
import WhatsAppButton from "../components/WhatsAppButton";
import { asset } from "../config";
import { aboutMedia, googleReputation } from "../about";
import { reviews } from "../content";

export default function AboutPage() {
  return (
    <div className="about-page">
      <section className="section about-page-opening">
        <div className="container">
          <Link className="text-link about-back" to="/#sobre"><ArrowLeft size={18} /> Voltar para a home</Link>
        </div>
      </section>
      <section id="henrique" className="section about-person-section" aria-labelledby="henrique-title">
        <div className="container about-person-grid">
          <img className="about-person-photo" src={asset("henrique-capucho.webp")} alt="Henrique em diferentes momentos do dia a dia na Capucho Informática" width="900" height="1600" decoding="async" fetchPriority="high" />
          <div className="about-person-copy">
            <h1 id="henrique-title">Henrique.<br /><span>À frente da Capucho.</span></h1>
            <p>Há 6 anos, Henrique toca o dia a dia da Capucho Informática. Dono da loja e profissional com 13 anos de experiência, ele está presente no atendimento, nos reparos e na montagem de computadores.</p>
            <p>A Capucho reúne essa experiência com um jeito próximo de atender: ouvir quem chega, entender o que o computador precisa e cuidar de cada serviço com atenção.</p>
          </div>
        </div>
      </section>
      <section id="instagram" className="section about-instagram-section">
        <div className="container">
          <div className="about-instagram-opening">
            <div className="about-instagram-copy">
              <h2>Nos acompanhe <span>no instagram</span></h2>
              <a className="about-instagram-link" href="https://www.instagram.com/capucho_informatica/" target="_blank" rel="noopener noreferrer"><img src={asset("social-instagram.webp")} alt="" width="38" height="38" /><span>Ver no Instagram</span><ArrowUpRight size={20} aria-hidden="true" /></a>
            </div>
            <img className="about-instagram-phone" src={asset("instagram-celular-capucho.webp")}
              srcSet={`${asset("instagram-celular-capucho-520.webp")} 520w, ${asset("instagram-celular-capucho.webp")} 856w`}
              sizes="(max-width: 700px) 56vw, 220px" width="856" height="1619" loading="lazy" decoding="async"
              alt="Celular mostrando o perfil da Capucho Informática no Instagram" />
          </div>
          <div className="about-instagram-content">
            <div className="about-instagram-content-heading">
              <h3 className="about-instagram-content-title">Nossos <span>conteúdos</span></h3>
              <p>Acompanhe os bastidores de todo o processo</p>
            </div>
            <FeatureCarousel items={[{ file: "instagram-antes-depois", title: "Antes e depois de uma manutenção" }, { file: "instagram-upgrade-domicilio", title: "Manutenção e upgrade em domicílio" }, { file: "instagram-pc-gamer", title: "PC gamer montado pela Capucho" }]} />
          </div>
        </div>
      </section>
      <section id="tiktok" className="section">
        <div className="container about-tiktok-row"><TiktokLogo size={64} weight="duotone" /><div><h2>A Capucho também no TikTok.</h2></div>{aboutMedia.tiktok ? <a className="button button-outline" href={aboutMedia.tiktok} target="_blank" rel="noreferrer">Ver no TikTok <ArrowUpRight size={20} /></a> : <span className="about-pending-label">Perfil em breve</span>}</div>
      </section>
      <section id="reputacao" className="section about-google-section" aria-label="Avaliações no Google">
        <div className="container">
          <h2 className="about-google-title">A única na região com nota 5,0 <span>com mais de 360 avaliações</span></h2>
          <div className="about-google-grid">
            <div><img className="about-google-logo" src={asset("google-reviews.webp")} width="400" height="164" loading="lazy" alt="Google Reviews" /><div className="about-google-rating"><strong>{googleReputation.rating}</strong><div><Stars /><span>{googleReputation.count} avaliações no Google</span></div></div><a className="text-link" href="https://g.page/r/CUYdeUogeg_yEAE/review" target="_blank" rel="noreferrer">Avaliar a Capucho no Google <ArrowUpRight size={20} /></a></div>
            <ReviewsMonitor reviews={reviews} />
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container about-close"><h2>Agora que você nos conhece,<br />conte o que seu PC precisa.</h2><WhatsAppButton /></div>
      </section>
    </div>
  );
}
