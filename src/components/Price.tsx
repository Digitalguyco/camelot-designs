"use client";

import { useCurrency } from "@/components/CurrencyProvider";
import { formatNaira, formatUsd, PRICE_ON_REQUEST } from "@/lib/format";

/** Renders a stored kobo price in whichever currency the viewer picked. */
export default function Price({ cents }: { cents: number | null }) {
  const { currency, ngnPerUsd } = useCurrency();
  if (cents === null) return <>{PRICE_ON_REQUEST}</>;
  return <>{currency === "USD" ? formatUsd(cents, ngnPerUsd) : formatNaira(cents)}</>;
}
