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
 * Since the bulk importer (scripts/import-catalog.ts) inserted rows in
 * manifest order with sequential CD-#### SKUs, this script re-derives
 * "which row is which original photo" the same way: manifest[i] <-> the
 * i-th CD-#### row ordered by SKU. That join is redone per-database (the
 * local DB and the VPS DB have different row ids for "the same" product)
 * rather than hardcoding ids.
 *
 * Run with:
 *   npx tsx scripts/merge-duplicate-products.ts <manifest.json> <clusters-by-file.json>
 *
 * manifest.json: the same [{file, name, ...}] array import-catalog.ts used.
 * clusters-by-file.json: [{ "primary": "IMG_xxxx.jpeg", "absorb": ["IMG_yyyy.jpeg", ...] }, ...]
 */
import "./load-env";
import { eq, inArray } from "drizzle-orm";
import { db } from "../src/lib/db";
import { products } from "../src/lib/db/schema";
import { readFile } from "fs/promises";

type ManifestEntry = { file: string; name: string };
type FileCluster = { primary: string; absorb: string[] };

async function main() {
  const [manifestPath, clustersPath] = process.argv.slice(2);
  if (!manifestPath || !clustersPath) {
    console.error(
      "Usage: npx tsx scripts/merge-duplicate-products.ts <manifest.json> <clusters-by-file.json>",
    );
    process.exit(1);
  }
  const manifest: ManifestEntry[] = JSON.parse(await readFile(manifestPath, "utf-8"));
  const fileClusters: FileCluster[] = JSON.parse(await readFile(clustersPath, "utf-8"));

  const allProducts = await db.select().from(products);
  const cdRows = allProducts
    .filter((r) => /^CD-\d{4}$/.test(r.sku))
    .sort((a, b) => Number(a.sku.slice(3)) - Number(b.sku.slice(3)));

  if (cdRows.length !== manifest.length) {
    console.error(`Mismatch: manifest has ${manifest.length} entries, DB has ${cdRows.length} CD-#### rows.`);
    process.exit(1);
  }
  for (let i = 0; i < manifest.length; i++) {
    if (manifest[i].name !== cdRows[i].name) {
      console.error(`Alignment check failed at index ${i}: "${manifest[i].name}" vs "${cdRows[i].name}"`);
      process.exit(1);
    }
  }
  console.log(`Alignment verified: ${manifest.length} manifest entries match ${cdRows.length} DB rows.`);

  const byFile = new Map(manifest.map((m, i) => [m.file, cdRows[i]]));

  let merged = 0;
  for (const { primary: primaryFile, absorb: absorbFiles } of fileClusters) {
    const primary = byFile.get(primaryFile);
    if (!primary) {
      console.error(`SKIP — no DB row found for primary file ${primaryFile}.`);
      continue;
    }
    const absorbRows = absorbFiles.map((f) => byFile.get(f)).filter((r): r is NonNullable<typeof r> => Boolean(r));
    if (absorbRows.length !== absorbFiles.length) {
      console.error(`WARNING — some absorb files for ${primaryFile} had no DB row.`);
    }

    // Re-read the primary fresh in case an earlier cluster in this same
    // run already touched it (shouldn't happen — clusters are disjoint —
    // but cheap to guard against).
    const [freshPrimary] = await db.select().from(products).where(eq(products.id, primary.id)).limit(1);
    if (!freshPrimary) continue;

    const combinedImages = [
      ...freshPrimary.images,
      ...absorbRows.flatMap((r) => r.images).filter((img) => !freshPrimary.images.includes(img)),
    ];

    await db
      .update(products)
      .set({ images: combinedImages, updatedAt: new Date() })
      .where(eq(products.id, primary.id));

    if (absorbRows.length > 0) {
      await db.delete(products).where(inArray(products.id, absorbRows.map((r) => r.id)));
    }

    console.log(`${primary.name}: ${combinedImages.length} images (absorbed ${absorbRows.length} rows).`);
    merged += 1;
  }

  console.log(`Done. Merged ${merged} clusters.`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
