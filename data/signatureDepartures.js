// PHASE 3A — CENTRAL TOUR & DEPARTURE DATA
// Edit this file to change public journeys, dates, group sizes and availability.
// Phase 3B will replace this file with the secure Imbondeiro Management Studio.

export const signatureDepartures = [
  {
    id: "departure:kalandula-september-2026",
    journeyId: "signature:kalandula-malanje",
    title: "Kalandula Falls & Malanje",
    location: "Malanje Province",
    image: "/assets/highlight-kalandula.jpg",
    startDate: "2026-09-12",
    endDate: "2026-09-14",
    duration: "3 days / 2 nights",
    maximumGuests: 8,
    reservedGuests: 3,
    travelStyle: "Small Group",
    status: "available",
    featured: true,
  },
  {
    id: "departure:lubango-october-2026",
    journeyId: "signature:lubango-serra",
    title: "Lubango & Serra da Leba",
    location: "Huíla Province",
    image: "/assets/serra-da-leba-approved.jpg",
    startDate: "2026-10-10",
    endDate: "2026-10-13",
    duration: "4 days / 3 nights",
    maximumGuests: 10,
    reservedGuests: 8,
    travelStyle: "Small Group",
    status: "limited",
    featured: true,
  },
  {
    id: "departure:kissama-october-2026",
    journeyId: "signature:kissama",
    title: "Kissama Safari Escape",
    location: "Bengo Province",
    image: "/assets/highlight-kissama.jpg",
    startDate: "2026-10-24",
    endDate: "2026-10-24",
    duration: "Full day",
    maximumGuests: 8,
    reservedGuests: 2,
    travelStyle: "Private & Small Group",
    status: "available",
    featured: true,
  },
  {
    id: "departure:benguela-november-2026",
    journeyId: "signature:benguela-coast",
    title: "Benguela & Lobito Coastal Escape",
    location: "Benguela Province",
    image: "/assets/benguela-coast-approved.webp",
    startDate: "2026-11-14",
    endDate: "2026-11-16",
    duration: "3 days / 2 nights",
    maximumGuests: 10,
    reservedGuests: 10,
    travelStyle: "Small Group",
    status: "sold-out",
    featured: false,
  },
];

export function placesRemaining(departure) {
  return Math.max(0, Number(departure.maximumGuests || 0) - Number(departure.reservedGuests || 0));
}
