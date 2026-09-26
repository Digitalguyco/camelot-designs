"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/session";
import { saveUploadedImage } from "@/lib/uploads";
import { uniqueSlug } from "@/lib/slug";
import { getProductById } from "@/lib/data/products";

export type ProductFormState = { error?: string };

const STATUSES = new Set(["available", "preorder", "sold-out"]);

function readCommonFields(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const priceRaw = String(formData.get("price") ?? "").trim();
  const material = String(formData.get("material") ?? "").trim();
  const dimensions = String(formData.get("dimensions") ?? "").trim();
  const sku = String(formData.get("sku") ?? "").trim();
  const status = String(formData.get("status") ?? "available");
  const description = String(formData.get("description") ?? "").trim();

  if (!name || !category || !material || !dimensions || !sku || !description) {
    throw new Error("Please fill in every field.");
  }
  if (!STATUSES.has(status)) {
    throw new Error("Invalid status.");
  }

  // Price is optional — leave it blank to list the piece as "Price on
  // Request" while sourcing/pricing is still being worked out, and set it
  // later without touching anything else about the listing.
  let priceCents: number | null = null;
  if (priceRaw !== "") {
    const priceDollars = Number(priceRaw);
    if (!Number.isFinite(priceDollars) || priceDollars < 0) {
      throw new Error("Enter a valid price, or leave it blank for “Price on Request.”");
    }
    priceCents = Math.round(priceDollars * 100);
  }

  return {
    name,
    category,
    priceCents,
    material,
    dimensions,
    sku,
    status: status as "available" | "preorder" | "sold-out",
    description,
  };
}

async function uploadNewImages(formData: FormData): Promise<string[]> {
  const files = formData.getAll("images").filter((f): f is File => f instanceof File && f.size > 0);
  return Promise.all(files.map(saveUploadedImage));
}

export async function createProduct(
  _prev: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  await requireAdmin();

  try {
    const fields = readCommonFields(formData);
    const newImages = await uploadNewImages(formData);
    if (newImages.length === 0) {
      return { error: "Add at least one image." };
    }

    const slug = await uniqueSlug(fields.name, async (candidate) => {
      const [existing] = await db.select({ id: products.id }).from(products).where(eq(products.slug, candidate)).limit(1);
      return Boolean(existing);
    });

    await db.insert(products).values({ ...fields, slug, images: newImages });
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Something went wrong." };
  }

  revalidatePath("/shop");
  revalidatePath("/");
  redirect("/admin/products");
}

export async function updateProduct(
  id: string,
  _prev: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  await requireAdmin();

  try {
    const existing = await getProductById(id);
    if (!existing) return { error: "Product not found." };

    const fields = readCommonFields(formData);
    const keepImages = formData.getAll("keepImages").map(String);
    const newImages = await uploadNewImages(formData);
    const images = [...keepImages, ...newImages];
    if (images.length === 0) {
      return { error: "A product needs at least one image." };
    }

    // The slug (and its public URL) stays fixed once a product is created,
    // even if the name is edited later — renaming shouldn't break a link.
    await db
      .update(products)
      .set({ ...fields, images, updatedAt: new Date() })
      .where(eq(products.id, id));
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Something went wrong." };
  }

  revalidatePath("/shop");
  revalidatePath("/");
  redirect("/admin/products");
}

export async function deleteProduct(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await db.delete(products).where(eq(products.id, id));
  revalidatePath("/shop");
  revalidatePath("/");
  redirect("/admin/products");
}
