"use client";
import { useEffect, useState } from "react";

const scenes = [
 {word:"JOURNEY", place:"Angola · The Journey Begins", image:"/assets/cabo-ledo-angola.jpg", video:"/videos/journey-angola.mp4"},
 {word:"WONDER", place:"Kalandula Falls · Malanje", image:"/assets/hero-kalandula.jpg", video:"/videos/kalandula-falls.mp4"},
 {word:"CULTURE", place:"The Soul of Angola", image:"/assets/angolan-culture-dance.png", video:"/videos/traditional-dance.mp4"}
];
export default function HeroEngine(){
 const [active,setActive]=useState(0); const [reduced,setReduced]=useState(false);
 useEffect(()=>{const m=matchMedia('(prefers-reduced-motion: reduce)'); setReduced(m.matches);},[]);
 useEffect(()=>{if(reduced)return; const t=setInterval(()=>setActive(v=>(v+1)%3),10000); return()=>clearInterval(t)},[reduced]);
 return <section id="top" className="hero">
   <div className="hero-media" aria-hidden="true">
    {scenes.map((s,i)=><div className={`hero-scene ${i===active?'active':''}`} key={s.word}>
      <img src={s.image} alt=""/>
      <video autoPlay muted loop playsInline preload="auto" poster={s.image} onError={e=>e.currentTarget.style.display='none'}><source src={s.video} type="video/mp4"/></video>
    </div>)}
    <div className="hero-overlay"/><div className="hero-depth"/>
   </div>
   <div className="hero-copy">
     <p className="chapter">Chapter One · The Gateway to Angola</p>
     <p className="hero-word" key={scenes[active].word}>{scenes[active].word}</p>
     <h1>Your Lifetime<br/>Experience<br/><em>Starts Here</em></h1>
     <p className="hero-lede">Explore Angola and the world through carefully crafted journeys, authentic experiences, and seamless travel planning designed around you.</p>
     <div className="hero-actions"><a className="btn gold" href="#contact">Plan Your Journey</a><a className="text-link" href="#angola">Discover Angola <span>→</span></a></div>
   </div>
   <div className="scene-place">{scenes[active].place}</div>
   <div className={`hero-signature ${active===2?'show':''}`}>Journey <b>•</b> Wonder <b>•</b> Culture</div>
   <a className="scroll-cue" href="#angola">Begin your journey through Angola<i/></a>
 </section>
}
