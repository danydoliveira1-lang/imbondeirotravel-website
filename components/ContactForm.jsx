"use client";

import { useEffect, useMemo, useState } from "react";
import { trackEvent } from "./Analytics";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "244923000000";

export default function ContactForm(){
  const [status,setStatus]=useState("");
  const [destination,setDestination]=useState("");
  const [sending,setSending]=useState(false);

  useEffect(()=>{
    const update=(event)=>setDestination(event.detail || "");
    window.addEventListener("imbondeiro-journey",update);
    return ()=>window.removeEventListener("imbondeiro-journey",update);
  },[]);

  const whatsappHref = useMemo(() => {
    const message = destination
      ? `Hello Imbondeiro Travel, I would like help crafting a journey including: ${destination}`
      : "Hello Imbondeiro Travel, I would like help crafting my journey.";
    return `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g,"")}?text=${encodeURIComponent(message)}`;
  }, [destination]);

  async function submit(e){
    e.preventDefault();
    if (sending) return;
    setSending(true);
    setStatus("Sending your request…");
    const f=new FormData(e.currentTarget);
    const payload = {
      name: f.get("name"),
      email: f.get("email"),
      whatsapp: f.get("whatsapp"),
      destination: f.get("destination"),
      dates: f.get("dates"),
      travellers: f.get("travellers"),
      travelStyle: f.get("travelStyle"),
      budget: f.get("budget"),
      message: f.get("message"),
      consent: f.get("consent") === "on",
      website: f.get("website"),
    };
    try{
      const r=await fetch("/api/send-request",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});
      const result = await r.json().catch(()=>({}));
      if(!r.ok) throw new Error(result.error || "Unable to send request.");
      setStatus("Thank you. Your journey request has been sent successfully. We will contact you shortly.");
      trackEvent("generate_lead", { destination: payload.destination || "Not specified", method: "email_form" });
      setDestination("");
      e.currentTarget.reset();
    }catch(error){
      setStatus(`${error.message || "The request could not be sent."} You can also contact imbondeirotravel@gmail.com or use WhatsApp.`);
    }finally{
      setSending(false);
    }
  }

  return <div className="journey-contact-wrap">
    <form onSubmit={submit} className="journey-form" noValidate>
      <label>Name<input name="name" autoComplete="name" required minLength="2"/></label>
      <label>Email<input name="email" type="email" autoComplete="email" required/></label>
      <label>WhatsApp<input name="whatsapp" type="tel" autoComplete="tel" placeholder="Include country code"/></label>
      <label>Destination<input name="destination" value={destination} onChange={(e)=>setDestination(e.target.value)} placeholder="Angola or worldwide"/></label>
      <label>Travel dates<input name="dates" placeholder="Preferred dates or month"/></label>
      <label>Travellers<input name="travellers" type="number" min="1" max="99" defaultValue="2"/></label>
      <label>Journey style<select name="travelStyle" defaultValue="Private"><option>Private</option><option>Small group</option><option>Honeymoon</option><option>Family</option><option>Corporate / MICE</option></select></label>
      <label>Indicative budget<select name="budget" defaultValue=""><option value="">Prefer not to say</option><option>Under USD 2,500</option><option>USD 2,500–5,000</option><option>USD 5,000–10,000</option><option>USD 10,000+</option></select></label>
      <label className="full">Tell us about your journey<textarea name="message" rows="5" defaultValue={destination ? `I would like to explore this journey: ${destination}` : ""}/></label>
      <label className="honeypot" aria-hidden="true">Website<input name="website" tabIndex="-1" autoComplete="off"/></label>
      <label className="full consent"><input name="consent" type="checkbox" required/> I agree that Imbondeiro Travel may use these details to respond to my enquiry.</label>
      <div className="full form-actions"><button className="btn gold" type="submit" disabled={sending}>{sending ? "Sending…" : "Craft My Journey"}</button><a className="btn whatsapp" href={whatsappHref} target="_blank" rel="noreferrer" onClick={()=>trackEvent("contact",{method:"whatsapp",destination:destination||"Not specified"})}>Continue on WhatsApp</a></div>
      <p className="full form-status" role="status" aria-live="polite">{status}</p>
    </form>
  </div>;
}
