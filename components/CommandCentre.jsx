"use client";

import { useEffect, useMemo, useState } from "react";

const seed = {
  tours: [
    { id: "tour-kalandula", title: "Kalandula Falls & Malanje", location: "Malanje", duration: "2 days / 1 night", price: 1250, status: "Published", video: "Gt3K_3KQlOM", start: "05:04", end: "05:22" },
    { id: "tour-kissama", title: "Kissama Safari Day", location: "Luanda", duration: "Full day", price: 320, status: "Published", video: "xBZjmw9AreU", start: "00:05", end: "00:28" },
    { id: "tour-mbanza", title: "M’Banza Kongo Heritage Journey", location: "Zaire", duration: "3 days / 2 nights", price: 980, status: "Draft", video: "jkTv2xkPNi8", start: "00:20", end: "03:45" },
  ],
  departures: [
    { id: "dep-1", tour: "Kalandula Falls & Malanje", date: "2026-09-12", capacity: 20, booked: 14, held: 2, status: "Open", guide: "Carlos Manuel" },
    { id: "dep-2", tour: "Kissama Safari Day", date: "2026-09-18", capacity: 12, booked: 12, held: 0, status: "Sold Out", guide: "Ana Paulo" },
    { id: "dep-3", tour: "M’Banza Kongo Heritage Journey", date: "2026-09-24", capacity: 16, booked: 8, held: 2, status: "Open", guide: "João Afonso" },
  ],
  reservations: [
    { id: "IMB-260701", customer: "Amélia Costa", journey: "Kalandula Falls & Malanje", travellers: 2, status: "On Hold", total: 2500, consultant: "Daniela" },
    { id: "IMB-260702", customer: "Peter Williams", journey: "Kissama Safari Day", travellers: 4, status: "Confirmed", total: 1280, consultant: "Daniela" },
    { id: "IMB-260703", customer: "Sofia Mendes", journey: "Private Angola Journey", travellers: 2, status: "Enquiry", total: 0, consultant: "Unassigned" },
  ],
  customers: [
    { id: "cust-1", name: "Amélia Costa", email: "amelia@example.com", phone: "+351 912 000 111", language: "Portuguese", preference: "Culture & nature", notes: "Vegetarian" },
    { id: "cust-2", name: "Peter Williams", email: "peter@example.com", phone: "+44 7700 900222", language: "English", preference: "Wildlife", notes: "Airport meet & greet requested" },
    { id: "cust-3", name: "Sofia Mendes", email: "sofia@example.com", phone: "+244 923 000 333", language: "Portuguese", preference: "Honeymoon", notes: "Interested in Maldives" },
  ],
  media: [
    { id: "media-1", name: "Kalandula Hero", type: "YouTube", reference: "Gt3K_3KQlOM", usage: "Homepage + destination", status: "Active" },
    { id: "media-2", name: "Traditional Dance", type: "YouTube", reference: "U9ILT0S2GYA", usage: "Homepage hero", status: "Active" },
    { id: "media-3", name: "Imbondeiro Brand Mark", type: "Image", reference: "/assets/logo.png", usage: "Global", status: "Active" },
  ],
};

const nav = [
  ["dashboard", "⌂", "Dashboard"], ["tours", "◉", "Tours"], ["departures", "□", "Departures"],
  ["reservations", "◇", "Reservations"], ["customers", "◎", "Customers"], ["media", "▣", "Media Library"],
  ["payments", "€", "Payments"], ["operations", "↗", "Operations"], ["reports", "⌁", "Reports"], ["settings", "⚙", "Settings"],
];

