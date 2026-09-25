import { useRef, useState } from "react";
import { Play } from "@phosphor-icons/react";
import { asset } from "../config";

export default function ServiceVideo({ file, title }) {
  const [started, setStarted] = useState(false);
  const [error, setError] = useState(false);
  const videoRef = useRef(null);
  async function start() {
    try {
      await videoRef.current.play();
      setStarted(true);
    } catch {
      setError(true);
    }
  }
  return (
    <article className="video-card">
      <div className="video-frame">
        <video
          ref={videoRef}
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
            onClick={start}
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
      <h3>{title}</h3>
    </article>
  );
}
