import { useEffect, useRef, useState } from "react";
import { asset } from "../config";

// One photograph keeps hardware perfectly aligned. Screen masks follow its
// perspective; the illuminated layer fades over a dim, desaturated base.
export default function GamerSetup() {
  const rootRef = useRef(null);
  const imageRef = useRef(null);
  const [state, setState] = useState("on");

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches || !window.IntersectionObserver) return;
    let disposed = false;
    let frame = 0;
    setState("waiting");
    const observer = new IntersectionObserver(async ([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      await imageRef.current?.decode().catch(() => {});
      if (disposed) return;
      // Give the initial dark frame a paint even on a direct #gamer visit.
      frame = requestAnimationFrame(() => {
        frame = requestAnimationFrame(() => {
          if (!disposed) setState("on");
        });
      });
    }, { threshold: 0.3 });
    observer.observe(rootRef.current);
    const onPreferenceChange = () => {
      if (reduce.matches) {
        observer.disconnect();
        cancelAnimationFrame(frame);
        setState("on");
      }
    };
    reduce.addEventListener("change", onPreferenceChange);
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      reduce.removeEventListener("change", onPreferenceChange);
    };
  }, []);

  const picture = {
    src: asset("gamer-setup.webp"),
    srcSet: `${asset("gamer-setup-800.webp")} 800w, ${asset("gamer-setup.webp")} 1440w`,
    sizes: "(max-width: 767px) calc(100vw - 40px), (max-width: 1023px) 55vw, 760px",
    width: 1440,
    height: 960,
    loading: "lazy",
    decoding: "async",
  };

  return (
    <div ref={rootRef} className="gamer-setup" data-state={state}>
      <div className="gamer-setup-halo" aria-hidden="true" />
      <div className="gamer-setup-stage">
        <img {...picture} ref={imageRef} className="gamer-setup-base"
          alt="Setup gamer ilustrativo com dois monitores, gabinete de vidro com iluminação roxa, teclado branco e headset" />
        <img {...picture} className="gamer-setup-powered" alt="" aria-hidden="true" />
        <span className="gamer-screen gamer-screen-main" aria-hidden="true" />
        <span className="gamer-screen gamer-screen-portrait" aria-hidden="true" />
      </div>
    </div>
  );
}