const moduleMeta = {
  tours: { title: "Tour Manager", singular: "Tour", fields: ["title", "location", "duration", "price", "status", "video", "start", "end"] },
  departures: { title: "Departure Manager", singular: "Departure", fields: ["tour_id", "title", "location", "start_date", "end_date", "maximum_guests", "reserved_guests", "held_guests", "status", "featured", "image", "duration", "travel_style", "guide"] },
  reservations: { title: "Reservation Manager", singular: "Reservation", fields: ["customer", "departure_id", "journey", "travellers", "status", "total", "consultant"] },
  customers: { title: "Customer CRM", singular: "Customer", fields: ["name", "email", "phone", "language", "preference", "notes"] },
  media: { title: "Media Library", singular: "Media Item", fields: ["name", "type", "reference", "usage", "status"] },
  payments: { title: "Payments", singular: "Payment", fields: ["reservation_id", "payment_type", "amount", "currency", "payment_method", "status", "paid_at", "reference", "notes"] },
};

function money(value) { return new Intl.NumberFormat("en-GB", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(Number(value || 0)); }
function titleCase(value) { if (value === "tour_id") return "Tour"; if (value === "departure_id") return "Departure"; return value.replaceAll("_", " ").replace(/([A-Z])/g, " $1").replace(/^./, c => c.toUpperCase());}
export default function CommandCentre() {
  const [ready, setReady] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [active, setActive] = useState("dashboard");
  const [data, setData] = useState(seed);
  const [modal, setModal] = useState(null);
  const [notice, setNotice] = useState("");
  const [query, setQuery] = useState("");

  async function loadData() {
    const response = await fetch("/api/admin/data", { cache: "no-store" });
    if (!response.ok) throw new Error((await response.json()).error || "Unable to load live data.");
    const payload = await response.json(); setData(payload.data);
  }
  useEffect(() => { fetch("/api/admin/session", { cache:"no-store" }).then(r=>r.json()).then(async state => { setSignedIn(state.authenticated); if(state.authenticated) await loadData(); setReady(true); }).catch(()=>setReady(true)); }, []);

  const stats = useMemo(() => {
    const enquiries = data.reservations.filter(r => r.status === "Enquiry").length;
    const held = data.reservations.filter(r => r.status === "On Hold").length;
    const upcoming = data.departures.filter(d => d.status !== "Cancelled").length;
    const seats = data.departures.reduce((sum, d) => sum + Math.max(0, Number(d.maximum_guests) - Number(d.reserved_guests) - Number(d.held_guests)), 0);
    const revenue = data.reservations.filter(r => r.status === "Confirmed").reduce((sum, r) => sum + Number(r.total || 0), 0);
    return { enquiries, held, upcoming, seats, revenue };
  }, [data]);

  if (!ready) return null;
  if (!signedIn) return <Login onLogin={async () => { setSignedIn(true); await loadData(); }} />;

  const saveRecord = async (section, record) => {
    const response = await fetch(`/api/admin/records/${section}`, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(record) });
    const payload = await response.json(); if(!response.ok) return flash(payload.error || "Save failed.");
    setData(prev => ({...prev,[section]:prev[section].some(x=>x.id===payload.record.id)?prev[section].map(x=>x.id===payload.record.id?payload.record:x):[payload.record,...prev[section]]}));
    setModal(null); flash(`${moduleMeta[section].singular} saved to the live website.`);
  };
  const deleteRecord = async (section, id) => { if(confirm("Delete this record?")){ const r=await fetch(`/api/admin/records/${section}?id=${encodeURIComponent(id)}`,{method:"DELETE"}); if(r.ok){setData(prev=>({...prev,[section]:prev[section].filter(x=>x.id!==id)}));flash("Record deleted.");}else flash("Delete failed."); } };
  const flash = message => { setNotice(message); setTimeout(() => setNotice(""), 2600); };

  return <div className="cc-shell">
    <aside className="cc-sidebar">
      <div className="cc-brand"><div className="cc-tree">♧</div><div><strong>IMBONDEIRO</strong><span>COMMAND CENTRE</span></div></div>
      <nav>{nav.map(([key, icon, label]) => <button key={key} className={active === key ? "active" : ""} onClick={() => setActive(key)}><i>{icon}</i>{label}{["operations","reports"].includes(key) && <small>Soon</small>}</button>)}</nav> 
      <div className="cc-profile"><div className="cc-avatar">DN</div><div><strong>Daniela</strong><span>Administrator</span></div><button title="Sign out" onClick={async () => { await fetch("/api/admin/logout",{method:"POST"}); setSignedIn(false); }}>↪</button></div>
    </aside>

    <main className="cc-main">
      <header className="cc-topbar"><div><span className="cc-eyebrow">Project Imbondeiro · Phase 5.1B</span><h1>{active === "dashboard" ? "Good afternoon, Daniela" : moduleMeta[active]?.title || titleCase(active)}</h1></div><div className="cc-top-actions"><label className="cc-search">⌕<input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search Command Centre" /></label><button className="cc-icon-btn" title="Notifications">♢<b>3</b></button></div></header>

      {notice && <div className="cc-notice">✓ {notice}</div>}
      {active === "dashboard" && <Dashboard stats={stats} data={data} open={(section, record = {}) => { setActive(section); setModal({ section, record }); }} navigate={setActive} />}
      {moduleMeta[active] && <Manager section={active} meta={moduleMeta[active]} rows={data[active]} tours={data.tours} departures={data.departures} query={query} onNew={() => setModal({ section: active, record: {} })} onEdit={record => setModal({ section: active, record })} onDelete={id => deleteRecord(active, id)} />}
      {["operations","reports","settings"].includes(active) && <ComingSoon type={active} />}
    </main>
    {modal && <RecordModal section={modal.section} meta={moduleMeta[modal.section]} initial={modal.record} tours={data.tours} departures={data.departures} customers={data.customers} reservations={data.reservations} onClose={() => setModal(null)} onSave={saveRecord} />}
  </div>;
}

