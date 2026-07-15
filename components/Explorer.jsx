"use client";

import { useEffect, useMemo, useRef, useState } from "react";

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
    lng: 16.00, lat: -9.08, image: "/assets/highlight-kalandula.jpg", duration: "2–3 days",
    note: "Stand close enough to feel the mist. Nature has its own language.",
    description: "One of Africa’s great waterfalls, surrounded by lush landscapes, powerful mist and the quiet beauty of Malanje.",
    highlights: ["Kalandula Falls", "Malanje landscapes", "Scenic photography"],
  },
  serra: {
    id: "serra", title: "Serra da Leba", province: "Huíla Province", category: "Nature",
    lng: 13.24, lat: -15.07, image: "/assets/serra-da-leba-approved.jpg", duration: "3 days",
    note: "Some roads take you somewhere. This one changes how you see the journey.",
    description: "A dramatic mountain pass, cool highland air and one of Angola’s most unforgettable road journeys.",
    highlights: ["Serra da Leba Pass", "Lubango", "Panoramic viewpoints"],
  },
  miradouro: {
    id: "miradouro", title: "Miradouro da Lua", province: "Luanda Province", category: "Nature",
    lng: 13.22, lat: -9.17, image: "/assets/miradouro-da-lua-approved.jpg", duration: "Half day",
    note: "A lunar landscape shaped by time, colour and the Atlantic wind.",
    description: "Explore surreal cliffs and sculpted earth formations just south of Luanda, especially striking in the warm evening light.",
    highlights: ["Lunar formations", "Golden-hour views", "Easy Luanda extension"],
  },
  mbanzaCulture: {
    id: "mbanzaCulture", title: "M’banza Kongo", province: "Zaire Province", category: "Culture",
    lng: 14.25, lat: -6.27, image: "/assets/mbanza-kongo-approved.jpg", duration: "2–3 days",
    note: "A living cultural landscape where a historic kingdom still speaks through place and tradition.",
    description: "Discover the political and spiritual heart of the former Kingdom of Kongo and its continuing cultural importance.",
    highlights: ["Kingdom of Kongo", "UNESCO heritage", "Living traditions"],
  },
  mufete: {
    id: "mufete", title: "Luanda & Mufete", province: "Luanda Province", category: "Culture",
    lng: 13.23, lat: -8.84, image: "/assets/mufete-angolan-dish.png", duration: "Half or full day",
    note: "A destination is also remembered through its flavours.",
    description: "Experience Luanda through one of Angola’s best-loved dishes, local hospitality and the stories shared around the table.",
    highlights: ["Traditional Mufete", "Local cuisine", "Luanda hospitality"],
  },
  dance: {
    id: "dance", title: "Traditional Angolan Dance", province: "Cultural Angola", category: "Culture",
    lng: 16.10, lat: -12.20, image: "/assets/angolan-culture-dance.png", duration: "Tailored experience",
    note: "The rhythm is not simply heard—it welcomes you.",
    description: "Meet Angola through movement, drums, textiles and living traditions shared with warmth and authenticity.",
    highlights: ["Live performance", "Traditional rhythms", "Cultural exchange"],
  },
  kissama: {
    id: "kissama", title: "Kissama National Park", province: "Luanda / Bengo", category: "Wildlife",
    lng: 13.55, lat: -9.75, image: "/assets/highlight-kissama.jpg", duration: "Full day",
    note: "Here, the landscape speaks in tracks, birdsong and the quiet movement of the wild.",
    description: "A safari journey through open landscapes and river environments, within easy reach of Luanda.",
    highlights: ["Safari drive", "Kwanza River", "Birdlife"],
  },
  benguelaCoast: {
    id: "benguelaCoast", title: "Benguela Coast", province: "Benguela Province", category: "Coast",
    lng: 13.41, lat: -12.58, image: "/assets/benguela-coast-approved.webp", duration: "2–3 days",
    note: "Where golden cliffs meet calm Atlantic blue.",
    description: "Discover Benguela’s sweeping bay, beaches, fresh seafood and relaxed coastal character.",
    highlights: ["Baía Azul", "Benguela beaches", "Coastal dining"],
  },
  cabo: {
    id: "cabo", title: "Cabo Ledo", province: "Luanda Province", category: "Coast",
    lng: 13.21, lat: -9.68, image: "/assets/cabo-ledo-angola.jpg", duration: "Full day or overnight",
    note: "A wild Atlantic horizon made for freedom, salt air and unhurried days.",
    description: "Discover sweeping beaches, surf-friendly waves and a relaxed coastal atmosphere south of Luanda.",
    highlights: ["Atlantic beach", "Surf and swimming", "Coastal dining"],
  },
  mussuloCoast: {
    id: "mussuloCoast", title: "Mussulo Peninsula", province: "Luanda Province", category: "Coast",
    lng: 13.08, lat: -9.02, image: "/assets/mussulo-luxury-island-escape.png", duration: "Full day",
    note: "Where time slows down and the Atlantic whispers.",
    description: "A calm-water peninsula escape with boat transfers, seafood, beach relaxation and optional private experiences.",
    highlights: ["Boat transfer", "Calm-water beach", "Fresh seafood"],
  },
  benguelaRomance: {
    id: "benguelaRomance", title: "Benguela Romantic Escape", province: "Benguela Province", category: "Romance",
    lng: 13.41, lat: -12.58, image: "/assets/benguela-romance-approved.jpg", duration: "3 days",
    note: "Some coastlines are visited. Others become part of your story.",
    description: "Blue water, dramatic cliffs and quiet coastal moments create a memorable escape designed for two.",
    highlights: ["Baía Azul", "Private coastal moments", "Sunset experiences"],
  },
  mussuloRomance: {
    id: "mussuloRomance", title: "Mussulo Peninsula", province: "Luanda Province", category: "Romance",
    lng: 13.08, lat: -9.02, image: "/assets/mussulo-luxury-island-escape.png", duration: "Full day or overnight",
    note: "A quiet shoreline, warm light and time reserved entirely for two.",
    description: "A private island-style escape with calm water, relaxed dining and optional romantic enhancements.",
    highlights: ["Private boat option", "Beach relaxation", "Sunset dining"],
  },
  caboRomance: {
    id: "caboRomance", title: "Cabo Ledo for Two", province: "Luanda Province", category: "Romance",
    lng: 13.21, lat: -9.68, image: "/assets/cabo-ledo-angola.jpg", duration: "Overnight",
    note: "Ocean air, warm sunsets and the freedom to slow down together.",
    description: "An intimate Atlantic escape with beach time, coastal dining and a beautifully unhurried pace.",
    highlights: ["Ocean-view stay", "Sunset", "Private dining option"],
  },
  mbanzaHeritage: {
    id: "mbanzaHeritage", title: "M’banza Kongo", province: "Zaire Province", category: "Heritage",
    lng: 14.25, lat: -6.27, image: "/assets/mbanza-kongo-approved.jpg", duration: "2–3 days",
    note: "Walk through the historic heart of a kingdom whose influence crossed borders and centuries.",
    description: "Explore the ancient capital of the Kingdom of Kongo, its sacred places and UNESCO-recognised historic landscape.",
    highlights: ["UNESCO World Heritage", "Kingdom of Kongo", "Historic centre"],
  },
  memorial: {
    id: "memorial", title: "Agostinho Neto Memorial", province: "Luanda Province", category: "Heritage",
    lng: 13.23, lat: -8.82, image: "/assets/agostinho-neto-memorial-approved.jpg", duration: "Half day",
    note: "A modern monument to memory, independence and national identity.",
    description: "Visit one of Luanda’s most recognisable landmarks, dedicated to Angola’s first President and the country’s independence story.",
    highlights: ["National history", "Monumental architecture", "Luanda landmark"],
  },
  fortaleza: {
    id: "fortaleza", title: "Fortaleza de São Miguel", province: "Luanda Province", category: "Heritage",
    lng: 13.22, lat: -8.81, image: "/assets/fortaleza-sao-miguel-approved.jpg", duration: "Half day",
    note: "From this historic hilltop, centuries of Angola’s story look out across the bay.",
    description: "Explore one of Luanda’s defining historic sites, its military heritage, murals, museum collections and city views.",
    highlights: ["Military history", "Historic murals", "Luanda views"],
  },
};

