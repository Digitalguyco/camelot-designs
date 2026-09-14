"use client";

import { useActionState } from "react";
import RichTextEditor from "@/components/admin/RichTextEditor";
import type { Post } from "@/lib/data/posts";
import type { PostFormState } from "./actions";

const initialState: PostFormState = {};

export default function PostForm({
  action,
  post,
  submitLabel,
}: {
  action: (prev: PostFormState, formData: FormData) => Promise<PostFormState>;
  post?: Post;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="space-y-6 max-w-2xl">
      <div>
        <label htmlFor="title" className="tag text-ink/60">
          Title
        </label>
        <input
          id="title"
          name="title"
          defaultValue={post?.title}
          required
          className="field mt-2 w-full px-4 py-3 text-sm"
        />
      </div>

      <div>
        <label htmlFor="dek" className="tag text-ink/60">
          Summary (shown on the blog index)
        </label>
        <textarea
          id="dek"
          name="dek"
          rows={2}
          defaultValue={post?.dek}
          required
          className="field mt-2 w-full px-4 py-3 text-sm leading-relaxed"
        />
      </div>

      <div>
        <label htmlFor="coverImage" className="tag text-ink/60">
          Cover image {post && "(leave blank to keep the current one)"}
        </label>
        {post?.coverImage && (
          // Admin-uploaded content — plain <img>, see ProductForm for why.
          <img src={post.coverImage} alt="" className="mt-2 h-32 w-full max-w-xs object-cover bg-stone" />
        )}
        <input
          id="coverImage"
          name="coverImage"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="field mt-2 w-full px-4 py-3 text-sm"
        />
      </div>

      <div>
        <p className="tag text-ink/60 mb-2">Body</p>
        <RichTextEditor initialHtml={post?.contentHtml ?? ""} />
      </div>

      <label className="flex items-center gap-2 text-sm text-ink/70">
        <input type="checkbox" name="published" defaultChecked={post?.published ?? false} />
        Published (visible on the public site)
      </label>

      {state.error && <p className="text-sm text-red-400">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="btn-primary px-6 py-3 text-sm tracking-wide disabled:opacity-60"
      >
        {pending ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}
