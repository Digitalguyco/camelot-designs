import { readFile, stat } from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

// Dev-mode / fallback file serving for uploaded images. In production, Nginx
// should serve UPLOADS_DIR at /uploads/ directly and requests never reach
// here — see DEPLOY.md. This route exists so `npm run dev` works without Nginx.
export async function GET(_req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path: segments } = await params;
  const dir = process.env.UPLOADS_DIR;
  if (!dir) return new NextResponse("Not configured", { status: 500 });

  // Reject any traversal outside the uploads directory.
  const resolvedDir = path.resolve(dir);
  const filePath = path.resolve(resolvedDir, ...segments);
  if (!filePath.startsWith(resolvedDir + path.sep)) {
    return new NextResponse("Not found", { status: 404 });
  }

  try {
    await stat(filePath);
    const data = await readFile(filePath);
    const ext = path.extname(filePath).toLowerCase();
    const contentType =
      ext === ".webp" ? "image/webp" : ext === ".png" ? "image/png" : ext === ".jpg" || ext === ".jpeg" ? "image/jpeg" : "application/octet-stream";
    return new NextResponse(new Uint8Array(data), {
      headers: { "Content-Type": contentType, "Cache-Control": "public, max-age=31536000, immutable" },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
