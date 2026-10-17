/**
 * Replaces the entire shop catalog with the real supplier price list,
 * grouping same-design/different-size rows (e.g. a vase's Small and Large)
 * into one product with multiple purchase options, instead of a separate
 * listing per size. Deleting a product cascades to its variants (see
 * schema.ts's onDelete: "cascade"), so wiping products is enough.
 *
 * Run with:
 *   npx tsx scripts/rebuild-catalog-with-variants.ts <manifest.json> <source-image-dir>
 *
 * manifest.json: [{ name, category, material, description, image,
 *   variants: [{ label, sku, dimensions, priceKobo }, ...] }, ...]
 * `image` is a filename inside <source-image-dir>; multiple products may
 * point at the same filename when the supplier's own photo shows more than
 * one design together (resized/uploaded once per unique filename either way).
 */
import "./load-env";
import { readFile, mkdir, writeFile } from "fs/promises";
import path from "path";
import { Jimp } from "jimp";
import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";
import { db } from "../src/lib/db";
import { products, productVariants } from "../src/lib/db/schema";
import { uniqueSlug } from "../src/lib/slug";

const MAX_DIMENSION = 1600;

type VariantEntry = { label: string; sku: string; dimensions: string; priceKobo: number };
type ManifestEntry = {
  name: string;
  category: string;
  material: string;
  description: string;
  image: string;
  variants: VariantEntry[];
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
    console.error("Usage: npx tsx scripts/rebuild-catalog-with-variants.ts <manifest.json> <source-image-dir>");
    process.exit(1);
  }
  const uploadsDir = process.env.UPLOADS_DIR;
  if (!uploadsDir) throw new Error("UPLOADS_DIR is not set.");

  const manifest: ManifestEntry[] = JSON.parse(await readFile(manifestPath, "utf-8"));
  const totalVariants = manifest.reduce((n, p) => n + p.variants.length, 0);
  console.log(`Loaded ${manifest.length} products (${totalVariants} purchase options).`);

  const deletedVariants = await db.delete(productVariants);
  const deletedProducts = await db.delete(products);
  console.log("Wiped existing products/variants:", deletedProducts, deletedVariants);

  const imagePathCache = new Map<string, string>();
  let created = 0;
  let variantsCreated = 0;

  for (const entry of manifest) {
    let imagePath = imagePathCache.get(entry.image);
    if (!imagePath) {
      try {
        imagePath = await saveImage(path.join(srcDir, entry.image), uploadsDir);
        imagePathCache.set(entry.image, imagePath);
      } catch (err) {
        console.error(`FAILED image for "${entry.name}" (${entry.image}):`, err instanceof Error ? err.message : err);
        continue;
      }
    }

    const slug = await uniqueSlug(entry.name, async (candidate) => {
      const [existing] = await db.select({ id: products.id }).from(products).where(eq(products.slug, candidate)).limit(1);
      return Boolean(existing);
    });

    const [product] = await db
      .insert(products)
      .values({
        slug,
        name: entry.name,
        category: entry.category,
        material: entry.material,
        status: "available",
        description: entry.description,
        images: [imagePath],
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
      variantsCreated += 1;
    }

    created += 1;
    if (created % 50 === 0) console.log(`  ${created} products imported...`);
  }

  console.log(`Done. Created ${created} products, ${variantsCreated} purchase options. Unique images used: ${imagePathCache.size}.`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
