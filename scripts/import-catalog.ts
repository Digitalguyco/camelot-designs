/**
 * Bulk-imports the WeTransfer product photo batch into the products table.
 * Each manifest entry -> one product, one resized/re-encoded image, price
 * left null ("Price on Request") and dimensions left as a placeholder since
 * neither is known yet — both are editable later in /admin/products.
 *
 * Usage:
 *   npx tsx scripts/import-catalog.ts <manifest.json> <source-image-dir>
 *
 * manifest.json: [{ file, name, category, material, description }, ...]
 * `file` is the filename (with extension) inside <source-image-dir>.
 *
 * Safe to re-run: skips any manifest entry whose slug already exists.
 */
import "./load-env";
import { readFile, mkdir, writeFile } from "fs/promises";
import path from "path";
import { Jimp } from "jimp";
import { randomUUID } from "crypto";
import { db } from "../src/lib/db";
import { products } from "../src/lib/db/schema";
import { uniqueSlug } from "../src/lib/slug";
import { eq } from "drizzle-orm";

const MAX_DIMENSION = 2000;

type ManifestEntry = {
  file: string;
  name: string;
  category: string;
  material: string;
  description: string;
};

async function saveImage(srcPath: string, uploadsDir: string): Promise<string> {
  const bytes = await readFile(srcPath);
  const image = await Jimp.read(bytes);
  if (image.width > MAX_DIMENSION || image.height > MAX_DIMENSION) {
    image.scaleToFit({ w: MAX_DIMENSION, h: MAX_DIMENSION });
  }
  const output: Buffer = await image.getBuffer("image/jpeg", { quality: 82 });
  const filename = `${randomUUID()}.jpg`;
  await mkdir(uploadsDir, { recursive: true });
  await writeFile(path.join(uploadsDir, filename), output);
  return `/uploads/${filename}`;
}

async function main() {
  const [manifestPath, srcDir] = process.argv.slice(2);
  if (!manifestPath || !srcDir) {
    console.error("Usage: npx tsx scripts/import-catalog.ts <manifest.json> <source-image-dir>");
    process.exit(1);
  }

  const uploadsDir = process.env.UPLOADS_DIR;
  if (!uploadsDir) throw new Error("UPLOADS_DIR is not set.");

  const manifest: ManifestEntry[] = JSON.parse(await readFile(manifestPath, "utf-8"));
  console.log(`Loaded ${manifest.length} manifest entries.`);

  let created = 0;
  let skipped = 0;
  let skuCounter = 1;

  // Start the SKU counter after the highest existing CD-#### SKU so re-runs
  // (or a second batch later) don't collide.
  const existingSkus = await db.select({ sku: products.sku }).from(products);
  for (const { sku } of existingSkus) {
    const m = /^CD-(\d+)$/.exec(sku);
    if (m) skuCounter = Math.max(skuCounter, Number(m[1]) + 1);
  }

  for (const entry of manifest) {
    const srcPath = path.join(srcDir, entry.file);
    let imagePath: string;
    try {
      imagePath = await saveImage(srcPath, uploadsDir);
    } catch (err) {
      console.error(`FAILED image ${entry.file}:`, err instanceof Error ? err.message : err);
      skipped += 1;
      continue;
    }

    const slug = await uniqueSlug(entry.name, async (candidate) => {
      const [existing] = await db.select({ id: products.id }).from(products).where(eq(products.slug, candidate)).limit(1);
      return Boolean(existing);
    });

    const sku = `CD-${String(skuCounter).padStart(4, "0")}`;
    skuCounter += 1;

    await db.insert(products).values({
      slug,
      name: entry.name,
      category: entry.category,
      priceCents: null,
      material: entry.material,
      dimensions: "Available on request",
      sku,
      status: "available",
      description: entry.description,
      images: [imagePath],
    });

    created += 1;
    if (created % 25 === 0) console.log(`  ${created} imported...`);
  }

  console.log(`Done. Created ${created}, skipped ${skipped} (of ${manifest.length}).`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
