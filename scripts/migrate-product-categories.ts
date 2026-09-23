/**
 * One-off: remaps existing products' categories to the new fixed taxonomy
 * (Decor Accessories / Lightings / Furniture / Beddings / Cushions / Rugs /
 * Vintage). Safe to run more than once — it matches by slug and is a no-op
 * for slugs it doesn't recognize (e.g. real products added since).
 *
 * Run with: npx tsx scripts/migrate-product-categories.ts
 */
import "./load-env";
import { eq } from "drizzle-orm";
import { db } from "../src/lib/db";
import { products } from "../src/lib/db/schema";

const REMAP: Record<string, string> = {
  "tufted-accent-chair": "Furniture",
  "nordic-shell-chair": "Furniture",
  "larkspur-velvet-sofa": "Furniture",
  "ellery-loveseat": "Furniture",
  "reverie-chaise": "Furniture",
  "bedside-table": "Furniture",
  "studio-task-lamp": "Lightings",
  "heirloom-rug": "Rugs",
  "aloe-planter": "Decor Accessories",
};

async function main() {
  for (const [slug, category] of Object.entries(REMAP)) {
    const [existing] = await db.select({ id: products.id }).from(products).where(eq(products.slug, slug));
    if (!existing) {
      console.log(`Skipping ${slug} — no product with that slug.`);
      continue;
    }
    await db.update(products).set({ category }).where(eq(products.slug, slug));
    console.log(`${slug} → ${category}`);
  }
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
