"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./PublicDestinationMap.module.css";

const COUNTRY_COORDINATES = {
  DZ: [28.03, 1.66],
  AO: [-11.2, 17.87],
  BJ: [9.31, 2.32],
  BW: [-22.33, 24.68],
  BF: [12.24, -1.56],
  BI: [-3.37, 29.92],
  CV: [15.12, -23.61],
  CM: [5.69, 12.74],
  CF: [6.61, 20.94],
  TD: [15.45, 18.73],
  KM: [-11.88, 43.87],
  CD: [-2.88, 23.66],
  CG: [-0.23, 15.83],
  CI: [7.54, -5.55],
  DJ: [11.83, 42.59],
  EG: [26.82, 30.8],
  GQ: [1.65, 10.27],
  ER: [15.18, 39.78],
  SZ: [-26.52, 31.47],
  ET: [8.63, 39.6],
  GA: [-0.8, 11.61],
  GM: [13.44, -15.31],
  GH: [7.95, -1.02],
  GN: [10.44, -10.94],
  GW: [11.8, -15.18],
  KE: [0.02, 37.91],
  LS: [-29.61, 28.23],
  LR: [6.43, -9.43],
  LY: [26.34, 17.23],
  MG: [-18.77, 46.87],
  MW: [-13.25, 34.3],
  ML: [17.57, -4.0],
  MR: [20.25, -10.94],
  MU: [-20.35, 57.55],
  MA: [31.79, -7.09],
  MZ: [-18.67, 35.53],
  NA: [-22.56, 17.08],
  NE: [17.61, 8.08],
  NG: [9.08, 8.68],
  RW: [-1.94, 29.87],
  ST: [0.19, 6.61],
  SN: [14.5, -14.45],
  SC: [-4.68, 55.49],
  SL: [8.46, -11.78],
  SO: [5.15, 46.2],
  ZA: [-30.56, 22.94],
  SS: [7.31, 30.05],
  SD: [15.6, 30.22],
  TZ: [-6.37, 34.89],
  TG: [8.62, 0.82],
  TN: [33.89, 9.54],
  UG: [1.37, 32.29],
  ZM: [-13.13, 27.85],
  ZW: [-19.02, 29.15],

  AM: [40.07, 45.04],
  AZ: [40.14, 47.58],
  BH: [26.07, 50.56],
  CY: [35.13, 33.43],
  GE: [42.32, 43.36],
  IR: [32.43, 53.69],
  IQ: [33.22, 43.68],
  IL: [31.05, 34.85],
  JO: [30.59, 36.24],
  KW: [29.31, 47.48],
  LB: [33.85, 35.86],
  OM: [21.47, 55.98],
  PS: [31.95, 35.23],
  QA: [25.35, 51.18],
  SA: [23.89, 45.08],
  SY: [34.8, 38.99],
  TR: [38.96, 35.24],
  AE: [23.42, 53.85],
  YE: [15.55, 48.52],
};

const SPECIAL_COORDINATES = {
  zanzibar: [-6.17, 39.2],
  dubai: [25.2, 55.27],
  abu_dhabi: [24.45, 54.38],
};

const MAP_BOUNDS = {
  minimumLongitude: -25,
  maximumLongitude: 65,
  minimumLatitude: -36,
  maximumLatitude: 43,
};

function destinationStatus(status) {
  const value = String(status || "").toLowerCase();

  if (["bookable", "live"].includes(value)) {
    return {
      label: "Available to Plan",
      className: styles.bookable,
    };
  }

  if (value === "tailor_made") {
    return {
      label: "Tailor Made",
      className: styles.tailorMade,
    };
  }

  return {
    label: "Coming Soon",
    className: styles.comingSoon,
  };
}

function getCoordinates(destination) {
  const special =
    SPECIAL_COORDINATES[
      String(destination.slug || "")
        .toLowerCase()
        .replaceAll("-", "_")
    ];

  if (special) {
    return special;
  }

  const latitude = Number(destination.map_latitude);
  const longitude = Number(destination.map_longitude);

  if (
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    destination.map_latitude !== null &&
    destination.map_longitude !== null
  ) {
    return [latitude, longitude];
  }

  return (
    COUNTRY_COORDINATES[
      String(
        destination.parent_country_code ||
          destination.country_code ||
          ""
      ).toUpperCase()
    ] || null
  );
}

function mapPosition(coordinates) {
  const [latitude, longitude] = coordinates;

  const longitudeRange =
    MAP_BOUNDS.maximumLongitude -
    MAP_BOUNDS.minimumLongitude;

  const latitudeRange =
    MAP_BOUNDS.maximumLatitude -
    MAP_BOUNDS.minimumLatitude;

  const horizontal =
    (longitude - MAP_BOUNDS.minimumLongitude) /
    longitudeRange;

  const vertical =
    (MAP_BOUNDS.maximumLatitude - latitude) /
    latitudeRange;

  return {
    left: `${5 + Math.min(1, Math.max(0, horizontal)) * 90}%`,
    top: `${4 + Math.min(1, Math.max(0, vertical)) * 92}%`,
  };
}

