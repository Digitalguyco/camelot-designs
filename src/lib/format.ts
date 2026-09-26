export function formatPrice(cents: number): string {
  return (cents / 100).toLocaleString(undefined, {
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  });
}

export const PRICE_ON_REQUEST = "Price on Request";

/** "$123" for a set price, or the "Price on Request" label when it's null. */
export function formatPriceOrRequest(cents: number | null): string {
  return cents === null ? PRICE_ON_REQUEST : `$${formatPrice(cents)}`;
}
