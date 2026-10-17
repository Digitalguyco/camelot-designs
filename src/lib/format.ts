// Canonical prices are stored in kobo (1 Naira = 100 kobo) — Naira is the
// real currency the supplier catalog prices in, and the business's own
// currency. USD is offered in the UI only as a converted display option
// (see CurrencyProvider/Price), never stored.
export const PRICE_ON_REQUEST = "Price on Request";

export function formatNaira(priceKobo: number): string {
  const naira = priceKobo / 100;
  return `₦${naira.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

export function formatUsd(priceKobo: number, ngnPerUsd: number): string {
  const usd = priceKobo / 100 / ngnPerUsd;
  return `$${usd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
