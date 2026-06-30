:root {
  --ivory: #f6f2e9;
  --paper: #fffdf8;
  --beige: #e9e0d1;
  --forest: #164c3b;
  --forest-dark: #0e352b;
  --navy: #10243a;
  --gold: #bf9145;
  --brown: #473a31;
  --charcoal: #222622;
  --muted: #6d7069;
  --line: rgba(34, 38, 34, 0.17);
}

* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body {
  min-width: 0;
  margin: 0;
  overflow-x: hidden;
  color: var(--charcoal);
  background: var(--ivory);
  font-family: "DM Sans", Arial, sans-serif;
}
body, button, input, textarea { letter-spacing: 0; }
img { display: block; width: 100%; }
a { color: inherit; text-decoration: none; }
button, input, textarea { font: inherit; }
h1, h2, h3, p { margin-top: 0; }
h1, h2, h3 { font-weight: 400; }
h1, h2 { font-family: "Libre Caslon Display", Georgia, serif; }
.section { padding: 112px max(5vw, 32px); }
.eyebrow {
  margin-bottom: 18px;
  color: var(--forest);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}
.eyebrow.light { color: #d8bd85; }
.button {
  display: inline-flex;
  min-height: 50px;
  align-items: center;
  justify-content: center;
  padding: 0 24px;
  border: 1px solid transparent;
  border-radius: 2px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 700;
  text-align: center;
  transition: background .2s ease, color .2s ease, border-color .2s ease, transform .2s ease;
}
.button:hover { transform: translateY(-2px); }
.button-green { color: #fff; background: var(--forest); }
.button-green:hover { background: var(--forest-dark); }
.button-outline { border-color: var(--forest); color: var(--forest); }
.button-outline:hover { color: #fff; background: var(--forest); }
.button-text { gap: 12px; padding-inline: 4px; color: var(--forest); border-bottom-color: var(--forest); }
.button-gold { color: var(--forest-dark); background: #d5ae68; }
.button-small { min-height: 40px; padding-inline: 15px; font-size: 11px; }
.button-row { display: flex; gap: 26px; align-items: center; margin-top: 36px; }

.site-header {
  position: sticky;
  z-index: 50;
  top: 0;
  border-bottom: 1px solid var(--line);
  background: rgba(246, 242, 233, .96);
  backdrop-filter: blur(16px);
}
.nav-shell {
  display: flex;
  min-height: 86px;
  max-width: 1500px;
  margin: auto;
  padding: 9px max(3vw, 24px);
  align-items: center;
  gap: 28px;
}
.brand { width: 150px; flex: 0 0 auto; }
.brand img { width: 150px; height: auto; object-fit: contain; }
.nav-panel { display: flex; flex: 1; align-items: center; justify-content: flex-end; gap: 28px; }
.nav-links { display: flex; align-items: center; gap: clamp(13px, 1.4vw, 24px); }
.nav-links a {
  padding: 10px 0;
  color: var(--brown);
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
}
.nav-links a:hover { color: var(--forest); }
.language-switcher {
  position: relative;
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
}
.language-toggle {
  display: inline-grid;
  width: 44px;
  height: 44px;
  padding: 0;
  place-items: center;
  border: 1px solid var(--line);
  color: var(--brown);
  background: var(--paper);
  cursor: pointer;
  font-size: 0;
}
.language-toggle:hover,
.language-switcher.is-open .language-toggle {
  color: #fff;
  border-color: var(--forest);
  background: var(--forest);
}
.language-globe-icon {
  width: 20px;
  height: 20px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.language-options {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  z-index: 30;
  display: inline-flex;
  padding: 3px;
  border: 1px solid var(--line);
  background: var(--paper);
  box-shadow: 0 18px 38px rgba(17, 24, 39, .14);
}
.language-options[hidden] {
  display: none !important;
}
.language-option {
  width: 36px;
  height: 36px;
  padding: 0;
  border: 0;
  color: var(--muted);
  background: transparent;
  cursor: pointer;
  font-size: 10px;
  font-weight: 700;
}
.language-option:hover { color: var(--forest); }
.language-option.is-active { color: #fff; background: var(--forest); }
.nav-actions { display: flex; align-items: center; gap: 8px; }
.header-socials {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-right: 4px;
}
.header-socials a {
  padding: 10px 0;
  color: var(--muted);
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
}
.header-socials a:hover { color: var(--forest); }
.menu-toggle { display: none; width: 42px; height: 42px; padding: 10px; border: 0; background: transparent; }
.menu-toggle span { display: block; height: 1px; margin: 5px 0; background: var(--charcoal); }

.hero {
  display: grid;
  min-height: calc(100vh - 86px);
  max-height: 900px;
  grid-template-columns: minmax(360px, .82fr) 1.18fr;
  align-items: stretch;
  background: linear-gradient(135deg, var(--paper) 0%, var(--ivory) 52%, #ece2d1 100%);
}
.hero-copy {
  display: flex;
  position: relative;
  padding: clamp(70px, 9vw, 150px) clamp(36px, 6vw, 100px);
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
}
.hero-copy::before {
  width: 72px;
  height: 1px;
  margin-bottom: 28px;
  background: var(--gold);
  content: "";
}
.hero h1 { max-width: 700px; margin-bottom: 30px; font-size: clamp(58px, 6.6vw, 108px); line-height: .96; }
.hero-copy > p:not(.eyebrow) { max-width: 610px; color: var(--muted); font-size: 18px; line-height: 1.75; }
.hero-media { position: relative; min-height: 650px; margin: 0; overflow: hidden; }
.hero-poster { position: absolute; inset: 0; height: 100%; object-fit: cover; object-position: center; }
.hero-video {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 1;
  width: max(100%, 177.78vh);
  height: max(100%, 56.25vw);
  border: 0;
  opacity: 0;
  pointer-events: none;
  transform: translate(-50%, -50%);
  transition: opacity 2.8s ease-in-out;
}
.hero-video.is-active {
  z-index: 2;
  opacity: 1;
}
.hero-media::after {
  position: absolute;
  z-index: 3;
  inset: 0;
  background: linear-gradient(180deg, transparent 55%, rgba(14, 53, 43, .48));
  content: "";
}
.hero-caption {
  position: absolute;
  z-index: 4;
  right: 42px;
  bottom: 38px;
  max-width: min(440px, calc(100% - 48px));
  color: #fff;
  font-family: "Libre Caslon Display", Georgia, serif;
  font-size: 30px;
  opacity: 0;
  text-align: right;
  transform: translateY(12px);
  transition: opacity 1.8s ease-in-out .7s, transform 1.8s ease-in-out .7s;
}
.hero-caption.is-active {
  opacity: 1;
  transform: translateY(0);
}
.hero-caption span { display: block; margin-bottom: 7px; font-family: "DM Sans", Arial, sans-serif; font-size: 10px; font-weight: 700; letter-spacing: .16em; text-transform: uppercase; }

@media (prefers-reduced-motion: reduce) {
  .hero-video { display: none; }
  .hero-caption { display: none; }
  .hero-caption[data-hero-caption="falls"] { display: block; opacity: 1; transform: none; }
}

.editorial-intro {
  display: grid;
  max-width: 1500px;
  margin: auto;
  grid-template-columns: 70px minmax(260px, .8fr) 1.2fr;
  align-items: start;
  gap: 6vw;
  border-bottom: 1px solid var(--line);
}
.section-number { color: var(--gold); font-family: "Libre Caslon Display", Georgia, serif; font-size: 28px; }
.editorial-intro h2, .section-heading h2, .faq h2, .contact h2 { margin-bottom: 0; font-size: clamp(44px, 5vw, 76px); line-height: 1.04; }
.intro-copy { max-width: 760px; margin: 26px 0 0; color: var(--brown); font-family: "Libre Caslon Display", Georgia, serif; font-size: clamp(24px, 2.2vw, 36px); line-height: 1.45; }
.about-story { max-width: 860px; }
.about-story .intro-copy { margin-top: 0; }
.about-story p:not(.intro-copy) { margin: 18px 0 0; color: var(--muted); font-size: 15px; line-height: 1.8; }
.promise { background: var(--paper); }
.promise-grid { display: grid; max-width: 1500px; margin: auto; grid-template-columns: repeat(2, 1fr); gap: 24px; }
.promise-grid article { padding: 36px; background: var(--ivory); border: 1px solid var(--line); }
.promise-grid span { display: block; margin-bottom: 20px; color: var(--gold); font-family: "Libre Caslon Display", Georgia, serif; font-size: 28px; }
.promise-grid p { margin: 0; color: var(--brown); font-size: 17px; line-height: 1.75; }
.content-strip { background: var(--ivory); border-top: 1px solid var(--line); }
.content-strip .section-heading { margin-bottom: 0; }
.partner-content { max-width: 1500px; margin: 42px auto 0; }
.partner-intro, .partner-grid article { padding: 32px; background: var(--paper); border: 1px solid rgba(34,38,34,.12); }
.partner-intro h3, .partner-grid h3 { margin: 0 0 16px; color: var(--ink); font-family: "Libre Caslon Display", Georgia, serif; font-size: clamp(28px, 3vw, 44px); line-height: 1.12; }
.partner-intro p { max-width: 1050px; margin: 0; color: var(--muted); font-size: 16px; line-height: 1.8; }
.partner-intro p + p { margin-top: 14px; }
.partner-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; margin-top: 24px; }
.partner-grid h3 { font-size: 30px; }
.partner-grid ul { margin: 0; padding-left: 20px; color: var(--muted); font-size: 15px; line-height: 1.75; }
.partner-grid li + li { margin-top: 8px; }
.partner-grid p { margin: 0; color: var(--muted); font-size: 15px; line-height: 1.75; }
.partner-grid p + h3 { margin-top: 24px; }
.partner-commitment { margin-top: 24px; background: var(--beige); }
.section-heading {
  display: flex;
  max-width: 1500px;
  margin: 0 auto 58px;
  align-items: end;
  justify-content: space-between;
  gap: 50px;
}
.section-heading > p { max-width: 390px; margin-bottom: 8px; color: var(--muted); font-size: 15px; line-height: 1.65; }

.destination-grid { display: grid; max-width: 1500px; margin: auto; grid-template-columns: repeat(3, 1fr); gap: 24px; }
.destination-card { min-width: 0; background: var(--paper); }
.destination-card img { height: 295px; object-fit: cover; }
.destination-card .image-left { object-position: left; }
.destination-card .image-right { object-position: right; }
.destination-card .image-center { object-position: center; }
.destination-featured { grid-column: span 2; }
.destination-featured img { height: 430px; }
.card-content { padding: 27px 28px 30px; }
.card-index { margin-bottom: 14px; color: var(--gold); font-size: 10px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; }
.card-content h3 { margin-bottom: 12px; font-family: "Libre Caslon Display", Georgia, serif; font-size: 30px; }
.card-content > p:not(.card-index) { min-height: 52px; color: var(--muted); font-size: 14px; line-height: 1.7; }
.card-content a, .region-list a { color: var(--forest); font-size: 12px; font-weight: 700; }

.world-section {
  display: grid;
  grid-template-columns: .72fr 1.28fr;
  gap: 8vw;
  color: #fff;
  background: var(--forest-dark);
}
.world-heading { position: sticky; top: 145px; align-self: start; }
.world-heading h2, .why-title h2 { margin-bottom: 30px; font-size: clamp(52px, 5.8vw, 88px); line-height: 1; }
.world-heading > p:last-child { max-width: 500px; color: rgba(255,255,255,.67); line-height: 1.8; }
.region-list article {
  display: grid;
  min-height: 145px;
  padding: 33px 0;
  grid-template-columns: 55px 180px 1fr 80px;
  align-items: center;
  gap: 22px;
  border-top: 1px solid rgba(255,255,255,.18);
}
.region-list article:last-child { border-bottom: 1px solid rgba(255,255,255,.18); }
.region-list article > span { color: #d8bd85; font-family: "Libre Caslon Display", Georgia, serif; font-size: 18px; }
.region-list h3 { margin: 0; font-family: "Libre Caslon Display", Georgia, serif; font-size: 31px; }
.region-list p { margin: 0; color: rgba(255,255,255,.67); font-size: 14px; line-height: 1.7; }
.region-list a { color: #fff; text-align: right; }

.tour-list { max-width: 1500px; margin: auto; border-top: 1px solid var(--line); }
.tour-list article {
  display: grid;
  min-height: 130px;
  padding: 26px 10px;
  grid-template-columns: 70px minmax(280px, 1fr) 170px 140px;
  align-items: center;
  gap: 26px;
  border-bottom: 1px solid var(--line);
}
.tour-no { color: var(--gold); font-family: "Libre Caslon Display", Georgia, serif; font-size: 21px; }
.tour-list h3 { margin-bottom: 8px; font-family: "Libre Caslon Display", Georgia, serif; font-size: 29px; }
.tour-list p { margin: 0; color: var(--muted); font-size: 14px; line-height: 1.5; }
.tour-list strong { color: var(--brown); font-size: 12px; }
.tour-list a { justify-self: end; padding: 10px 0; color: var(--forest); border-bottom: 1px solid var(--forest); font-size: 11px; font-weight: 700; }
.tour-list-feature > .tour-booking-panel { grid-column: 2 / -1; }
.tour-list-feature .tour-feature { grid-column: 2 / -1; }
.tour-feature { max-width: 1500px; margin: 10px 0 0; padding: 0; background: var(--paper); border: 1px solid var(--line); }
.tour-feature summary { width: max-content; margin: 24px; padding: 14px 20px; color: #fff; background: var(--forest); border-radius: 999px; cursor: pointer; font-size: 12px; font-weight: 700; list-style: none; }
.tour-feature summary::-webkit-details-marker { display: none; }
.tour-feature[open] summary { margin-bottom: 0; }
.tour-feature-body { padding: 28px clamp(24px, 4vw, 48px) clamp(28px, 4vw, 48px); }
.tour-feature h3 { margin: 10px 0 18px; font-family: "Libre Caslon Display", Georgia, serif; font-size: clamp(36px, 4vw, 62px); line-height: 1.04; }
.tour-feature-body > p:not(.eyebrow), .tour-feature li { color: var(--muted); font-size: 15px; line-height: 1.75; }
.tour-feature-grid { display: grid; margin: 30px 0 26px; grid-template-columns: 1.2fr .8fr; gap: 34px; }
.tour-feature h4 { margin: 0 0 12px; color: var(--brown); font-family: "Libre Caslon Display", Georgia, serif; font-size: 24px; }
.tour-feature ul { margin: 0; padding-left: 20px; }
.tour-feature strong { display: block; margin-bottom: 22px; color: var(--brown); font-family: "Libre Caslon Display", Georgia, serif; font-size: 24px; font-weight: 400; }
.tour-feature li strong { display: inline; margin: 0; font-family: "DM Sans", Arial, sans-serif; font-size: inherit; font-weight: 700; }
.tour-booking-panel { display: grid; margin: 8px 0 28px; padding: 22px; grid-template-columns: minmax(260px, 1.2fr) minmax(150px, .45fr) minmax(200px, .7fr) minmax(220px, .75fr); gap: 22px; align-items: end; border: 1px solid var(--line); background: var(--ivory); }
.tour-booking-panel span { display: block; margin-bottom: 8px; color: var(--gold); font-size: 10px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; }
.tour-booking-panel strong { margin: 0; font-size: 28px; }
.tour-booking-panel label, .tour-date-picker { display: grid; gap: 8px; }
.tour-booking-panel input { width: 100%; min-height: 48px; padding: 12px 14px; color: var(--charcoal); border: 1px solid var(--line); border-radius: 0; background: #fff; }
.tour-booking-panel input:focus { border-color: var(--forest); outline: 2px solid rgba(39, 84, 67, .14); outline-offset: 0; }
.tour-product-summary p { margin-top: 12px; color: var(--muted); font-size: 13px; line-height: 1.55; }
.tour-product-price strong { color: var(--forest); font-size: 34px; }
.tour-product-meta { display: grid; gap: 9px; margin: 0; }
.tour-product-meta div { display: grid; grid-template-columns: 92px 1fr; gap: 10px; }
.tour-product-meta dt { color: var(--brown); font-size: 11px; font-weight: 700; }
.tour-product-meta dd { margin: 0; color: var(--muted); font-size: 13px; }
.tour-date-picker { align-self: stretch; justify-content: end; }
.calendar-toggle { min-height: 48px; padding: 12px 18px; color: #fff; border: 0; background: var(--forest); cursor: pointer; font-size: 12px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; }
.calendar-toggle:hover { background: var(--forest-dark); }
.live-calendar { grid-column: 1 / -1; max-width: 520px; padding: 18px; border: 1px solid var(--line); background: #fff; }
.calendar-header { display: grid; grid-template-columns: 44px 1fr 44px; align-items: center; gap: 10px; }
.calendar-header strong { margin: 0; color: var(--brown); font-family: "Libre Caslon Display", Georgia, serif; font-size: 26px; text-align: center; }
.calendar-nav { width: 44px; height: 44px; color: #fff; border: 0; border-radius: 50%; background: var(--forest); cursor: pointer; font-size: 26px; line-height: 1; }
.calendar-nav:hover { background: var(--forest-dark); }
.calendar-weekdays, .calendar-days { display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 7px; }
.calendar-weekdays { margin: 18px 0 8px; color: var(--gold); font-size: 10px; font-weight: 700; letter-spacing: .08em; text-align: center; text-transform: uppercase; }
.calendar-day, .calendar-empty { min-height: 42px; }
.calendar-day { color: var(--charcoal); border: 1px solid var(--line); background: var(--ivory); cursor: pointer; font-size: 14px; }
.calendar-day:hover:not(:disabled), .calendar-day.is-selected { color: #fff; border-color: var(--forest); background: var(--forest); }
.calendar-day:disabled { color: rgba(34, 38, 34, .28); cursor: not-allowed; background: #f4f1eb; }
.calendar-selected { margin-top: 14px; color: var(--brown); font-size: 13px; font-weight: 700; }
.tour-image-card { grid-column: 1 / -1; margin: 4px 0 0; border: 1px solid var(--line); background: #fff; }
.tour-image-card img { aspect-ratio: 16 / 9; object-fit: cover; }
.tour-image-card figcaption { padding: 13px 16px 15px; color: var(--muted); font-size: 13px; line-height: 1.5; }
.section-cta { max-width: 1500px; margin: 42px auto 0; text-align: right; }

.services { background: linear-gradient(180deg, var(--beige), #f2eadf); }
.services .content-block { max-width: 1500px; margin: 0 auto 28px; padding: 30px; background: rgba(255,255,255,.56); border: 1px solid rgba(34,38,34,.12); color: var(--muted); font-size: 16px; line-height: 1.8; }
.services .content-block:last-child { margin-top: 28px; margin-bottom: 0; }
.services .content-block h3 { margin: 0 0 12px; color: var(--ink); font-family: "Libre Caslon Display", Georgia, serif; font-size: 30px; }
.services .content-block p { margin: 0; }
.services .content-block p + p { margin-top: 12px; }
.service-grid { display: grid; max-width: 1500px; margin: auto; grid-template-columns: repeat(3, 1fr); gap: 1px; background: rgba(34,38,34,.14); border: 1px solid rgba(34,38,34,.14); }
.service-grid article { min-height: 245px; padding: 30px; background: var(--ivory); }
.service-grid span, .why-grid span { color: var(--gold); font-family: "Libre Caslon Display", Georgia, serif; font-size: 18px; }
.service-grid h3, .why-grid h3 { margin: 48px 0 13px; font-family: "Libre Caslon Display", Georgia, serif; font-size: 26px; line-height: 1.18; }
.service-grid p, .why-grid p { margin: 0; color: var(--muted); font-size: 14px; line-height: 1.7; }

.why { display: grid; grid-template-columns: .7fr 1.3fr; gap: 8vw; color: #fff; background: linear-gradient(135deg, var(--brown), var(--navy)); }
.why-title { align-self: center; }
.why-grid { display: grid; grid-template-columns: 1fr 1fr; }
.why-grid article { min-height: 270px; padding: 35px; border: solid rgba(255,255,255,.16); border-width: 0 0 1px 1px; }
.why-grid h3 { margin-top: 60px; }
.why-grid p { color: rgba(255,255,255,.68); }

.currency-converter {
  display: grid;
  grid-template-columns: .78fr 1.22fr;
  gap: 8vw;
  align-items: center;
  background: var(--ivory);
}
.currency-copy > p:last-child { max-width: 440px; margin-top: 26px; color: var(--muted); line-height: 1.75; }
.currency-copy .button { margin-top: 28px; }
.currency-panel {
  padding: 34px;
  border: 1px solid var(--line);
  background: #fff;
  box-shadow: 0 22px 70px rgba(34,38,34,.08);
}
.currency-panel[hidden] { display: none; }
.currency-panel label {
  display: block;
  margin-bottom: 10px;
  color: var(--gold);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: .14em;
  text-transform: uppercase;
}
.currency-input-row {
  display: grid;
  grid-template-columns: 72px minmax(140px, 1fr) auto;
  gap: 12px;
  align-items: center;
}
.currency-input-row span {
  display: inline-grid;
  min-height: 48px;
  place-items: center;
  color: #fff;
  background: var(--brown);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: .12em;
}
.currency-input-row input {
  width: 100%;
  min-height: 48px;
  padding: 12px 14px;
  color: var(--charcoal);
  border: 1px solid var(--line);
  border-radius: 0;
  background: var(--ivory);
  font-size: 18px;
}
.currency-input-row input:focus { border-color: var(--forest); outline: 2px solid rgba(39, 84, 67, .14); outline-offset: 0; }
.currency-target-label { margin-top: 22px; }
.currency-panel select {
  width: 100%;
  min-height: 48px;
  padding: 12px 14px;
  color: var(--charcoal);
  border: 1px solid var(--line);
  border-radius: 0;
  background: var(--ivory);
  font: inherit;
}
.currency-panel select:focus { border-color: var(--forest); outline: 2px solid rgba(39, 84, 67, .14); outline-offset: 0; }
.currency-results { display: grid; margin-top: 24px; grid-template-columns: 1fr; gap: 12px; }
.currency-results article { padding: 20px; background: var(--ivory); border: 1px solid rgba(34,38,34,.08); }
.currency-results span {
  display: block;
  margin-bottom: 14px;
  color: var(--gold);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: .1em;
  text-transform: uppercase;
}
.currency-results strong { color: var(--ink); font-family: "Libre Caslon Display", Georgia, serif; font-size: 28px; line-height: 1.1; }
.currency-status { margin: 18px 0 0; color: var(--muted); font-size: 13px; line-height: 1.6; }

.faq { display: grid; max-width: 1500px; margin: auto; grid-template-columns: .7fr 1.3fr; gap: 8vw; }
.faq-intro > p:last-child { max-width: 390px; margin-top: 28px; color: var(--muted); line-height: 1.7; }
.accordion { border-top: 1px solid var(--line); }
.accordion details { border-bottom: 1px solid var(--line); }
.accordion summary {
  display: flex;
  padding: 28px 0;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  cursor: pointer;
  font-family: "Libre Caslon Display", Georgia, serif;
  font-size: 23px;
  list-style: none;
}
.accordion summary::-webkit-details-marker { display: none; }
.accordion summary span { color: var(--gold); font-family: "DM Sans", Arial, sans-serif; font-size: 25px; font-weight: 300; transition: transform .2s ease; }
.accordion details[open] summary span { transform: rotate(45deg); }
.accordion details p { max-width: 700px; padding: 0 45px 26px 0; color: var(--muted); line-height: 1.7; }

.contact {
  display: grid;
  grid-template-columns: .78fr 1.22fr;
  gap: 8vw;
  color: #fff;
  background: linear-gradient(135deg, var(--forest-dark), var(--navy));
}
.contact-copy > p:not(.eyebrow) { max-width: 520px; margin-top: 26px; color: rgba(255,255,255,.68); line-height: 1.75; }
.contact-details { display: grid; margin-top: 60px; gap: 24px; }
.contact-details a, .contact-details p { margin: 0; font-family: "Libre Caslon Display", Georgia, serif; font-size: 19px; }
.contact-details span { display: block; margin-bottom: 6px; color: #d8bd85; font-family: "DM Sans", Arial, sans-serif; font-size: 9px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; }
.contact .inquiry-form {
  padding: clamp(24px, 4vw, 42px);
  border: 1px solid rgba(255,255,255,.16);
  background: rgba(255,255,255,.06);
  box-shadow: 0 28px 80px rgba(0,0,0,.18);
}
.inquiry-form { display: grid; align-content: start; grid-template-columns: 1fr 1fr; gap: 26px 22px; }
.field { display: grid; gap: 9px; }
.field-wide { grid-column: 1 / -1; }
.field label { color: rgba(255,255,255,.75); font-size: 11px; font-weight: 700; }
.field input, .field textarea {
  width: 100%;
  padding: 13px 0;
  color: #fff;
  border: 0;
  border-bottom: 1px solid rgba(255,255,255,.32);
  border-radius: 0;
  outline: none;
  background: transparent;
}
.field input:focus, .field textarea:focus { border-bottom-color: #d8bd85; }
.field textarea { resize: vertical; }
.field input::placeholder { color: rgba(255,255,255,.42); }
.inquiry-form .button { margin-top: 8px; border: 0; }

.site-footer {
  display: grid;
  padding: 65px max(5vw, 32px) 30px;
  grid-template-columns: 1.6fr repeat(3, 1fr);
  gap: 7vw;
  color: #dedbd3;
  background: #17201c;
  font-family: "DM Sans", Arial, sans-serif;
}
.footer-brand img { width: 120px; padding: 0; background: transparent; }
.footer-brand p { margin-top: 18px; color: rgba(255,255,255,.58); font-size: 13px; line-height: 1.6; }
.site-footer h2 { margin-bottom: 18px; color: #d8bd85; font-family: "DM Sans", Arial, sans-serif; font-size: 10px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; }
.site-footer > div:not(.footer-brand) { display: flex; flex-direction: column; gap: 11px; }
.site-footer a, .site-footer > div > p { margin: 0; color: rgba(255,255,255,.62); font-size: 13px; }
.site-footer a:hover { color: #fff; }
.footer-contact-row,
.footer-social-link { display: inline-flex; width: fit-content; align-items: center; gap: 8px; }
.footer-contact-row a,
.footer-social-link { color: rgba(255,255,255,.62); }
.footer-contact-row a:hover,
.footer-social-link:hover { color: #fff; }
.footer-contact-reveal { width: max-content; }
.footer-contact-reveal summary { list-style: none; cursor: pointer; }
.footer-contact-reveal summary::-webkit-details-marker { display: none; }
.footer-contact-toggle span,
.footer-contact-button span,
.footer-contact-icon,
.footer-social-icon {
  width: 14px;
  height: 14px;
  flex: 0 0 14px;
}
.footer-contact-icon { display: inline-grid; place-items: center; font-size: 12px; line-height: 1; }
.footer-social-icon {
  fill: none;
  stroke: currentColor;
  stroke-width: 1.7;
}
.footer-contact-button {
  width: max-content;
  padding: 8px 12px;
  border: 1px solid rgba(255,255,255,.18);
  border-radius: 999px;
}
.footer-contact-button:hover { border-color: rgba(255,255,255,.38); }
.footer-contact-number {
  display: inline-flex;
  width: max-content;
  margin: 7px 0 0 15px;
  padding: 4px 0;
  color: #fff;
}
.footer-contact-toggle span,
.footer-contact-button span { display: inline-grid; place-items: center; font-size: 12px; line-height: 1; }
.copyright { grid-column: 1 / -1; margin: 38px 0 0; padding-top: 24px; color: rgba(255,255,255,.37); border-top: 1px solid rgba(255,255,255,.12); font-size: 11px; }

@media (max-width: 1180px) {
  .menu-toggle { display: block; margin-left: auto; }
  .nav-panel {
    position: absolute;
    top: 86px;
    right: 0;
    left: 0;
    width: 100%;
    max-width: 100vw;
    display: none;
    padding: 28px max(4vw, 24px);
    align-items: stretch;
    background: var(--ivory);
    border-bottom: 1px solid var(--line);
    overflow-x: hidden;
  }
  .nav-panel.is-open { display: grid; }
  .nav-links { display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px 20px; }
  .nav-links a { padding: 12px 0; border-bottom: 1px solid var(--line); }
  .nav-actions { min-width: 0; margin-top: 14px; }
  .header-socials { grid-column: 1 / -1; margin: 0 0 4px; }
  .language-switcher { justify-self: start; align-self: start; margin: 0 0 8px; }
  .language-options { position: static; margin-left: 8px; box-shadow: none; }
  .destination-grid { grid-template-columns: repeat(2, 1fr); }
  .destination-featured { grid-column: span 2; }
  .service-grid { grid-template-columns: repeat(2, 1fr); }
  .world-section, .why, .faq, .currency-converter, .contact { gap: 5vw; }
}

@media (max-width: 820px) {
  .section { padding: 82px 24px; }
  .nav-panel { max-height: calc(100dvh - 86px); overflow-y: auto; overscroll-behavior: contain; }
  .nav-links a { min-height: 44px; display: flex; align-items: center; }
  .language-option { min-width: 44px; min-height: 44px; }
  .hero { min-height: 0; max-height: none; grid-template-columns: 1fr; }
  .hero-copy { min-height: auto; padding: 64px 24px 54px; }
  .hero h1 { max-width: 12ch; font-size: clamp(46px, 11vw, 58px); line-height: 1; overflow-wrap: anywhere; }
  .hero-media { min-height: min(68vh, 520px); }
  .hero-video { top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; transform: none; }
  .editorial-intro { grid-template-columns: 45px 1fr; gap: 26px; }
  .editorial-intro .intro-copy, .editorial-intro .about-story { grid-column: 2; }
  .section-heading { align-items: start; flex-direction: column; gap: 24px; }
  .world-section, .why, .faq, .currency-converter, .contact { grid-template-columns: 1fr; }
  .world-heading { position: static; }
  .region-list article { grid-template-columns: 42px 150px 1fr; }
  .region-list article a { grid-column: 3; text-align: left; }
  .tour-list article { grid-template-columns: 48px 1fr 120px; }
  .tour-list article a { grid-column: 2; justify-self: start; }
  .tour-booking-panel { grid-template-columns: 1fr; }
  .tour-list-feature > .tour-booking-panel { grid-column: 1 / -1; }
  .tour-list-feature .tour-feature { grid-column: 2; }
  .why-grid { margin-top: 20px; }
  .site-footer { grid-template-columns: 1fr 1fr; }
}

@media (max-width: 560px) {
  .nav-shell { min-height: 76px; padding: 6px 18px; }
  .brand { width: 150px; }
  .brand img { width: 150px; height: auto; }
  .nav-panel {
    position: fixed;
    top: 76px;
    max-height: calc(100dvh - 76px);
    padding: 18px;
    overflow-y: auto;
    overscroll-behavior: contain;
  }
  .nav-links { grid-template-columns: 1fr; }
  .nav-links a { min-height: 44px; display: flex; align-items: center; }
  .nav-actions { flex-direction: column; }
  .header-socials { width: 100%; justify-content: center; gap: 28px; }
  .header-socials a { min-height: 44px; display: inline-flex; align-items: center; }
  .language-switcher { width: 100%; flex-wrap: wrap; }
  .language-toggle { width: 100%; min-height: 44px; }
  .language-options { width: 100%; margin: 8px 0 0; }
  .language-option { min-height: 44px; flex: 1; }
  .nav-actions .button { width: 100%; min-width: 0; white-space: normal; }
  .hero-copy { min-height: auto; padding: 48px 20px 42px; }
  .hero h1 { max-width: 100%; margin-bottom: 22px; font-size: 44px; line-height: 1.04; overflow-wrap: anywhere; }
  .hero-copy > p:not(.eyebrow) { font-size: 16px; }
  .button-row { width: 100%; flex-direction: column; align-items: stretch; gap: 10px; }
  .button-row .button { width: 100%; }
  .hero-media { min-height: 62vh; max-height: 500px; }
  .hero-caption { right: 20px; bottom: 20px; left: 20px; max-width: none; font-size: 25px; overflow-wrap: anywhere; }
  .editorial-intro { grid-template-columns: 1fr; }
  .editorial-intro .intro-copy { grid-column: auto; }
  .section-number { display: none; }
  .editorial-intro h2, .section-heading h2, .faq h2, .contact h2 { font-size: 40px; line-height: 1.08; overflow-wrap: anywhere; }
  .destination-grid { grid-template-columns: 1fr; }
  .destination-featured { grid-column: auto; }
  .destination-card img, .destination-featured img { height: 280px; }
  .world-heading h2, .why-title h2 { font-size: 43px; line-height: 1.06; overflow-wrap: anywhere; }
  .region-list article { grid-template-columns: 36px 1fr; padding: 27px 0; }
  .region-list article p, .region-list article a { grid-column: 2; }
  .region-list article a, .tour-list article a, .card-content a { min-height: 44px; display: inline-flex; align-items: center; }
  .region-list h3 { font-size: 28px; }
  .tour-list article { padding: 28px 0; grid-template-columns: 38px 1fr; gap: 15px; }
  .tour-list article strong, .tour-list article a { grid-column: 2; justify-self: start; }
  .tour-list-feature .tour-feature { grid-column: 2; }
  .tour-list h3 { font-size: 26px; }
  .section-cta .button { width: 100%; }
  .service-grid, .why-grid, .promise-grid, .partner-grid, .tour-feature-grid, .tour-booking-panel, .currency-results, .inquiry-form { grid-template-columns: 1fr; }
  .currency-panel { padding: 24px; }
  .currency-input-row { grid-template-columns: 1fr; }
  .service-grid article { min-height: 0; padding: 26px 24px; }
  .service-grid h3 { margin-top: 32px; }
  .why-grid article { min-height: 0; padding: 28px 24px; border-left: 0; }
  .why-grid h3 { margin-top: 36px; }
  .field-wide { grid-column: auto; }
  .field input, .field textarea { min-height: 48px; font-size: 16px; }
  .field textarea { min-height: 120px; }
  .accordion summary { min-height: 64px; padding-block: 20px; gap: 18px; font-size: 19px; line-height: 1.35; }
  .accordion details p { padding-right: 0; }
  .contact-details { margin-top: 40px; }
  .contact-details a { overflow-wrap: anywhere; }
  .site-footer { padding-inline: 24px; grid-template-columns: 1fr; }
}

@media (max-width: 380px) {
  .section { padding: 66px 18px; }
  .nav-shell { padding-inline: 14px; }
  .brand { width: 150px; }
  .hero-copy { padding-inline: 18px; }
  .hero h1 { font-size: 38px; }
  .hero-media { min-height: 56vh; }
  .editorial-intro h2, .section-heading h2, .faq h2, .contact h2 { font-size: 35px; }
  .world-heading h2, .why-title h2 { font-size: 38px; }
  .card-content { padding-inline: 22px; }
  .destination-card img, .destination-featured img { height: 240px; }
  .region-list article { grid-template-columns: 30px 1fr; gap: 12px; }
  .tour-list article { grid-template-columns: 30px 1fr; gap: 12px; }
  .site-footer { padding-inline: 18px; }
}

.footer-contact-item { display: flex; flex-direction: column; gap: 5px; }
.footer-contact-row span,
.footer-contact-detail,
.footer-social-link { color: rgba(255,255,255,.62); }
.footer-contact-detail:hover,
.footer-social-link:hover { color: #fff; }
.footer-contact-icon {
  display: inline-grid;
  width: 14px;
  height: 14px;
  padding: 0;
  flex: 0 0 14px;
  place-items: center;
  color: rgba(255,255,255,.62);
  border: 0;
  background: transparent;
  font: inherit;
  font-size: 11px;
  line-height: 1;
  cursor: pointer;
}
.footer-contact-icon:hover { color: #fff; }
.footer-contact-icon .footer-social-icon { width: 14px; height: 14px; }
.footer-whatsapp-icon { font-size: 9px; font-weight: 700; letter-spacing: 0; }
.footer-contact-detail {
  display: inline-flex;
  width: fit-content;
  margin: -2px 0 4px 22px;
  overflow-wrap: anywhere;
}
.footer-contact-detail[hidden] { display: none !important; }
.site-footer,
.site-footer a,
.site-footer p,
.site-footer button,
.site-footer span,
.footer-contact-detail,
.footer-social-link {
  font-family: "DM Sans", Arial, sans-serif;
}
.site-footer a,
.site-footer p,
.site-footer > div > p,
.footer-contact-row span,
.footer-contact-detail,
.footer-social-link {
  font-size: 13px;
  font-weight: 400;
  line-height: 1.5;
  letter-spacing: 0;
}
