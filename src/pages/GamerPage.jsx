import { Link } from "react-router";
import {
  ArrowUpRight,
  GameController,
} from "@phosphor-icons/react";
import BuildCarousel from "../components/BuildCarousel";
import GlitchButton from "../components/GlitchButton";
import GradientBand from "../components/GradientBand";
import TubesCursor from "../components/TubesCursor";
import LiquidButton from "../components/LiquidButton";
import WhatsAppButton from "../components/WhatsAppButton";
import { asset } from "../config";
import { gamerBuilds } from "../gamer";
import "../gamer-services.css";

// Serviços da Capucho para quem joga, cada um levando à página do serviço correspondente.
const gamerServices = [
  {
    image: "montagem-completa",
    tone: "red",
    title: "Montagem completa",
    text: "Seu PC montado do zero, com peças escolhidas e testadas.",
    link: "/gamer/montagem-completa",
  },
  {
    image: "upgrade-de-pecas",
    tone: "red",
    title: "Upgrade de peças",
    text: "Mais desempenho com as peças certas para o seu PC.",
    link: "/gamer/upgrade-de-pecas",
  },
  {
    image: "limpeza-e-pasta-termica",
    tone: "ochre",
    title: "Limpeza e pasta térmica",
    text: "Cuidado por dentro para o seu PC trabalhar mais frio.",
    link: "/gamer/limpeza-e-pasta-termica",
  },
  {
    image: "formatacao-e-programas",
    tone: "olive",
    title: "Formatação e programas",
    text: "Um novo começo, com sistema e programas organizados.",
    link: "/gamer/formatacao-e-programas",
  },
];

export default function GamerPage() {
  return (
    <>
      <section className="gamer-band gamer-hero">
        <GradientBand>
          <TubesCursor />
          <div className="container gamer-section">
            <div className="gamer-copy">
              <GameController size={34} />
              <h1>
                Capucho <span className="gamer-accent">Gamer</span>
              </h1>
              <p className="gamer-hero-sub">
                Sua área gamer para upgrade, manutenção, e montagem do seu jeito
              </p>
              <LiquidButton to="/gamer/monte-seu-pc">Monte seu PC</LiquidButton>
            </div>
          </div>
          {/* Arte na extrema direita, com a base encostada na linha de baixo da seção */}
          <img
            className="gamer-hero-art"
            src={asset("gamer-hero-personagens.webp")}
            srcSet={`${asset("gamer-hero-personagens-520.webp")} 569w, ${asset("gamer-hero-personagens.webp")} 985w`}
            sizes="(max-width: 767px) 90vw, 569px"
            alt=""
            width="985"
            height="900"
            fetchPriority="high"
          />
        </GradientBand>
      </section>

      <section className="section builds-section">
        <div className="builds-glow" aria-hidden="true" />
        <div className="container builds-head">
          <h2>
            PCs montados pela <span className="gamer-accent">Capucho</span>
          </h2>
          <p>Alguns dos PCs gamer que saíram da nossa bancada.</p>
        </div>
        {gamerBuilds.length > 0 ? (
          <BuildCarousel items={gamerBuilds} />
        ) : (
          <div className="container build-empty">
            <p>Em breve, fotos e vídeos dos PCs gamer montados aqui na loja.</p>
          </div>
        )}
      </section>

      <section className="gamer-band gamer-cta">
        <GradientBand>
          <div className="container gamer-cta-inner">
            <h2>
              Monte o PC <span className="gamer-accent">do seu jeito</span>
            </h2>
            <p>
              Escolha peça por peça, veja o total estimado e mande a lista para a Capucho pelo
              WhatsApp.
            </p>
            <div className="gamer-cta-actions">
              <GlitchButton to="/gamer/monte-seu-pc">Monte seu PC</GlitchButton>
              <WhatsAppButton
                secondary
                message="Olá, Capucho! Quero ajuda para escolher as peças do meu PC gamer."
              >
                Prefiro ajuda para escolher
              </WhatsAppButton>
            </div>
          </div>
        </GradientBand>
      </section>

      <section className="section gamer-services-section" aria-labelledby="gamer-services-title">
        <div className="container">
          <div className="gamer-services-heading">
            <p className="gamer-services-label">SERVIÇOS GAMER</p>
            <h2 id="gamer-services-title">O que fazemos no seu PC gamer</h2>
            <p>Escolha o serviço para o seu PC.</p>
          </div>
          <div className="gamer-services">
            {gamerServices.map(({ image, tone, title, text, link }) => (
              <Link key={title} className={`gamer-service gamer-service--${image}`} to={link} aria-labelledby={`service-${image}`}>
                <div className="gamer-service-art">
                  <img
                    src={asset(`gamer-services/${image}-400.webp`)}
                    srcSet={`${asset(`gamer-services/${image}-400.webp`)} 400w, ${asset(`gamer-services/${image}-720.webp`)} 720w`}
                    sizes="(max-width: 599px) calc(100vw - 40px), (max-width: 1023px) calc((100vw - 60px) / 2), (max-width: 1303px) calc((100vw - 140px) / 4), 291px"
                    width="1122"
                    height="1402"
                    alt=""
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="gamer-service-content">
                  <span className={`gamer-service-rule gamer-service-rule--${tone}`} aria-hidden="true" />
                  <h3 id={`service-${image}`}>{title}</h3>
                  <p>{text}</p>
                  <span className="gamer-service-link">
                    Explorar serviço
                    <ArrowUpRight size={18} aria-hidden="true" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
