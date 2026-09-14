import { desc, eq } from "drizzle-orm";
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

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const [row] = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
  return row;
}

export async function getProductById(id: string): Promise<Product | undefined> {
  const [row] = await db.select().from(products).where(eq(products.id, id)).limit(1);
  return row;
}
