"use client";

import { useEffect, useMemo, useRef } from "react";
import { signatureDepartures, placesRemaining } from "../data/signatureDepartures";
import { useJourney } from "./JourneyContext";
import { trackEvent } from "./Analytics";

const journeyMatches = {
  serra: [{ id:"signature:lubango-serra",title:"Lubango & Serra da Leba",meta:"4 days / 3 nights · Highlands",description:"A cinematic journey through Lubango, Tundavala and the legendary curves of Serra da Leba." }],
  kalandula: [{ id:"signature:kalandula-malanje",title:"Kalandula Falls & Malanje",meta:"3 days / 2 nights · Nature",description:"Waterfalls, Pedras Negras and the lush landscapes of Malanje in one carefully paced journey." }],
  kissama: [{ id:"signature:kissama",title:"Kissama Safari Escape",meta:"Full day · Wildlife",description:"A guided safari experience within easy reach of Luanda, enriched by river and landscape stops." }],
  miradouro: [{ id:"signature:kwanza",title:"Kwanza River & Southern Luanda",meta:"Full day · Nature & heritage",description:"Combine Miradouro da Lua with the Kwanza River and cultural landmarks south of Luanda." }],
  kwanza: [{ id:"signature:kwanza",title:"Kwanza River Journey",meta:"8 hours · Nature & heritage",description:"River tranquillity, cultural history and extraordinary viewpoints south of the capital." }],
  luandaCity: [{ id:"signature:luanda-city",title:"Luanda City Welcome",meta:"4 hours · Culture",description:"A private introduction to Angola’s capital, its history, bay, architecture and living culture." }],
  mbanzaCulture: [{id:"signature:mbanza-kongo",title:"M’Banza Kongo Heritage Journey",meta:"3 days / 2 nights · Culture",description:"Explore the former Kingdom of Kongo through sacred places, archaeology and living traditions."}],
  mbanzaHeritage: [{id:"signature:mbanza-kongo",title:"M’Banza Kongo Heritage Journey",meta:"3 days / 2 nights · Heritage",description:"A considered journey into one of Africa’s most important historic landscapes."}],
  cabo: [{id:"signature:cabo-ledo",title:"Cabo Ledo Atlantic Escape",meta:"Full day or overnight · Coast",description:"Open beaches, coastal dining and time shaped around the Atlantic."}],
  benguelaCoast: [{id:"signature:benguela-lobito",title:"Benguela & Lobito Coastal Escape",meta:"3 days / 2 nights · Coast",description:"A refined coastal journey linking Baía Azul, Benguela and Lobito."}],
};

const heroMedia = {
  kalandula: {
  type: "video",
  src: "https://wbjkwafduitelgjhjfzd.supabase.co/storage/v1/object/public/journey-media/launch-v1/kalandula-falls.mp4"
},
kissama: {
  type: "video",
  src: "https://wbjkwafduitelgjhjfzd.supabase.co/storage/v1/object/public/journey-media/launch-v1/kissama-hero-v4-no-ranger-v3.mp4"
},
serra: {
  type: "video",
  src: "https://wbjkwafduitelgjhjfzd.supabase.co/storage/v1/object/public/journey-media/launch-v1/serra-da-leba.mp4"
},
mbanzaCulture: {
  type: "video",
  src: "https://wbjkwafduitelgjhjfzd.supabase.co/storage/v1/object/public/journey-media/launch-v1/mbanza-kongo.mp4"
},
mbanzaHeritage: {
  type: "video",
  src: "https://wbjkwafduitelgjhjfzd.supabase.co/storage/v1/object/public/journey-media/launch-v1/mbanza-kongo.mp4"
},
dance: {
  type: "video",
  src: "https://wbjkwafduitelgjhjfzd.supabase.co/storage/v1/object/public/journey-media/launch-v1/traditional-dances.mp4"
},
  benguelaCoast:{type:"youtube",id:"Of-AtWK5CtA"}, lobito:{type:"youtube",id:"Of-AtWK5CtA"},
  benguelaRomance:{type:"youtube",id:"Of-AtWK5CtA"},cabo:{type:"youtube",id:"Om6PSHBDB34"}, caboRomance:{type:"youtube",id:"Om6PSHBDB34"}, mussuloCoast:{type:"youtube",id:"VFfqt5AOebE"},
  mussuloRomance:{type:"youtube",id:"VFfqt5AOebE"}, luandaCity:{type:"youtube",id:"JXCkN8Xa_AM"}, mufete:{type:"youtube",id:"5NT13b4YBLU"},
  memorial:{type:"youtube",id:"IrfKcAbqbCY",start:72}, fortaleza:{type:"youtube",id:"yIbhk2kqhA4",start:5}, kwanza:{type:"youtube",id:"lVGz0m0HW4M"},
  miradouro:{type:"youtube",id:"GGqtvK7a0tE"}, 
};

