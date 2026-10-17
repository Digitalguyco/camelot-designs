import { asc, desc, eq, inArray, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { products, productVariants, type Product, type ProductVariant } from "@/lib/db/schema";
import { productCategories } from "@/lib/content";

export type { Product, ProductVariant };
export type ProductWithVariants = Product & { variants: ProductVariant[] };

// Display order until a merchandising/ordering feature exists: available
// first, then pre-order, then sold-out, newest within each group first.
function statusRank(p: Pick<Product, "status">) {
  return p.status === "sold-out" ? 2 : p.status === "preorder" ? 1 : 0;
}

async function attachVariants(rows: Product[]): Promise<ProductWithVariants[]> {
  if (rows.length === 0) return [];
  const ids = rows.map((r) => r.id);
  const variants = await db
    .select()
    .from(productVariants)
    .where(inArray(productVariants.productId, ids))
    .orderBy(asc(productVariants.sortOrder));

  const byProduct = new Map<string, ProductVariant[]>();
  for (const v of variants) {
    const list = byProduct.get(v.productId) ?? [];
    list.push(v);
    byProduct.set(v.productId, list);
  }
  return rows.map((r) => ({ ...r, variants: byProduct.get(r.id) ?? [] }));
}

/** The lowest-priced variant's cents, or null if every variant is unpriced. */
export function startingPriceCents(product: Pick<ProductWithVariants, "variants">): number | null {
  const priced = product.variants.map((v) => v.priceCents).filter((c): c is number => c !== null);
  return priced.length > 0 ? Math.min(...priced) : null;
}

export async function getAllProducts(): Promise<ProductWithVariants[]> {
  const rows = await db.select().from(products).orderBy(desc(products.createdAt));
  const sorted = [...rows].sort((a, b) => statusRank(a) - statusRank(b));
  return attachVariants(sorted);
}

export async function getProductsByCategory(category: string): Promise<ProductWithVariants[]> {
  const rows = await db
    .select()
    .from(products)
    .where(eq(products.category, category))
    .orderBy(desc(products.createdAt));
  const sorted = [...rows].sort((a, b) => statusRank(a) - statusRank(b));
  return attachVariants(sorted);
}

// The shop's front page shows one tile per category that actually has
// stock — each tile's photo is that category's most recently added
// product, so it's always a real, currently-valid image.
export async function getCategoryShowcases(): Promise<
  { category: string; image: string; count: number }[]
> {
  const all = await getAllProducts();
  return productCategories
    .map((category) => {
      const inCategory = all.filter((p) => p.category === category);
      if (inCategory.length === 0) return null;
      return { category, image: inCategory[0].images[0], count: inCategory.length };
    })
    .filter((c): c is { category: string; image: string; count: number } => c !== null);
}

// A fresh random sample on every call (SQLite RANDOM()) — used for the
// homepage's shop teaser, which shouldn't always show the same pieces.
export async function getRandomProducts(count: number): Promise<ProductWithVariants[]> {
  const rows = await db
    .select()
    .from(products)
    .where(eq(products.status, "available"))
    .orderBy(sql`RANDOM()`)
    .limit(count);
  return attachVariants(rows);
}

export async function getProductBySlug(slug: string): Promise<ProductWithVariants | undefined> {
  const [row] = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
  if (!row) return undefined;
  const [withVariants] = await attachVariants([row]);
  return withVariants;
}

export async function getProductById(id: string): Promise<ProductWithVariants | undefined> {
  const [row] = await db.select().from(products).where(eq(products.id, id)).limit(1);
  if (!row) return undefined;
  const [withVariants] = await attachVariants([row]);
  return withVariants;
}
