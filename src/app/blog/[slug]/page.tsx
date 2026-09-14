import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { site } from "@/lib/content";
import { getPublishedPostBySlug, getPublishedPosts } from "@/lib/data/posts";
import JsonLd from "@/components/JsonLd";

// Posts live in Postgres and change from /admin — always render fresh.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) return { title: "Journal" };

  return {
    title: post.title,
    description: post.dek,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: `${post.title} — ${site.name}`,
      description: post.dek,
      url: `/blog/${post.slug}`,
      images: [post.coverImage],
      publishedTime: (post.publishedAt ?? post.createdAt).toISOString(),
    },
  };
}

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) notFound();

  const allPosts = await getPublishedPosts();
  const more = allPosts.filter((p) => p.slug !== post.slug).slice(0, 2);
  const date = post.publishedAt ?? post.createdAt;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.dek,
    image: [post.coverImage],
    datePublished: date.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: { "@type": "Organization", name: site.name },
    publisher: { "@type": "Organization", name: site.name },
    mainEntityOfPage: `${site.url}/blog/${post.slug}`,
  };

  return (
    <article>
      <JsonLd data={articleJsonLd} />
      <div className="mx-auto max-w-3xl px-6 pt-16">
        <Link href="/blog" className="tag text-ink/60 hover:text-gold transition-colors">
          ← Journal
        </Link>
        <p className="tag text-ink/60 mt-6">
          {formatDate(date)} · {post.readTime} read
        </p>
        <h1 className="font-serif text-4xl sm:text-5xl mt-3 leading-tight">{post.title}</h1>
        <p className="mt-4 text-lg text-ink/65 leading-relaxed">{post.dek}</p>
      </div>

      <div className="relative aspect-[16/9] mt-10 mx-auto max-w-5xl px-6">
        <div className="relative w-full h-full overflow-hidden bg-stone">
          {/* Admin-uploaded content — plain <img>, see ProductCard. */}
          <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
        </div>
      </div>

      <div
        className="prose-editor mx-auto max-w-3xl px-6 py-14 text-lg text-ink/75"
        dangerouslySetInnerHTML={{ __html: post.contentHtml }}
      />

      {more.length > 0 && (
        <div className="border-t hairline">
          <div className="mx-auto max-w-5xl px-6 py-16">
            <p className="eyebrow mb-8">More from the Journal</p>
            <div className="grid gap-10 sm:grid-cols-2">
              {more.map((p) => (
                <Link key={p.slug} href={`/blog/${p.slug}`} className="group block">
                  <div className="relative aspect-[4/3] overflow-hidden bg-stone">
                    <img
                      src={p.coverImage}
                      alt={p.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                  <h3 className="font-serif text-xl mt-4">{p.title}</h3>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
