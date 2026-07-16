"use client";
import {useEffect,useState} from "react";
import {useJourney} from "./JourneyContext";
import {languages,useLanguage} from "./LanguageContext";
import {currencies,useCurrency} from "./CurrencyContext";
import CurrencyConverter from "./CurrencyConverter";

export default function Header(){
 const [open,setOpen]=useState(false),[scrolled,setScrolled]=useState(false),[converter,setConverter]=useState(false);
 const {summary}=useJourney();const {language,setLanguage,t}=useLanguage();const {currency,setCurrency}=useCurrency();
 useEffect(()=>{const f=()=>setScrolled(window.scrollY>30);f();addEventListener("scroll",f);return()=>removeEventListener("scroll",f)},[]);
 useEffect(()=>{document.body.classList.toggle("menu-open",open);const key=e=>e.key==="Escape"&&setOpen(false);addEventListener("keydown",key);return()=>{document.body.classList.remove("menu-open");removeEventListener("keydown",key)}},[open]);
 const close=()=>setOpen(false);
 return <>
 <header className={`site-header chapter-header ${scrolled?"is-scrolled":""} ${open?"menu-active":""}`}>
  <a className="brand" href="#top" aria-label="Imbondeiro Travel"><img src="/assets/imbondeiro-logo-luxury-web.png" alt="Imbondeiro Travel"/></a>
  <nav className="chapter-nav" aria-label="Primary navigation">
   <a href="#angola">{t("meet")}</a><a href="#explorer">{t("explorer")}</a>
  </nav>
  <div className="header-actions">
   <a className="journey-header-link" href="#my-journey"><span>{t("journey")}</span><b>{summary.count}</b></a>
   <button className="editorial-menu-button" onClick={()=>setOpen(true)} aria-expanded={open}><span>{t("menu")}</span><i/><i/></button>
  </div>
 </header>
 <div className={`full-menu ${open?"is-open":""}`} aria-hidden={!open}>
  <div className="full-menu-top"><a className="menu-brand" href="#top" onClick={close}><img src="/assets/imbondeiro-logo-luxury-web.png" alt="Imbondeiro Travel"/></a><button className="menu-close" onClick={close}><span>{t("close")}</span>×</button></div>
  <div className="full-menu-body">
   <div className="menu-intro"><p className="eyebrow">Project Baobab</p><h2>{t("menuIntro")}</h2><p>Journey • Wonder • Culture</p></div>
   <nav className="menu-chapters" aria-label="Full navigation">
    <a href="#top" onClick={close}><small>01</small><span>{t("gateway")}</span></a>
    <a href="#angola" onClick={close}><small>02</small><span>{t("meet")}</span></a>
    <a href="#explorer" onClick={close}><small>03</small><span>{t("explorer")}</span></a>
    <a href="#experiences" onClick={close}><small>04</small><span>{t("signature")}</span></a>
    <a href="#world" onClick={close}><small>05</small><span>{t("world")}</span></a>
    <a href="#services" onClick={close}><small>06</small><span>{t("services")}</span></a>
    <a href="#journal" onClick={close}><small>07</small><span>{t("journal")}</span></a>
    <a href="#about" onClick={close}><small>08</small><span>{t("story")}</span></a>
    <a href="#partners" onClick={close}><small>09</small><span>{t("partners")}</span></a>
    <a href="#contact" onClick={close}><small>10</small><span>{t("contact")}</span></a>
   </nav>
   <aside className="menu-utilities">
    <section><h3>{t("language")}</h3><div className="utility-options">{languages.map(l=><button key={l.code} className={language===l.code?"active":""} onClick={()=>setLanguage(l.code)}>{l.short}</button>)}</div></section>
    <section><h3>{t("selectedCurrency")}</h3><div className="utility-options">{currencies.map(c=><button key={c} className={currency===c?"active":""} onClick={()=>setCurrency(c)}>{c}</button>)}</div><button className="converter-link" onClick={()=>{setOpen(false);setConverter(true)}}>{t("converter")} →</button></section>
    <section className="menu-journey-summary"><h3>{t("journey")}</h3><strong>{summary.count}</strong><p>{summary.categories.join(" · ")||t("empty")}</p><a href="#my-journey" onClick={close}>{t("craft")} →</a></section>
   </aside>
  </div>
  <div className="menu-footer"><span>imbondeirotravel.com</span><span>Angola · Portugal · South Africa</span></div>
 </div>
 <CurrencyConverter open={converter} onClose={()=>setConverter(false)}/>
 </>
}
