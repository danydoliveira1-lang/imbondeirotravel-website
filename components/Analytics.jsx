"use client";

import { useEffect } from "react";

export function trackEvent(name, parameters = {}) {
  if (typeof window === "undefined") return;
  window.gtag?.("event", name, parameters);
}

export default function Analytics() {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  useEffect(() => {
    if (!measurementId || document.getElementById("imbondeiro-ga")) return;
    const script = document.createElement("script");
    script.id = "imbondeiro-ga";
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag(){ window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", measurementId, { anonymize_ip: true });
  }, [measurementId]);

  return null;
}