const ANGOLA_POLYGONS = [
  [[16.326528,-5.87747],[16.57318,-6.622645],[16.860191,-7.222298],[17.089996,-7.545689],[17.47297,-8.068551],[18.134222,-7.987678],[18.464176,-7.847014],[19.016752,-7.988246],[19.166613,-7.738184],[19.417502,-7.155429],[20.037723,-7.116361],[20.091622,-6.94309],[20.601823,-6.939318],[20.514748,-7.299606],[21.728111,-7.290872],[21.746456,-7.920085],[21.949131,-8.305901],[21.801801,-8.908707],[21.875182,-9.523708],[22.208753,-9.894796],[22.155268,-11.084801],[22.402798,-10.993075],[22.837345,-11.017622],[23.456791,-10.867863],[23.912215,-10.926826],[24.017894,-11.237298],[23.904154,-11.722282],[24.079905,-12.191297],[23.930922,-12.565848],[24.016137,-12.911046],[21.933886,-12.898437],[21.887843,-16.08031],[22.562478,-16.898451],[23.215048,-17.523116],[21.377176,-17.930636],[18.956187,-17.789095],[18.263309,-17.309951],[14.209707,-17.353101],[14.058501,-17.423381],[13.462362,-16.971212],[12.814081,-16.941343],[12.215461,-17.111668],[11.734199,-17.301889],[11.640096,-16.673142],[11.778537,-15.793816],[12.123581,-14.878316],[12.175619,-14.449144],[12.500095,-13.5477],[12.738479,-13.137906],[13.312914,-12.48363],[13.633721,-12.038645],[13.738728,-11.297863],[13.686379,-10.731076],[13.387328,-10.373578],[13.120988,-9.766897],[12.87537,-9.166934],[12.929061,-8.959091],[13.236433,-8.562629],[12.93304,-7.596539],[12.728298,-6.927122],[12.227347,-6.294448],[12.322432,-6.100092],[12.735171,-5.965682],[13.024869,-5.984389],[13.375597,-5.864241],[16.326528,-5.87747]],
  [[12.436688,-5.684304],[12.182337,-5.789931],[11.914963,-5.037987],[12.318608,-4.60623],[12.62076,-4.438023],[12.995517,-4.781103],[12.631612,-4.991271],[12.468004,-5.248362],[12.436688,-5.684304]]
];

