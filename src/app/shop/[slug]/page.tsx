import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { site } from "@/lib/content";
import { getProductBySlug } from "@/lib/data/products";
import { startingPriceCents } from "@/lib/pricing";
import JsonLd from "@/components/JsonLd";
import ProductGallery from "@/components/ProductGallery";
import VariantPicker from "@/components/VariantPicker";

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

  const soldOut = product.status === "sold-out";
  const preorder = product.status === "preorder";
  const startingCents = startingPriceCents(product);

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    sku: product.variants[0]?.sku,
    image: product.images,
    category: product.category,
    // Omitted entirely (rather than a made-up price) while pricing is
    // still being finalized — an Offer without a real price would be
    // inaccurate structured data.
    ...(startingCents !== null && {
      offers: product.variants.map((v) => ({
        "@type": "Offer",
        sku: v.sku,
        priceCurrency: "NGN",
        price: v.priceCents !== null ? (v.priceCents / 100).toFixed(2) : undefined,
        availability: AVAILABILITY[product.status],
        url: `${site.url}/shop/${product.slug}`,
      })),
    }),
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <JsonLd data={productJsonLd} />
      <Link href="/shop" className="tag text-ink/60 hover:text-gold transition-colors">
        ← Back to Shop
      </Link>

      <div className="mt-8 grid gap-12 md:grid-cols-2">
        <ProductGallery
          images={product.images}
          alt={product.name}
          soldOut={soldOut}
          preorder={preorder}
        />

        <div>
          <p className="eyebrow">{product.category}</p>
          <h1 className="font-serif text-3xl sm:text-4xl mt-2">{product.name}</h1>

          <p className="mt-6 text-ink/70 leading-relaxed max-w-md">{product.description}</p>

          <VariantPicker slug={product.slug} variants={product.variants} material={product.material} status={product.status} />
        </div>
      </div>
    </div>
  );
}
