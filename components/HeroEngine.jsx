"use client";

import { useEffect, useRef, useState } from "react";

const scenes = [
  {
    id: "falls",
    word: "WONDER",
    place: "Kalandula Falls · Malanje",
    poster: "/assets/hero-kalandula.jpg",
    kind: "video",
    src: "https://videos.pexels.com/video-files/33053868/14088588_2560_1440_60fps.mp4",
    fallback: "/videos/kalandula-falls.mp4",
  },
  {
    id: "dance",
    word: "CULTURE",
    place: "Angolan Traditional Dance",
    poster: "/assets/angolan-culture-dance.png",
    kind: "youtube",
    src: "https://www.youtube-nocookie.com/embed/U9ILT0S2GYA?autoplay=1&mute=1&controls=0&loop=1&playlist=U9ILT0S2GYA&playsinline=1&rel=0&iv_load_policy=3&disablekb=1&modestbranding=1&vq=hd720",
  },
  {
    id: "kissama",
    word: "JOURNEY",
    place: "Kissama · Angola Wildlife",
    poster: "/assets/highlight-kissama.jpg",
    kind: "video",
    src: "https://videos.pexels.com/video-files/37156656/15740803_1920_1080_25fps.mp4",
    fallback: "/videos/journey-angola.mp4",
  },
];

function ActiveMedia({ scene }) {
  const videoRef = useRef(null);
  const [useFallback, setUseFallback] = useState(false);

  useEffect(() => {
    if (!videoRef.current) return;
    const attempt = videoRef.current.play();
    if (attempt?.catch) attempt.catch(() => {});
  }, [scene.id, useFallback]);

  if (scene.kind === "youtube") {
    return (
      <>
        <img className="hero-active-poster" src={scene.poster} alt="" />
        <iframe
          className="hero-active-media hero-youtube"
          src={scene.src}
          title="Angolan traditional dance"
          allow="autoplay; encrypted-media; picture-in-picture"
          referrerPolicy="strict-origin-when-cross-origin"
          tabIndex="-1"
        />
      </>
    );
  }

  return (
    <>
      <img className="hero-active-poster" src={scene.poster} alt="" />
      <video
        ref={videoRef}
        key={`${scene.id}-${useFallback ? "fallback" : "remote"}`}
        className="hero-active-media"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={scene.poster}
        onError={() => setUseFallback(true)}
      >
        <source src={useFallback ? scene.fallback : scene.src} type="video/mp4" />
      </video>
    </>
  );
}

export default function HeroEngine() {
  const [active, setActive] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(media.matches);
    sync();
    media.addEventListener?.("change", sync);
    return () => media.removeEventListener?.("change", sync);
  }, []);

  useEffect(() => {
    if (reduced) return;
    const timer = window.setInterval(() => setActive((value) => (value + 1) % scenes.length), 9000);
    return () => window.clearInterval(timer);
  }, [reduced]);

  const scene = scenes[active];

  return (
    <section id="top" className="hero hero-stable">
      <div className="hero-media" aria-hidden="true">
        <div className="hero-single-scene" key={scene.id}>
          <ActiveMedia scene={scene} />
        </div>
        <div className="hero-overlay" />
        <div className="hero-depth" />
      </div>

      <div className="hero-copy">
        <p className="chapter">Chapter One · The Gateway to Angola</p>
        <p className="hero-word" key={scene.word}>{scene.word}</p>
        <h1>Your Lifetime<br />Experience<br /><em>Starts Here</em></h1>
        <p className="hero-lede">Private journeys across Angola and beyond, thoughtfully designed around you.</p>
        <div className="hero-actions">
          <a className="btn gold" href="#contact">Plan Your Journey</a>
          <a className="text-link" href="#angola">Discover Angola <span>→</span></a>
        </div>
      </div>

      <div className="scene-place">{scene.place}</div>
      <div className={`hero-signature ${active === scenes.length - 1 ? "show" : ""}`}>Journey <b>•</b> Wonder <b>•</b> Culture</div>
      <div className="hero-scene-dots" aria-label="Hero scenes">
        {scenes.map((item, index) => (
          <button key={item.id} type="button" className={index === active ? "active" : ""} onClick={() => setActive(index)} aria-label={`Show ${item.place}`} />
        ))}
      </div>
      <a className="scroll-cue" href="#angola">Begin your journey through Angola<i /></a>
    </section>
  );
}
