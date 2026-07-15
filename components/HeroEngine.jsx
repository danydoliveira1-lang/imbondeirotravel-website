"use client";

import { useEffect, useRef, useState } from "react";

const scenes = [
  { id:"falls", word:"WONDER", place:"Kalandula Falls · Malanje", src:"/videos/kalandula-falls.mp4", poster:"/assets/hero-kalandula.jpg" },
  { id:"dance", word:"CULTURE", place:"Angolan Traditional Dance", src:"/videos/traditional-dance.mp4", poster:"/assets/angolan-culture-dance.png" },
  { id:"journey", word:"JOURNEY", place:"Angola · The Journey Begins", src:"/videos/journey-angola.mp4", poster:"/assets/highlight-kissama.jpg" },
];

export default function HeroEngine(){
  const [active,setActive]=useState(0);
  const [fading,setFading]=useState(false);
  const [reduced,setReduced]=useState(false);
  const videoRef=useRef(null);
  const switching=useRef(false);

  useEffect(()=>{
    const mq=window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync=()=>setReduced(mq.matches);
    sync(); mq.addEventListener?.("change",sync);
    return()=>mq.removeEventListener?.("change",sync);
  },[]);

  useEffect(()=>{
    const v=videoRef.current;
    if(!v) return;
    switching.current=false;
    v.load();
    const p=v.play();
    p?.catch?.(()=>{});
  },[active]);

  function goTo(index){
    if(index===active || switching.current) return;
    switching.current=true;
    setFading(true);
    window.setTimeout(()=>{
      setActive(index);
      setFading(false);
      switching.current=false;
    },520);
  }

  function onTimeUpdate(){
    const v=videoRef.current;
    if(!v || reduced || switching.current || !Number.isFinite(v.duration)) return;
    if(v.duration-v.currentTime<0.65) goTo((active+1)%scenes.length);
  }

  const scene=scenes[active];
  return <section id="top" className="hero hero-local">
    <div className={`hero-media ${fading?"is-fading":""}`} aria-hidden="true">
      <img className="hero-local-poster" src={scene.poster} alt="" />
      {!reduced && <video ref={videoRef} className="hero-local-video" muted playsInline preload="auto" poster={scene.poster} onTimeUpdate={onTimeUpdate} onEnded={()=>goTo((active+1)%scenes.length)}>
        <source src={scene.src} type="video/mp4" />
      </video>}
      <div className="hero-overlay"/><div className="hero-depth"/>
    </div>
    <div className="hero-copy">
      <p className="chapter">Chapter One · The Gateway to Angola</p>
      <p className="hero-word" key={scene.word}>{scene.word}</p>
      <h1>Your Lifetime<br/>Experience<br/><em>Starts Here</em></h1>
      <p className="hero-lede">Private journeys across Angola and beyond, thoughtfully designed around you.</p>
      <div className="hero-actions"><a className="btn gold" href="#contact">Plan Your Journey</a><a className="text-link" href="#angola">Discover Angola <span>→</span></a></div>
    </div>
    <div className="scene-place">{scene.place}</div>
    <div className="hero-scene-dots" aria-label="Hero scenes">{scenes.map((s,i)=><button key={s.id} type="button" className={i===active?"active":""} onClick={()=>goTo(i)} aria-label={`Show ${s.place}`}/>)}</div>
    <a className="scroll-cue" href="#angola">Begin your journey through Angola<i/></a>
  </section>;
}
