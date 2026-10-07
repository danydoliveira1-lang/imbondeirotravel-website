"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./PublicDestinationExplorer.module.css";

const PAGE_SIZE = 12;

function statusLabel(status) {
  const labels = {
    bookable: "Available",
    tailor_made: "Tailor Made",
    coming_soon: "Coming Soon",
  };

  return labels[status] || "Discover";
}

export default function PublicDestinationExplorer() {
  const [destinations, setDestinations] = useState([]);
  const [region, setRegion] = useState("All");
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadDestinations() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/public/destinations", {
          cache: "no-store",
          signal: controller.signal,
        });

        const body = await response.json();

        if (!response.ok) {
          throw new Error(
            body.error || "Destinations could not be loaded."
          );
        }

        setDestinations(body.destinations || []);
      } catch (loadError) {
        if (loadError.name !== "AbortError") {
          setError(
            loadError.message ||
              "Destinations are temporarily unavailable."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadDestinations();

    return () => controller.abort();
  }, []);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [region, search]);

  const filteredDestinations = useMemo(() => {
    const term = search.trim().toLowerCase();

    return [...destinations]
      .sort((first, second) => {
        if (Boolean(first.featured) !== Boolean(second.featured)) {
          return first.featured ? -1 : 1;
        }

        return (
          Number(first.sort_order || 9999) -
          Number(second.sort_order || 9999)
        );
      })
      .filter(destination => {
        const matchesRegion =
          region === "All" ||
          destination.explorer_region === region;

        const searchableText = [
          destination.name,
          destination.capital,
          destination.subregion,
          destination.explorer_region,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        const matchesSearch =
          !term || searchableText.includes(term);

        return matchesRegion && matchesSearch;
      });
  }, [destinations, region, search]);

  const visibleDestinations =
    filteredDestinations.slice(0, visibleCount);

  return (
    <section className={styles.explorer} id="destination-explorer">
      <div className={styles.introduction}>
        <span className={styles.eyebrow}>
          Africa &amp; Middle East Explorer
        </span>

        <h2 className={styles.title}>
          Journeys shaped by place, people and possibility.
        </h2>

        <p>
          Begin in Angola, then travel across Africa and the Middle
          East through thoughtful, tailor-made journeys designed
          around how you want to experience the world.
        </p>
      </div>

      <div className={styles.controls}>
        <div
          className={styles.filters}
          aria-label="Filter destinations by region"
        >
          {["All", "Africa", "Middle East"].map(option => (
            <button
              key={option}
              type="button"
              className={region === option ? styles.active : ""}
              aria-pressed={region === option}
              onClick={() => setRegion(option)}
            >
              {option}
            </button>
          ))}
        </div>

        <label className={styles.search}>
          <span aria-hidden="true">⌕</span>

          <input
            type="search"
            value={search}
            onChange={event => setSearch(event.target.value)}
            placeholder="Search a destination"
            aria-label="Search destinations"
          />
        </label>
      </div>

      {!loading && !error && (
        <div className={styles.resultLine}>
          <span>
            {filteredDestinations.length} destination
            {filteredDestinations.length === 1 ? "" : "s"}
          </span>

          <span>
            {region === "All"
              ? "Africa & Middle East"
              : region}
          </span>
        </div>
      )}

     <div className={styles.grid}>
  {loading && (
    <p className={styles.message}>
      Preparing your destination collection…
    </p>
  )}

  {error && (
    <p className={styles.message}>
      {error}
    </p>
  )}

  {!loading &&
    !error &&
    visibleDestinations.map(destination => {
      const destinationUrl = `/explorer/${encodeURIComponent(
        destination.slug
      )}`;

      return (
        <article
          className={styles.card}
          key={destination.id}
        >
          <a
            className={styles.cardMediaLink}
            href={destinationUrl}
            aria-label={`Discover ${destination.name}`}
          >
            {destination.hero_image ? (
              <div
                className={styles.image}
                style={{
                  backgroundImage: `url("${destination.hero_image}")`,
                }}
              >
                <span className={styles.badge}>
                  {statusLabel(
                    destination.launch_status
                  )}
                </span>
              </div>
            ) : (
              <div className={styles.fallback}>
                <span aria-hidden="true">
                  {destination.name?.charAt(0) || "I"}
                </span>

                <span className={styles.badge}>
                  {statusLabel(
                    destination.launch_status
                  )}
                </span>
              </div>
            )}
          </a>

          <div className={styles.content}>
            <span className={styles.location}>
              {destination.subregion ||
                destination.explorer_region}

              {destination.capital
                ? ` · ${destination.capital}`
                : ""}
            </span>

            <h3>
              <a
                className={styles.titleLink}
                href={destinationUrl}
              >
                {destination.name}
              </a>
            </h3>

            <p>
              {destination.summary ||
                `Discover ${destination.name} through a journey shaped around your interests, pace and travel style.`}
            </p>

            <div className={styles.action}>
              <a
                className={styles.discoverLink}
                href={destinationUrl}
              >
                Discover destination <span>→</span>
              </a>

              {destination.enquiry_enabled ? (
                <a
                  href={`/?destination=${encodeURIComponent(
                    destination.slug
                  )}#contact`}
                >
                  Start planning <span>→</span>
                </a>
              ) : (
                <span className={styles.unavailable}>
                  Journey details coming soon
                </span>
              )}
            </div>
          </div>
        </article>
      );
    })}

  {!loading &&
    !error &&
    filteredDestinations.length === 0 && (
      <p className={styles.message}>
        No destinations match your search.
      </p>
    )}
</div>

{visibleCount < filteredDestinations.length && (
  <button
    type="button"
    className={styles.loadMore}
    onClick={() =>
      setVisibleCount(
        count => count + PAGE_SIZE
      )
    }
  >
    Load more destinations
  </button>
)}
</section>
);
} 
