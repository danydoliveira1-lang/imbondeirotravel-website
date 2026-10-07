"use client";

import { useEffect, useState } from "react";
import { useJourney } from "./JourneyContext";
import {
  languages,
  useLanguage,
} from "./LanguageContext";
import {
  currencies,
  useCurrency,
} from "./CurrencyContext";
import CurrencyConverter from "./CurrencyConverter";

const approvedWebsiteLogo =
  "/assets/imbondeiro-logo-seashell-gold.png";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [converter, setConverter] = useState(false);

  const { summary } = useJourney();
  const { language, setLanguage, t } = useLanguage();
  const { currency, setCurrency } = useCurrency();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };

    handleScroll();
    addEventListener("scroll", handleScroll);

    return () =>
      removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("menu-open", open);

    const handleKey = event => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    addEventListener("keydown", handleKey);

    return () => {
      document.body.classList.remove("menu-open");
      removeEventListener("keydown", handleKey);
    };
  }, [open]);

  const close = () => setOpen(false);

  const revealChapter = (id, targetId = id) => {
    if (
      document.body.classList.contains(
        "destination-story-open"
      )
    ) {
      return;
    }

    setOpen(false);

    const sections = document.querySelectorAll(
      ".menu-reveal-section"
    );

    sections.forEach(section => {
      section.classList.remove("is-revealed");
      section.setAttribute("aria-hidden", "true");
    });

    const section = document.getElementById(id);

    if (!section) return;

    document.body.classList.add(
      "chapter-reveal-active"
    );

    section.classList.add("is-revealed");
    section.setAttribute("aria-hidden", "false");

    window.setTimeout(() => {
      document
        .getElementById(targetId)
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 180);
  };

  const visitChapter = (
    event,
    id,
    targetId = id
  ) => {
    event.preventDefault();

    if (window.location.pathname !== "/") {
      setOpen(false);
      window.location.assign(`/#${targetId}`);
      return;
    }

    revealChapter(id, targetId);
  };

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");

    const map = {
      experiences: ["experiences", "experiences"],
      contact: ["contact", "contact"],
      world: ["world", "world"],
      services: ["services", "services"],
      journal: ["journal", "journal"],
      about: ["about", "about"],
      partners: ["partners", "partners"],
    };

    if (map[hash]) {
      revealChapter(...map[hash]);
    }
  }, []);

  return (
    <>
      <header
        className={`site-header chapter-header ${
          scrolled ? "is-scrolled" : ""
        } ${open ? "menu-active" : ""}`}
      >
        <a
          className="brand"
          href="/#top"
          aria-label="Imbondeiro Travel"
        >
          <img
            src={approvedWebsiteLogo}
            alt="Imbondeiro Travel"
            onError={event => {
              event.currentTarget.onerror = null;
              event.currentTarget.src =
                approvedWebsiteLogo;
            }}
          />
        </a>

        <nav
          className="chapter-nav"
          aria-label="Primary navigation"
        >
          <a href="/#angola">{t("meet")}</a>

          <a href="/#explorer">
            {t("explorer")}
          </a>

          <a href="/explorer">
            Africa &amp; Middle East
          </a>
        </nav>

        <div className="header-actions">
          <a
            className="journey-header-link"
            href="/#my-journey"
          >
            <span>{t("journey")}</span>
            <b>{summary.count}</b>
          </a>

          <button
            type="button"
            className="editorial-menu-button"
            onClick={() => setOpen(true)}
            aria-expanded={open}
          >
            <span>{t("menu")}</span>
            <i />
            <i />
          </button>
        </div>
      </header>

      <div
        className={`full-menu ${
          open ? "is-open" : ""
        }`}
        aria-hidden={!open}
      >
        <div className="full-menu-top">
          <a
            className="menu-brand"
            href="/#top"
            onClick={close}
          >
            <img
              src={approvedWebsiteLogo}
              alt="Imbondeiro Travel"
              onError={event => {
                event.currentTarget.onerror = null;
                event.currentTarget.src =
                  approvedWebsiteLogo;
              }}
            />
          </a>

          <button
            type="button"
            className="menu-close"
            onClick={close}
          >
            <span>{t("close")}</span>×
          </button>
        </div>

        <div className="full-menu-body">
          <div className="menu-intro">
            <p className="eyebrow">
              Project Baobab
            </p>

            <h2>{t("menuIntro")}</h2>

            <p>Journey • Wonder • Culture</p>
          </div>

          <nav
            className="menu-chapters"
            aria-label="Full navigation"
          >
            <a href="/#top" onClick={close}>
              <small>01</small>
              <span>{t("gateway")}</span>
            </a>

            <a href="/#angola" onClick={close}>
              <small>02</small>
              <span>{t("meet")}</span>
            </a>

            <a href="/#explorer" onClick={close}>
              <small>03</small>
              <span>{t("explorer")}</span>
            </a>

            <a href="/explorer" onClick={close}>
              <small>04</small>
              <span>
                Africa &amp; Middle East Explorer
              </span>
            </a>

            <a
              href="/#experiences"
              onClick={event =>
                visitChapter(
                  event,
                  "experiences"
                )
              }
            >
              <small>05</small>
              <span>{t("signature")}</span>
            </a>

            <a
              href="/#world"
              onClick={event =>
                visitChapter(event, "world")
              }
            >
              <small>06</small>
              <span>{t("world")}</span>
            </a>

            <a
              href="/#services"
              onClick={event =>
                visitChapter(event, "services")
              }
            >
              <small>07</small>
              <span>{t("services")}</span>
            </a>

            <a
              href="/#journal"
              onClick={event =>
                visitChapter(event, "journal")
              }
            >
              <small>08</small>
              <span>{t("journal")}</span>
            </a>

            <a
              href="/#about"
              onClick={event =>
                visitChapter(event, "about")
              }
            >
              <small>09</small>
              <span>{t("story")}</span>
            </a>

            <a
              href="/#partners"
              onClick={event =>
                visitChapter(event, "partners")
              }
            >
              <small>10</small>
              <span>{t("partners")}</span>
            </a>

            <a
              href="/#contact"
              onClick={event =>
                visitChapter(event, "contact")
              }
            >
              <small>11</small>
              <span>Craft My Journey</span>
            </a>
          </nav>

          <aside className="menu-utilities">
            <section>
              <h3>{t("language")}</h3>

              <div className="utility-options">
                {languages.map(item => (
                  <button
                    type="button"
                    key={item.code}
                    className={
                      language === item.code
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      setLanguage(item.code)
                    }
                  >
                    {item.short}
                  </button>
                ))}
              </div>
            </section>

            <section>
              <h3>{t("selectedCurrency")}</h3>

              <div className="utility-options">
                {currencies.map(item => (
                  <button
                    type="button"
                    key={item}
                    className={
                      currency === item
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      setCurrency(item)
                    }
                  >
                    {item}
                  </button>
                ))}
              </div>

              <button
                type="button"
                className="converter-link"
                onClick={() => {
                  setOpen(false);
                  setConverter(true);
                }}
              >
                {t("converter")} →
              </button>
            </section>

            <section className="menu-journey-summary">
              <h3>{t("journey")}</h3>

              <strong>{summary.count}</strong>

              <p>
                {summary.categories.join(" · ") ||
                  t("empty")}
              </p>

              <a
                href="/#contact"
                onClick={event =>
                  visitChapter(event, "contact")
                }
              >
                {t("craft")} →
              </a>
            </section>
          </aside>
        </div>

        <div className="menu-footer">
          <span>imbondeirotravel.com</span>
          <span>
            Angola · Portugal · South Africa
          </span>
        </div>
      </div>

      <CurrencyConverter
        open={converter}
        onClose={() => setConverter(false)}
      />
    </>
  );
}
