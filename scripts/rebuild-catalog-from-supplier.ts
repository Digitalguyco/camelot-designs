/**
 * Replaces the entire shop catalog with the real supplier price list (768
 * coded products — M-001..M-215, G-001..G-553). The previous catalog was
 * built by guessing names/materials from photos alone; this one uses the
 * supplier's own codes, materials, colours, dimensions and prices, so it
 * replaces rather than merges with what was there before.
 *
 * Run with:
 *   npx tsx scripts/rebuild-catalog-from-supplier.ts <manifest.json> <source-image-dir>
 *
 * manifest.json: [{ sku, name, category, material, dimensions, description,
 *   priceKobo, image }, ...] — `image` is a filename inside <source-image-dir>.
 * Multiple manifest entries may share the same `image` filename (the
 * supplier's own catalog photo shows size-variant pairs together) — the
 * image is only resized/uploaded once per unique filename.
 */
import "./load-env";
import { readFile, mkdir, writeFile } from "fs/promises";
import path from "path";
import { Jimp } from "jimp";
import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";
import { db } from "../src/lib/db";
import { products } from "../src/lib/db/schema";
import { uniqueSlug } from "../src/lib/slug";

const MAX_DIMENSION = 1600;

type ManifestEntry = {
  sku: string;
  name: string;
  category: string;
  material: string;
  dimensions: string;
  description: string;
  priceKobo: number;
  image: string;
};

async function saveImage(srcPath: string, uploadsDir: string): Promise<string> {
  const bytes = await readFile(srcPath);
  const image = await Jimp.read(bytes);
  if (image.width > MAX_DIMENSION || image.height > MAX_DIMENSION) {
    image.scaleToFit({ w: MAX_DIMENSION, h: MAX_DIMENSION });
  }
  const output: Buffer = await image.getBuffer("image/jpeg", { quality: 85 });
  const filename = `${randomUUID()}.jpg`;
  await mkdir(uploadsDir, { recursive: true });
  await writeFile(path.join(uploadsDir, filename), output);
  return `/uploads/${filename}`;
}

async function main() {
  const [manifestPath, srcDir] = process.argv.slice(2);
  if (!manifestPath || !srcDir) {
    console.error("Usage: npx tsx scripts/rebuild-catalog-from-supplier.ts <manifest.json> <source-image-dir>");
    process.exit(1);
  }
  const uploadsDir = process.env.UPLOADS_DIR;
  if (!uploadsDir) throw new Error("UPLOADS_DIR is not set.");

  const manifest: ManifestEntry[] = JSON.parse(await readFile(manifestPath, "utf-8"));
  console.log(`Loaded ${manifest.length} manifest entries.`);

  const deleted = await db.delete(products);
  console.log("Wiped existing products table:", deleted);

  const imagePathCache = new Map<string, string>();
  let created = 0;

  for (const entry of manifest) {
    let imagePath = imagePathCache.get(entry.image);
    if (!imagePath) {
      try {
        imagePath = await saveImage(path.join(srcDir, entry.image), uploadsDir);
        imagePathCache.set(entry.image, imagePath);
      } catch (err) {
        console.error(`FAILED image for ${entry.sku} (${entry.image}):`, err instanceof Error ? err.message : err);
        continue;
      }
    }

    const slug = await uniqueSlug(entry.name, async (candidate) => {
      const [existing] = await db.select({ id: products.id }).from(products).where(eq(products.slug, candidate)).limit(1);
      return Boolean(existing);
    });

    await db.insert(products).values({
      slug,
      name: entry.name,
      category: entry.category,
      priceCents: entry.priceKobo,
      material: entry.material,
      dimensions: entry.dimensions,
      sku: entry.sku,
      status: "available",
      description: entry.description,
      images: [imagePath],
    });

    created += 1;
    if (created % 50 === 0) console.log(`  ${created} imported...`);
  }

  console.log(`Done. Created ${created} of ${manifest.length}. Unique images used: ${imagePathCache.size}.`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
