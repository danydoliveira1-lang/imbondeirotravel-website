"use client";

import { useEffect, useMemo } from "react";
import { signatureDepartures, placesRemaining } from "../data/signatureDepartures";
import { useJourney } from "./JourneyContext";

const journeyMatches = {
  serra: [
    { id: "signature:lubango-serra", title: "Lubango & Serra da Leba", meta: "4 days / 3 nights · Highlands", description: "A cinematic journey through Lubango, Tundavala and the legendary curves of Serra da Leba." },
    { id: "signature:southern-angola", title: "Southern Angola Grand Journey", meta: "7 days / 6 nights · Private", description: "Combine Huíla’s dramatic highlands with Namibe’s desert, coast and remarkable landscapes." },
  ],
  kalandula: [
    { id: "signature:kalandula-malanje", title: "Kalandula Falls & Malanje", meta: "3 days / 2 nights · Nature", description: "Waterfalls, Pedras Negras and the lush landscapes of Malanje in one carefully paced journey." },
  ],
  kissama: [
    { id: "signature:kissama", title: "Kissama Safari Escape", meta: "Full day · Wildlife", description: "A guided safari experience within easy reach of Luanda, enriched by river and landscape stops." },
  ],
  miradouro: [
    { id: "signature:kwanza", title: "Kwanza River & Southern Luanda", meta: "Full day · Nature & heritage", description: "Combine Miradouro da Lua with the Kwanza River, coastal scenery and cultural landmarks south of Luanda." },
  ],
  kwanza: [
    { id: "signature:kwanza", title: "Kwanza River Journey", meta: "8 hours · Nature & heritage", description: "River tranquillity, cultural history and extraordinary viewpoints south of the capital." },
  ],
  luandaCity: [
    { id: "signature:luanda-city", title: "Luanda City Welcome", meta: "4 hours · Culture", description: "A private introduction to Angola’s capital, its history, bay, architecture and living culture." },
  ],
};

const heroMedia = {
  serra: { type: "youtube", id: "FlWYO9zeRGI" },
  kalandula: { type: "youtube", id: "1Bot0Ke7a0Y", start: 50 },
  kissama: { type: "youtube", id: "xBZjmw9AreU" },
  benguelaCoast: { type: "youtube", id: "Of-AtWK5CtA" },
  lobito: { type: "youtube", id: "Of-AtWK5CtA" },
  benguelaRomance: { type: "youtube", id: "Of-AtWK5CtA" },
  mbanzaCulture: { type: "youtube", id: "jkTv2xkPNi8" },
  mbanzaHeritage: { type: "youtube", id: "jkTv2xkPNi8" },
  cabo: { type: "youtube", id: "Om6PSHBDB34" },
  caboRomance: { type: "youtube", id: "Om6PSHBDB34" },
  mussuloCoast: { type: "youtube", id: "VFfqt5AOebE" },
  mussuloRomance: { type: "youtube", id: "VFfqt5AOebE" },
  luandaCity: { type: "youtube", id: "JXCkN8Xa_AM" },
  mufete: { type: "youtube", id: "JXCkN8Xa_AM" },
  memorial: { type: "youtube", id: "JXCkN8Xa_AM" },
  fortaleza: { type: "youtube", id: "JXCkN8Xa_AM" },
  kwanza: { type: "youtube", id: "lVGz0m0HW4M" },
  miradouro: { type: "youtube", id: "GGqtvK7a0tE" },
  dance: { type: "local", src: "/videos/traditional-dance.mp4" },
};

const storyHeadings = {
  serra: "A road carved into the highlands.",
  kalandula: "Where water becomes wonder.",
  miradouro: "A landscape that looks beyond Earth.",
  kwanza: "Angola’s great river, experienced slowly.",
  luandaCity: "A capital shaped by the Atlantic.",
  kissama: "The wild begins just beyond the city.",
  benguelaCoast: "Atlantic light and an unhurried coast.",
  lobito: "A harbour city where the Atlantic shapes the rhythm of life.",
  mbanzaCulture: "A kingdom whose story still lives.",
  cabo: "Where the city gives way to open ocean.",
};

function youtubeBackgroundUrl(id, start = 0) {
  const params = new URLSearchParams({
    autoplay: "1", mute: "1", controls: "1", loop: "1", playlist: id,
    modestbranding: "1", rel: "0", playsinline: "1", iv_load_policy: "3",
  });
  if (start > 0) params.set("start", String(start));
  return `https://www.youtube-nocookie.com/embed/${id}?${params.toString()}`;
}

function HeroMedia({ destination }) {
  const media = heroMedia[destination.id];
  if (!media) return <img src={destination.image} alt={destination.title} />;
  if (media.type === "local") {
    return <video autoPlay muted loop playsInline poster={destination.image} preload="metadata"><source src={media.src} type="video/mp4" /></video>;
  }
  return <>
    <img className="story-hero-fallback" src={destination.image} alt="" />
    <iframe className="story-hero-youtube" src={youtubeBackgroundUrl(media.id, media.start)} title={`${destination.title} cinematic destination video`} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />
  </>;
}

