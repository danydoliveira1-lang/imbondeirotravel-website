"use client";

import { useEffect, useState } from "react";
import JourneyAddButton from "./JourneyAddButton";

export default function PublicTours() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTours() {
      try {
        const response = await fetch("/api/public/tours", {
          cache: "no-store",
        });

        const data = await response.json();

        if (Array.isArray(data.tours)) {
          setTours(data.tours);
        }
      } catch (error) {
        console.error("Unable to load public tours:", error);
      } finally {
        setLoading(false);
      }
    }

    loadTours();
  }, []);

  if (loading) {
    return (
      <div className="experience-grid">
        <p>Loading journeys...</p>
      </div>
    );
  }

  if (!tours.length) {
    return (
      <div className="experience-grid">
        <p>Our journeys are being prepared.</p>
      </div>
    );
  }

  return (
    <div className="experience-grid">
      {tours.map((tour, index) => {
        const image = tour.image || "/assets/hero-kalandula.jpg";

        const meta = [
          tour.duration,
          tour.category,
        ]
          .filter(Boolean)
          .join(" · ");

        const item = {
          id: `tour:${tour.slug}`,
          title: tour.title,
          category: tour.category,
          days: tour.days,
          image,
          province: "Signature Angola Journey",
          kind: "tour",
        };

        return (
          <article key={tour.id || tour.slug}>
            <div className="card-image">
              <img src={image} alt={tour.title} />
              <span>{String(index + 1).padStart(2, "0")}</span>
            </div>

            <p className="card-meta">{meta}</p>

            <h3>{tour.title}</h3>

            <p>{tour.summary}</p>

            <JourneyAddButton
              item={item}
              label="Add Tour to My Journey"
            />
          </article>
        );
      })}
    </div>
  );
}
