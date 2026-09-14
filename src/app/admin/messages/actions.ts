"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { contactMessages } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/session";

export async function toggleHandled(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const handled = formData.get("handled") === "true";
  if (!id) return;

  await db.update(contactMessages).set({ handled: !handled }).where(eq(contactMessages.id, id));
  revalidatePath("/admin/messages");
}
