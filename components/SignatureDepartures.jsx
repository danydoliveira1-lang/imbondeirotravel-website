"use client";

import { useMemo, useState } from "react";
import JourneyAddButton from "./JourneyAddButton";
import { placesRemaining, signatureDepartures } from "../data/signatureDepartures";

const dateFormatter = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" });

function dateLabel(startDate, endDate) {
  const start = new Date(`${startDate}T12:00:00`);
  const end = new Date(`${endDate}T12:00:00`);
  if (startDate === endDate) return dateFormatter.format(start);
  if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
    return `${start.getDate()}–${dateFormatter.format(end)}`;
  }
  return `${dateFormatter.format(start)} – ${dateFormatter.format(end)}`;
}

function availability(departure) {
  const remaining = placesRemaining(departure);
  if (departure.status === "sold-out" || remaining === 0) return { label: "Sold Out", tone: "sold" };
  if (departure.status === "limited" || remaining <= 2) return { label: `Only ${remaining} ${remaining === 1 ? "place" : "places"} left`, tone: "limited" };
  return { label: `${remaining} places remaining`, tone: "available" };
}

export default function SignatureDepartures() {
  const [showAll, setShowAll] = useState(false);
  const departures = useMemo(() => showAll ? signatureDepartures : signatureDepartures.filter(x => x.featured), [showAll]);

  function choosePrivateDates() {
    const field = document.querySelector('input[name="dates"]');
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.setTimeout(() => field?.focus(), 650);
  }

  return <section id="departures" className="signature-departures section-pad">
    <div className="departures-heading">
      <div>
        <p className="eyebrow">Upcoming Signature Departures</p>
        <h2>Travel Angola on<br/><em>carefully chosen dates.</em></h2>
      </div>
      <p>Join a small group of fellow explorers on thoughtfully curated journeys, or choose private dates designed entirely around you.</p>
    </div>

    <div className="departure-grid">
      {departures.map((departure, index) => {
        const remaining = placesRemaining(departure);
        const state = availability(departure);
        const soldOut = state.tone === "sold";
        const journeyItem = {
          id: departure.id,
          title: `${departure.title} — ${dateLabel(departure.startDate, departure.endDate)}`,
          category: "Signature Departure",
          province: departure.location,
          kind: "departure",
          days: Math.max(1, Math.round((new Date(departure.endDate) - new Date(departure.startDate)) / 86400000) + 1),
          image: departure.image,
          departureDate: departure.startDate,
          maximumGuests: departure.maximumGuests,
          placesRemaining: remaining,
        };
        return <article className="departure-card" key={departure.id}>
          <div className="departure-image">
            <img src={departure.image} alt={departure.title}/>
            <span className="departure-number">{String(index + 1).padStart(2, "0")}</span>
            <span className={`availability-badge ${state.tone}`}><i/>{state.label}</span>
          </div>
          <div className="departure-content">
            <p className="departure-location">{departure.location}</p>
            <h3>{departure.title}</h3>
            <p className="departure-date">{dateLabel(departure.startDate, departure.endDate)}</p>
            <div className="departure-details">
              <span>{departure.duration}</span>
              <span>Maximum {departure.maximumGuests} guests</span>
              <span>{departure.travelStyle}</span>
            </div>
            {soldOut
              ? <button type="button" className="departure-sold" disabled>Join the waiting list soon</button>
              : <JourneyAddButton item={journeyItem} label="Reserve Your Place" className="departure-reserve"/>}
          </div>
        </article>;
      })}
    </div>

    <div className="departure-actions">
      <button type="button" className="text-link dark departure-view-all" onClick={() => setShowAll(value => !value)}>{showAll ? "Show featured departures" : "View all departures"} <span>→</span></button>
    </div>

    <div className="private-journey-panel">
      <div><p className="eyebrow">Prefer to travel privately?</p><h3>Choose your own dates.</h3></div>
      <p>We will shape the itinerary, pace, accommodation and private services around your preferred travel window.</p>
      <button type="button" onClick={choosePrivateDates}>Craft My Private Journey <span>→</span></button>
    </div>
  </section>;
}
