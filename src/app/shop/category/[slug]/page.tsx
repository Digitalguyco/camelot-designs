import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { site, categoryFromSlug } from "@/lib/content";
import { getProductsByCategory } from "@/lib/data/products";
import ShopBrowser from "../../ShopBrowser";

// Product data lives in the database and changes from /admin — always render fresh.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = categoryFromSlug(slug);
  if (!category) return { title: "Shop" };

  const description = `${category} from the ${site.name} shop.`;
  return {
    title: `${category} — Shop`,
    description,
    alternates: { canonical: `/shop/category/${slug}` },
    openGraph: { title: `${category} — ${site.name}`, description, url: `/shop/category/${slug}` },
  };
}

export default async function ShopCategory({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = categoryFromSlug(slug);
  if (!category) notFound();

  const items = await getProductsByCategory(category);
  if (items.length === 0) notFound();

  return (
    <div>
      <div className="mx-auto max-w-6xl px-6 pt-20 pb-14">
        <Link href="/shop" className="tag text-ink/60 hover:text-gold transition-colors">
          ← All Categories
        </Link>
        <p className="eyebrow mt-6">Shop</p>
        <h1 className="font-serif text-4xl sm:text-5xl mt-2 max-w-xl">{category}</h1>
      </div>

      <div className="mx-auto max-w-6xl px-6 pb-24">
        <ShopBrowser products={items} />
      </div>
    </div>
  );
}
