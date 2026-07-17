"use client";

export default function HideChapterButton(){
  const hide=()=>{
    document.querySelectorAll(".menu-reveal-section.is-revealed").forEach((section)=>section.classList.remove("is-revealed"));
    document.body.classList.remove("chapter-reveal-active");
    const explorer=document.getElementById("explorer");
    if(explorer){explorer.scrollIntoView({behavior:"smooth",block:"start"});}
    if(window.history?.replaceState){window.history.replaceState(null,"",`${window.location.pathname}${window.location.search}`);}
  };
  return <button className="chapter-return" type="button" onClick={hide}>← Return to the main journey</button>;
}
