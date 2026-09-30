import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { Cpu, Fan, Monitor, Play } from "@phosphor-icons/react";
import { asset } from "../config";
import BuildCarousel from "./BuildCarousel";

// Vídeos do trabalho em fileiras, inspirado na seção de soluções do leadedu.com.br:
// no desktop, a coluna do meio fica fixa na tela e troca de vídeo conforme cada fileira
// passa pelo centro; no tablet, cada fileira mostra o próprio vídeo (só começam com um clique, sem som).
// No celular, as fileiras dão lugar ao mesmo carrossel da Área Gamer, em versão clara, com o texto
// do vídeo do centro logo abaixo.

const icons = { "troca-tela": Monitor, limpeza: Fan, montagem: Cpu };

function VideoFrame({ file, title, active = true, className = "" }) {
  const ref = useRef(null);
  const [started, setStarted] = useState(false);
  const [error, setError] = useState(false);

  // Ao trocar de fileira, o vídeo que estava tocando para e volta à capa.
  useEffect(() => {
    if (!active && ref.current) {
      ref.current.pause();
      setStarted(false);
    }
  }, [active]);

  async function start() {
    try {
      await ref.current.play();
      setStarted(true);
    } catch {
      setError(true);
    }
  }

  return (
    <div className={`video-frame ${className}`} aria-hidden={!active || undefined}>
      <video
        ref={ref}
        src={asset(`${file}.mp4`)}
        poster={asset(`${file}.webp`)}
        muted
        playsInline
        controls={started}
        preload="none"
        aria-label={title}
        onEnded={() => setStarted(false)}
        onError={() => setError(true)}
      />
      {!started && !error && (
        <button
          className="play-button"
          type="button"
          onClick={start}
          tabIndex={active ? 0 : -1}
          aria-label={`Reproduzir: ${title}`}
        >
          <Play weight="fill" size={24} />
        </button>
      )}
      {error && (
        <div className="video-error">
          Não foi possível reproduzir.
          <a href={asset(`${file}.mp4`)}>Abrir o vídeo</a>
        </div>
      )}
    </div>
  );
}

export default function WorkShowcase({ items }) {
  const [active, setActive] = useState(0);
  const rowsRef = useRef([]);

  // A fileira que cruza a linha central da tela vira a ativa.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting)
            setActive(Number(entry.target.dataset.index));
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    rowsRef.current.forEach((row) => row && observer.observe(row));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="work-panel">
      <div className="work-stage-col">
        <div className="work-stage">
          {items.map((item, i) => (
            <VideoFrame
              key={item.file}
              file={item.file}
              title={item.title}
              active={i === active}
              className={i === active ? "is-active" : ""}
            />
          ))}
        </div>
      </div>
      {items.map((item, i) => {
        const Icon = icons[item.file];
        return (
          <article
            key={item.file}
            ref={(el) => (rowsRef.current[i] = el)}
            data-index={i}
            className={i === active ? "work-row is-active" : "work-row"}
          >
            <header className="work-row-title">
              <Icon size={52} weight="duotone" />
              <h3>{item.title}</h3>
            </header>
            <div className="work-row-media">
              <VideoFrame file={item.file} title={item.title} />
            </div>
            <div className="work-row-text">
              <p>{item.text}</p>
              <Link className="work-button" to={item.link}>
                Saiba mais
              </Link>
            </div>
          </article>
        );
      })}
      <div className="work-mobile">
        <BuildCarousel
          light
          items={items}
          renderCaption={(item) => {
            const Icon = icons[item.file];
            return (
              <>
                <h3>
                  <Icon size={30} weight="duotone" />
                  {item.title}
                </h3>
                <p>{item.text}</p>
                <Link className="work-button" to={item.link}>
                  Saiba mais
                </Link>
              </>
            );
          }}
        />
      </div>
    </div>
  );
}
