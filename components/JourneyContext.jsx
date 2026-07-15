"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const JourneyContext = createContext(null);
const STORAGE_KEY = "imbondeiro-my-journey-v1";

export function JourneyProvider({ children }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      if (Array.isArray(saved)) setItems(saved);
    } catch {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch {}
  }, [items]);

  function add(item) {
    setItems(current => current.some(x => x.id === item.id) ? current : [...current, item]);
  }

  function remove(id) {
    setItems(current => current.filter(x => x.id !== id));
  }

  function toggle(item) {
    setItems(current => current.some(x => x.id === item.id)
      ? current.filter(x => x.id !== item.id)
      : [...current, item]);
  }

  function has(id) { return items.some(x => x.id === id); }
  function clear() { setItems([]); }

  const summary = useMemo(() => {
    const categories = [...new Set(items.map(x => x.category).filter(Boolean))];
    const numericDays = items.reduce((sum, item) => sum + (Number(item.days) || 0), 0);
    return {
      count: items.length,
      categories,
      estimatedDays: numericDays || null,
      label: items.map(x => x.title).join(" → "),
    };
  }, [items]);

  return <JourneyContext.Provider value={{ items, add, remove, toggle, has, clear, summary }}>
    {children}
  </JourneyContext.Provider>;
}

export function useJourney() {
  const value = useContext(JourneyContext);
  if (!value) throw new Error("useJourney must be used inside JourneyProvider");
  return value;
}
