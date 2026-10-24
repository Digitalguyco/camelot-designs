/**
 * One-off: keeps only the products that have a verified high-res photo from
 * the client's own photography, sets their images, and deletes every other
 * product (variants cascade).
 *
 * Run with:
 *   npx tsx scripts/prune-to-photographed-products.ts <variant_manifest.json> <keep_products.json> <photo-dir>
 *
 * keep_products.json: { "<manifest index>": ["IMG_1234.png", ...], ... }
 */
import "./load-env";
import { readFile, mkdir, writeFile } from "fs/promises";
import path from "path";
import { Jimp } from "jimp";
import { randomUUID } from "crypto";
import { eq, notInArray } from "drizzle-orm";
import { db } from "../src/lib/db";
import { products } from "../src/lib/db/schema";

const MAX_DIMENSION = 2000;

async function saveImage(srcPath: string, uploadsDir: string): Promise<string> {
  const image = await Jimp.read(await readFile(srcPath));
  if (image.width > MAX_DIMENSION || image.height > MAX_DIMENSION) {
    image.scaleToFit({ w: MAX_DIMENSION, h: MAX_DIMENSION });
  }
  // PNG cutouts have transparent backgrounds; flatten onto white so JPEG doesn't turn them black.
  const flattened = new Jimp({ width: image.width, height: image.height, color: 0xffffffff });
  flattened.composite(image, 0, 0);
  const output: Buffer = await flattened.getBuffer("image/jpeg", { quality: 88 });
  const filename = `${randomUUID()}.jpg`;
  await mkdir(uploadsDir, { recursive: true });
  await writeFile(path.join(uploadsDir, filename), output);
  return `/uploads/${filename}`;
}

async function main() {
  const [manifestPath, keepPath, photoDir] = process.argv.slice(2);
  if (!manifestPath || !keepPath || !photoDir) {
    console.error("Usage: npx tsx scripts/prune-to-photographed-products.ts <variant_manifest.json> <keep_products.json> <photo-dir>");
    process.exit(1);
  }
  const uploadsDir = process.env.UPLOADS_DIR;
  if (!uploadsDir) throw new Error("UPLOADS_DIR is not set.");

  const manifest: { name: string }[] = JSON.parse(await readFile(manifestPath, "utf-8"));
  const keep: Record<string, string[]> = JSON.parse(await readFile(keepPath, "utf-8"));

  const rows = await db.select().from(products).orderBy(products.createdAt);
  if (rows.length !== manifest.length) {
    console.error(`Row count mismatch: DB has ${rows.length}, manifest has ${manifest.length}. Refusing to guess.`);
    process.exit(1);
  }
  for (let i = 0; i < rows.length; i++) {
    if (rows[i].name !== manifest[i].name) {
      console.error(`Alignment check failed at index ${i}: "${rows[i].name}" vs "${manifest[i].name}". Refusing to guess.`);
      process.exit(1);
    }
  }

  const cache = new Map<string, string>();
  const keepIds: string[] = [];
  for (const [indexStr, files] of Object.entries(keep)) {
    const row = rows[Number(indexStr)];
    const images: string[] = [];
    for (const file of files) {
      let saved = cache.get(file);
      if (!saved) {
        saved = await saveImage(path.join(photoDir, file), uploadsDir);
        cache.set(file, saved);
      }
      images.push(saved);
    }
    await db.update(products).set({ images, updatedAt: new Date() }).where(eq(products.id, row.id));
    keepIds.push(row.id);
    console.log(`kept: ${row.name} (${files.join(", ")})`);
  }

  const deleted = await db.delete(products).where(notInArray(products.id, keepIds)).returning({ id: products.id });
  console.log(`Done. Kept ${keepIds.length} products, deleted ${deleted.length}.`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
