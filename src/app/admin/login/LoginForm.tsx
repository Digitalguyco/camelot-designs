"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { login, type LoginState } from "./actions";

const initialState: LoginState = {};

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initialState);
  const searchParams = useSearchParams();
  const from = searchParams.get("from") ?? "/admin/products";

  return (
    <form action={formAction} className="mt-8 space-y-5">
      <input type="hidden" name="from" value={from} />
      <div>
        <label htmlFor="email" className="tag text-ink/60">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="username"
          className="field mt-2 w-full px-4 py-3 text-sm"
        />
      </div>
      <div>
        <label htmlFor="password" className="tag text-ink/60">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="field mt-2 w-full px-4 py-3 text-sm"
        />
      </div>

      {state.error && <p className="text-sm text-red-400">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="btn-primary w-full px-6 py-3 text-sm tracking-wide disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Sign In"}
      </button>
    </form>
  );
}
