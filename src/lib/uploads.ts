import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { Jimp } from "jimp";

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
 * Saves an uploaded image to disk (resized, re-encoded as JPEG) and returns
 * the public path to store on the record, e.g. "/uploads/xyz.jpg".
 * Nginx (or a route handler in dev) serves UPLOADS_DIR at /uploads/.
 *
 * Uses Jimp (pure JS) rather than sharp: several budget VPS hosts run older
 * virtualized CPUs (no SSE4.2/POPCNT) that sharp's prebuilt binaries refuse
 * to load on, and building it from source needs a full libvips toolchain.
 * Trade-off: Jimp doesn't auto-rotate by EXIF orientation the way sharp
 * does, so a photo uploaded straight from a phone in portrait mode may
 * occasionally need re-uploading pre-rotated.
 */
export async function saveUploadedImage(file: File): Promise<string> {
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new Error("Only JPEG, PNG, or WebP images are allowed.");
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const image = await Jimp.read(bytes);

  if (image.width > MAX_DIMENSION || image.height > MAX_DIMENSION) {
    image.scaleToFit({ w: MAX_DIMENSION, h: MAX_DIMENSION });
  }

  const output: Buffer = await image.getBuffer("image/jpeg", { quality: 82 });

  const filename = `${randomUUID()}.jpg`;
  const dir = uploadsDir();
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, filename), output);
  return `/uploads/${filename}`;
}
