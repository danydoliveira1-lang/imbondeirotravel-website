"use client";

import { useEffect, useMemo, useState } from "react";
import { trackEvent } from "./Analytics";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "244945175238";
const INITIAL_FORM = {
  name: "",
  email: "",
  whatsapp: "",
  destination: "",
  dates: "",
  travellers: "2",
  travelStyle: "Private",
  budget: "",
  message: "",
  consent: false,
  website: "",
};

export default function ContactForm(){
  const [form,setForm]=useState(INITIAL_FORM);
  const [status,setStatus]=useState("");
  const [sending,setSending]=useState(false);
  const [confirmation,setConfirmation]=useState(null);

  useEffect(()=>{
    const update=(event)=>{
      const destination = String(event.detail || "");
      setForm((current)=>({
        ...current,
        destination,
        message: destination ? `I would like to explore this journey: ${destination}` : current.message,
      }));
    };
    window.addEventListener("imbondeiro-journey",update);
    return ()=>window.removeEventListener("imbondeiro-journey",update);
  },[]);

  function updateField(event){
    const { name, value, type, checked } = event.target;
    setForm((current)=>({ ...current, [name]: type === "checkbox" ? checked : value }));
  }

  const emailHref = useMemo(() => {
    const subject = form.destination ? `Journey request — ${form.destination}` : "Personalised journey request";
    const body = [
      "Hello Imbondeiro Travel,",
      "",
      "I would like help crafting a personalised journey.",
      form.destination ? `Journey: ${form.destination}` : null,
      form.dates ? `Travel dates: ${form.dates}` : null,
      form.travellers ? `Travellers: ${form.travellers}` : null,
      form.travelStyle ? `Journey style: ${form.travelStyle}` : null,
      form.budget ? `Indicative budget: ${form.budget}` : "Indicative budget: Prefer not to say",
      form.name ? `Name: ${form.name}` : null,
      form.email ? `Email: ${form.email}` : null,
      form.whatsapp ? `My WhatsApp: ${form.whatsapp}` : null,
      form.message ? `Notes: ${form.message}` : null,
    ].filter(Boolean).join("\n");
    return `mailto:imbondeirotravel@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }, [form]);

  const whatsappHref = useMemo(() => {
    const lines = [
      "Hello Imbondeiro Travel,",
      "",
      "I would like help crafting a personalised journey.",
      form.destination ? `Journey: ${form.destination}` : null,
      form.dates ? `Travel dates: ${form.dates}` : null,
      form.travellers ? `Travellers: ${form.travellers}` : null,
      form.travelStyle ? `Journey style: ${form.travelStyle}` : null,
      form.budget ? `Indicative budget: ${form.budget}` : "Indicative budget: Prefer not to say",
      form.name ? `Name: ${form.name}` : null,
      form.email ? `Email: ${form.email}` : null,
      form.whatsapp ? `My WhatsApp: ${form.whatsapp}` : null,
      form.message ? `Notes: ${form.message}` : null,
    ].filter(Boolean);
    return `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g,"")}?text=${encodeURIComponent(lines.join("\n"))}`;
  }, [form]);

  function validate(){
    if(form.name.trim().length < 2) return "Please enter your name.";
    if(!/^\S+@\S+\.\S+$/.test(form.email.trim())) return "Please enter a valid email address.";
    if(!form.consent) return "Please agree to the privacy consent before continuing.";
    return "";
  }

  async function submit(event){
    event.preventDefault();
    if (sending) return;
    const error = validate();
    if(error){ setStatus(error); return; }

    setSending(true);
    setStatus("Sending your request…");
    try{
      const response=await fetch("/api/send-request",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(form)
      });
      const result = await response.json().catch(()=>({}));
      if(!response.ok){
        // Until the secure Resend key is connected, never leave mobile users
        // at a dead end: open their email app with the complete request ready.
        if(response.status === 503){
          setStatus("Opening your email app with the journey request ready to send…");
          window.location.href = emailHref;
          return;
        }
        throw new Error(result.error || "Unable to send request.");
      }

      setConfirmation({
        reference: result.reference,
        designer: result.designer || "Daniela Nama D'Oliveira",
        responseTime: result.responseTime || "Within 24 hours",
      });
      setStatus("");
      trackEvent("generate_lead", { destination: form.destination || "Not specified", method: "email_form" });
      setForm(INITIAL_FORM);
    }catch(error){
      setStatus(`${error.message || "The request could not be sent."} Your details are still available in the WhatsApp message, so you can continue there now.`);
    }finally{
      setSending(false);
    }
  }

  if(confirmation){
    return <div className="journey-contact-wrap journey-thank-you" role="status" aria-live="polite">
      <p className="eyebrow">Request received</p>
      <h3>Thank you for contacting Imbondeiro Travel</h3>
      <p>Your journey request has been received and a Travel Designer will review it personally.</p>
      <dl className="journey-confirmation-grid">
        <div><dt>Reference</dt><dd>{confirmation.reference}</dd></div>
        <div><dt>Your Journey Designer</dt><dd>{confirmation.designer}</dd></div>
        <div><dt>Response time</dt><dd>{confirmation.responseTime}</dd></div>
      </dl>
      <div className="form-actions">
        <button className="btn gold" type="button" onClick={()=>setConfirmation(null)}>Create another request</button>
        <a className="btn whatsapp" href={`https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g,"")}`} target="_blank" rel="noreferrer">Chat on WhatsApp</a>
        <a className="btn" href="#top">Return home</a>
      </div>
    </div>;
  }

  return <div className="journey-contact-wrap">
    <form onSubmit={submit} className="journey-form">
      <label>Name<input name="name" value={form.name} onChange={updateField} autoComplete="name" required minLength="2"/></label>
      <label>Email<input name="email" value={form.email} onChange={updateField} type="email" autoComplete="email" required/></label>
      <label>WhatsApp<input name="whatsapp" value={form.whatsapp} onChange={updateField} type="tel" autoComplete="tel" placeholder="Include country code"/></label>
      <label>Destination<input name="destination" value={form.destination} onChange={updateField} placeholder="Angola or worldwide"/></label>
      <label>Travel dates<input name="dates" value={form.dates} onChange={updateField} placeholder="Preferred dates or month"/></label>
      <label>Travellers<input name="travellers" value={form.travellers} onChange={updateField} type="number" min="1" max="99"/></label>
      <label>Journey style<select name="travelStyle" value={form.travelStyle} onChange={updateField}><option>Private</option><option>Small group</option><option>Honeymoon</option><option>Family</option><option>Corporate / MICE</option></select></label>
      <label>Indicative budget<select name="budget" value={form.budget} onChange={updateField}><option value="">Prefer not to say</option><option>Under USD 2,500</option><option>USD 2,500–5,000</option><option>USD 5,000–10,000</option><option>USD 10,000+</option></select></label>
      <label className="full">Tell us about your journey<textarea name="message" rows="5" value={form.message} onChange={updateField}/></label>
      <label className="honeypot" aria-hidden="true">Website<input name="website" value={form.website} onChange={updateField} tabIndex="-1" autoComplete="off"/></label>
      <label className="full consent"><input name="consent" type="checkbox" checked={form.consent} onChange={updateField} required/> I agree that Imbondeiro Travel may use these details to respond to my enquiry.</label>
      <div className="full form-actions">
        <button className="btn gold" type="submit" disabled={sending}>{sending ? "Sending…" : "Craft My Journey"}</button>
        <a className="btn whatsapp" href={whatsappHref} target="_blank" rel="noreferrer" onClick={()=>trackEvent("contact",{method:"whatsapp",destination:form.destination||"Not specified"})}>Continue on WhatsApp</a>
        <a className="btn email-fallback" href={emailHref} onClick={()=>trackEvent("contact",{method:"email_link",destination:form.destination||"Not specified"})}>Email My Journey Request</a>
      </div>
      <p className="full contact-email-line">Email: <a href="mailto:imbondeirotravel@gmail.com">imbondeirotravel@gmail.com</a></p>
      <p className="full form-status" role="status" aria-live="polite">{status} {!status && <span>Automatic confirmation email requires the secure Vercel email key. Until it is connected, <strong>Craft My Journey</strong> will open your email app with the full request ready to send.</span>}</p>
    </form>
  </div>;
}