function Login({ onLogin }) {
  const [email, setEmail] = useState("daniela@imbondeirotravel.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const submit = async e => { e.preventDefault(); if (!email || !password) return setError("Enter your email and password."); setError(""); const r=await fetch("/api/admin/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email,password})}); const body=await r.json(); if(!r.ok) return setError(body.error||"Sign in failed."); await onLogin(); };
  return <div className="cc-login"><div className="cc-login-art"><div className="cc-login-copy"><span>PROJECT IMBONDEIRO · PHASE 5.1</span><h1>The operational heart of every remarkable journey.</h1><p>Manage tours, departures, reservations, customers and media—without touching code.</p></div></div><form className="cc-login-card" onSubmit={submit}><div className="cc-login-logo">♧</div><span className="cc-eyebrow">Secure staff access</span><h2>Imbondeiro Command Centre</h2><p>Welcome back. Sign in to continue.</p><label>Email address<input type="email" value={email} onChange={e=>setEmail(e.target.value)} /></label><label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Enter your Command Centre password" /></label>{error && <div className="cc-error">{error}</div>}<button className="cc-primary" type="submit">Enter Command Centre <span>→</span></button><small>Phase 5.1B live mode. Credentials are protected by a secure server session.</small></form></div>;
}

function Dashboard({ stats, data, open, navigate }) {
  const attentionReservations = data.reservations.filter(r => ["Enquiry", "On Hold", "Quoted"].includes(r.status));
  const followUpAction = status => status === "Enquiry" ? "Respond to enquiry" : status === "On Hold" ? "Confirm or release hold" : status === "Quoted" ? "Follow up on quote" : "";
  const cards = [["Today’s enquiries", stats.enquiries, "+18% this week"], ["Reservations on hold", stats.held, "Require follow-up"], ["Upcoming departures", stats.upcoming, "Next 90 days"], ["Available seats", stats.seats, "Across live departures"], ["Confirmed revenue", money(stats.revenue), "Current records"]];
  return <div className="cc-dashboard">
    <section className="cc-welcome"><div><span>IMBONDEIRO COMMAND CENTRE</span><h2>Elegant for the traveller.<br/>Powerful for the team.</h2><p>Your Phase 5 workspace is ready. All changes made here are saved to the live Supabase database and published to the website.</p></div><div className="cc-orbit"><span>LIVE</span><strong>{stats.upcoming}</strong><small>departures</small></div></section>
    <section className="cc-stat-grid">{cards.map(([label,value,sub],i)=><article key={label} className={i===4?"wide":""}><span>{label}</span><strong>{value}</strong><small>{sub}</small></article>)}</section>
   {attentionReservations.length > 0 && <section className="cc-panel"><div className="cc-panel-head"><div><span className="cc-eyebrow">Action centre</span><h3>Needs Attention</h3></div><span>{attentionReservations.length} item{attentionReservations.length===1?"":"s"}</span></div><div className="cc-activity">{attentionReservations.map(r=><div key={r.id}><span className="cc-dot"></span><div><strong>{r.customer}</strong><span>{r.journey} · {r.travellers} traveller{Number(r.travellers)!==1?"s":""}</span></div><em className={`cc-status ${String(r.status||"").toLowerCase().replaceAll(" ","-")}`}>{r.status}</em><button type="button" onClick={() => open("reservations", { ...r, _source: "attention" })}>{followUpAction(r.status)}</button></div>)}</div></section>}
    <section className="cc-grid-two"><div className="cc-panel"><div className="cc-panel-head"><div><span className="cc-eyebrow">Fast workflows</span><h3>Quick actions</h3></div></div><div className="cc-quick">{[["tours","＋","New tour"],["departures","□","New departure"],["reservations","◇","New reservation"],["customers","◎","New customer"],["media","▣","Add media"]].map(([s,i,l])=><button key={s} onClick={()=>open(s)}><i>{i}</i><span>{l}</span><b>→</b></button>)}</div></div>
    <div className="cc-panel"><div className="cc-panel-head"><div><span className="cc-eyebrow">Seat control</span><h3>Upcoming departures</h3></div><button onClick={()=>navigate("departures")}>View all</button></div><div className="cc-departure-list">{data.departures.slice(0,4).map(d=>{const available=Math.max(0,d.maximum_guests-d.reserved_guests-d.held_guests);return <div key={d.id}><div className="cc-date"><strong>{new Date(d.start_date+"T12:00:00").getDate()}</strong><span>{new Date(d.start_date+"T12:00:00").toLocaleString("en",{month:"short"})}</span></div><div><strong>{d.title}</strong><span>{d.reserved_guests} booked · {d.held_guests} held</span></div><div className="cc-seat"><strong>{available}</strong><span>available</span></div><em className={`cc-status ${d.status.toLowerCase().replaceAll(" ","-")}`}>{d.status}</em></div>})}</div></div></section>
    <section className="cc-panel"><div className="cc-panel-head"><div><span className="cc-eyebrow">Reservation desk</span><h3>Latest activity</h3></div><button onClick={()=>navigate("reservations")}>Open reservations</button></div><div className="cc-activity">{data.reservations.map(r=><div key={r.id}><span className="cc-dot"></span><div><strong>{r.customer}</strong><span>{r.journey} · {r.travellers} traveller{r.travellers!==1?"s":""}</span></div><em className={`cc-status ${r.status.toLowerCase().replaceAll(" ","-")}`}>{r.status}</em><b>{r.total?money(r.total):"Awaiting quote"}</b></div>)}</div></section>
  </div>;
}

