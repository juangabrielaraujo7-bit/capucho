import { useEffect, useRef, useState } from "react";
import { Play } from "@phosphor-icons/react";
import { asset } from "../config";

export default function InstagramReel({ file, title, active = true, onPlaybackChange }) {
  const video = useRef(null);
  const [paused, setPaused] = useState(true);
  const [error, setError] = useState(false);
  useEffect(() => { if (!active) video.current?.pause(); }, [active]);
  const play = async () => {
    try {
      await video.current.play();
      setError(false);
    } catch {
      setError(true);
    }
  };
  return (
    <figure>
      <div className="instagram-reel">
        <video ref={video} controls={!paused} playsInline preload="none"
          src={asset(`${file}.mp4`)} poster={asset(`${file}.webp`)} aria-label={title}
          onPlay={event => {
            event.currentTarget.closest(".about-instagram-gallery").querySelectorAll("video").forEach(other => {
              if (other !== event.currentTarget) other.pause();
            });
            setPaused(false);
            onPlaybackChange?.(true);
          }}
          onPause={() => { setPaused(true); onPlaybackChange?.(false); }}
          onEnded={event => { event.currentTarget.currentTime = 0; setPaused(true); onPlaybackChange?.(false); }} />
        {paused && <button className="instagram-reel-cover" type="button" onClick={play} aria-label={`Reproduzir vídeo: ${title}`}>
          <img src={asset(`${file}.webp`)} alt="" width="360" height="640" loading="lazy" decoding="async" />
          <span className="instagram-reel-play"><Play size={26} weight="fill" aria-hidden="true" /></span>
        </button>}
      </div>
      <figcaption>{title}</figcaption>
      {error && <p className="instagram-reel-error" role="alert">Não foi possível reproduzir. Tente dar play novamente.</p>}
    </figure>
  );
}
