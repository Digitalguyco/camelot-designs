import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import sharp from "sharp";

const MAX_DIMENSION = 2000;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

function uploadsDir() {
  const dir = process.env.UPLOADS_DIR;
  if (!dir) {
    throw new Error("UPLOADS_DIR is not set — see .env.example.");
  }
  return dir;
}

/**
 * Saves an uploaded image to disk (resized, converted to WebP) and returns
 * the public path to store on the record, e.g. "/uploads/xyz.webp".
 * Nginx (or a route handler in dev) serves UPLOADS_DIR at /uploads/.
 */
export async function saveUploadedImage(file: File): Promise<string> {
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new Error("Only JPEG, PNG, or WebP images are allowed.");
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const filename = `${randomUUID()}.webp`;
  const dir = uploadsDir();
  await mkdir(dir, { recursive: true });

  const output = await sharp(bytes)
    .rotate()
    .resize({ width: MAX_DIMENSION, height: MAX_DIMENSION, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer();

  await writeFile(path.join(dir, filename), output);
  return `/uploads/${filename}`;
}
