"use server";

import DOMPurify from "isomorphic-dompurify";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { posts } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/session";
import { saveUploadedImage } from "@/lib/uploads";
import { uniqueSlug } from "@/lib/slug";
import { estimateReadTime, getPostById } from "@/lib/data/posts";

export type PostFormState = { error?: string };

function readCommonFields(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const dek = String(formData.get("dek") ?? "").trim();
  const contentHtml = DOMPurify.sanitize(String(formData.get("contentHtml") ?? ""));
  const published = formData.get("published") === "on";

  if (!title || !dek || !contentHtml.trim()) {
    throw new Error("Please fill in the title, summary, and body.");
  }

  return { title, dek, contentHtml, published, readTime: estimateReadTime(contentHtml) };
}

export async function createPost(_prev: PostFormState, formData: FormData): Promise<PostFormState> {
  await requireAdmin();

  try {
    const fields = readCommonFields(formData);
    const coverFile = formData.get("coverImage");
    if (!(coverFile instanceof File) || coverFile.size === 0) {
      return { error: "Add a cover image." };
    }
    const coverImage = await saveUploadedImage(coverFile);

    const slug = await uniqueSlug(fields.title, async (candidate) => {
      const [existing] = await db.select({ id: posts.id }).from(posts).where(eq(posts.slug, candidate)).limit(1);
      return Boolean(existing);
    });

    await db.insert(posts).values({
      ...fields,
      slug,
      coverImage,
      publishedAt: fields.published ? new Date() : null,
    });
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Something went wrong." };
  }

  revalidatePath("/blog");
  revalidatePath("/");
  redirect("/admin/blog");
}

export async function updatePost(
  id: string,
  _prev: PostFormState,
  formData: FormData,
): Promise<PostFormState> {
  await requireAdmin();

  try {
    const existing = await getPostById(id);
    if (!existing) return { error: "Post not found." };

    const fields = readCommonFields(formData);
    const coverFile = formData.get("coverImage");
    const coverImage =
      coverFile instanceof File && coverFile.size > 0 ? await saveUploadedImage(coverFile) : existing.coverImage;

    const publishedAt = fields.published ? existing.publishedAt ?? new Date() : existing.publishedAt;

    await db
      .update(posts)
      .set({ ...fields, coverImage, publishedAt, updatedAt: new Date() })
      .where(eq(posts.id, id));
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Something went wrong." };
  }

  revalidatePath("/blog");
  revalidatePath("/");
  redirect("/admin/blog");
}

export async function deletePost(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await db.delete(posts).where(eq(posts.id, id));
  revalidatePath("/blog");
  revalidatePath("/");
  redirect("/admin/blog");
}
