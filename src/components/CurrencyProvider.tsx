"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Currency = "NGN" | "USD";
type CurrencyContextValue = {
  currency: Currency;
  ngnPerUsd: number;
  setCurrency: (c: Currency) => void;
};

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

/** `ngnPerUsd` is fetched server-side once per request — see layout.tsx. */
export default function CurrencyProvider({
  ngnPerUsd,
  children,
}: {
  ngnPerUsd: number;
  children: React.ReactNode;
}) {
  const [currency, setCurrencyState] = useState<Currency>("NGN");

  // Read the viewer's last choice after mount — localStorage isn't
  // available during SSR, and guessing wrong before then would flash.
  useEffect(() => {
    try {
      const stored = localStorage.getItem("currency");
      if (stored === "USD" || stored === "NGN") setCurrencyState(stored);
    } catch {
      // Private browsing or storage disabled — default (NGN) stands.
    }
  }, []);

  function setCurrency(c: Currency) {
    setCurrencyState(c);
    try {
      localStorage.setItem("currency", c);
    } catch {
      // Nothing to persist to — the in-memory choice still applies this visit.
    }
  }

  return (
    <CurrencyContext.Provider value={{ currency, ngnPerUsd, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within a CurrencyProvider");
  return ctx;
}
