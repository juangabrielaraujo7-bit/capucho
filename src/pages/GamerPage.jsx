import { Link } from "react-router";
import {
  ArrowUpRight,
  Broom,
  Cpu,
  GameController,
  Screwdriver,
  WindowsLogo,
} from "@phosphor-icons/react";
import BuildCarousel from "../components/BuildCarousel";
import GlitchButton from "../components/GlitchButton";
import GradientBand from "../components/GradientBand";
import TubesCursor from "../components/TubesCursor";
import LiquidButton from "../components/LiquidButton";
import WhatsAppButton from "../components/WhatsAppButton";
import { asset } from "../config";
import { gamerBuilds } from "../gamer";

// Serviços da Capucho para quem joga, cada um levando à página do serviço correspondente.
const gamerServices = [
  {
    icon: Screwdriver,
    title: "Montagem completa",
    text: "Seu PC gamer montado do zero com as peças escolhidas e testado antes da entrega.",
    link: "/servicos/upgrade-e-montagem",
  },
  {
    icon: Cpu,
    title: "Upgrade de peças",
    text: "Placa de vídeo, processador, memória, SSD e fonte, conferindo a compatibilidade antes.",
    link: "/servicos/upgrade-e-montagem",
  },
  {
    icon: Broom,
    title: "Limpeza e pasta térmica",
    text: "Poeira removida e pasta térmica nova para o PC voltar a trabalhar mais frio.",
    link: "/servicos/limpeza-preventiva",
  },
  {
    icon: WindowsLogo,
    title: "Formatação e programas",
    text: "Windows limpo, com os drivers e os programas que você usa instalados.",
    link: "/servicos/formatacao-e-programas",
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

      <section className="section section-tint">
        <div className="container">
          <h2 className="eyebrow section-label">O que fazemos no seu PC gamer</h2>
          <div className="gamer-services">
            {gamerServices.map(({ icon: Icon, title, text, link }) => (
              <Link key={title} className="gamer-service" to={link}>
                <Icon size={34} weight="duotone" />
                <h3>{title}</h3>
                <p>{text}</p>
                <span className="text-link">
                  Saiba mais
                  <ArrowUpRight size={18} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
