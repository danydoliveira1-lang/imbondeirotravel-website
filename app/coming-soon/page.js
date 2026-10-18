import styles from "./coming-soon.module.css";

export const metadata = {
  title: "Coming Soon | Imbondeiro Travel",
  description:
    "Imbondeiro Travel is preparing a refined new gateway to journeys across Angola, Africa and the Middle East.",
};

export default function ComingSoonPage() {
  return (
    <main className={styles.page}>
      <div className={styles.overlay} />

      <section className={styles.content}>
        <img
          className={styles.logo}
          src="/assets/imbondeiro-logo-seashell-gold.png"
          alt="Imbondeiro Travel"
        />

        <p className={styles.eyebrow}>
          A NEW JOURNEY IS TAKING SHAPE
        </p>

        <h1>
          Africa and the Middle East,
          <br />
          <em>beautifully explored.</em>
        </h1>

        <p className={styles.introduction}>
          We are refining the Imbondeiro Travel experience—a
          thoughtful gateway to extraordinary journeys across
          Angola, Africa and the Middle East.
        </p>

        <div className={styles.divider} />

        <p className={styles.contactText}>
          Planning a journey or working with us as a travel partner?
          Our team remains available while the new experience is
          being prepared.
        </p>

        <a
          className={styles.contactButton}
          href="mailto:imbondeirotravel@gmail.com?subject=Imbondeiro%20Travel%20Enquiry"
        >
          Contact Imbondeiro Travel
          <span aria-hidden="true">→</span>
        </a>

        <div className={styles.details}>
          <span>Angola</span>
          <i aria-hidden="true">·</i>
          <span>South Africa</span>
          <i aria-hidden="true">·</i>
          <span>Africa &amp; Middle East</span>
        </div>
      </section>

      <footer className={styles.footer}>
        <span>IMBONDEIRO TRAVEL</span>
        <span>Your Lifetime Experience</span>
      </footer>
    </main>
  );
}
