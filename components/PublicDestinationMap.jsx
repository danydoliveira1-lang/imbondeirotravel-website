    if (box.left < 8 || box.right > VIEW_WIDTH - 8 ||
        box.top < 8 || box.bottom > VIEW_HEIGHT - 8) continue;
    const collides = occupied.some(other =>
      box.left < other.right + 5 && box.right + 5 > other.left &&
      box.top < other.bottom + 5 && box.bottom + 5 > other.top
    );
    // Avoid placing text over clickable destination markers.
    const coversPin = pinPoints.some(([x, y]) =>
      x > box.left - 17 && x < box.right + 17 &&
      y > box.top - 17 && y < box.bottom + 17
    );
    if (collides || coversPin) continue;
    occupied.push(box);
    accepted.push(label);
  }
  return accepted;
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
  
const visibleDestinations = useMemo(
  () =>
    destinations
      .filter(destination => destination.show_on_explorer === true)
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
      .sort(
        (a, b) =>
          Number(Boolean(b.featured)) -
            Number(Boolean(a.featured)) ||
          String(a.name).localeCompare(String(b.name))
      ),
  [destinations, region]
);

  const countryLabels = useMemo(
    () => selectCountryLabels(selectedCountries, project, region, visibleDestinations),
    [selectedCountries, project, region, visibleDestinations]
  );

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
            {countryLabels.map(label => (
              <text key={`label-${label.feature.code}`} x={label.x} y={label.y} className={styles.countryLabel} textAnchor="middle" aria-hidden="true">{label.feature.name}</text>
            ))}
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
