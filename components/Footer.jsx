"use client";

import { useEffect, useState } from "react";

const fallbackLogo =
  "/assets/imbondeiro-logo-seashell-gold.png";

export default function Footer() {
  const [tagline, setTagline] =
    useState("Your Lifetime Experience");

  useEffect(() => {
    const controller = new AbortController();

    async function loadCompanySettings() {
      try {
        const response = await fetch(
          "/api/public/company-settings",
          {
            cache: "no-store",
            signal: controller.signal,
          }
        );

        if (!response.ok) return;

        const settings = await response.json();

        if (settings.tagline) {
          setTagline(settings.tagline);
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error(
            "Footer company settings could not be loaded.",
            error
          );
        }
      }
    }

    loadCompanySettings();

    return () => controller.abort();
  }, []);

  return (
    <footer>
      <img
        src={fallbackLogo}
        alt="Imbondeiro Travel"
        onError={event => {
          event.currentTarget.onerror = null;
          event.currentTarget.src = fallbackLogo;
        }}
      />

      <p>{tagline}</p>

      <p>
        Project Imbondeiro · Crafted with passion
        for Angola and the world.
      </p>
    </footer>
  );
}
