"use client";

import { useJourney } from "./JourneyContext";

export default function JourneyAddButton({ item, label="Add to My Journey", className="journey-add-button" }) {
  const { toggle, has } = useJourney();
  const selected = has(item.id);
  return <button type="button" className={`${className} ${selected ? "selected" : ""}`} onClick={()=>toggle(item)}>
    <span>{selected ? "✓" : "+"}</span>{selected ? "Added to My Journey" : label}
  </button>;
}
