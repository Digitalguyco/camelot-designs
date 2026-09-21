import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { projects, type Project } from "@/lib/db/schema";

export type { Project };

export async function getAllProjects(): Promise<Project[]> {
  return db.select().from(projects).orderBy(desc(projects.createdAt));
}

export async function getFeaturedProjects(limit = 3): Promise<Project[]> {
  const all = await getAllProjects();
  const featured = all.filter((p) => p.featured);
  const rest = all.filter((p) => !p.featured);
  return [...featured, ...rest].slice(0, limit);
}

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  const [row] = await db.select().from(projects).where(eq(projects.slug, slug)).limit(1);
  return row;
}

export async function getProjectById(id: string): Promise<Project | undefined> {
  const [row] = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
  return row;
}
