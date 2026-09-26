import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { projects, type Project } from "@/lib/db/schema";

export type { Project };

export async function getAllProjects(): Promise<Project[]> {
  return db.select().from(projects).orderBy(desc(projects.createdAt));
}

// Homepage "Recent Work" — always the most recently added project, so a
// new upload replaces whatever was there without any manual curation step.
export async function getMostRecentProject(): Promise<Project | undefined> {
  const [row] = await db.select().from(projects).orderBy(desc(projects.createdAt)).limit(1);
  return row;
}

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  const [row] = await db.select().from(projects).where(eq(projects.slug, slug)).limit(1);
  return row;
}

export async function getProjectById(id: string): Promise<Project | undefined> {
  const [row] = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
  return row;
}