function formatDate(value) {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" }).format(new Date(`${value}T12:00:00`));
}

export default function DestinationStory({ destination, onClose }) {
  const { toggle, has } = useJourney();
  const itemId = destination ? `destination:${destination.id}` : "";
  const journeys = useMemo(() => journeyMatches[destination?.id] || [], [destination]);
  const departures = useMemo(() => {
    const ids = new Set(journeys.map(j => j.id));
    return signatureDepartures.filter(d => ids.has(d.journeyId));
  }, [journeys]);

  useEffect(() => {
    if (!destination) return;
    document.body.classList.add("destination-story-open");
    const key = e => e.key === "Escape" && onClose();
    window.addEventListener("keydown", key);
    return () => {
      document.body.classList.remove("destination-story-open");
      window.removeEventListener("keydown", key);
    };
  }, [destination, onClose]);

  if (!destination) return null;

  const addDestination = () => toggle({ ...destination, id: itemId, sourceId: destination.id, kind: "destination", days: parseFloat(destination.duration) || 0 });
  const craft = () => {
    onClose();
    window.setTimeout(() => {
      document.getElementById("contact")?.classList.add("is-revealed");
      document.getElementById("contact")?.setAttribute("aria-hidden", "false");
      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
    }, 180);
  };

  return <div className="destination-story" role="dialog" aria-modal="true" aria-label={`${destination.title} destination story`}>
    <button className="story-close" type="button" onClick={onClose} aria-label="Close destination story"><span>Close</span>×</button>
    <header className="story-hero">
      <HeroMedia destination={destination} />
      <div className="story-hero-shade"/>
      <div className="story-hero-copy"><p>{destination.province} · {destination.category}</p><h1>{destination.title}</h1><blockquote>“{destination.note}”</blockquote></div>
      <span className="story-scroll">Scroll to discover ↓</span>
    </header>

    <main className="story-body">
      <section className="story-introduction">
        <p className="eyebrow">The Story</p>
        <h2>{storyHeadings[destination.id] || "A place that stays with you."}</h2>
        <div><p>{destination.description}</p><p>{destination.id === "serra" ? "From Lubango’s cool plateau, the road descends through a breathtaking sequence of curves into a vast southern landscape. It is not simply a viewpoint; it is one of Angola’s great journeys, best experienced slowly, with time for mountain light, local stories and quiet observation." : "Imbondeiro reveals the destination through local knowledge, thoughtful pacing and experiences selected around the character of the place."}</p></div>
      </section>

      <section className="story-details">
        <div><p className="eyebrow">Highlights</p><ul>{destination.highlights.map(h => <li key={h}>{h}</li>)}</ul></div>
        <div><p className="eyebrow">Practical Details</p><dl><div><dt>Recommended stay</dt><dd>{destination.duration}</dd></div><div><dt>Best for</dt><dd>{destination.category} · Photography · Private journeys</dd></div><div><dt>Journey style</dt><dd>Private or curated small group</dd></div></dl></div>
      </section>

      <section className="story-journeys">
        <div className="story-section-heading"><p className="eyebrow">Travel With Imbondeiro</p><h2>Signature journeys featuring {destination.title}</h2></div>
        <div className="story-journey-grid">{journeys.length ? journeys.map(j => <article key={j.id}><span>Signature Journey</span><h3>{j.title}</h3><p>{j.description}</p><small>{j.meta}</small></article>) : <article><span>Tailor-Made</span><h3>Designed around you</h3><p>We can incorporate {destination.title} into a private itinerary shaped around your dates and interests.</p><small>Flexible dates · Personal planning</small></article>}</div>
      </section>

      <section className="story-departures">
        <div className="story-section-heading"><p className="eyebrow">Next Departures</p><h2>Choose a curated date—or travel privately.</h2></div>
        <div className="story-date-list">{departures.length ? departures.map(d => { const remaining = placesRemaining(d); return <article key={d.id}><div><strong>{formatDate(d.startDate)}</strong><small>{d.duration} · {d.travelStyle}</small></div><span className={`story-availability ${remaining <= 2 ? "limited" : ""}`}>{d.status === "sold-out" ? "Sold out" : `${remaining} places remaining`}</span></article> }) : <article><div><strong>Private dates available</strong><small>Choose your preferred travel period</small></div><span className="story-availability">Tailor-made</span></article>}</div>
      </section>

      <section className="story-actions"><div><p className="eyebrow">Your Journey</p><h2>Make this destination part of your story.</h2></div><div><button type="button" className={`story-add ${has(itemId) ? "selected" : ""}`} onClick={addDestination}>{has(itemId) ? "✓ Added to My Journey" : "+ Add to My Journey"}</button><button type="button" className="story-craft" onClick={craft}>Craft My Journey →</button></div></section>
    </main>
  </div>;
}
