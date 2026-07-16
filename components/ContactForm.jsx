"use client";
import { useEffect, useState } from "react";
export default function ContactForm(){
 const [status,setStatus]=useState("");
 const [destination,setDestination]=useState("");
 useEffect(()=>{
   const update=(event)=>setDestination(event.detail || "");
   window.addEventListener("imbondeiro-journey",update);
   return ()=>window.removeEventListener("imbondeiro-journey",update);
 },[]);
 async function submit(e){e.preventDefault(); setStatus("Sending…"); const f=new FormData(e.currentTarget); const subject=`Travel request: ${f.get('destination')||'Angola'}`; const body=[`Name: ${f.get('name')}`,`Email: ${f.get('email')}`,`WhatsApp: ${f.get('whatsapp')}`,`Destination: ${f.get('destination')}`,`Dates: ${f.get('dates')}`,`Travellers: ${f.get('travellers')}`,'',f.get('message')].join('\n');
 try{const r=await fetch('/api/send-request',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({subject,body})}); if(!r.ok)throw Error(); setStatus("Thank you. Your request has been sent."); setDestination(""); e.currentTarget.reset();}catch{setStatus("Email service is not configured yet. Please contact imbondeirotravel@gmail.com.");}}
 return <form onSubmit={submit} className="journey-form"><label>Name<input name="name" required/></label><label>Email<input name="email" type="email" required/></label><label>WhatsApp<input name="whatsapp"/></label><label>Destination<input name="destination" value={destination} onChange={(e)=>setDestination(e.target.value)} placeholder="Angola or worldwide"/></label><label>Travel dates<input name="dates"/></label><label>Travellers<input name="travellers" type="number" min="1"/></label><label className="full">Tell us about your journey<textarea name="message" rows="5" defaultValue={destination ? `I would like to explore this journey: ${destination}` : ""}/></label><button className="btn gold" type="submit">Begin My Journey</button><p role="status">{status}</p></form>
}
