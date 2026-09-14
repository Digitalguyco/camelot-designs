import type { Metadata } from "next";
import { site } from "@/lib/content";
import { getPublishedPosts } from "@/lib/data/posts";
import ArticleCard from "@/components/ArticleCard";

// Posts live in Postgres and change from /admin — always render fresh.
export const dynamic = "force-dynamic";

const description = "Short essays on the decisions behind our projects, from the Camelot Designs studio.";

export const metadata: Metadata = {
  title: "Journal",
  description,
  alternates: { canonical: "/blog" },
  openGraph: { title: `Journal — ${site.name}`, description, url: "/blog" },
};

export default async function Blog() {
  const posts = await getPublishedPosts();
  const [latest, ...rest] = posts;

  return (
    <div>
      <div className="mx-auto max-w-6xl px-6 pt-20 pb-14">
        <p className="eyebrow">Journal</p>
        <h1 className="font-serif text-4xl sm:text-5xl mt-2 max-w-xl">
          Notes from the studio floor.
        </h1>
        <p className="mt-4 max-w-lg text-ink/65 leading-relaxed">
          Short essays on the decisions behind our projects — what we kept, what we cut, and why.
        </p>
      </div>

      {latest ? (
        <div className="mx-auto max-w-6xl px-6 pb-24 space-y-16">
          <ArticleCard post={latest} featured />
          {rest.length > 0 && (
            <>
              <div className="border-t hairline" />
              <div className="grid gap-14 sm:grid-cols-2">
                {rest.map((post) => (
                  <ArticleCard key={post.slug} post={post} />
                ))}
              </div>
            </>
          )}
        </div>
      ) : (
        <p className="mx-auto max-w-6xl px-6 pb-24 text-ink/60">
          Nothing published yet — check back soon.
        </p>
      )}
    </div>
  );
}
