"use client";

import { useMemo, useRef, useState } from "react";
import { useJourney } from "./JourneyContext";
import { useLanguage } from "./LanguageContext";
import DestinationStory from "./DestinationStory";

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
  kwanza: {
    id: "kwanza", title: "Kwanza River Journey", province: "Icolo e Bengo Province", category: "Nature",
    lng: 13.47, lat: -9.35, image: "/assets/kwanza-river-boat.png", duration: "Full day",
    note: "Follow Angola’s great river through calm waters, living history and wide natural horizons.",
    description: "Travel along the Kwanza River for a serene day of river scenery, cultural history, birdlife and remarkable landscapes south of Luanda.",
    highlights: ["Kwanza River cruise", "Birdlife and river scenery", "Cultural and historic stops"],
  },
  mbanzaCulture: {
    id: "mbanzaCulture", title: "M’banza Kongo", province: "Zaire Province", category: "Culture",
    lng: 14.25, lat: -6.27, image: "/assets/mbanza-kongo-approved.jpg", duration: "2–3 days",
    note: "A living cultural landscape where a historic kingdom still speaks through place and tradition.",
    description: "Discover the political and spiritual heart of the former Kingdom of Kongo and its continuing cultural importance.",
    highlights: ["Kingdom of Kongo", "UNESCO heritage", "Living traditions"],
  },
  luandaCity: {
    id: "luandaCity", title: "Luanda City Tour", province: "Luanda Province", category: "Culture",
    lng: 13.24, lat: -8.84, image: "/assets/highlight-luanda.jpg", duration: "Half or full day",
    note: "A capital of Atlantic light, layered history and unmistakable Angolan energy.",
    description: "Discover Luanda Bay, historic landmarks, contemporary city life and the cultural rhythm of Angola’s capital with an expert local guide.",
    highlights: ["Luanda Bay", "Historic city landmarks", "Contemporary Angolan culture"],
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
    id: "kissama", title: "Kissama National Park", province: "Icolo e Bengo Province", category: "Wildlife",
    lng: 13.55, lat: -9.75, image: "/assets/highlight-kissama.jpg", duration: "Full day",
    note: "Here, the landscape speaks in tracks, birdsong and the quiet movement of the wild.",
    description: "A safari journey through open landscapes and river environments, within easy reach of Luanda.",
    highlights: ["Safari drive", "Kwanza River", "Birdlife"],
  },
  benguelaCoast: {
    id: "benguelaCoast", title: "Benguela Coast / Baía Azul", province: "Benguela Province", category: "Coast",
    lng: 13.40, lat: -12.65, image: "/assets/benguela-coast-approved.webp", duration: "2–3 days",
    note: "Where golden cliffs meet calm Atlantic blue.",
    description: "Discover Benguela’s sweeping bay, beaches, fresh seafood and relaxed coastal character.",
    highlights: ["Baía Azul", "Benguela beaches", "Coastal dining"],
  },
  lobito: {
    id: "lobito", title: "Lobito", province: "Benguela Province", category: "Coast",
    lng: 13.54, lat: -12.35, image: "/assets/benguela-coast-approved.webp", duration: "1–2 days",
    note: "A graceful Atlantic harbour framed by the Restinga and Benguela’s coastal light.",
    description: "Explore Lobito’s historic port city, the Restinga peninsula, waterfront views and relaxed coastal atmosphere in Benguela Province.",
    highlights: ["Restinga Peninsula", "Lobito Bay", "Historic port city"],
  },
  cabo: {
    id: "cabo", title: "Cabo Ledo", province: "Icolo e Bengo Province", category: "Coast",
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


const PROVINCE_LABELS = [
  { name: "Cabinda", lng: 12.30, lat: -5.05 },
  { name: "Zaire", lng: 14.15, lat: -6.25 },
  { name: "Uíge", lng: 15.30, lat: -7.35 },
  { name: "Bengo", lng: 13.75, lat: -8.05 },
  { name: "Luanda", lng: 13.18, lat: -8.85 },
  { name: "Icolo e Bengo", lng: 14.25, lat: -9.05 },
  { name: "Cuanza Norte", lng: 15.15, lat: -9.25 },
  { name: "Malanje", lng: 16.85, lat: -9.65 },
  { name: "Lunda Norte", lng: 19.35, lat: -8.45 },
  { name: "Lunda Sul", lng: 20.00, lat: -10.95 },
  { name: "Cuanza Sul", lng: 14.75, lat: -11.55 },
  { name: "Benguela", lng: 13.55, lat: -12.55 },
  { name: "Huambo", lng: 15.65, lat: -12.75 },
  { name: "Bié", lng: 17.20, lat: -12.85 },
  { name: "Moxico", lng: 19.35, lat: -13.45 },
  { name: "Moxico Leste", lng: 22.20, lat: -12.10 },
  { name: "Namibe", lng: 12.65, lat: -15.10 },
  { name: "Huíla", lng: 14.80, lat: -15.05 },
  { name: "Cunene", lng: 16.05, lat: -16.55 },
  { name: "Cubango", lng: 18.65, lat: -16.10 },
  { name: "Cuando", lng: 21.65, lat: -15.25 },
];

const categoryDestinations = {
  Nature: ["kalandula", "serra", "miradouro", "kwanza"],
  Culture: ["luandaCity", "mbanzaCulture", "mufete", "dance"],
  Wildlife: ["kissama"],
  Coast: ["benguelaCoast", "lobito", "cabo", "mussuloCoast"],
  Romance: ["benguelaRomance", "mussuloRomance", "caboRomance"],
  Heritage: ["mbanzaHeritage", "memorial", "fortaleza"],
};

export default function Explorer() {
  const {t}=useLanguage();
  const [choice,setChoice]=useState("Nature");
  const [selectedId,setSelectedId]=useState("kalandula");
  const [storyId,setStoryId]=useState(null);
  const [zoom,setZoom]=useState(1);
  const [pan,setPan]=useState({x:0,y:0});
  const drag=useRef(null);

  const { items, toggle: toggleJourney, has, summary } = useJourney();
  const visibleIds=categoryDestinations[choice];
  const selected=destinations[selectedId]||destinations[visibleIds[0]];
  const journey=items;
  const mapJourney=useMemo(()=>items.filter(item=>Number.isFinite(item.lng)&&Number.isFinite(item.lat)),[items]);

  function journeyItem(id){
    const d=destinations[id];
    return { ...d, id:`destination:${d.id}`, sourceId:d.id, kind:"destination", days:parseFloat(d.duration)||0 };
  }
  function chooseCategory(id){setChoice(id);setSelectedId(categoryDestinations[id][0]);setZoom(1);setPan({x:0,y:0});}
  function toggle(id){toggleJourney(journeyItem(id));}
  function craft(){const detail=(journey.length?summary.label:selected.title);window.dispatchEvent(new CustomEvent("imbondeiro-journey",{detail}));document.getElementById("contact")?.scrollIntoView({behavior:"smooth"});}
  function down(e){if(e.target.closest("button"))return;drag.current={x:e.clientX,y:e.clientY,px:pan.x,py:pan.y};e.currentTarget.setPointerCapture?.(e.pointerId)}
  function move(e){if(!drag.current)return;setPan({x:drag.current.px+e.clientX-drag.current.x,y:drag.current.py+e.clientY-drag.current.y})}
  function up(e){drag.current=null;e.currentTarget.releasePointerCapture?.(e.pointerId)}
  function markerStyle(place){const p=project(place.lng,place.lat);return{left:`${p.x/MAP_W*100}%`,top:`${p.y/MAP_H*100}%`}}

  return <section className="explorer-section explorer-premium" id="explorer">
    <div className="section-intro centered"><p className="eyebrow">The Imbondeiro Explorer</p><h2>{t("whatCalls")}</h2><p>{t("choose")}</p></div>
    <div className="experience-tabs luxury-tabs">{categories.map(c=><button key={c.id} type="button" className={choice===c.id?"active":""} onClick={()=>chooseCategory(c.id)}><span>{c.symbol}</span>{t(c.id.toLowerCase())}</button>)}</div>

    <div className="living-layout">
      <aside className="living-left">
        <div className="living-heading"><h3>{t("explore")} <em>{t(choice.toLowerCase())}</em> {t("inAngola")}</h3><p>{t("selectReveal")}</p></div>
        <div className="living-cards">{visibleIds.map((id,index)=>{const d=destinations[id],active=selectedId===id,added=has(`destination:${id}`);return <article className={`living-card ${active?"active":""}`} key={id}>
          <button className="living-card-main" type="button" onClick={()=>{setSelectedId(id);setStoryId(id)}}><span className="living-num">{index+1}</span><img src={d.image} alt=""/><span className="living-card-copy"><small>{d.province}</small><strong>{d.title}</strong><i>{d.description}</i></span><b>›</b></button>
          <button className={`living-add ${added?"added":""}`} type="button" onClick={()=>toggle(id)} aria-label={`${added?"Remove":"Add"} ${d.title}`}>{added?"✓":"+"}</button>
        </article>})}</div>
        <p className="living-help">ⓘ Select destinations on the map or from the list to add them to your journey.</p>
      </aside>

      <div className={`living-map mood-${choice.toLowerCase()}`} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}>
        <div className="map-chapter-label"><span>ANGOLA</span><small>{choice} collection</small></div>
        <div className="living-map-canvas" style={{transform:`translate(${pan.x}px,${pan.y}px) scale(${zoom})`}}>
          <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} className="living-country" aria-label="Interactive map of Angola">
            <defs><linearGradient id="landLuxury" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#233d31"/><stop offset=".58" stopColor="#102a23"/><stop offset="1" stopColor="#071a16"/></linearGradient><filter id="landShadow"><feDropShadow dx="0" dy="0" stdDeviation="10" floodColor="#caa85b" floodOpacity=".24"/></filter><clipPath id="angolaClip">{ANGOLA_POLYGONS.map((polygon,i)=><path key={i} d={polygonPath(polygon)}/>)}</clipPath></defs>
            <g filter="url(#landShadow)">{ANGOLA_POLYGONS.map((polygon,i)=><path key={i} d={polygonPath(polygon)} className="living-land" fill="url(#landLuxury)"/>)}</g>
            <g clipPath="url(#angolaClip)" className="living-terrain"><path d="M90 250 C250 180 430 260 720 160"/><path d="M50 420 C250 330 490 470 810 330"/><path d="M70 610 C300 500 500 680 800 520"/><path d="M120 760 C330 650 560 790 760 700"/><path className="river" d="M275 155 C350 250 325 390 430 478 S575 660 515 830"/></g>
            <text x="445" y="520" className="living-angola-label">ANGOLA</text>
            <g className="living-province-labels" aria-label="Angola province names">
              {PROVINCE_LABELS.map(province => {
                const point = project(province.lng, province.lat);
                return <text key={province.name} x={point.x} y={point.y}>{province.name}</text>;
              })}
            </g>
            {mapJourney.slice(0,-1).map((aItem,i)=>{const bItem=mapJourney[i+1];const a=project(aItem.lng,aItem.lat);const b=project(bItem.lng,bItem.lat);return <path key={`${aItem.id}-${bItem.id}`} className="living-route journey-route" d={`M${a.x} ${a.y} Q${(a.x+b.x)/2+30} ${(a.y+b.y)/2-35} ${b.x} ${b.y}`}/>})}
          </svg>
          {visibleIds.map(id=>{const d=destinations[id],active=selectedId===id,added=has(`destination:${id}`);return <button key={id} type="button" className={`living-marker ${active?"active":""} ${added?"added":""}`} style={markerStyle(d)} onPointerDown={e=>e.stopPropagation()} onClick={()=>{setSelectedId(id);setStoryId(id)}} aria-label={`Explore ${d.title}`}><span className="pin"><i/></span><span className="marker-name">{d.title}<small>{d.province}</small></span></button>})}
        </div>
        <div className="living-map-controls" aria-label="Map controls"><button type="button" aria-label="Zoom in" onClick={()=>setZoom(z=>Math.min(1.65,z+.15))}>+</button><button type="button" aria-label="Zoom out" onClick={()=>setZoom(z=>Math.max(.88,z-.15))}>−</button><button type="button" aria-label="Reset map" onClick={()=>{setZoom(1);setPan({x:0,y:0})}}>⌂</button></div>
        <p className="map-instruction">Select a glowing marker · drag to explore · use + to save</p>
        <div className="living-compass">N<span>✦</span></div>
      </div>

      <aside className="living-journey" id="my-journey">
        <div className="journey-title"><span>▣</span><div><strong>{t("journey").toUpperCase()}</strong><small>{t("selectedDestinations")}</small></div><b>{journey.length}</b></div>
        <div className="journey-list">{journey.length?journey.map((d,i)=><article key={d.id}><img src={d.image} alt=""/><span><small>{i+1}</small><strong>{d.title}</strong><em>{d.province || d.meta || d.category || "Selected experience"}</em></span><button onClick={()=>toggleJourney(d)}>×</button></article>):<div className="journey-empty"><span>⌖</span><strong>{t("empty")}</strong><p>{t("emptyHelp")}</p></div>}</div>
        <div className="journey-smart">{summary.estimatedDays&&<span><strong>{t("duration")}:</strong> about {summary.estimatedDays} days<br/></span>}{summary.categories.length>0&&<span><strong>{t("travelStyle")}:</strong> {summary.categories.join(" · ")}</span>}</div><div className={`journey-awake ${journey.length>=3?"ready":""}`}><h3>{journey.length>=3?t("shape"):t("keep")}</h3><p>{journey.length>=3?`You’ve selected ${journey.length} inspiring destinations.`:t("shapeHelp")}</p><div className="journey-progress"><i className={journey.length>0?"on":""}/><i className={journey.length>1?"on":""}/><i className={journey.length>2?"on":""}/></div><button className="btn gold" type="button" onClick={craft}>{t("craft")} →</button></div>
      </aside>
    </div>

    <div className="living-story"><img src={selected.image} alt={selected.title}/><div><p className="eyebrow">{selected.province} · {selected.category}</p><h3>{selected.title}</h3><p>{selected.description}</p><dl><div><dt>{t("recommended")}</dt><dd>{selected.duration}</dd></div><div><dt>{t("note")}</dt><dd>“{selected.note}”</dd></div></dl><div className="living-story-actions"><button className="btn gold" onClick={()=>toggle(selected.id)}>{has(`destination:${selected.id}`)?t("remove"):t("add")}</button><button className="btn story-link" onClick={()=>setStoryId(selected.id)}>Discover the full story →</button></div></div></div>

    <div className="explorer-benefits" aria-label="Explorer benefits">
      <article><span>◭</span><div><strong>Curated Landscapes</strong><p>Waterfalls, highlands, coast and living heritage.</p></div></article>
      <article><span>⌖</span><div><strong>Interactive Discovery</strong><p>Choose freely and let your route take shape.</p></div></article>
      <article><span>✦</span><div><strong>Personal Journey</strong><p>Every saved place becomes part of your story.</p></div></article>
      <article><span>▤</span><div><strong>Thoughtful Planning</strong><p>Send one coherent journey to our travel team.</p></div></article>
    </div>
    <DestinationStory destination={storyId ? destinations[storyId] : null} onClose={()=>setStoryId(null)}/>
  </section>;
}
