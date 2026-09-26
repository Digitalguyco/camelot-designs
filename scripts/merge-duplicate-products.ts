/**
 * One-off: merges shop products that turned out to be the same physical
 * item photographed multiple times during the styled photoshoot batch
 * (some solo, some paired with a companion piece) into a single product
 * per item, with all of its photos in one gallery (shown as a carousel on
 * the product page). Each cluster keeps its richest photo's product row
 * (usually a pair/group shot, so a companion piece's only representation
 * is never lost) and folds the other rows' images into it, then deletes
 * the now-redundant rows.
 *
 * Clusters were identified by direct visual comparison of the ~105 photos
 * in the styled-console-shoot subset of the WeTransfer catalog import.
 * Each original photo's uploaded path is resolved via
 * catalog_manifest_full.json (the exact list scripts/import-catalog.ts
 * used) joined once against the DB *before any merge has run* — see
 * styled_subset.json, which records {file, image} for that original,
 * unmutated state. Resolving by image path (rather than by row position
 * or SKU order) is safe to run repeatedly across multiple merge passes,
 * since an image path stays inside *some* product's images array forever
 * once assigned, even after the row it originally belonged to is merged
 * away — a later pass just finds it further down the primary's gallery.
 *
 * Run with:
 *   npx tsx scripts/merge-duplicate-products.ts <file-to-image.json> <clusters-by-file.json>
 *
 * file-to-image.json: [{file, image}, ...] (styled_subset.json works as-is —
 *   extra fields are ignored).
 * clusters-by-file.json: [{ "primary": "IMG_xxxx.jpeg", "absorb": ["IMG_yyyy.jpeg", ...] }, ...]
 */
import "./load-env";
import { eq } from "drizzle-orm";
import { db } from "../src/lib/db";
import { products, type Product } from "../src/lib/db/schema";
import { readFile } from "fs/promises";

type FileImage = { file: string; image: string };
type FileCluster = { primary: string; absorb: string[] };

async function findByImage(image: string): Promise<Product | undefined> {
  const all = await db.select().from(products);
  return all.find((p) => p.images.includes(image));
}

async function main() {
  const [fileImagePath, clustersPath] = process.argv.slice(2);
  if (!fileImagePath || !clustersPath) {
    console.error(
      "Usage: npx tsx scripts/merge-duplicate-products.ts <file-to-image.json> <clusters-by-file.json>",
    );
    process.exit(1);
  }
  const fileImages: FileImage[] = JSON.parse(await readFile(fileImagePath, "utf-8"));
  const fileClusters: FileCluster[] = JSON.parse(await readFile(clustersPath, "utf-8"));
  const imageByFile = new Map(fileImages.map((f) => [f.file, f.image]));

  let merged = 0;
  for (const { primary: primaryFile, absorb: absorbFiles } of fileClusters) {
    const primaryImage = imageByFile.get(primaryFile);
    if (!primaryImage) {
      console.error(`SKIP — ${primaryFile} not found in file-to-image map.`);
      continue;
    }
    const primary = await findByImage(primaryImage);
    if (!primary) {
      console.error(`SKIP — no current product row contains ${primaryFile}'s image (${primaryImage}).`);
      continue;
    }

    const absorbRowIds = new Set<string>();
    let newImages = [...primary.images];
    for (const absorbFile of absorbFiles) {
      const absorbImage = imageByFile.get(absorbFile);
      if (!absorbImage) {
        console.error(`  WARNING — ${absorbFile} not found in file-to-image map, skipping.`);
        continue;
      }
      const row = await findByImage(absorbImage);
      if (!row) {
        console.error(`  WARNING — no current product row contains ${absorbFile}'s image, skipping.`);
        continue;
      }
      if (row.id === primary.id) {
        console.log(`  ${absorbFile} is already part of ${primary.name}'s gallery — nothing to do.`);
        continue;
      }
      absorbRowIds.add(row.id);
      for (const img of row.images) {
        if (!newImages.includes(img)) newImages.push(img);
      }
    }

    if (newImages.length !== primary.images.length) {
      await db.update(products).set({ images: newImages, updatedAt: new Date() }).where(eq(products.id, primary.id));
    }
    for (const id of absorbRowIds) {
      await db.delete(products).where(eq(products.id, id));
    }

    console.log(`${primary.name}: ${newImages.length} images (absorbed ${absorbRowIds.size} rows).`);
    merged += 1;
  }

  console.log(`Done. Processed ${merged} clusters.`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
