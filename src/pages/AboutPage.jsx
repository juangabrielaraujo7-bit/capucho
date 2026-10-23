import { Link } from "react-router";
import { ArrowLeft, ArrowUpRight } from "@phosphor-icons/react";
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
            <h1 id="henrique-title">Henrique Capucho.</h1>
            <p className="about-person-tagline">Tecnologia com propósito. Confiança em cada detalhe.</p>
            <p>À frente da Capucho Informática, Henrique une mais de 13 anos de experiência em tecnologia a um atendimento próximo, transparente e focado em soluções de verdade.</p>
            <p>Há 6 anos construindo a história da Capucho, ele participa de perto de cada etapa: do primeiro atendimento ao diagnóstico, dos reparos especializados à montagem de computadores personalizados.</p>
            <p>Mais do que consertar computadores ou montar máquinas de alto desempenho, nosso compromisso é entender a necessidade de cada cliente, indicar a solução certa e entregar um serviço feito com cuidado, responsabilidade e qualidade.</p>
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
      <section id="tiktok" className="section about-tiktok-section" aria-labelledby="tiktok-title">
        <div className="container about-tiktok-layout">
          <div className="about-tiktok-heading">
            <h2 id="tiktok-title">A Capucho também no <span className="about-tiktok-brand"><span className="about-tiktok-word"><img src={asset("tiktok-brand.png")} alt="TikTok" width="494" height="146" loading="lazy" draggable="false" /></span><span className="about-tiktok-mark" aria-hidden="true"><img src={asset("tiktok-brand.png")} alt="" width="494" height="146" loading="lazy" draggable="false" /></span></span></h2>
            <a className="button button-outline" href={aboutMedia.tiktok} target="_blank" rel="noopener noreferrer">Ver no TikTok <ArrowUpRight size={20} /></a>
          </div>
          <div className="about-tiktok-content">
            <FeatureCarousel compact gestures arrows={false} initialIndex={0} label="Vídeos da Capucho no TikTok" items={[{ file: "tiktok-bastidores", title: "Quem usa SSD vai entender" }, { file: "tiktok-dia-a-dia", title: "Ryzen ou Intel?" }]} />
          </div>
        </div>
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
