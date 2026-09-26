"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { projects } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/session";
import { saveUploadedImage } from "@/lib/uploads";
import { uniqueSlug } from "@/lib/slug";
import { getProjectById } from "@/lib/data/projects";

export type ProjectFormState = { error?: string };

function readCommonFields(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const projectType = String(formData.get("projectType") ?? "").trim();
  const scope = String(formData.get("scope") ?? "").trim();
  const concept = String(formData.get("concept") ?? "").trim();
  const materials = String(formData.get("materials") ?? "").trim();
  const customFurnitureRaw = String(formData.get("customFurniture") ?? "").trim();
  const customFurniture = customFurnitureRaw === "" ? null : customFurnitureRaw;
  const role = String(formData.get("role") ?? "").trim();

  if (!name || !location || !projectType || !scope || !concept || !materials || !role) {
    throw new Error("Please fill in every field.");
  }

  return { name, location, projectType, scope, concept, materials, customFurniture, role };
}

async function uploadNewImages(formData: FormData): Promise<string[]> {
  const files = formData.getAll("images").filter((f): f is File => f instanceof File && f.size > 0);
  return Promise.all(files.map(saveUploadedImage));
}

export async function createProject(
  _prev: ProjectFormState,
  formData: FormData,
): Promise<ProjectFormState> {
  await requireAdmin();

  try {
    const fields = readCommonFields(formData);
    const newImages = await uploadNewImages(formData);
    if (newImages.length === 0) {
      return { error: "Add at least one image." };
    }

    const slug = await uniqueSlug(fields.name, async (candidate) => {
      const [existing] = await db
        .select({ id: projects.id })
        .from(projects)
        .where(eq(projects.slug, candidate))
        .limit(1);
      return Boolean(existing);
    });

    await db.insert(projects).values({ ...fields, slug, images: newImages });
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Something went wrong." };
  }

  revalidatePath("/portfolio");
  revalidatePath("/");
  redirect("/admin/projects");
}

export async function updateProject(
  id: string,
  _prev: ProjectFormState,
  formData: FormData,
): Promise<ProjectFormState> {
  await requireAdmin();

  try {
    const existing = await getProjectById(id);
    if (!existing) return { error: "Project not found." };

    const fields = readCommonFields(formData);
    const keepImages = formData.getAll("keepImages").map(String);
    const newImages = await uploadNewImages(formData);
    const images = [...keepImages, ...newImages];
    if (images.length === 0) {
      return { error: "A project needs at least one image." };
    }

    // The slug (and its public URL) stays fixed once a project is created.
    await db
      .update(projects)
      .set({ ...fields, images, updatedAt: new Date() })
      .where(eq(projects.id, id));
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Something went wrong." };
  }

  revalidatePath("/portfolio");
  revalidatePath("/");
  redirect("/admin/projects");
}

export async function deleteProject(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await db.delete(projects).where(eq(projects.id, id));
  revalidatePath("/portfolio");
  revalidatePath("/");
  redirect("/admin/projects");
}