const MAP_BOUNDS = { minLng: 11.3, maxLng: 24.4, minLat: -18.35, maxLat: -4.15 };
const MAP_W = 860;
const MAP_H = 920;
const MAP_PAD = 55;

function project(lng, lat) {
  const x = MAP_PAD + ((lng - MAP_BOUNDS.minLng) / (MAP_BOUNDS.maxLng - MAP_BOUNDS.minLng)) * (MAP_W - MAP_PAD * 2);
  const y = MAP_PAD + ((MAP_BOUNDS.maxLat - lat) / (MAP_BOUNDS.maxLat - MAP_BOUNDS.minLat)) * (MAP_H - MAP_PAD * 2);
  return { x, y };
}

function polygonPath(points) {
  return points.map(([lng, lat], index) => {
    const p = project(lng, lat);
    return `${index ? "L" : "M"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
  }).join(" ") + " Z";
}

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
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragRef = useRef(null);

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
    setPan({ x: 0, y: 0 });
  }
  function toggleJourney(id) {
    setExplored((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  }
  function beginDrag(event) {
    if (event.button !== undefined && event.button !== 0) return;
    dragRef.current = { x: event.clientX, y: event.clientY, panX: pan.x, panY: pan.y };
    setDragging(true);
    event.currentTarget.setPointerCapture?.(event.pointerId);
  }
  function moveDrag(event) {
    if (!dragRef.current) return;
    const dx = event.clientX - dragRef.current.x;
    const dy = event.clientY - dragRef.current.y;
    setPan({ x: dragRef.current.panX + dx, y: dragRef.current.panY + dy });
  }
  function endDrag(event) {
    dragRef.current = null;
    setDragging(false);
    event.currentTarget.releasePointerCapture?.(event.pointerId);
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
            <div
              className={`map-viewport ${dragging ? "is-dragging" : ""}`}
              onPointerDown={beginDrag}
              onPointerMove={moveDrag}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
              onPointerLeave={endDrag}
            >
              <svg className="angola-live-map" viewBox={`0 0 ${MAP_W} ${MAP_H}`} role="img" aria-label={`Interactive map of Angola showing ${choice} destinations`}>
                <defs>
                  <linearGradient id="angolaLand" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#193e32" />
                    <stop offset=".52" stopColor="#0d2e26" />
                    <stop offset="1" stopColor="#071c18" />
                  </linearGradient>
                  <radialGradient id="mapGlow">
                    <stop offset="0" stopColor="#d9b45f" stopOpacity=".28" />
                    <stop offset="1" stopColor="#d9b45f" stopOpacity="0" />
                  </radialGradient>
                  <filter id="softGlow" x="-80%" y="-80%" width="260%" height="260%">
                    <feGaussianBlur stdDeviation="8" result="blur" />
                    <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                  </filter>
                  <filter id="mapTexture">
                    <feTurbulence type="fractalNoise" baseFrequency=".018" numOctaves="3" seed="7" result="noise" />
                    <feColorMatrix in="noise" type="saturate" values="0" result="mono" />
                    <feComponentTransfer in="mono"><feFuncA type="table" tableValues="0 .17" /></feComponentTransfer>
                    <feBlend in="SourceGraphic" in2="mono" mode="soft-light" />
                  </filter>
                </defs>
                <g className="map-pan-layer" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: `${MAP_W / 2}px ${MAP_H / 2}px` }}>
                  <ellipse cx="420" cy="470" rx="380" ry="430" fill="url(#mapGlow)" opacity=".42" />
                  {ANGOLA_POLYGONS.map((polygon, index) => (
                    <path key={index} d={polygonPath(polygon)} className="angola-geography" fill="url(#angolaLand)" filter="url(#mapTexture)" />
                  ))}
                  <path className="map-river" d="M235 224 C300 300 320 390 402 463 S530 618 487 790" />
                  <path className="map-contour" d="M180 350 C310 300 470 330 640 282" />
                  <path className="map-contour" d="M160 515 C310 470 500 535 680 455" />
                  <path className="map-contour" d="M190 680 C360 610 510 700 650 625" />
                  <text x="445" y="515" className="angola-label">ANGOLA</text>
                  {visibleIds.slice(0, -1).map((id, index) => {
                    const a = project(destinations[id].lng, destinations[id].lat);
                    const b = project(destinations[visibleIds[index + 1]].lng, destinations[visibleIds[index + 1]].lat);
                    return <path key={`${id}-route`} className="live-route" d={`M ${a.x} ${a.y} Q ${(a.x+b.x)/2 + 38} ${(a.y+b.y)/2 - 25} ${b.x} ${b.y}`} pathLength="1" />;
                  })}
                  {visibleIds.map((id, index) => {
                    const place = destinations[id];
                    const p = project(place.lng, place.lat);
                    const active = selectedId === id;
                    const visited = explored.includes(id);
                    return (
                      <g key={id} className={`svg-marker ${active ? "active" : ""} ${visited ? "visited" : ""}`} transform={`translate(${p.x} ${p.y})`} onClick={(event) => { event.stopPropagation(); setSelectedId(id); }} role="button" tabIndex="0" onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") setSelectedId(id); }} aria-label={`Show ${place.title}`}>
                        <circle className="marker-halo" r="27" />
                        <path className="marker-pin" d="M0-20C-12-20-21-11-21 1c0 15 21 34 21 34S21 16 21 1C21-11 12-20 0-20Z" />
                        <circle className="marker-core" cy="0" r="6" />
                        {visited && <text className="marker-check" x="0" y="4">✓</text>}
                        <g className="marker-label" transform="translate(28 -13)">
                          <rect x="0" y="0" rx="5" width={Math.max(112, place.title.length * 8.2)} height="31" />
                          <text x="10" y="20">{place.title}</text>
                        </g>
                      </g>
                    );
                  })}
                </g>
              </svg>
            </div>
            <div className="map-controls" aria-label="Map controls">
              <button type="button" onClick={() => setZoom((z) => Math.min(1.8, +(z + 0.15).toFixed(2)))} aria-label="Zoom in">+</button>
              <button type="button" onClick={() => setZoom((z) => Math.max(0.82, +(z - 0.15).toFixed(2)))} aria-label="Zoom out">−</button>
              <button type="button" onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }} aria-label="Reset map">↺</button>
            </div>
            <div className="map-whisper">Tap a glowing marker · drag to explore · use + to save</div>
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
