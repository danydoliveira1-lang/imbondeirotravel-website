"use client";
import {createContext,useContext,useEffect,useMemo,useState} from "react";
const CurrencyContext=createContext(null);const STORAGE="imbondeiro-currency-v1";
export const currencies=["AOA","EUR","USD","ZAR","GBP"];
export function CurrencyProvider({children}){const [currency,setCurrency]=useState("EUR");useEffect(()=>{const s=localStorage.getItem(STORAGE);if(currencies.includes(s))setCurrency(s)},[]);useEffect(()=>localStorage.setItem(STORAGE,currency),[currency]);const value=useMemo(()=>({currency,setCurrency,currencies}),[currency]);return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>}
export function useCurrency(){const v=useContext(CurrencyContext);if(!v)throw new Error("useCurrency requires CurrencyProvider");return v}
