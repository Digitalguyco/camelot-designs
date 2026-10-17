/**
 * One-off: upgrades specific products' cover photo from the supplier
 * catalog's low-res thumbnail to the client's own high-resolution photo,
 * for the subset where a confident visual match was found (see the
 * matching work in the session scratchpad — conservative by design, most
 * catalog items have no WeTransfer counterpart at all).
 *
 * Run with:
 *   npx tsx scripts/apply-recovered-images.ts <variant_manifest.json> <matches.json> <wetransfer-dir>
 *
 * matches.json: [{ catalog: "catalog_0123.jpg", match: "IMG_3830.jpeg" }, ...]
 * variant_manifest.json: the same file rebuild-catalog-with-variants.ts used
 * (products in DB insertion order, each with an `image` field) — used only
 * to figure out which DB row each catalog image belongs to.
 */
import "./load-env";
import { readFile, mkdir, writeFile } from "fs/promises";
import path from "path";
import { Jimp } from "jimp";
import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";
import { db } from "../src/lib/db";
import { products } from "../src/lib/db/schema";

const MAX_DIMENSION = 2000;

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
  const [manifestPath, matchesPath, wtDir] = process.argv.slice(2);
  if (!manifestPath || !matchesPath || !wtDir) {
    console.error("Usage: npx tsx scripts/apply-recovered-images.ts <variant_manifest.json> <matches.json> <wetransfer-dir>");
    process.exit(1);
  }
  const uploadsDir = process.env.UPLOADS_DIR;
  if (!uploadsDir) throw new Error("UPLOADS_DIR is not set.");

  const manifest: { name: string; image: string }[] = JSON.parse(await readFile(manifestPath, "utf-8"));
  const matches: { catalog: string; match: string }[] = JSON.parse(await readFile(matchesPath, "utf-8"));
  const matchByImage = new Map(matches.map((m) => [m.catalog, m.match]));

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
  console.log(`Alignment verified: ${rows.length} rows.`);

  const wtImageCache = new Map<string, string>();
  let updated = 0;

  for (let i = 0; i < rows.length; i++) {
    const catalogImage = manifest[i].image;
    const wtFile = matchByImage.get(catalogImage);
    if (!wtFile) continue;

    let newImagePath = wtImageCache.get(wtFile);
    if (!newImagePath) {
      newImagePath = await saveImage(path.join(wtDir, wtFile), uploadsDir);
      wtImageCache.set(wtFile, newImagePath);
    }

    await db
      .update(products)
      .set({ images: [newImagePath], updatedAt: new Date() })
      .where(eq(products.id, rows[i].id));
    console.log(`${rows[i].name} (${catalogImage} -> ${wtFile})`);
    updated += 1;
  }

  console.log(`Done. Updated ${updated} products with recovered high-res photos.`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
