import { desc, eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { products, type Product } from "@/lib/db/schema";

export type { Product };

// Display order until a merchandising/ordering feature exists: available
// first, then pre-order, then sold-out, newest within each group first.
function statusRank(p: Pick<Product, "status">) {
  return p.status === "sold-out" ? 2 : p.status === "preorder" ? 1 : 0;
}

export async function getAllProducts(): Promise<Product[]> {
  const rows = await db.select().from(products).orderBy(desc(products.createdAt));
  return [...rows].sort((a, b) => statusRank(a) - statusRank(b));
}

// A fresh random sample on every call (SQLite RANDOM()) — used for the
// homepage's shop teaser, which shouldn't always show the same pieces.
export async function getRandomProducts(count: number): Promise<Product[]> {
  return db
    .select()
    .from(products)
    .where(eq(products.status, "available"))
    .orderBy(sql`RANDOM()`)
    .limit(count);
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const [row] = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
  return row;
}

export async function getProductById(id: string): Promise<Product | undefined> {
  const [row] = await db.select().from(products).where(eq(products.id, id)).limit(1);
  return row;
}
