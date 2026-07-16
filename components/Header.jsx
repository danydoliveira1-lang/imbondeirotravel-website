"use client";
import { useEffect, useState } from "react";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll(); window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const close = () => setOpen(false);
  return <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
    <a className="brand" href="#top" aria-label="Imbondeiro Travel home">
      <img src="/assets/imbondeiro-logo-luxury-web.png" alt="Imbondeiro Travel" />
    </a>
    <button className="menu-toggle" onClick={() => setOpen(v=>!v)} aria-expanded={open} aria-label="Open navigation"><span/><span/></button>
    <nav className={open ? "is-open" : ""} aria-label="Main navigation">
      <a href="#angola" onClick={close}>Explore Angola</a>
      <a href="#experiences" onClick={close}>Experiences</a>
      <a href="#world" onClick={close}>The World</a>
      <a href="#about" onClick={close}>About</a>
      <a href="#contact" onClick={close}>Contact</a>
      <span className="language">EN · PT · FR · ES</span>
      <a className="nav-cta" href="#contact" onClick={close}>Plan Your Journey</a>
    </nav>
  </header>;
}
