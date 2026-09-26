import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { site } from "@/lib/content";
import { getProductBySlug } from "@/lib/data/products";
import { formatPriceOrRequest } from "@/lib/format";
import JsonLd from "@/components/JsonLd";

// Product data lives in Postgres and changes from /admin — always render fresh.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Shop" };

  const description = product.description.slice(0, 155);
  return {
    title: product.name,
    description,
    alternates: { canonical: `/shop/${product.slug}` },
    openGraph: {
      title: `${product.name} — ${site.name}`,
      description,
      url: `/shop/${product.slug}`,
      images: product.images,
    },
  };
}

const AVAILABILITY: Record<string, string> = {
  available: "https://schema.org/InStock",
  preorder: "https://schema.org/PreOrder",
  "sold-out": "https://schema.org/OutOfStock",
};

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const specs = [
    ["SKU", product.sku],
    ["Material", product.material],
    ["Dimensions", product.dimensions],
  ] as const;

  const soldOut = product.status === "sold-out";
  const preorder = product.status === "preorder";

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    sku: product.sku,
    image: product.images,
    category: product.category,
    // Omitted entirely (rather than a made-up price) while pricing is
    // still being finalized — an Offer without a real price would be
    // inaccurate structured data.
    ...(product.priceCents !== null && {
      offers: {
        "@type": "Offer",
        priceCurrency: "USD",
        price: (product.priceCents / 100).toFixed(2),
        availability: AVAILABILITY[product.status],
        url: `${site.url}/shop/${product.slug}`,
      },
    }),
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <JsonLd data={productJsonLd} />
      <Link href="/shop" className="tag text-ink/60 hover:text-gold transition-colors">
        ← Back to Shop
      </Link>

      <div className="mt-8 grid gap-12 md:grid-cols-2">
        <div className="relative aspect-[4/5] overflow-hidden bg-stone">
          {/* Admin-uploaded content — plain <img>, see ProductCard. */}
          <img
            src={product.images[0]}
            alt={product.name}
            className={`w-full h-full object-cover ${soldOut ? "grayscale opacity-60" : ""}`}
          />
          {soldOut && (
            <span className="absolute left-0 top-4 bg-ink text-card px-3 py-1 tag">Sold Out</span>
          )}
          {preorder && (
            <span className="absolute left-0 top-4 bg-gold text-parchment px-3 py-1 tag">
              Pre-Order
            </span>
          )}
        </div>

        <div>
          <p className="eyebrow">{product.category}</p>
          <h1 className="font-serif text-3xl sm:text-4xl mt-2">{product.name}</h1>
          <p className="tag text-ink/70 mt-3 text-sm">{formatPriceOrRequest(product.priceCents)}</p>

          <p className="mt-6 text-ink/70 leading-relaxed max-w-md">{product.description}</p>

          <dl className="mt-8 space-y-2 border-t hairline pt-6">
            {specs.map(([label, value]) => (
              <div key={label} className="flex justify-between gap-4 text-sm">
                <dt className="tag text-ink/60">{label}</dt>
                <dd className="text-ink/80 text-right">{value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-8">
            {soldOut ? (
              <div>
                <span className="inline-block bg-stone/40 border hairline px-6 py-3 text-sm text-ink/55 cursor-not-allowed">
                  Currently Sold Out
                </span>
                <p className="mt-3 text-sm text-ink/65">
                  Want to know when this returns?{" "}
                  <Link href="/contact" className="text-gold hover:underline">
                    Join the waitlist
                  </Link>
                  .
                </p>
              </div>
            ) : preorder ? (
              <div>
                <Link
                  href="/contact"
                  className="btn-primary inline-block px-6 py-3 text-sm tracking-wide"
                >
                  Reserve a Pre-Order
                </Link>
                <p className="mt-3 text-sm text-ink/65">
                  Made to order in the next studio run. We&apos;ll confirm the lead time and take a
                  deposit before production begins.
                </p>
              </div>
            ) : (
              <Link href="/contact" className="btn-primary inline-block px-6 py-3 text-sm tracking-wide">
                Enquire to Purchase
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