function Manager({ section, meta, rows, tours, departures, query, onNew, onEdit, onDelete }) {
  const filtered = rows.filter(row => JSON.stringify(row).toLowerCase().includes(query.toLowerCase()));
  return <section className="cc-manager"><div className="cc-manager-head"><div><p>{section === "tours" ? "Create and publish journeys without changing code." : section === "departures" ? "Control dates, capacity and live seat availability." : section === "reservations" ? "Move every booking through the complete reservation lifecycle." : section === "customers" ? "Build richer traveller profiles and personalised service." : "Manage videos, images, documents and brand assets."}</p></div><button className="cc-primary" onClick={onNew}>＋ Add {meta.singular}</button></div><div className="cc-table-wrap"><table className="cc-table"><thead><tr>{meta.fields.slice(0,6).map(f=><th key={f}>{titleCase(f)}</th>)}<th>Actions</th></tr></thead><tbody>{filtered.map(row=><tr key={row.id}>{meta.fields.slice(0,6).map(field=><td key={field}>{field === "tour_id" ? (tours.find(t=>t.id===row[field])?.title || "—") : field === "departure_id" ? (() => { const departure = departures.find(d => d.id === row[field]); return departure ? `${departure.title} — ${new Date(departure.start_date + "T12:00:00").toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"})}` : "—"; })() : field === "price" || field === "total" ? money(row[field]) : field === "status" ? <em className={`cc-status ${String(row[field]).toLowerCase().replaceAll(" ","-")}`}>{row[field]}</em> : field === "date" ? new Date(row[field]+"T12:00:00").toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"}) : String(row[field] ?? "—")}</td>)}<td><div className="cc-row-actions"><button onClick={()=>onEdit(row)}>Edit</button><button className="danger" onClick={()=>onDelete(row.id)}>Delete</button></div></td></tr>)}</tbody></table>{!filtered.length && <div className="cc-empty">No matching records found.</div>}</div><div className="cc-manager-foot"><span>{filtered.length} record{filtered.length===1?"":"s"}</span><span>Changes are saved to the live website database.</span></div></section>;
}

function RecordModal({ section, meta, initial, tours, departures, customers, reservations, onClose, onSave }) {
  const blank = Object.fromEntries(meta.fields.map(f=>[f,""]));
  const [record, setRecord] = useState({ ...blank, ...initial });
  const numeric = ["price","maximum_guests","reserved_guests","held_guests","travellers","total","amount"];
  const submit = e => { e.preventDefault(); const { _source, ...payload } = record; onSave(section, payload); };
  const customerBookings = section === "customers" && initial.id ? (reservations || []).filter(r => r.customer_id === initial.id) : [];
  const customerTravellers = customerBookings.reduce((sum, r) => sum + Number(r.travellers || 0), 0);
  const customerValue = customerBookings.reduce((sum, r) => sum + Number(r.total || 0), 0);
  const upcomingJourneys = customerBookings.map(r => ({ reservation: r, departure: (departures || []).find(d => d.id === r.departure_id) })).filter(item => item.departure?.start_date && new Date(item.departure.start_date + "T12:00:00") >= new Date()).sort((a, b) => new Date(a.departure.start_date) -new Date(b.departure.start_date));
  const nextJourney = upcomingJourneys[0] || null;
  const laterJourneys = upcomingJourneys.slice(1);
  const pastJourneys = customerBookings.map(r => ({ reservation: r, departure: (departures || []).find(d => d.id === r.departure_id) })).filter(item => item.departure?.start_date && new Date(item.departure.start_date + "T12:00:00") < new Date()).sort((a, b) => new Date(b.departure.start_date) - new Date(a.departure.start_date));
  return <div className="cc-modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)onClose();}}><form className="cc-modal" onSubmit={submit}><div className="cc-modal-head"><div><span className="cc-eyebrow">No-code editor</span><h2>{initial.id?"Edit":"Add"} {meta.singular}</h2></div><button type="button" onClick={onClose}>×</button></div><div className="cc-form-grid">{meta.fields.map(field=><label key={field} className={["notes","reference"].includes(field)?"full":""}>{titleCase(field)}{field==="customer" && section==="reservations"?<select required value={record[field]||""} onChange={e=>{const customer=(customers||[]).find(c=>c.name===e.target.value);setRecord({...record,customer:e.target.value,customer_id:customer?.id||""});}}><option value="">Choose customer</option>{(customers||[]).map(c=><option key={c.id} value={c.name}>{c.name}</option>)}</select>:field==="tour_id"?<select required value={record[field]||""} onChange={e=>setRecord({...record,[field]:e.target.value})}><option value="">Choose tour</option>{(tours||[]).map(t=><option key={t.id} value={t.id}>{t.title}</option>)}</select>:field==="reservation_id" && section==="payments"?<select required value={record[field]||""} onChange={e=>{const reservation=(reservations||[]).find(r=>r.id===e.target.value);setRecord({...record,reservation_id:e.target.value,customer_id:reservation?.customer_id||""});}}><option value="">Choose reservation</option>{(reservations||[]).map(r=><option key={r.id} value={r.id}>{r.customer} — {r.journey} — {r.status}</option>)}</select>:field==="departure_id"?<select required value={record[field]||""} onChange={e=>setRecord({...record,[field]:e.target.value})}><option value="">Choose departure</option>{(departures||[]).map(d=><option key={d.id} value={d.id}>{d.title} — {d.start_date}</option>)}</select>:field==="payment_type" && section==="payments"?<select required value={record[field]||""} onChange={e=>setRecord({...record,[field]:e.target.value})}><option value="">Choose payment type</option>{["Deposit","Balance","Full Payment","Refund"].map(type=><option key={type} value={type}>{type}</option>)}</select>:field==="status"?<select required value={record[field]} onChange={e=>setRecord({...record,[field]:e.target.value})}><option value="">Choose status</option>{(section==="tours"?["Draft","Published"]:section==="departures"?["scheduled","sold_out","cancelled","completed"]:section==="reservations"?["Enquiry","On Hold","Quoted","Deposit Paid","Confirmed","Travelled"]:section==="payments"?["Pending","Paid","Refunded","Cancelled"]:section==="media"?["Active","Inactive"]:[]).map(s=><option key={s} value={s}>{s.replaceAll("_"," ").replace(/\b\w/g,c=>c.toUpperCase())}</option>)}</select>:field==="notes"?<textarea value={record[field]} onChange={e=>setRecord({...record,[field]:e.target.value})} rows="4"/>:<input required={["title","tour","customer","name"].includes(field)} type={["date","start_date","end_date"].includes(field)?"date":numeric.includes(field)?"number":"text"} value={record[field]} onChange={e=>setRecord({...record,[field]:numeric.includes(field)?Number(e.target.value):e.target.value})}/>}</label>)}</div>{section==="reservations" && initial.id && ["Enquiry","On Hold","Quoted"].includes(record.status) && <div className="cc-panel"><div className="cc-panel-head"><div><span className="cc-eyebrow">Recommended next action</span><h3>{record.status==="Enquiry"?"Respond to enquiry":record.status==="On Hold"?"Confirm or release hold":record.status==="Quoted"?"Follow up on quote":"Follow-up"}</h3></div></div><p>{record.status==="Enquiry"?"Contact the customer and prepare their proposal. Once the proposal has been sent, change the reservation status to Quoted.":record.status==="On Hold"?"Confirm the booking or release the hold so the reserved seats can return to availability.":record.status==="Quoted"?"Follow up with the customer. Once the deposit is received, change the reservation status to Deposit Paid.":"Review this reservation and update its status when the follow-up is complete."}</p></div>}{section==="customers" && initial.id && <div className="cc-panel"><div className="cc-panel-head"><div><span className="cc-eyebrow">Customer journey history</span><h3>Booking history</h3></div><span>{customerBookings.length} booking{customerBookings.length===1?"":"s"}</span></div><div className="cc-stat-grid"><article><span>Total bookings</span><strong>{customerBookings.length}</strong></article><article><span>Total travellers</span><strong>{customerTravellers}</strong></article><article><span>Lifetime value</span><strong>{money(customerValue)}</strong></article></div>{nextJourney && <div className="cc-panel"><div className="cc-panel-head"><div><span className="cc-eyebrow">Next journey</span><h3>{nextJourney.departure.title}</h3></div><span>{new Date(nextJourney.departure.start_date + "T12:00:00").toLocaleDateString("en-GB",{day:"2-digit",month:"long",year:"numeric"})}</span></div><div className="cc-activity"><div><span className="cc-dot"></span><div><strong>{nextJourney.reservation.journey||nextJourney.departure.title}</strong><span>{nextJourney.reservation.travellers||0} traveller{Number(nextJourney.reservation.travellers)!==1?"s":""}</span></div><em className={`cc-status ${String(nextJourney.reservation.status||"").toLowerCase().replaceAll(" ","-")}`}>{nextJourney.reservation.status}</em><b>{nextJourney.reservation.total?money(nextJourney.reservation.total):"€0"}</b></div></div></div>}{laterJourneys.length > 0 && <div className="cc-panel"><div className="cc-panel-head"><div><span className="cc-eyebrow">Upcoming travel</span><h3>Later journeys</h3></div><span>{laterJourneys.length} journey{laterJourneys.length===1?"":"s"}</span></div><div className="cc-activity">{laterJourneys.map(item=><div key={item.reservation.id}><span className="cc-dot"></span><div><strong>{item.departure.title}</strong><span>{new Date(item.departure.start_date + "T12:00:00").toLocaleDateString("en-GB",{day:"2-digit",month:"long",year:"numeric"})} · {item.reservation.travellers||0} traveller{Number(item.reservation.travellers)!==1?"s":""}</span></div><em className={`cc-status ${String(item.reservation.status||"").toLowerCase().replaceAll(" ","-")}`}>{item.reservation.status}</em><b>{item.reservation.total?money(item.reservation.total):"€0"}</b></div>)}</div></div>}<div className="cc-activity">{customerBookings.length?customerBookings.map(r=><div key={r.id}><span className="cc-dot"></span><div><strong>{r.journey||"Journey not specified"}</strong><span>{r.travellers||0} traveller{Number(r.travellers)!==1?"s":""}</span></div><em className={`cc-status ${String(r.status||"").toLowerCase().replaceAll(" ","-")}`}>{r.status}</em><b>{r.total?money(r.total):"€0"}</b></div>):<div>No bookings linked to this customer yet.</div>}</div>{pastJourneys.length > 0 && <div className="cc-panel"><div className="cc-panel-head"><div><span className="cc-eyebrow">Travel history</span><h3>Past journeys</h3></div><span>{pastJourneys.length} journey{pastJourneys.length===1?"":"s"}</span></div><div className="cc-activity">{pastJourneys.map(item=><div key={item.reservation.id}><span className="cc-dot"></span><div><strong>{item.departure.title}</strong><span>{new Date(item.departure.start_date + "T12:00:00").toLocaleDateString("en-GB",{day:"2-digit",month:"long",year:"numeric"})} · {item.reservation.travellers||0} traveller{Number(item.reservation.travellers)!==1?"s":""}</span></div><em className={`cc-status ${String(item.reservation.status||"").toLowerCase().replaceAll(" ","-")}`}>{item.reservation.status}</em><b>{item.reservation.total?money(item.reservation.total):"€0"}</b></div>)}</div></div>}</div>}<div className="cc-modal-actions"><button type="button" onClick={onClose}>Cancel</button><button className="cc-primary" type="submit">Save {meta.singular}</button></div></form></div>;
}

function ComingSoon({ type }) {
  const copy = { payments:["Payments & Invoicing","Deposits, balances, invoices and refunds will connect here in Phase 5.4."], operations:["Operations Desk","Guides, drivers, vehicles, hotels, suppliers and airport assistance arrive in Phase 5.5."], reports:["Business Intelligence","Revenue, occupancy, conversion and market reports arrive in Phase 5.6."], settings:["Command Centre Settings","Staff roles, security, business details and integrations will be activated with the Supabase connection."] }[type];
  return <div className="cc-coming"><div>♧</div><span className="cc-eyebrow">Prepared for expansion</span><h2>{copy[0]}</h2><p>{copy[1]}</p><button className="cc-primary" onClick={()=>alert("This module is reserved for the next approved Phase 5 milestone.")}>View roadmap</button></div>;
}
