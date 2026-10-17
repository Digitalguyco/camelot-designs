"use client";

import { useCurrency } from "@/components/CurrencyProvider";

export default function CurrencyToggle() {
  const { currency, setCurrency } = useCurrency();

  return (
    <div className="flex items-center border border-ink/20 rounded-full overflow-hidden text-xs tag shrink-0">
      {(["NGN", "USD"] as const).map((c) => (
        <button
          key={c}
          type="button"
          onClick={() => setCurrency(c)}
          aria-pressed={currency === c}
          className={`px-2.5 py-1.5 transition-colors ${
            currency === c ? "bg-ink text-card" : "text-ink/60 hover:text-ink"
          }`}
        >
          {c === "NGN" ? "₦" : "$"}
        </button>
      ))}
    </div>
  );
}
