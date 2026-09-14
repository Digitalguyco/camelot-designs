"use server";

import { unstable_rethrow } from "next/navigation";
import { signIn } from "@/lib/auth";

export type LoginState = { error?: string };

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const from = String(formData.get("from") ?? "/admin/products");

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: from.startsWith("/admin") ? from : "/admin/products",
    });
    return {};
  } catch (err) {
    unstable_rethrow(err);
    return { error: "Incorrect email or password." };
  }
}
