"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "./LanguageContext";

const SCENE_MS = 9000;
const FADE_MS = 700;
const SIGNATURE_MS = 1200;

const scenes = [
  {
    id: "journey",
    type: "youtube",
    word: "JOURNEY",
    place: "Serra da Leba · Huíla",
    youtubeId: "Qb9sOPbUJ-g",
    title: "Serra da Leba, Angola",
    fit: "cover",
  },
  {
    id: "wonder",
    type: "youtube",
    word: "WONDER",
    place: "Kalandula Falls · Malanje",
    youtubeId: "1Bot0Ke7a0Y",
    start: 50,
    title: "Kalandula Falls, Angola",
    fit: "cover",
  },
  {
    id: "culture",
    type: "youtube",
    word: "CULTURE",
    place: "Traditional Angolan Dance",
    youtubeId: "2H1qkAt4N_4",
    title: "Traditional Angolan dance",
    fit: "contain",
  },
];

function youtubeBackgroundUrl(id, start = 0) {
  const params = new URLSearchParams({
    autoplay: "1",
    mute: "1",
    controls: "0",
    loop: "1",
    playlist: id,
    modestbranding: "1",
    rel: "0",
    playsinline: "1",
    iv_load_policy: "3",
    disablekb: "1",
    fs: "0",
  });
  if (start > 0) params.set("start", String(start));
  return `https://www.youtube-nocookie.com/embed/${id}?${params.toString()}`;
}

export default function HeroEngine() {
  const {t}=useLanguage();
  const [active, setActive] = useState(0);
  const [fading, setFading] = useState(false);
  const [showSignature, setShowSignature] = useState(false);
  const [reduced, setReduced] = useState(false);
  const timerRef = useRef(null);
  const transitionRef = useRef(null);
  const signatureRef = useRef(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener?.("change", sync);
    return () => mq.removeEventListener?.("change", sync);
  }, []);

  useEffect(() => {
    clearTimeout(timerRef.current);
    clearTimeout(signatureRef.current);
    if (reduced) return;

    timerRef.current = window.setTimeout(() => {
      if (active === scenes.length - 1) {
        setShowSignature(true);
        signatureRef.current = window.setTimeout(() => {
          setShowSignature(false);
          transitionTo(0);
        }, SIGNATURE_MS);
      } else {
        transitionTo(active + 1);
      }
    }, SCENE_MS);

    return () => {
      clearTimeout(timerRef.current);
      clearTimeout(signatureRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, reduced]);

  function transitionTo(index) {
    if (index === active) return;
    clearTimeout(transitionRef.current);
    setFading(true);
    transitionRef.current = window.setTimeout(() => {
      setActive(index);
      setFading(false);
    }, FADE_MS);
  }

  function goTo(index) {
    clearTimeout(timerRef.current);
    clearTimeout(signatureRef.current);
    setShowSignature(false);
    transitionTo(index);
  }

  const scene = scenes[active];

  return (
    <section id="top" className="hero hero-motion-only">
      <div className={`hero-media ${fading ? "is-fading" : ""}`} aria-hidden="true">
        <div className="hero-video-fallback" />
        {!reduced && scene.type === "video" && (
          <video key={scene.src} className={`hero-local-video hero-fit-${scene.fit || "cover"}`} autoPlay muted loop playsInline preload="metadata">
            <source src={scene.src} type="video/mp4" />
          </video>
        )}
        {!reduced && scene.type === "youtube" && (
          <iframe
            key={scene.youtubeId}
            className={`hero-youtube hero-fit-${scene.fit || "cover"}`}
            src={youtubeBackgroundUrl(scene.youtubeId, scene.start)}
            title={scene.title}
            allow="autoplay; encrypted-media; picture-in-picture"
            referrerPolicy="strict-origin-when-cross-origin"
            tabIndex="-1"
          />
        )}
        <div className="hero-overlay" />
        <div className="hero-depth" />
      </div>

      <div className="hero-copy">
        <p className="chapter">{t("chapter")}</p>
        <p className="hero-word" key={scene.word}>{scene.word}</p>
        <h1>{t("headline1")}<br />{t("headline2")}<br /><em>{t("headline3")}</em></h1>
        <p className="hero-lede">{t("heroLede")}</p>
        <div className="hero-actions">
          <a className="btn gold" href="#contact">{t("plan")}</a>
          <a className="text-link" href="#angola">{t("discover")} <span>→</span></a>
        </div>
      </div>

      <div className="scene-place">{scene.place}</div>
      <div className="hero-scene-dots" aria-label="Hero scenes">
        {scenes.map((item, index) => (
          <button key={item.id} type="button" className={index === active ? "active" : ""}
            onClick={() => goTo(index)} aria-label={`Show ${item.place}`} />
        ))}
      </div>
      <div className={`hero-signature ${showSignature ? "show-now" : ""}`} aria-hidden="true">
        <span>Journey</span><b>•</b><span>Wonder</span><b>•</b><span>Culture</span>
      </div>
      <a className="scroll-cue" href="#angola">{t("begin")}<i /></a>
    </section>
  );
}
