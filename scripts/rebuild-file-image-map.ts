/**
 * One-off: rebuilds a {file -> current image path} map for a database that
 * has already been through one merge-duplicate-products.ts pass, without
 * needing to have captured that mapping beforehand (styled_subset.json is
 * local-only — its image UUIDs don't exist on the VPS's separate import).
 *
 * Since import-catalog.ts inserted rows in manifest order with sequential
 * SKUs, and merges only ever *delete* rows (never reorder or renumber
 * surviving SKUs), removing the previously-absorbed filenames from the
 * manifest leaves a list whose order still lines up 1:1, position for
 * position, with the surviving CD-#### rows sorted by SKU.
 *
 * Run with:
 *   npx tsx scripts/rebuild-file-image-map.ts <manifest.json> <round1-clusters-by-file.json> <output.json>
 */
import "./load-env";
import { db } from "../src/lib/db";
import { products } from "../src/lib/db/schema";
import { readFile, writeFile } from "fs/promises";

type ManifestEntry = { file: string };
type FileCluster = { primary: string; absorb: string[] };

async function main() {
  const [manifestPath, clustersPath, outPath] = process.argv.slice(2);
  if (!manifestPath || !clustersPath || !outPath) {
    console.error(
      "Usage: npx tsx scripts/rebuild-file-image-map.ts <manifest.json> <round1-clusters-by-file.json> <output.json>",
    );
    process.exit(1);
  }
  const manifest: ManifestEntry[] = JSON.parse(await readFile(manifestPath, "utf-8"));
  const round1: FileCluster[] = JSON.parse(await readFile(clustersPath, "utf-8"));
  const absorbed = new Set(round1.flatMap((c) => c.absorb));

  const survivingManifest = manifest.filter((m) => !absorbed.has(m.file));

  const all = await db.select().from(products);
  const cdRows = all
    .filter((r) => /^CD-\d{4}$/.test(r.sku))
    .sort((a, b) => Number(a.sku.slice(3)) - Number(b.sku.slice(3)));

  if (survivingManifest.length !== cdRows.length) {
    console.error(
      `Mismatch: expected ${survivingManifest.length} surviving manifest entries, found ${cdRows.length} CD-#### rows. Refusing to guess.`,
    );
    process.exit(1);
  }

  const result = survivingManifest.map((m, i) => ({ file: m.file, image: cdRows[i].images[0] }));
  await writeFile(outPath, JSON.stringify(result, null, 1));
  console.log(`Wrote ${result.length} file->image entries to ${outPath}.`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