const editorial = {
  serra:{heading:"A road carved into the highlands.",story:"From Lubango’s cool plateau, the road descends through a breathtaking sequence of curves into Angola’s southern landscape. The experience is as much about the changing light and altitude as it is about the famous road itself.",best:"May to September",access:"Approx. 50 km from Lubango",experiences:["Scenic drive with specialist guide","Tundavala viewpoint extension","Sunrise or golden-hour photography","Highland picnic"],stays:["Pululukwa Resort","Casper Resort","Boutique stays in Lubango"]},
  kalandula:{heading:"Where water becomes wonder.",story:"Kalandula is powerful, atmospheric and deeply immersive. Mist rises through tropical vegetation while the Lucala River falls across a vast horseshoe-shaped escarpment—one of Angola’s defining natural spectacles.",best:"May to September for fuller flow",access:"Road journey from Malanje",experiences:["Main panoramic viewpoint","Guided lower viewpoint walk","Pedras Negras extension","Landscape photography"],stays:["Pousada de Kalandula","Hotel options in Malanje","Private guided circuit"]},
  kissama:{heading:"The wild begins beyond the city.",story:"Kissama offers a gentle introduction to Angola’s wildlife and open landscapes. Safari drives reveal antelope, birdlife and broad savannah, while the nearby Kwanza River adds a quieter dimension to the day.",best:"June to October",access:"Approx. 2–3 hours from central Luanda",experiences:["Guided safari drive","Birdwatching","Kwanza River viewpoint","Private picnic stop"],stays:["Kissama lodge options","Barra do Kwanza retreats","Luanda day-trip base"]},
  mbanzaCulture:{heading:"A kingdom whose story still lives.",story:"M’Banza Kongo was the political and spiritual centre of the historic Kingdom of Kongo. Today, archaeology, sacred memory and living tradition meet in a UNESCO-recognised cultural landscape.",best:"May to September",access:"Flight or road connection via Zaire Province",experiences:["Royal Museum and historic centre","Kulumbimbi and sacred sites","Local cultural interpretation","Community-led heritage walk"],stays:["Selected hotels in M’Banza Kongo","Private heritage itinerary","Regional guesthouses"]},
  mbanzaHeritage:{heading:"A kingdom whose story still lives.",story:"M’Banza Kongo invites slower, respectful discovery of a place whose influence crossed modern borders. Its monuments and traditions reveal a sophisticated African kingdom and an enduring cultural identity.",best:"May to September",access:"Flight or road connection via Zaire Province",experiences:["UNESCO heritage circuit","Royal Museum","Historic cathedral ruins","Expert cultural guide"],stays:["Selected hotels in M’Banza Kongo","Private heritage itinerary","Regional guesthouses"]},
  cabo:{heading:"Where the city gives way to open ocean.",story:"Cabo Ledo combines broad Atlantic beaches, warm light and a relaxed coastal rhythm. It works beautifully as a full-day escape or an overnight pause with seafood, surf and sunset.",best:"Most of the year; drier months May–October",access:"Approx. 2 hours south of Luanda",experiences:["Beach and surf time","Seafood lunch","Sunset experience","Private coastal picnic"],stays:["Carpe Diem Resort","Queiroz Point Eco Resort","Selected coastal lodges"]},
  miradouro:{heading:"A landscape that looks beyond Earth.",story:"Wind and rain have sculpted Miradouro da Lua into ribbons of ochre, rust and pale stone. Its lunar forms are especially striking at golden hour and pair naturally with a journey south of Luanda.",best:"Year-round; golden hour recommended",access:"Approx. 45 km south of Luanda",experiences:["Golden-hour photography","Geological interpretation","Kwanza River combination","Private scenic stop"],stays:["Best visited from Luanda","Barra do Kwanza retreats","Cabo Ledo extension"]},
  benguelaCoast:{heading:"Atlantic light and an unhurried coast.",story:"Benguela’s coastline is defined by blue coves, warm-toned cliffs and an easy social rhythm. Baía Azul, Benguela city and nearby Lobito create a rewarding multi-day coastal chapter.",best:"May to October",access:"Flight to Catumbela or overland journey",experiences:["Baía Azul beach day","Benguela architecture walk","Seafood dining","Lobito Restinga excursion"],stays:["Hotel Terminus Lobito","Restinga hotels","Selected Benguela properties"]},
  luandaCity:{heading:"A capital shaped by the Atlantic.",story:"Luanda is layered, energetic and visually compelling. Historic fortifications, modern monuments, bay views, markets and cuisine reveal a capital whose identity is constantly evolving.",best:"Year-round",access:"International gateway to Angola",experiences:["Historic city circuit","Luanda Bay promenade","Craft market visit","Mufete dining experience"],stays:["InterContinental Luanda Miramar","EPIC SANA Luanda","Hotel Presidente Luanda"]},
};

