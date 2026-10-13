import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { ArrowRight, ArrowUpRight, VideoCamera } from "@phosphor-icons/react";
import { asset, business, maps } from "../config";
import { aboutMedia, googleReputation } from "../about";
import AnimatedText from "./AnimatedText";
import LetterSwap from "./LetterSwap";
import "../about.css";

export function HenriqueVideo() {
  return (
    <div className="about-film">
      {aboutMedia.henriqueVideo ? (
        // Vídeo vertical: fica inteiro no centro do quadro 16:10, sobre a própria capa desfocada.
        <div className="about-film-stage">
          {aboutMedia.henriquePoster && <img className="about-film-backdrop" src={aboutMedia.henriquePoster} alt="" aria-hidden="true" />}
          <video controls playsInline preload="none" src={aboutMedia.henriqueVideo}
            poster={aboutMedia.henriquePoster || undefined} aria-label="Henrique trabalhando na Capucho" />
        </div>
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

// Ramos do "mapa mental": saem do título e terminam no centro de cada botão (medido, acompanha o layout).
function useBranches(mapRef) {
  const [branches, setBranches] = useState(null);
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const measure = () => {
      const box = map.querySelector(".about-branch-space").getBoundingClientRect();
      const ends = [...map.querySelectorAll(".about-social-node")].map(node => {
        const r = node.getBoundingClientRect();
        return { x: r.left + r.width / 2 - box.left, y: r.top - box.top };
      });
      // no celular os botões quebram em duas linhas: os ramos só fazem sentido com os três lado a lado
      const sideBySide = ends.length === 3 && ends.every(e => Math.abs(e.y - ends[0].y) < 2);
      setBranches(sideBySide ? { w: box.width, h: ends[0].y, ends } : null);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(map);
    return () => observer.disconnect();
  }, [mapRef]);
  return branches;
}

export function SocialBranches() {
  const mapRef = useRef(null);
  const branches = useBranches(mapRef);
  return (
    <div className="about-social-map" ref={mapRef}>
      <div className="about-branch-space">
        <AnimatedText className="about-branch-title" text="Conheça a Capucho" />
        {branches && (
          <svg className="about-branches" width={branches.w} height={branches.h} viewBox={`0 0 ${branches.w} ${branches.h}`} aria-hidden="true">
            {branches.ends.map((end, i) => {
              const sx = branches.w / 2, sy = 58, ey = end.y - 4, my = (sy + ey) / 2;
              const d = `M ${sx} ${sy} C ${sx} ${my}, ${end.x} ${my}, ${end.x} ${ey}`;
              return (
                <g key={i}>
                  <path className="about-branch-track" d={d} />
                  <path className="about-branch-flow" d={d} style={{ animationDelay: `${i * -0.6}s` }} />
                  <circle className="about-branch-tip" cx={end.x} cy={ey} r="4" />
                </g>
              );
            })}
            <circle className="about-branch-root" cx={branches.w / 2} cy="58" r="5" />
          </svg>
        )}
      </div>
      <div className="about-social-nodes">
        <a className="about-social-node about-social-node-main" href={business.instagram} target="_blank" rel="noreferrer">
          <img className="about-social-logo" src={asset("social-instagram.webp")} alt="" width="38" height="38" loading="lazy" /><span>Instagram<small>Acompanhe de perto</small></span><ArrowUpRight size={19} />
        </a>
        {aboutMedia.tiktok ? <a className="about-social-node" href={aboutMedia.tiktok} target="_blank" rel="noreferrer"><span><img className="about-social-logo about-social-logo-wide" src={asset("social-tiktok.webp")} alt="TikTok" width="96" height="28" loading="lazy" /><small>Vídeos da bancada</small></span><ArrowUpRight size={18} /></a> :
          <div className="about-social-node about-social-pending"><span><img className="about-social-logo about-social-logo-wide" src={asset("social-tiktok.webp")} alt="TikTok" width="96" height="28" loading="lazy" /><small>Perfil em breve</small></span></div>}
        <a className="about-social-node" href={maps} target="_blank" rel="noreferrer"><img className="about-social-logo" src={asset("social-google.webp")} alt="" width="34" height="34" loading="lazy" /><span>Google<small>{googleReputation.rating} · {googleReputation.count} avaliações</small></span><ArrowUpRight size={18} /></a>
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
            <h2><LetterSwap text="5 anos" /> no mercado.<br /><span><span className="about-title-mark">A melhor assistência técnica</span> da região.</span></h2>
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
