import type { Metadata } from "next";
import { site } from "@/lib/content";
import { getAllProducts } from "@/lib/data/products";
import ShopBrowser from "./ShopBrowser";

// Product data lives in Postgres and changes from /admin — always render fresh.
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
  const items = await getAllProducts();
  const inStock = items.filter((p) => p.status === "available").length;
  const preorder = items.filter((p) => p.status === "preorder").length;

  const availability =
    `${inStock} of ${items.length} pieces are in stock now` +
    (preorder > 0 ? `, and ${preorder} are open for pre-order` : "") +
    "; sold pieces are shown for reference and return in future runs.";

  return (
    <div>
      <div className="mx-auto max-w-6xl px-6 pt-20 pb-14">
        <p className="eyebrow">Shop</p>
        <h1 className="font-serif text-4xl sm:text-5xl mt-2 max-w-xl">
          Pieces from our studio, made available in limited runs.
        </h1>
        <p className="mt-4 max-w-lg text-ink/65 leading-relaxed">
          Each item is sourced or built the same way we furnish a full project — in small
          batches, from materials we&rsquo;d use ourselves. {availability}
        </p>
      </div>

      <div className="mx-auto max-w-6xl px-6 pb-24">
        <ShopBrowser products={items} />
      </div>
    </div>
  );
}
