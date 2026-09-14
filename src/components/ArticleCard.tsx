import Link from "next/link";
import type { Post } from "@/lib/data/posts";

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function ArticleCard({ post, featured = false }: { post: Post; featured?: boolean }) {
  const date = post.publishedAt ?? post.createdAt;

  if (featured) {
    return (
      <Link href={`/blog/${post.slug}`} className="group grid gap-8 sm:grid-cols-5 items-center">
        <div className="relative aspect-[16/10] overflow-hidden bg-stone sm:col-span-3">
          {/* Admin-uploaded content — plain <img>, see ProductCard. */}
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </div>
        <div className="sm:col-span-2">
          <p className="tag text-ink/60">
            {formatDate(date)} · {post.readTime} read
          </p>
          <h3 className="font-serif mt-2 text-3xl leading-tight">{post.title}</h3>
          <p className="mt-3 text-ink/65 leading-relaxed">{post.dek}</p>
          <p className="eyebrow mt-4 inline-block group-hover:text-ink transition-colors">
            Read the story →
          </p>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <div className="relative aspect-[4/3] overflow-hidden bg-stone">
        <img
          src={post.coverImage}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <p className="tag text-ink/60 mt-4">
        {formatDate(date)} · {post.readTime} read
      </p>
      <h3 className="font-serif mt-2 text-xl leading-snug">{post.title}</h3>
      <p className="mt-2 text-ink/65 leading-relaxed">{post.dek}</p>
    </Link>
  );
}
