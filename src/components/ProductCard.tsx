import Link from "next/link";
import type { Product } from "@/lib/data/products";
import { formatPrice } from "@/lib/format";

// Available pieces carry no label — only pre-order and sold-out are flagged.
const STATUS_BADGE: Record<"preorder" | "sold-out", { label: string; className: string }> = {
  preorder: { label: "Pre-Order", className: "bg-gold text-parchment" },
  "sold-out": { label: "Sold Out", className: "bg-ink text-card" },
};

export default function ProductCard({ product }: { product: Product }) {
  const badge = product.status !== "available" ? STATUS_BADGE[product.status] : null;
  const soldOut = product.status === "sold-out";

  return (
    <Link href={`/shop/${product.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden bg-stone">
        {/* Admin-uploaded content — plain <img>, not next/image (see /admin/products/ProductForm). */}
        <img
          src={product.images[0]}
          alt={product.name}
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03] ${
            soldOut ? "grayscale opacity-60" : ""
          }`}
        />
        {badge && (
          <span className={`absolute left-0 top-4 px-3 py-1 tag ${badge.className}`}>
            {badge.label}
          </span>
        )}
      </div>
      <div className="mt-4 flex items-baseline justify-between gap-4">
        <div>
          <p className="eyebrow">{product.category}</p>
          <h3 className="font-serif text-lg mt-0.5">{product.name}</h3>
        </div>
        <p className="tag text-ink/70 whitespace-nowrap">${formatPrice(product.priceCents)}</p>
      </div>
    </Link>
  );
}