const galleryPool = ["/assets/hero-kalandula.jpg","/assets/highlight-luanda.jpg","/assets/miradouro-da-lua-approved.jpg","/assets/serra-da-leba-approved.jpg","/assets/benguela-coast-approved.webp","/assets/mbanza-kongo-approved.jpg","/assets/cabo-ledo-angola.jpg","/assets/kwanza-river-boat.png"];

function youtubeBackgroundUrl(id,start=0,end=0){
  const params=new URLSearchParams({autoplay:"1",mute:"1",controls:"0",loop:"1",playlist:id,modestbranding:"1",rel:"0",playsinline:"1",iv_load_policy:"3",cc_load_policy:"0",fs:"0",disablekb:"1"});
  if(start>0)params.set("start",String(start));
  if(end>0)params.set("end",String(end));
  return `https://www.youtube-nocookie.com/embed/${id}?${params.toString()}`;
}

function HeroMedia({ destination }) {
  const media = heroMedia[destination.id];

  if (!media) {
    return <img src={destination.image} alt={destination.title} />;
  }

  if (media.type === "video") {
    return (
      <>
        <img
          className="story-hero-fallback"
          src={destination.image}
          alt=""
        />

        <video
          className="story-hero-video"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        >
          <source src={media.src} type="video/mp4" />
        </video>
      </>
    );
  }

  return (
    <>
      <img
        className="story-hero-fallback"
        src={destination.image}
        alt=""
      />

      <iframe
        className="story-hero-youtube"
        src={youtubeBackgroundUrl(media.id, media.start, media.end)}
        title={destination.title}
        allow="autoplay; encrypted-media; picture-in-picture"
      />
    </>
  );
}

