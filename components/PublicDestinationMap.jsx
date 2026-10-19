"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./PublicDestinationMap.module.css";
import countryData from "../data/world-regions.json";

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

const VIEW_WIDTH = 1000;
const VIEW_HEIGHT = 650;
const REGION_OPTIONS = ["Africa", "Middle East", "All"];
const MIDDLE_EAST_CODES = new Set(["ARM", "AZE", "BHR", "CYP", "GEO", "IRN", "IRQ", "ISR", "JOR", "KWT", "LBN", "OMN", "PSE", "QAT", "SAU", "SYR", "TUR", "ARE", "YEM", "EGY"]);

function getCoordinates(destination) {
  const special = SPECIAL_COORDINATES[String(destination.slug || "").toLowerCase().replaceAll("-", "_")];
  if (special) return special;
  if (destination.map_latitude != null && destination.map_longitude != null && destination.map_latitude !== "" && destination.map_longitude !== "") {
    const lat = Number(destination.map_latitude);
    const lon = Number(destination.map_longitude);
    if (Number.isFinite(lat) && Number.isFinite(lon)) return [lat, lon];
  }
  return COUNTRY_COORDINATES[String(destination.parent_country_code || destination.country_code || "").toUpperCase()] || null;
}

function statusInfo(value) {
  const status = String(value || "").toLowerCase();
  if (["bookable", "live"].includes(status)) return { label: "Available to Plan", className: styles.bookable };
  if (status === "tailor_made") return { label: "Tailor Made", className: styles.tailorMade };
  return { label: "Coming Soon", className: styles.comingSoon };
}

function forRegion(feature, region) {
  if (region === "All") return true;
  if (region === "Africa") return feature.region === "Africa";
  return feature.region === "Middle East" || MIDDLE_EAST_CODES.has(feature.code);
}

function coordinatesOf(geometry) {
  if (geometry.type === "Polygon") return geometry.coordinates.flat(1);
  return geometry.coordinates.flat(2);
}

function createProjection(features, region) {
  const coords = features.flatMap(feature => coordinatesOf(feature.geometry));
  const longs = coords.map(point => point[0]);
  const lats = coords.map(point => point[1]);
  // Geographic aspect adjustment: longitude degrees narrow with latitude.
  const minLon = Math.min(...longs), maxLon = Math.max(...longs);
  const minLat = Math.min(...lats), maxLat = Math.max(...lats);
  const centerLat = (minLat + maxLat) / 2;
  const longitudeFactor = Math.max(0.65, Math.cos(centerLat * Math.PI / 180));
  const width = (maxLon - minLon) * longitudeFactor;
  const height = maxLat - minLat;
  const padding = region === "Middle East" ? 78 : 52;
  const scale = Math.min((VIEW_WIDTH - padding * 2) / width, (VIEW_HEIGHT - padding * 2) / height);
  const xOffset = (VIEW_WIDTH - width * scale) / 2;
  const yOffset = (VIEW_HEIGHT - height * scale) / 2;
  return ([lat, lon]) => [xOffset + (lon - minLon) * longitudeFactor * scale, yOffset + (maxLat - lat) * scale];
}

