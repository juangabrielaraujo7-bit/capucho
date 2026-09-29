import { Link } from "react-router";
import {
  ArrowUpRight,
  Broom,
  Cpu,
  GameController,
  Screwdriver,
  WindowsLogo,
} from "@phosphor-icons/react";
import GamerVideo from "../components/GamerVideo";
import GlitchButton from "../components/GlitchButton";
import GradientBand from "../components/GradientBand";
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

function BuildItem({ item }) {
  return (
    <figure className="build-item">
      {item.type === "video" ? (
        <video
          src={asset(`${item.file}.mp4`)}
          poster={asset(`${item.file}.webp`)}
          controls
          muted
          playsInline
          preload="none"
          aria-label={item.title}
        />
      ) : (
        <img src={asset(item.file)} alt={item.title} loading="lazy" />
      )}
      <figcaption>
        <strong>{item.title}</strong>
        {item.specs?.length > 0 && <span>{item.specs.join(" · ")}</span>}
      </figcaption>
    </figure>
  );
}

export default function GamerPage() {
  return (
    <>
      <section className="gamer-band gamer-hero">
        <GradientBand>
          <div className="container gamer-section">
            <div className="gamer-copy">
              <GameController size={34} />
              <h1>Área Gamer</h1>
              <p>PC gamer montado, upgrade e manutenção feitos pela Capucho.</p>
              <GlitchButton to="/gamer/monte-seu-pc">Monte seu PC</GlitchButton>
            </div>
          </div>
          <GamerVideo />
        </GradientBand>
      </section>

      <section className="section container">
        <h2 className="eyebrow section-label">PCs montados pela Capucho</h2>
        {gamerBuilds.length > 0 ? (
          <div className="build-grid">
            {gamerBuilds.map((item) => (
              <BuildItem key={item.file} item={item} />
            ))}
          </div>
        ) : (
          <div className="build-empty">
            <p>Em breve, fotos e vídeos dos PCs gamer montados aqui na loja.</p>
          </div>
        )}
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

      <section className="gamer-band gamer-cta">
        <GradientBand>
          <div className="container gamer-cta-inner">
            <h2>Monte o PC do seu jeito</h2>
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
    </>
  );
}
