import Link from "next/link";
import { getAllPosts } from "@/lib/data/posts";
import ConfirmSubmit from "@/components/admin/ConfirmSubmit";
import { deletePost } from "./actions";

export default async function AdminBlogPage() {
  const items = await getAllPosts();

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-serif text-3xl">Blog</h1>
        <Link href="/admin/blog/new" className="btn-primary px-5 py-2.5 text-sm tracking-wide">
          New Post
        </Link>
      </div>

      <div className="mt-8 divide-y hairline border-t border-b hairline">
        {items.length === 0 && <p className="py-6 text-ink/60 text-sm">No posts yet.</p>}
        {items.map((post) => (
          <div key={post.id} className="flex items-center gap-4 py-4">
            <img src={post.coverImage} alt="" className="h-16 w-16 object-cover bg-stone flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-serif text-lg truncate">{post.title}</p>
              <p className="tag text-ink/55 mt-0.5">{post.published ? "Published" : "Draft"}</p>
            </div>
            <Link href={`/admin/blog/${post.id}`} className="tag text-ink/70 hover:text-gold transition-colors">
              Edit
            </Link>
            <form action={deletePost}>
              <input type="hidden" name="id" value={post.id} />
              <ConfirmSubmit
                message={`Delete "${post.title}"? This can't be undone.`}
                className="tag text-red-400/80 hover:text-red-400 transition-colors"
              >
                Delete
              </ConfirmSubmit>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