function polygonPath(rings, project) {
  return rings.map(ring => ring.map(([lon, lat], i) => {
    const [x, y] = project([lat, lon]);
    return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ") + " Z").join(" ");
}

function countryPath(feature, project) {
  const geometry = feature.geometry;
  return geometry.type === "Polygon"
    ? polygonPath(geometry.coordinates, project)
    : geometry.coordinates.map(poly => polygonPath(poly, project)).join(" ");
}

function countryLabel(feature, project) {
  // Bounding-box centre is an approximate label location; skip tiny territories.
  const points = coordinatesOf(feature.geometry);
  const minLon = Math.min(...points.map(p => p[0]));
  const maxLon = Math.max(...points.map(p => p[0]));
  const minLat = Math.min(...points.map(p => p[1]));
  const maxLat = Math.max(...points.map(p => p[1]));
  const [x, y] = project([(minLat + maxLat) / 2, (minLon + maxLon) / 2]);
  return { x, y, size: (maxLon - minLon) * (maxLat - minLat) };
}

export default function PublicDestinationMap() {
  const [destinations, setDestinations] = useState([]);
  const [region, setRegion] = useState("Africa");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        setLoading(true);
        setError("");
        const response = await fetch("/api/public/destinations", { cache: "no-store", signal: controller.signal });
        const body = await response.json();
        if (!response.ok) throw new Error(body.error || "The destination map could not be loaded.");
        setDestinations(Array.isArray(body.destinations) ? body.destinations : []);
      } catch (err) {
        if (err.name !== "AbortError") setError(err.message || "The destination map is temporarily unavailable.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    load();
    return () => controller.abort();
  }, []);

  const selectedCountries = useMemo(() => countryData.features.filter(feature => forRegion(feature, region)), [region]);
  const project = useMemo(() => createProjection(selectedCountries, region), [selectedCountries, region]);
  const visibleDestinations = useMemo(() => destinations
    .filter(destination => region === "All" || destination.explorer_region === region)
    // The public endpoint is expected to return only intentionally published destinations.
    .filter(destination => destination.published !== false && destination.status !== "draft")
    .map(destination => ({ ...destination, coordinates: getCoordinates(destination) }))
    .filter(destination => destination.coordinates)
    .sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)) || String(a.name).localeCompare(String(b.name))), [destinations, region]);

  return (
    <section className={styles.section} aria-labelledby="regional-map-title">
      <div className={styles.inner}>
        <div className={styles.header}>
          <div>
            <p className={styles.eyebrow}>The Imbondeiro World</p>
            <h2 id="regional-map-title">Africa and the Middle East,<br />mapped for discovery.</h2>
          </div>
          <p className={styles.headerText}>Explore countries across the region. Only destinations in our curated collection carry pins. Select a pin to discover its journey.</p>
        </div>
        <div className={styles.controls} aria-label="Map region">
          {REGION_OPTIONS.map(option => <button key={option} type="button" className={`${styles.control} ${region === option ? styles.controlActive : ""}`} aria-pressed={region === option} onClick={() => setRegion(option)}>{option}</button>)}
        </div>
        <div className={styles.mapFrame}>
          <svg className={styles.mapGraphic} viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`} role="img" aria-label={`Map of ${region === "All" ? "Africa and the Middle East" : region} with country boundaries and selected destination pins`}>
            {selectedCountries.map(feature => (
              <path key={`${feature.region}-${feature.code}`} d={countryPath(feature, project)} className={`${styles.land} ${feature.code === "AGO" ? styles.homeCountry : ""}`} fillRule="evenodd">
                <title>{feature.name}</title>
              </path>
            ))}
            {selectedCountries.map(feature => {
              const label = countryLabel(feature, project);
              if (label.size < (region === "All" ? 20 : 8)) return null;
              return <text key={`label-${feature.code}`} x={label.x} y={label.y} className={styles.countryLabel} textAnchor="middle" aria-hidden="true">{feature.name}</text>;
            })}
            {!loading && !error && visibleDestinations.map(destination => {
              const [x, y] = project(destination.coordinates);
              const status = statusInfo(destination.launch_status);
              return (
                <a key={destination.id} href={`/explorer/${encodeURIComponent(destination.slug)}`} className={`${styles.mapPin} ${status.className} ${destination.featured ? styles.featured : ""}`} aria-label={`Open ${destination.name} — ${status.label}`}>
                  <circle cx={x} cy={y} r={15} className={styles.pinHalo} />
                  <circle cx={x} cy={y} r={destination.featured ? 7 : 5} className={styles.pinDot} />
                  <title>{`${destination.name} · ${status.label}`}</title>
                </a>
              );
            })}
          </svg>
          {loading && <div className={styles.empty}>Preparing the destination map…</div>}
          {error && <div className={styles.empty}>{error}</div>}
          {!loading && !error && visibleDestinations.length === 0 && <div className={styles.empty}>No mapped destinations are currently available in this region.</div>}
        </div>
        <div className={styles.legend} aria-label="Map status legend">
          <span className={`${styles.legendItem} ${styles.bookable}`}><i className={styles.legendDot} />Available to Plan</span>
          <span className={`${styles.legendItem} ${styles.tailorMade}`}><i className={styles.legendDot} />Tailor Made</span>
          <span className={`${styles.legendItem} ${styles.comingSoon}`}><i className={styles.legendDot} />Coming Soon</span>
          <span className={styles.legendHome}>Angola · Imbondeiro's Home</span>
        </div>
        <div className={styles.mobileDestinations} aria-label={`${region} destinations`}>
          {visibleDestinations.map(destination => <a key={`mobile-${destination.id}`} className={styles.mobileDestination} href={`/explorer/${encodeURIComponent(destination.slug)}`}><strong>{destination.name}</strong><span>{statusInfo(destination.launch_status).label}</span></a>)}
        </div>
      </div>
    </section>
  );
}