export default function PublicDestinationMap() {
  const [destinations, setDestinations] = useState([]);
  const [region, setRegion] = useState("Africa");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadDestinations() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "/api/public/destinations",
          {
            cache: "no-store",
            signal: controller.signal,
          }
        );

        const body = await response.json();

        if (!response.ok) {
          throw new Error(
            body.error ||
              "The destination map could not be loaded."
          );
        }

        setDestinations(body.destinations || []);
      } catch (requestError) {
        if (requestError.name !== "AbortError") {
          setError(
            requestError.message ||
              "The destination map is temporarily unavailable."
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

  const mappedDestinations = useMemo(() => {
    return destinations
      .filter(
        destination =>
          region === "All" ||
          destination.explorer_region === region
      )
      .map(destination => ({
        ...destination,
        coordinates: getCoordinates(destination),
      }))
      .filter(destination => destination.coordinates)
      .sort((first, second) => {
        if (first.featured !== second.featured) {
          return first.featured ? -1 : 1;
        }

        return String(first.name).localeCompare(
          String(second.name)
        );
      });
  }, [destinations, region]);

  return (
    <section
      className={styles.section}
      aria-labelledby="regional-map-title"
    >
      <div className={styles.inner}>
        <div className={styles.header}>
          <div>
            <p className={styles.eyebrow}>
              The Imbondeiro World
            </p>

            <h2 id="regional-map-title">
              Africa and the Middle East,
              <br />
              mapped for discovery.
            </h2>
          </div>

          <p className={styles.headerText}>
            Move across the map to discover destinations
            shaped by culture, landscape and thoughtful local
            planning. Select a marker to open its destination
            story.
          </p>
        </div>

        <div
          className={styles.controls}
          aria-label="Map region"
        >
          {["All", "Africa", "Middle East"].map(option => (
            <button
              key={option}
              type="button"
              className={`${styles.control} ${
                region === option
                  ? styles.controlActive
                  : ""
              }`}
              aria-pressed={region === option}
              onClick={() => setRegion(option)}
            >
              {option}
            </button>
          ))}
        </div>

        <div className={styles.mapFrame}>
          <svg
            className={styles.mapGraphic}
            viewBox="0 0 1000 650"
            role="img"
            aria-label="Editorial map of Africa and the Middle East"
          >
            <path
              className={styles.land}
              d="M178 79 L242 46 L323 44 L389 65 L437 103
                 L454 146 L490 174 L473 214 L443 239
                 L432 289 L405 321 L390 374 L359 431
                 L328 493 L291 574 L257 604 L233 557
                 L212 502 L180 459 L151 408 L132 352
                 L105 304 L80 244 L94 194 L126 159
                 L139 111 Z"
            />

            <path
              className={styles.land}
              d="M453 121 L505 93 L563 78 L627 83 L678 106
                 L729 101 L777 124 L828 121 L889 146
                 L922 184 L895 211 L836 220 L798 246
                 L741 238 L699 260 L649 242 L606 219
                 L564 207 L520 181 L476 168 Z"
            />

            <path
              className={styles.land}
              d="M499 315 L525 342 L536 392 L522 451
                 L493 501 L470 471 L475 414 L462 365 Z"
            />

            <path
              className={styles.landDetail}
              d="M106 190 C191 222 294 220 438 168
                 M132 352 C227 337 324 339 432 289
                 M257 604 C301 512 351 420 390 374
                 M520 181 C625 163 730 171 895 211"
            />
          </svg>

          {loading && (
            <div className={styles.empty}>
              Preparing the destination map…
            </div>
          )}

          {error && (
            <div className={styles.empty}>
              {error}
            </div>
          )}

          {!loading &&
            !error &&
            mappedDestinations.map(destination => {
              const status = destinationStatus(
                destination.launch_status
              );

              const position = mapPosition(
                destination.coordinates
              );

              return (
                <div
                  className={`${styles.marker} ${
                    status.className
                  } ${
                    destination.featured
                      ? styles.featured
                      : ""
                  }`}
                  style={position}
                  key={destination.id}
                >
                  <a
                    className={styles.markerButton}
                    href={`/explorer/${encodeURIComponent(
                      destination.slug
                    )}`}
                    aria-label={`Open ${destination.name} — ${status.label}`}
                  >
                    <span
                      className={styles.markerDot}
                      aria-hidden="true"
                    />
                  </a>

                  <div
                    className={styles.tooltip}
                    aria-hidden="true"
                  >
                    <strong>{destination.name}</strong>
                    <span>
                      {destination.explorer_region}
                      {" · "}
                      {status.label}
                    </span>
                  </div>
                </div>
              );
            })}

          {!loading &&
            !error &&
            mappedDestinations.length === 0 && (
              <div className={styles.empty}>
                No mapped destinations are currently
                available in this region.
              </div>
            )}
        </div>

        <div
          className={styles.legend}
          aria-label="Map status legend"
        >
          <span
            className={`${styles.legendItem} ${styles.bookable}`}
          >
            <i className={styles.legendDot} />
            Available to Plan
          </span>

          <span
            className={`${styles.legendItem} ${styles.tailorMade}`}
          >
            <i className={styles.legendDot} />
            Tailor Made
          </span>

          <span
            className={`${styles.legendItem} ${styles.comingSoon}`}
          >
            <i className={styles.legendDot} />
            Coming Soon
          </span>

          <span className={styles.legendHome}>
            Angola · Imbondeiro’s Home
          </span>
        </div>

        <div
          className={styles.mobileDestinations}
          aria-label={`${region} destinations`}
        >
          {mappedDestinations.map(destination => {
            const status = destinationStatus(
              destination.launch_status
            );

            return (
              <a
                className={styles.mobileDestination}
                href={`/explorer/${encodeURIComponent(
                  destination.slug
                )}`}
                key={`mobile-${destination.id}`}
              >
                <strong>{destination.name}</strong>
                <span>{status.label}</span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
