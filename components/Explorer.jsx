"use client";

import { useEffect, useMemo, useState } from "react";

const categories = [
  { id: "Nature", label: "Nature", symbol: "◒" },
  { id: "Culture", label: "Culture", symbol: "◈" },
  { id: "Wildlife", label: "Wildlife", symbol: "◇" },
  { id: "Coast", label: "Coast", symbol: "≈" },
  { id: "Romance", label: "Romance", symbol: "♡" },
  { id: "Heritage", label: "Heritage", symbol: "⌂" },
];

const destinations = {
  kalandula: {
    id: "kalandula", title: "Kalandula Falls", province: "Malanje Province", category: "Nature",
    x: 61, y: 31, image: "/assets/highlight-kalandula.jpg", duration: "2–3 days",
    note: "Stand close enough to feel the mist. Nature has its own language.",
    description: "One of Africa’s great waterfalls, surrounded by lush landscapes, powerful mist and the quiet beauty of Malanje.",
    highlights: ["Kalandula Falls", "Malanje landscapes", "Scenic photography"],
  },
  serra: {
    id: "serra", title: "Serra da Leba", province: "Huíla Province", category: "Nature",
    x: 43, y: 75, image: "/assets/serra-da-leba-approved.jpg", duration: "3 days",
    note: "Some roads take you somewhere. This one changes how you see the journey.",
    description: "A dramatic mountain pass, cool highland air and one of Angola’s most unforgettable road journeys.",
    highlights: ["Serra da Leba Pass", "Lubango", "Panoramic viewpoints"],
  },
  miradouro: {
    id: "miradouro", title: "Miradouro da Lua", province: "Luanda Province", category: "Nature",
    x: 31, y: 47, image: "/assets/miradouro-da-lua-approved.jpg", duration: "Half day",
    note: "A lunar landscape shaped by time, colour and the Atlantic wind.",
    description: "Explore surreal cliffs and sculpted earth formations just south of Luanda, especially striking in the warm evening light.",
    highlights: ["Lunar formations", "Golden-hour views", "Easy Luanda extension"],
  },
  mbanzaCulture: {
    id: "mbanzaCulture", title: "M’banza Kongo", province: "Zaire Province", category: "Culture",
    x: 25, y: 14, image: "/assets/mbanza-kongo-approved.jpg", duration: "2–3 days",
    note: "A living cultural landscape where a historic kingdom still speaks through place and tradition.",
    description: "Discover the political and spiritual heart of the former Kingdom of Kongo and its continuing cultural importance.",
    highlights: ["Kingdom of Kongo", "UNESCO heritage", "Living traditions"],
  },
  mufete: {
    id: "mufete", title: "Luanda & Mufete", province: "Luanda Province", category: "Culture",
    x: 27, y: 39, image: "/assets/mufete-angolan-dish.png", duration: "Half or full day",
    note: "A destination is also remembered through its flavours.",
    description: "Experience Luanda through one of Angola’s best-loved dishes, local hospitality and the stories shared around the table.",
    highlights: ["Traditional Mufete", "Local cuisine", "Luanda hospitality"],
  },
  dance: {
    id: "dance", title: "Traditional Angolan Dance", province: "Cultural Angola", category: "Culture",
    x: 48, y: 54, image: "/assets/angolan-culture-dance.png", duration: "Tailored experience",
    note: "The rhythm is not simply heard—it welcomes you.",
    description: "Meet Angola through movement, drums, textiles and living traditions shared with warmth and authenticity.",
    highlights: ["Live performance", "Traditional rhythms", "Cultural exchange"],
  },
  kissama: {
    id: "kissama", title: "Kissama National Park", province: "Luanda / Bengo", category: "Wildlife",
    x: 35, y: 49, image: "/assets/highlight-kissama.jpg", duration: "Full day",
    note: "Here, the landscape speaks in tracks, birdsong and the quiet movement of the wild.",
    description: "A safari journey through open landscapes and river environments, within easy reach of Luanda.",
    highlights: ["Safari drive", "Kwanza River", "Birdlife"],
  },
  benguelaCoast: {
    id: "benguelaCoast", title: "Benguela Coast", province: "Benguela Province", category: "Coast",
    x: 33, y: 66, image: "/assets/benguela-coast-approved.webp", duration: "2–3 days",
    note: "Where golden cliffs meet calm Atlantic blue.",
    description: "Discover Benguela’s sweeping bay, beaches, fresh seafood and relaxed coastal character.",
    highlights: ["Baía Azul", "Benguela beaches", "Coastal dining"],
  },
  cabo: {
    id: "cabo", title: "Cabo Ledo", province: "Luanda Province", category: "Coast",
    x: 35, y: 54, image: "/assets/cabo-ledo-angola.jpg", duration: "Full day or overnight",
    note: "A wild Atlantic horizon made for freedom, salt air and unhurried days.",
    description: "Discover sweeping beaches, surf-friendly waves and a relaxed coastal atmosphere south of Luanda.",
    highlights: ["Atlantic beach", "Surf and swimming", "Coastal dining"],
  },
  mussuloCoast: {
    id: "mussuloCoast", title: "Mussulo Peninsula", province: "Luanda Province", category: "Coast",
    x: 26, y: 45, image: "/assets/mussulo-luxury-island-escape.png", duration: "Full day",
    note: "Where time slows down and the Atlantic whispers.",
    description: "A calm-water peninsula escape with boat transfers, seafood, beach relaxation and optional private experiences.",
    highlights: ["Boat transfer", "Calm-water beach", "Fresh seafood"],
  },
  benguelaRomance: {
    id: "benguelaRomance", title: "Benguela Romantic Escape", province: "Benguela Province", category: "Romance",
    x: 33, y: 66, image: "/assets/benguela-romance-approved.jpg", duration: "3 days",
    note: "Some coastlines are visited. Others become part of your story.",
    description: "Blue water, dramatic cliffs and quiet coastal moments create a memorable escape designed for two.",
    highlights: ["Baía Azul", "Private coastal moments", "Sunset experiences"],
  },
  mussuloRomance: {
    id: "mussuloRomance", title: "Mussulo Peninsula", province: "Luanda Province", category: "Romance",
    x: 26, y: 45, image: "/assets/mussulo-luxury-island-escape.png", duration: "Full day or overnight",
    note: "A quiet shoreline, warm light and time reserved entirely for two.",
    description: "A private island-style escape with calm water, relaxed dining and optional romantic enhancements.",
    highlights: ["Private boat option", "Beach relaxation", "Sunset dining"],
  },
  caboRomance: {
    id: "caboRomance", title: "Cabo Ledo for Two", province: "Luanda Province", category: "Romance",
    x: 35, y: 54, image: "/assets/cabo-ledo-angola.jpg", duration: "Overnight",
    note: "Ocean air, warm sunsets and the freedom to slow down together.",
    description: "An intimate Atlantic escape with beach time, coastal dining and a beautifully unhurried pace.",
    highlights: ["Ocean-view stay", "Sunset", "Private dining option"],
  },
  mbanzaHeritage: {
    id: "mbanzaHeritage", title: "M’banza Kongo", province: "Zaire Province", category: "Heritage",
    x: 25, y: 14, image: "/assets/mbanza-kongo-approved.jpg", duration: "2–3 days",
    note: "Walk through the historic heart of a kingdom whose influence crossed borders and centuries.",
    description: "Explore the ancient capital of the Kingdom of Kongo, its sacred places and UNESCO-recognised historic landscape.",
    highlights: ["UNESCO World Heritage", "Kingdom of Kongo", "Historic centre"],
  },
  memorial: {
    id: "memorial", title: "Agostinho Neto Memorial", province: "Luanda Province", category: "Heritage",
    x: 28, y: 38, image: "/assets/agostinho-neto-memorial-approved.jpg", duration: "Half day",
    note: "A modern monument to memory, independence and national identity.",
    description: "Visit one of Luanda’s most recognisable landmarks, dedicated to Angola’s first President and the country’s independence story.",
    highlights: ["National history", "Monumental architecture", "Luanda landmark"],
  },
  fortaleza: {
    id: "fortaleza", title: "Fortaleza de São Miguel", province: "Luanda Province", category: "Heritage",
    x: 29, y: 36, image: "/assets/fortaleza-sao-miguel-approved.jpg", duration: "Half day",
    note: "From this historic hilltop, centuries of Angola’s story look out across the bay.",
    description: "Explore one of Luanda’s defining historic sites, its military heritage, murals, museum collections and city views.",
    highlights: ["Military history", "Historic murals", "Luanda views"],
  },
};

