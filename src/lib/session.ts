import { auth } from "@/lib/auth";

/**
 * Every mutating Server Action under /admin must call this first. proxy.ts
 * only gates page navigation — a Server Action can be invoked directly, so
 * authorization has to be re-checked here too.
 */
export async function requireAdmin() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Not authenticated");
  }
  return session.user;
}
