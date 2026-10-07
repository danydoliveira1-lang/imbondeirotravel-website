"use client";

import { useEffect, useState } from "react";
import styles from "./DestinationStory.module.css";

function formatStatus(status) {
  const labels = {
    bookable: "Available to Plan",
    live: "Available to Plan",
    tailor_made: "Tailor Made",
    coming_soon: "Coming Soon",
  };

  return (
    labels[String(status || "").toLowerCase()] ||
    String(status || "Destination")
      .replaceAll("_", " ")
      .replace(/\b\w/g, character => character.toUpperCase())
  );
}

function displayValue(value, fallback = "To be confirmed") {
  if (value === null || value === undefined || value === "") {
    return fallback;
  }

  return value;
}

export default function DestinationStory({ slug }) {
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    if (!slug) {
      setError("A destination was not selected.");
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    async function loadDestination() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `/api/public/destinations/${encodeURIComponent(slug)}`,
          {
            cache: "no-store",
            signal: controller.signal,
          }
        );

        const body = await response.json();

        if (!response.ok) {
          throw new Error(
            body.error || "The destination could not be loaded."
          );
        }

        setDestination(body.destination);
      } catch (requestError) {
        if (requestError.name !== "AbortError") {
          setError(
            requestError.message ||
              "The destination is temporarily unavailable."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadDestination();

    return () => controller.abort();
  }, [slug]);

  if (loading) {
    return (
      <main className={styles.state}>
        <div className={styles.stateCard}>
          <span>Africa &amp; Middle East Explorer</span>
          <h1>Opening the destination…</h1>
          <p>
            We are preparing your Imbondeiro Travel destination story.
          </p>
        </div>
      </main>
    );
  }

  if (error || !destination) {
    return (
      <main className={styles.state}>
        <div className={styles.stateCard}>
          <span>Destination Explorer</span>
          <h1>Destination unavailable</h1>
          <p>
            {error ||
              "This destination is not currently available in the Explorer."}
          </p>

          <a className={styles.primaryAction} href="/explorer">
            Return to the Explorer
          </a>
        </div>
      </main>
    );
  }

  const hasHeroImage =
    Boolean(destination.hero_image) && !imageFailed;

  const fallbackLetter =
    destination.name?.trim()?.charAt(0)?.toUpperCase() || "I";

  const regionLabel = [
    destination.explorer_region,
    destination.subregion,
  ]
    .filter(Boolean)
    .join(" · ");

  const planningUrl =
    `/?destination=${encodeURIComponent(
      destination.slug
    )}#contact`;

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        {hasHeroImage ? (
          <img
            className={styles.heroImage}
            src={destination.hero_image}
            alt={`${destination.name} destination`}
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div
            className={styles.heroFallback}
            aria-hidden="true"
          >
            <span>{fallbackLetter}</span>
          </div>
        )}

        <div
          className={styles.heroOverlay}
          aria-hidden="true"
        />

        <a className={styles.backLink} href="/explorer">
          <span aria-hidden="true">←</span>
          Africa &amp; Middle East Explorer
        </a>

        <div className={styles.heroContent}>
          <p className={styles.eyebrow}>
            {regionLabel || "Imbondeiro Travel Destination"}
          </p>

          <h1>{destination.name}</h1>

          <div className={styles.heroMeta}>
            {destination.capital && (
              <span>Capital · {destination.capital}</span>
            )}

            {destination.destination_type && (
              <span>
                {String(destination.destination_type)
                  .replaceAll("_", " ")}
              </span>
            )}

            <span className={styles.status}>
              {formatStatus(destination.launch_status)}
            </span>
          </div>
        </div>
      </section>

      <div className={styles.content}>
        <section className={styles.introduction}>
          <p className={styles.sectionLabel}>
            Discover {destination.name}
          </p>

          <div className={styles.introductionCopy}>
            <h2>
              {destination.summary ||
                `A journey shaped around ${destination.name}.`}
            </h2>

            {destination.description ? (
              <p className={styles.description}>
                {destination.description}
              </p>
            ) : (
              <p className={styles.placeholderText}>
                Our destination specialists are preparing a richer
                editorial introduction. In the meantime, this
                destination can still be discussed as part of a
                personalised journey.
              </p>
            )}
          </div>
        </section>

        <section className={styles.information}>
          <div>
            <p className={styles.sectionLabel}>
              Before You Travel
            </p>

            <h2>Practical information</h2>

            {destination.practical_information ? (
              <p className={styles.practicalText}>
                {destination.practical_information}
              </p>
            ) : (
              <p className={styles.placeholderText}>
                Detailed practical guidance will be provided during
                the planning process and confirmed before travel.
              </p>
            )}

            {destination.entry_information_notice && (
              <div className={styles.notice}>
                <strong>Entry information</strong>
                <p>
                  {destination.entry_information_notice}
                </p>
              </div>
            )}
          </div>

          <dl className={styles.facts}>
            <div className={styles.fact}>
              <dt>Region</dt>
              <dd>
                {displayValue(destination.explorer_region)}
              </dd>
            </div>

            <div className={styles.fact}>
              <dt>Subregion</dt>
              <dd>
                {displayValue(destination.subregion)}
              </dd>
            </div>

            <div className={styles.fact}>
              <dt>Capital</dt>
              <dd>
                {displayValue(destination.capital)}
              </dd>
            </div>

            <div className={styles.fact}>
              <dt>Best months</dt>
              <dd>
                {displayValue(
                  destination.best_months,
                  "Discuss with our travel specialists"
                )}
              </dd>
            </div>

            <div className={styles.fact}>
              <dt>Currency</dt>
              <dd>
                {displayValue(
                  destination.currency,
                  "Confirmed during planning"
                )}
              </dd>
            </div>

            <div className={styles.fact}>
              <dt>Journey style</dt>
              <dd>
                {formatStatus(destination.launch_status)}
              </dd>
            </div>
          </dl>
        </section>

        <section className={styles.planning}>
          <div>
            <p className={styles.sectionLabel}>
              Your Lifetime Experience
            </p>

            <h2>
              Begin planning your journey to{" "}
              {destination.name}.
            </h2>

            <p>
              Tell us how you would like to travel. Our team will
              shape the route, stays and experiences around your
              interests, preferred pace and travel dates.
            </p>
          </div>

          <div className={styles.planningActions}>
            {destination.enquiry_enabled ? (
              <a
                className={styles.primaryAction}
                href={planningUrl}
              >
                Start Planning
              </a>
            ) : (
              <span className={styles.secondaryAction}>
                Enquiries Opening Soon
              </span>
            )}

            <a
              className={styles.secondaryAction}
              href="/explorer"
            >
              Explore More Destinations
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