const formatDate=value=>new Intl.DateTimeFormat("en-GB",{day:"numeric",month:"long",year:"numeric"}).format(new Date(`${value}T12:00:00`));
function DestinationMap({ destination }) 
{ const x = destination.mapLng ?? destination.lng;  
 const y = destination.mapLat ?? destination.lat;

  const minLng = 11.3;
  const maxLng = 24.4;
  const minLat = -18.35;
  const maxLat = -4.15;

  const left = ((x - minLng) / (maxLng - minLng)) * 100;
  const top = ((maxLat - y) / (maxLat - minLat)) * 100;
  const ANGOLA_POLYGONS = [
  [[16.326528,-5.87747],[16.57318,-6.622645],[16.860191,-7.222298],[17.089996,-7.545689],[17.47297,-8.068551],[18.134222,-7.987678],[18.464176,-7.847014],[19.016752,-7.988246],[19.166613,-7.738184],[19.417502,-7.155429],[20.037723,-7.116361],[20.091622,-6.94309],[20.601823,-6.939318],[20.514748,-7.299606],[21.728111,-7.290872],[21.746456,-7.920085],[21.949131,-8.305901],[21.801801,-8.908707],[21.875182,-9.523708],[22.208753,-9.894796],[22.155268,-11.084801],[22.402798,-10.993075],[22.837345,-11.017622],[23.456791,-10.867863],[23.912215,-10.926826],[24.017894,-11.237298],[23.904154,-11.722282],[24.079905,-12.191297],[23.930922,-12.565848],[24.016137,-12.911046],[21.933886,-12.898437],[21.887843,-16.08031],[22.562478,-16.898451],[23.215048,-17.523116],[21.377176,-17.930636],[18.956187,-17.789095],[18.263309,-17.309951],[14.209707,-17.353101],[14.058501,-17.423381],[13.462362,-16.971212],[12.814081,-16.941343],[12.215461,-17.111668],[11.734199,-17.301889],[11.640096,-16.673142],[11.778537,-15.793816],[12.123581,-14.878316],[12.175619,-14.449144],[12.500095,-13.5477],[12.738479,-13.137906],[13.312914,-12.48363],[13.633721,-12.038645],[13.738728,-11.297863],[13.686379,-10.731076],[13.387328,-10.373578],[13.120988,-9.766897],[12.87537,-9.166934],[12.929061,-8.959091],[13.236433,-8.562629],[12.93304,-7.596539],[12.728298,-6.927122],[12.227347,-6.294448],[12.322432,-6.100092],[12.735171,-5.965682],[13.024869,-5.984389],[13.375597,-5.864241],[16.326528,-5.87747]],
  [[12.436688,-5.684304],[12.182337,-5.789931],[11.914963,-5.037987],[12.318608,-4.60623],[12.62076,-4.438023],[12.995517,-4.781103],[12.631612,-4.991271],[12.468004,-5.248362],[12.436688,-5.684304]]
];
 const MAP_W = 860;
const MAP_H = 920;

const projectPoint = (lng, lat) => {
  const px = ((lng - minLng) / (maxLng - minLng)) * MAP_W;
  const py = ((maxLat - lat) / (maxLat - minLat)) * MAP_H;
  return [px, py];
};

const polygonPoints = (polygon) =>
  polygon.map(([lng, lat]) => {
    const [px, py] = projectPoint(lng, lat);
    return `${px},${py}`;
  }).join(" "); 
 return (
    <div className="story-map-card">
      <div className="story-map-angola">
        <svg
  viewBox="0 0 860 920"
  className="story-map-angola-svg"
  aria-label={`Location of ${destination.title} in Angola`}
>
  {ANGOLA_POLYGONS.map((polygon, index) => (
    <polygon
      key={index}
      className="story-map-country"
      points={polygonPoints(polygon)}
    />
  ))}

  {(() => {
    const [pinX, pinY] = projectPoint(x, y);

    return (
      <g
        className="story-map-svg-pin"
        transform={`translate(${pinX} ${pinY})`}
      >
        <circle className="story-map-svg-pin-halo" r="18" />
        <circle className="story-map-svg-pin-dot" r="8" />
      </g>
    );
  })()}
</svg>

        <span
          className="story-map-destination"
          style={{
            left: `${Math.max(7, Math.min(93, left))}%`,
            top: `${Math.max(7, Math.min(93, top))}%`
          }}
        >
          <i />
          <strong>{destination.title}</strong>
          <small>{destination.province}</small>
        </span>

        <span className="story-map-country-name">ANGOLA</span>

        <span className="story-map-coordinates">
          {destination.lat.toFixed(3)}, {destination.lng.toFixed(3)}
        </span>
      </div>
    </div>
  );
}
export default function DestinationStory({destination,onClose}){
  const {toggle,has}=useJourney();
  const closeRef=useRef(null);
  const itemId=destination?`destination:${destination.id}`:"";
  const journeys=useMemo(()=>journeyMatches[destination?.id]||[],[destination]);
  const departures=useMemo(()=>{const ids=new Set(journeys.map(j=>j.id));return signatureDepartures.filter(d=>ids.has(d.journeyId));},[journeys]);
  const copy=editorial[destination?.id]||{heading:"A place that stays with you.",story:"Imbondeiro reveals this destination through local knowledge, thoughtful pacing and experiences selected around the character of the place.",best:"Best confirmed during planning",access:"Private transfer arranged by Imbondeiro",experiences:destination?.highlights||[],stays:["Handpicked accommodation","Private itinerary options","Concierge recommendations"]};
  const gallery=[destination?.image,...galleryPool.filter(x=>x!==destination?.image)].slice(0,4);

  useEffect(()=>{
    if(!destination)return;
    document.body.classList.add("destination-story-open");
    closeRef.current?.focus();
    trackEvent("view_item",{item_name:destination.title,item_category:destination.category});
    const key=e=>e.key==="Escape"&&onClose();
    window.addEventListener("keydown",key);
    return()=>{document.body.classList.remove("destination-story-open");window.removeEventListener("keydown",key);};
  },[destination,onClose]);
  if(!destination)return null;

  const addDestination=()=>{toggle({...destination,id:itemId,sourceId:destination.id,kind:"destination",days:parseFloat(destination.duration)||0});trackEvent("add_to_cart",{item_name:destination.title,item_category:destination.category});};
  const craft=()=>{onClose();window.setTimeout(()=>{const el=document.getElementById("contact");el?.classList.add("is-revealed");el?.setAttribute("aria-hidden","false");el?.scrollIntoView({behavior:"smooth"});trackEvent("begin_checkout",{destination:destination.title});},180);};

  return <div className="destination-story" role="dialog" aria-modal="true" aria-label={`${destination.title} destination story`}>
    <button ref={closeRef} className="story-close" type="button" onClick={onClose} aria-label="Close destination story"><span>Close</span>×</button>
    <header className="story-hero"><HeroMedia destination={destination}/><div className="story-hero-shade"/><div className="story-hero-copy"><p>{destination.province} · {destination.category}</p><h1>{destination.title}</h1><blockquote>“{destination.note}”</blockquote></div><span className="story-scroll">Scroll to discover ↓</span></header>

    <main className="story-body">
      <section className="story-introduction"><p className="eyebrow">The Story</p><h2>{copy.heading}</h2><div><p>{destination.description}</p><p>{copy.story}</p></div></section>

      <section className="story-details"><div><p className="eyebrow">Highlights</p><ul>{destination.highlights.map(h=><li key={h}>{h}</li>)}</ul></div><div><p className="eyebrow">Practical Details</p><dl><div><dt>Recommended stay</dt><dd>{destination.duration}</dd></div><div><dt>Best period</dt><dd>{copy.best}</dd></div><div><dt>Access</dt><dd>{copy.access}</dd></div><div><dt>Journey style</dt><dd>Private or curated small group</dd></div></dl></div></section>

      <section className="story-details"></section><section className="story-map-section"> <div><p className="eyebrow">Location</p><h2>Place it within your Angola journey.</h2><p>{destination.title} is located in {destination.province}. Imbondeiro coordinates the route, transfers and timing as part of your complete itinerary.</p></div><DestinationMap destination={destination} /></section><section className="story-gallery"></section> 

      <section className="story-gallery"><div className="story-section-heading"><p className="eyebrow">Visual Journal</p><h2>Atmosphere, landscape and detail.</h2></div><div className="story-gallery-grid">{gallery.map((src,i)=><figure key={`${src}-${i}`}><img src={src} alt={`${destination.title} travel inspiration ${i+1}`} loading="lazy"/><figcaption>{i===0?destination.title:"Angola through the Imbondeiro lens"}</figcaption></figure>)}</div></section>

      <section className="story-curation"><div><p className="eyebrow">Local Experiences</p><h2>Ways to experience the destination.</h2><ul>{copy.experiences.map(x=><li key={x}>{x}</li>)}</ul></div><div><p className="eyebrow">Recommended Stays</p><h2>Selected around comfort and location.</h2><ul>{copy.stays.map(x=><li key={x}>{x}</li>)}</ul><small>Accommodation is subject to availability and final quality review at the time of booking.</small></div></section>

      <section className="story-journeys"><div className="story-section-heading"><p className="eyebrow">Travel With Imbondeiro</p><h2>Signature journeys featuring {destination.title}</h2></div><div className="story-journey-grid">{journeys.length?journeys.map(j=><article key={j.id}><span>Signature Journey</span><h3>{j.title}</h3><p>{j.description}</p><small>{j.meta}</small></article>):<article><span>Tailor-Made</span><h3>Designed around you</h3><p>We can incorporate {destination.title} into a private itinerary shaped around your dates and interests.</p><small>Flexible dates · Personal planning</small></article>}</div></section>

      <section className="story-departures"><div className="story-section-heading"><p className="eyebrow">Next Departures</p><h2>Choose a curated date—or travel privately.</h2></div><div className="story-date-list">{departures.length?departures.map(d=>{const remaining=placesRemaining(d);return <article key={d.id}><div><strong>{formatDate(d.startDate)}</strong><small>{d.duration} · {d.travelStyle}</small></div><span className={`story-availability ${remaining<=2?"limited":""}`}>{d.status==="sold-out"?"Sold out":`${remaining} places remaining`}</span></article>}):<article><div><strong>Private dates available</strong><small>Choose your preferred travel period</small></div><span className="story-availability">Tailor-made</span></article>}</div></section>

      <section className="story-actions"><div><p className="eyebrow">Your Journey</p><h2>Make this destination part of your story.</h2></div><div><button type="button" className={`story-add ${has(itemId)?"selected":""}`} onClick={addDestination}>{has(itemId)?"✓ Added to My Journey":"+ Add to My Journey"}</button><button type="button" className="story-craft" onClick={craft}>Craft My Journey →</button></div></section>
    </main>
  </div>;
}
