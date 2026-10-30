"use client";

import { useState } from "react";
import Link from "next/link";
import type { ProductVariant } from "@/lib/data/products";
import Price from "@/components/Price";

export default function VariantPicker({
  slug,
  variants,
  material,
  status,
}: {
  slug: string;
  variants: ProductVariant[];
  material: string;
  status: "available" | "preorder" | "sold-out";
}) {
  const [selectedId, setSelectedId] = useState(variants[0]?.id);
  const selected = variants.find((v) => v.id === selectedId) ?? variants[0];

  // Opens the contact page's product-enquiry form (delivery details) for
  // this piece and the option currently selected.
  const option = variants.length > 1 ? selected.label || selected.sku : "";
  const enquireHref = `/contact?${new URLSearchParams({ product: slug, ...(option && { option }) })}`;

  const soldOut = status === "sold-out";
  const preorder = status === "preorder";

  const specs = [
    ["SKU", selected.sku],
    ["Material", material],
    ["Dimensions", selected.dimensions],
  ] as const;

  return (
    <div>
      <p className="tag text-ink/70 mt-3 text-sm">
        <Price cents={selected.priceCents} />
      </p>

      {variants.length > 1 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {variants.map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => setSelectedId(v.id)}
              aria-pressed={v.id === selected.id}
              className={`tag px-4 py-2 border transition-colors ${
                v.id === selected.id
                  ? "border-gold bg-gold text-parchment"
                  : "border-ink/25 text-ink/70 hover:border-gold hover:text-gold"
              }`}
            >
              {v.label || v.sku}
            </button>
          ))}
        </div>
      )}

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
              <Link href={enquireHref} className="text-gold hover:underline">
                Join the waitlist
              </Link>
              .
            </p>
          </div>
        ) : preorder ? (
          <div>
            <Link href={enquireHref} className="btn-primary inline-block px-6 py-3 text-sm tracking-wide">
              Reserve a Pre-Order
            </Link>
            <p className="mt-3 text-sm text-ink/65">
              Made to order in the next studio run. We&apos;ll confirm the lead time and take a
              deposit before production begins.
            </p>
          </div>
        ) : (
          <Link href={enquireHref} className="btn-primary inline-block px-6 py-3 text-sm tracking-wide">
            Enquire to Purchase
          </Link>
        )}
      </div>
    </div>
  );
}
