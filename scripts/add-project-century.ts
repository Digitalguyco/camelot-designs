/**
 * One-off: adds "Project Century" (the Chairman's Office) to the portfolio.
 * Resizes/re-encodes the source photos via Jimp and inserts one project row
 * with them in a chosen display order (cover image first).
 *
 * Run with: npx tsx scripts/add-project-century.ts <source-image-dir>
 */
import "./load-env";
import { readFile, mkdir, writeFile } from "fs/promises";
import path from "path";
import { Jimp } from "jimp";
import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";
import { db } from "../src/lib/db";
import { projects } from "../src/lib/db/schema";
import { uniqueSlug } from "../src/lib/slug";

const MAX_DIMENSION = 2000;

// Cover image first, then the rest of the sit-out, then the office, then the
// bar nook and ensuite as closing detail shots.
const IMAGE_ORDER = [
  "IMG_0056.jpg",
  "IMG_0076.jpg",
  "IMG_0058.jpg",
  "IMG_0071.jpg",
  "IMG_0066.jpg",
  "IMG_0068.jpg",
  "IMG_0074.jpg",
  "IMG_0063.jpg",
];

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
  const [srcDir] = process.argv.slice(2);
  if (!srcDir) {
    console.error("Usage: npx tsx scripts/add-project-century.ts <source-image-dir>");
    process.exit(1);
  }

  const uploadsDir = process.env.UPLOADS_DIR;
  if (!uploadsDir) throw new Error("UPLOADS_DIR is not set.");

  const images: string[] = [];
  for (const file of IMAGE_ORDER) {
    images.push(await saveImage(path.join(srcDir, file), uploadsDir));
    console.log(`  saved ${file}`);
  }

  const slug = await uniqueSlug("Project Century", async (candidate) => {
    const [existing] = await db.select({ id: projects.id }).from(projects).where(eq(projects.slug, candidate)).limit(1);
    return Boolean(existing);
  });

  await db.insert(projects).values({
    slug,
    name: "Project Century",
    location: "Lagos, Nigeria",
    projectType: "Commercial",
    role: "Full space transformation — architecture, finishes, lighting, furniture and styling, designed and executed end to end.",
    scope:
      "A complete floor-to-ceiling transformation of the Chairman's private office and adjoining sit-out, for work, hosting and unwinding alike.",
    concept:
      "A floor-to-ceiling reimagining of the Chairman's office and its adjoining sit-out — floors, walls, ceilings, lighting, a feature wall, furniture and soft furnishings considered together as one environment. Warm neutrals, deep wood tones and textured finishes set the base, with the company's signature burgundy carried through in cushions, rug and artwork. The sit-out reads as a natural extension of the office: relaxed enough to unwind in, polished enough to host clients and guests, with a fluted feature wall and statement artwork giving the room its own identity.",
    materials:
      "Warm neutral and deep wood-tone finishes, fluted wall panelling, burgundy soft furnishings (cushions and rug), and statement artwork throughout.",
    images,
  });

  console.log(`Done — created project "${slug}" with ${images.length} images.`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
