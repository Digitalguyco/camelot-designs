import type { ProductVariant } from "@/lib/db/schema";

/**
 * Pure helpers with no server-only imports (no `db`, no better-sqlite3) —
 * safe to import by value from Client Components like ProductCard. Keep
 * it that way: anything imported by value from "@/lib/data/products"
 * drags the SQLite driver into the browser bundle the moment a Client
 * Component imports it (type-only imports are erased and don't count).
 */

/** The lowest-priced variant's cents, or null if every variant is unpriced. */
export function startingPriceCents(product: { variants: Pick<ProductVariant, "priceCents">[] }): number | null {
  const priced = product.variants.map((v) => v.priceCents).filter((c): c is number => c !== null);
  return priced.length > 0 ? Math.min(...priced) : null;
}
