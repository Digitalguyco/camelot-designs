import Link from "next/link";
import type { Metadata } from "next";
import { site, categoryToSlug } from "@/lib/content";
import { getCategoryShowcases } from "@/lib/data/products";

// Product data lives in the database and changes from /admin — always render fresh.
export const dynamic = "force-dynamic";

const description =
  "Furniture, lighting, and decor from the Camelot Designs studio, sourced and built in limited runs.";

export const metadata: Metadata = {
  title: "Shop",
  description,
  alternates: { canonical: "/shop" },
  openGraph: { title: `Shop — ${site.name}`, description, url: "/shop" },
};

export default async function Shop() {
  const categories = await getCategoryShowcases();

  return (
    <div>
      <div className="mx-auto max-w-6xl px-6 pt-20 pb-14">
        <p className="eyebrow">Shop</p>
        <h1 className="font-serif text-4xl sm:text-5xl mt-2 max-w-xl">
          Pieces from our studio, made available in limited runs.
        </h1>
        <p className="mt-4 max-w-lg text-ink/65 leading-relaxed">
          Each item is sourced or built the same way we furnish a full project — in small
          batches, from materials we&rsquo;d use ourselves. Choose a category to see what&rsquo;s
          currently available.
        </p>
      </div>

      <div className="mx-auto max-w-6xl px-6 pb-24">
        {categories.length === 0 ? (
          <p className="text-ink/60">Nothing in stock right now — check back soon.</p>
        ) : (
          <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map(({ category, image, count }) => (
              <Link key={category} href={`/shop/category/${categoryToSlug(category)}`} className="group block">
                <div className="relative aspect-[4/5] overflow-hidden bg-stone">
                  <img
                    src={image}
                    alt={category}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="mt-4 flex items-baseline justify-between gap-4">
                  <h2 className="font-serif text-xl">{category}</h2>
                  <p className="tag text-ink/55 whitespace-nowrap">
                    {count} {count === 1 ? "piece" : "pieces"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
