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
const SVG_WIDTH = 1000;
const SVG_HEIGHT = 650;

const AFRICA_OUTLINE = [
  [28.5, -17.5],
  [32.5, -13.0],
  [35.8, -9.5],
  [35.9, -5.5],
  [35.0, -1.5],
  [37.0, 3.0],
  [37.0, 9.5],
  [33.0, 11.5],
  [32.0, 15.0],
  [31.5, 25.0],
  [31.2, 32.5],
  [29.5, 34.8],
  [23.0, 35.5],
  [18.0, 37.5],
  [15.0, 40.0],
  [12.5, 42.5],
  [11.5, 51.2],
  [8.0, 49.0],
  [4.0, 44.0],
  [0.0, 42.0],
  [-4.0, 41.0],
  [-10.0, 40.0],
  [-15.0, 36.0],
  [-20.0, 35.0],
  [-26.0, 32.0],
  [-33.0, 28.0],
  [-35.0, 22.0],
  [-34.8, 18.0],
  [-28.0, 15.0],
  [-21.0, 12.0],
  [-15.0, 12.0],
  [-10.0, 13.0],
  [-5.0, 12.0],
  [-1.0, 9.0],
  [1.5, 8.0],
  [4.0, 9.0],
  [5.0, 5.0],
  [5.0, 1.0],
  [5.0, -5.0],
  [7.0, -10.0],
  [10.0, -14.0],
  [14.0, -16.0],
  [20.0, -17.0],
  [28.5, -17.5],
];

const MIDDLE_EAST_OUTLINE = [
  [42.0, 26.0],
  [42.0, 36.0],
  [41.0, 45.0],
  [39.0, 51.0],
  [38.0, 58.0],
  [35.0, 63.0],
  [29.0, 61.0],
  [25.0, 58.0],
  [22.0, 56.0],
  [17.0, 55.0],
  [13.0, 52.0],
  [12.0, 46.0],
  [16.0, 43.0],
  [20.0, 39.0],
  [27.0, 35.0],
  [31.0, 30.0],
  [35.0, 27.0],
  [42.0, 26.0],
];

const MADAGASCAR_OUTLINE = [
  [-11.8, 49.2],
  [-14.5, 50.1],
  [-19.0, 49.3],
  [-23.8, 47.3],
  [-25.5, 45.3],
  [-22.0, 43.5],
  [-17.5, 44.0],
  [-13.5, 46.0],
  [-11.8, 49.2],
];

function projectOutline(outline) {
  const longitudeRange =
    MAP_BOUNDS.maximumLongitude -
    MAP_BOUNDS.minimumLongitude;

  const latitudeRange =
    MAP_BOUNDS.maximumLatitude -
    MAP_BOUNDS.minimumLatitude;

  return outline
    .map(([latitude, longitude]) => {
      const horizontal =
        (longitude - MAP_BOUNDS.minimumLongitude) /
        longitudeRange;

      const vertical =
        (MAP_BOUNDS.maximumLatitude - latitude) /
        latitudeRange;

      const x = horizontal * SVG_WIDTH;
      const y = vertical * SVG_HEIGHT;

      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

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
  viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
  role="img"
  aria-label="Geographic map of Africa and the Middle East"
>
  {region !== "Middle East" && (
    <>
      <polygon
        className={styles.land}
        points={projectOutline(AFRICA_OUTLINE)}
      />

      <polygon
        className={styles.land}
        points={projectOutline(MADAGASCAR_OUTLINE)}
      />
    </>
  )}

  {region !== "Africa" && (
    <polygon
      className={styles.land}
      points={projectOutline(MIDDLE_EAST_OUTLINE)}
    />
  )}

  {region === "All" && (
    <>
      <polyline
        className={styles.landDetail}
        points={projectOutline([
          [0, -16],
          [0, 9],
          [0, 23],
          [0, 42],
        ])}
      />

      <polyline
        className={styles.landDetail}
        points={projectOutline([
          [23.5, -17],
          [23.5, 10],
          [23.5, 35],
          [23.5, 58],
        ])}
      />
    </>
  )}
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