const categoryDestinations = {
  Nature: ["kalandula", "serra", "miradouro"],
  Culture: ["mbanzaCulture", "mufete", "dance"],
  Wildlife: ["kissama"],
  Coast: ["benguelaCoast", "cabo", "mussuloCoast"],
  Romance: ["benguelaRomance", "mussuloRomance", "caboRomance"],
  Heritage: ["mbanzaHeritage", "memorial", "fortaleza"],
};

export default function Explorer() {
  const [choice, setChoice] = useState("Nature");
  const [selectedId, setSelectedId] = useState("kalandula");
  const [explored, setExplored] = useState([]);
  const [ready, setReady] = useState(false);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("imbondeiro-explored") || "[]");
      if (Array.isArray(saved)) setExplored(saved.filter((id) => destinations[id]));
    } catch {}
    finally { setReady(true); }
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem("imbondeiro-explored", JSON.stringify(explored));
  }, [explored, ready]);

  const visibleIds = categoryDestinations[choice];
  const selected = destinations[selectedId] || destinations[visibleIds[0]];
  const journey = useMemo(() => explored.map((id) => destinations[id]).filter(Boolean), [explored]);
  const isTakingShape = journey.length >= 3;

  function chooseCategory(category) {
    setChoice(category);
    setSelectedId(categoryDestinations[category][0]);
    setZoom(1);
  }
  function toggleJourney(id) {
    setExplored((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  }
  function craftJourney() {
    const titles = journey.map((item) => item.title);
    const detail = titles.length ? titles.join(" → ") : selected.title;
    window.dispatchEvent(new CustomEvent("imbondeiro-journey", { detail }));
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section className="explorer-section" id="explorer">
      <div className="section-intro centered">
        <p className="eyebrow">The Imbondeiro Explorer</p>
        <h2>What calls you to Angola?</h2>
        <p>Choose an experience to explore the destinations that speak to you.</p>
      </div>

      <div className="explorer-shell">
        <div className="experience-tabs" aria-label="Choose an experience">
          {categories.map((category) => (
            <button type="button" className={choice === category.id ? "active" : ""} onClick={() => chooseCategory(category.id)} key={category.id} aria-pressed={choice === category.id}>
              <span aria-hidden="true">{category.symbol}</span>{category.label}
            </button>
          ))}
        </div>

        <div className="explorer-grid">
          <aside className="destination-column">
            <div className="destination-column-intro">
              <h3>Explore <em>{choice}</em> in Angola</h3>
              <p>Select a destination to reveal its story, then add it to your journey.</p>
            </div>
            <div className="destination-selector" aria-label={`${choice} journeys`}>
              {visibleIds.map((id, index) => {
                const place = destinations[id];
                const active = selectedId === id;
                const added = explored.includes(id);
                return (
                  <article className={`destination-choice ${active ? "active" : ""}`} key={id}>
                    <button type="button" className="destination-choice-main" onClick={() => setSelectedId(id)} aria-pressed={active}>
                      <span className="choice-number">{index + 1}</span>
                      <img src={place.image} alt="" />
                      <span><small>{place.province}</small><strong>{place.title}</strong></span>
                    </button>
                    <button type="button" className={`destination-choice-add ${added ? "added" : ""}`} onClick={() => toggleJourney(id)} aria-label={`${added ? "Remove" : "Add"} ${place.title} ${added ? "from" : "to"} My Journey`}>{added ? "✓" : "+"}</button>
                  </article>
                );
              })}
            </div>
          </aside>

          <div className={`map-outline mood-${choice.toLowerCase()}`}>
            <div className="map-viewport">
              <div className="angola-map" style={{ transform: `scale(${zoom})` }} role="group" aria-label={`Interactive Angola map showing ${choice} destinations`}>
                <svg className="angola-map-art" viewBox="0 0 500 700" aria-hidden="true">
                  <defs>
                    <linearGradient id="land" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#2f735d"/><stop offset="1" stopColor="#0d3228"/></linearGradient>
                  </defs>
                  <path className="angola-country" fill="#174b3b" stroke="#c6a25a" strokeWidth="4" vectorEffect="non-scaling-stroke" d="M193 28 L325 48 L403 116 L383 208 L428 285 L405 381 L463 469 L405 573 L329 674 L213 641 L161 576 L92 527 L58 411 L91 313 L75 224 L129 114 Z"/>
                  <path className="cabinda" fill="#215845" stroke="#c6a25a" strokeWidth="4" vectorEffect="non-scaling-stroke" d="M86 38 L143 30 L163 70 L126 100 L82 80 Z"/>
                  <path className="river-line" fill="none" stroke="#65b9ad" strokeOpacity="0.5" strokeWidth="3" vectorEffect="non-scaling-stroke" d="M130 170 C210 210 205 330 320 395 S375 510 338 620"/>
                  <path className="contour-line" fill="none" stroke="#f6f1e8" strokeOpacity="0.16" strokeWidth="2" vectorEffect="non-scaling-stroke" d="M112 260 C180 230 265 250 360 218"/>
                  <path className="contour-line" fill="none" stroke="#f6f1e8" strokeOpacity="0.16" strokeWidth="2" vectorEffect="non-scaling-stroke" d="M110 420 C190 390 285 430 398 388"/>
                  <path className="contour-line" fill="none" stroke="#f6f1e8" strokeOpacity="0.16" strokeWidth="2" vectorEffect="non-scaling-stroke" d="M145 535 C235 500 306 555 382 525"/>
                </svg>
                <svg className="journey-routes" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                  {visibleIds.slice(0, -1).map((id, index) => {
                    const from = destinations[id];
                    const to = destinations[visibleIds[index + 1]];
                    return <path key={`${id}-${to.id}`} d={`M ${from.x} ${from.y} Q ${(from.x + to.x) / 2 + 6} ${(from.y + to.y) / 2 - 5} ${to.x} ${to.y}`} pathLength="1"/>;
                  })}
                </svg>
                {visibleIds.map((id, index) => {
                  const place = destinations[id];
                  const active = selectedId === id;
                  const visited = explored.includes(id);
                  return (
                    <button type="button" key={id} className={`destination-marker ${active ? "active" : ""} ${visited ? "visited" : ""}`} style={{ left: `${place.x}%`, top: `${place.y}%`, "--marker-delay": `${index * 160}ms` }} onClick={() => setSelectedId(id)} aria-label={`Show ${place.title}`} aria-pressed={active}>
                      <i aria-hidden="true"/><span>{place.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="map-controls" aria-label="Map controls">
              <button type="button" onClick={() => setZoom((z) => Math.min(1.35, +(z + 0.1).toFixed(2)))} aria-label="Zoom in">+</button>
              <button type="button" onClick={() => setZoom((z) => Math.max(0.85, +(z - 0.1).toFixed(2)))} aria-label="Zoom out">−</button>
              <button type="button" onClick={() => setZoom(1)} aria-label="Reset map">↺</button>
            </div>
            <div className="map-whisper">Click a glowing destination to reveal its story</div>
          </div>

          <aside className={`journey-sidebar ${isTakingShape ? "is-awake" : ""}`} aria-live="polite">
            <div className="journey-sidebar-head"><p className="eyebrow">My Journey</p><span>{journey.length}</span></div>
            {journey.length === 0 ? (
              <div className="journey-empty"><strong>Your journey is empty</strong><p>Start exploring and add destinations to begin.</p></div>
            ) : (
              <ol className="journey-sidebar-list">
                {journey.map((place, index) => (
                  <li key={place.id}>
                    <button type="button" onClick={() => setSelectedId(place.id)}>
                      <img src={place.image} alt=""/><span><small>{String(index + 1).padStart(2, "0")}</small><strong>{place.title}</strong><em>{place.province}</em></span>
                    </button>
                    <button type="button" className="journey-remove" onClick={() => toggleJourney(place.id)} aria-label={`Remove ${place.title}`}>×</button>
                  </li>
                ))}
              </ol>
            )}
            <div className="journey-sidebar-cta">
              <h3>{isTakingShape ? "Your Journey Is Taking Shape" : "Keep exploring"}</h3>
              <p>{isTakingShape ? "You have selected three or more destinations. Your personal Angola route is ready to be crafted." : `Add ${Math.max(0, 3 - journey.length)} more destination${3 - journey.length === 1 ? "" : "s"} to shape your journey.`}</p>
              {journey.length > 0 && <button type="button" className="btn gold" onClick={craftJourney}>Craft My Journey</button>}
            </div>
          </aside>
        </div>

        <article className="map-panel" key={selected.id}>
          <div className="destination-photo"><img src={selected.image} alt={selected.title}/></div>
          <div className="destination-panel-body">
            <p className="eyebrow">{selected.province} · {selected.category}</p>
            <h3>{selected.title}</h3>
            <p>{selected.description}</p>
            <div className="destination-facts"><span>Recommended stay</span><strong>{selected.duration}</strong></div>
            <ul>{selected.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}</ul>
            <blockquote>“{selected.note}”</blockquote>
            <button type="button" className={`btn gold ${explored.includes(selected.id) ? "is-added" : ""}`} onClick={() => toggleJourney(selected.id)}>{explored.includes(selected.id) ? "Remove from My Journey" : "Add to My Journey"}</button>
          </div>
        </article>
      </div>
    </section>
  );
}
