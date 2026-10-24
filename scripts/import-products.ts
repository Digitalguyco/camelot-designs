/**
 * Adds products to the catalog without touching existing ones — the
 * additive counterpart to rebuild-catalog-with-variants.ts. Safe to re-run:
 * a product is skipped if any of its SKUs already exists, and images are
 * stored under a content hash, so an image already attached is never
 * attached twice.
 *
 * Images are copied as-is (already resized/padded JPEGs), so the same
 * bundle produces identical results locally and on the server.
 *
 * Run with:
 *   npx tsx scripts/import-products.ts <manifest.json> <image-dir>
 *
 * manifest.json: {
 *   products: [{ name, category, material, description, status, images: [filename],
 *     variants: [{ label, sku, dimensions, priceKobo | null }] }],
 *   addImages: [{ sku, images: [filename] }]   // extra photos for existing products
 * }
 */
import "./load-env";
import { readFile, mkdir, writeFile, access } from "fs/promises";
import path from "path";
import { createHash } from "crypto";
import { eq, inArray } from "drizzle-orm";
import { db } from "../src/lib/db";
import { products, productVariants } from "../src/lib/db/schema";
import { uniqueSlug } from "../src/lib/slug";

type Status = "available" | "preorder" | "sold-out";
type VariantEntry = { label: string; sku: string; dimensions: string; priceKobo: number | null };
type ProductEntry = {
  name: string;
  category: string;
  material: string;
  description: string;
  status: Status;
  images: string[];
  variants: VariantEntry[];
};
type Manifest = { products?: ProductEntry[]; addImages?: { sku: string; images: string[] }[] };

async function storeImage(srcPath: string, uploadsDir: string): Promise<string> {
  const bytes = await readFile(srcPath);
  const filename = `${createHash("sha1").update(bytes).digest("hex").slice(0, 20)}.jpg`;
  const dest = path.join(uploadsDir, filename);
  try {
    await access(dest);
  } catch {
    await mkdir(uploadsDir, { recursive: true });
    await writeFile(dest, bytes);
  }
  return `/uploads/${filename}`;
}

async function main() {
  const [manifestPath, srcDir] = process.argv.slice(2);
  if (!manifestPath || !srcDir) {
    console.error("Usage: npx tsx scripts/import-products.ts <manifest.json> <image-dir>");
    process.exit(1);
  }
  const uploadsDir = process.env.UPLOADS_DIR;
  if (!uploadsDir) throw new Error("UPLOADS_DIR is not set.");

  const manifest: Manifest = JSON.parse(await readFile(manifestPath, "utf-8"));
  const store = (f: string) => storeImage(path.join(srcDir, f), uploadsDir);

  let created = 0;
  let skipped = 0;
  for (const entry of manifest.products ?? []) {
    const skus = entry.variants.map((v) => v.sku);
    const existing = await db
      .select({ sku: productVariants.sku })
      .from(productVariants)
      .where(inArray(productVariants.sku, skus))
      .limit(1);
    if (existing.length) {
      skipped += 1;
      continue;
    }

    const images: string[] = [];
    for (const f of entry.images) images.push(await store(f));

    const slug = await uniqueSlug(entry.name, async (candidate) => {
      const [hit] = await db.select({ id: products.id }).from(products).where(eq(products.slug, candidate)).limit(1);
      return Boolean(hit);
    });

    const [product] = await db
      .insert(products)
      .values({
        slug,
        name: entry.name,
        category: entry.category,
        material: entry.material,
        status: entry.status,
        description: entry.description,
        images,
      })
      .returning();

    for (const [i, v] of entry.variants.entries()) {
      await db.insert(productVariants).values({
        productId: product.id,
        label: v.label,
        sku: v.sku,
        dimensions: v.dimensions,
        priceCents: v.priceKobo,
        sortOrder: i,
      });
    }

    created += 1;
    if (created % 50 === 0) console.log(`  ${created} products imported...`);
  }

  let extended = 0;
  for (const { sku, images } of manifest.addImages ?? []) {
    const [variant] = await db.select().from(productVariants).where(eq(productVariants.sku, sku)).limit(1);
    if (!variant) {
      console.error(`No product with SKU ${sku} — extra images skipped.`);
      continue;
    }
    const [product] = await db.select().from(products).where(eq(products.id, variant.productId)).limit(1);
    const next = [...product.images];
    for (const f of images) {
      const stored = await store(f);
      if (!next.includes(stored)) next.push(stored);
    }
    if (next.length !== product.images.length) {
      await db.update(products).set({ images: next, updatedAt: new Date() }).where(eq(products.id, product.id));
      extended += 1;
    }
  }

  console.log(`Done. Created ${created} products, skipped ${skipped} already present, added photos to ${extended}.`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
