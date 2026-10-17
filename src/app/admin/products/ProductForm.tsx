"use client";

import { useActionState, useState } from "react";
import { productCategories } from "@/lib/content";
import type { ProductWithVariants } from "@/lib/data/products";
import type { ProductFormState } from "./actions";

const STATUS_OPTIONS: { value: "available" | "preorder" | "sold-out"; label: string }[] = [
  { value: "available", label: "Available now" },
  { value: "preorder", label: "Pre-order" },
  { value: "sold-out", label: "Sold out" },
];

const initialState: ProductFormState = {};

type VariantRow = { key: string; label: string; sku: string; dimensions: string; price: string };

let nextKey = 0;
function emptyVariant(): VariantRow {
  return { key: `new-${nextKey++}`, label: "", sku: "", dimensions: "", price: "" };
}

export default function ProductForm({
  action,
  product,
  submitLabel,
}: {
  action: (prev: ProductFormState, formData: FormData) => Promise<ProductFormState>;
  product?: ProductWithVariants;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const [keepImages, setKeepImages] = useState<string[]>(product?.images ?? []);
  const [variants, setVariants] = useState<VariantRow[]>(
    product && product.variants.length > 0
      ? product.variants.map((v) => ({
          key: v.id,
          label: v.label,
          sku: v.sku,
          dimensions: v.dimensions,
          price: v.priceCents != null ? (v.priceCents / 100).toFixed(2) : "",
        }))
      : [emptyVariant()],
  );

  function updateVariant(key: string, field: keyof Omit<VariantRow, "key">, value: string) {
    setVariants((rows) => rows.map((r) => (r.key === key ? { ...r, [field]: value } : r)));
  }

  return (
    <form action={formAction} className="space-y-6 max-w-xl">
      <input type="hidden" name="variants" value={JSON.stringify(variants)} />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" name="name" defaultValue={product?.name} required />
        <div>
          <label htmlFor="category" className="tag text-ink/60">
            Category
          </label>
          <select
            id="category"
            name="category"
            defaultValue={product?.category ?? productCategories[0]}
            className="field mt-2 w-full px-4 py-3 text-sm"
          >
            {productCategories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <Field label="Material" name="material" defaultValue={product?.material} required />
      </div>

      <div>
        <label htmlFor="status" className="tag text-ink/60">
          Status
        </label>
        <select
          id="status"
          name="status"
          defaultValue={product?.status ?? "available"}
          className="field mt-2 w-full px-4 py-3 text-sm"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="description" className="tag text-ink/60">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={5}
          defaultValue={product?.description}
          required
          className="field mt-2 w-full px-4 py-3 text-sm leading-relaxed"
        />
      </div>

      <div>
        <p className="tag text-ink/60">
          Purchase options — one row per size/variant. Leave Price blank for “Price on Request.”
        </p>
        <div className="mt-3 space-y-4">
          {variants.map((row, i) => (
            <div key={row.key} className="grid grid-cols-[1fr_1fr_1fr_1fr_auto] gap-2 items-end">
              <MiniField
                label="Label"
                value={row.label}
                onChange={(v) => updateVariant(row.key, "label", v)}
                placeholder="Small"
              />
              <MiniField
                label="SKU"
                value={row.sku}
                onChange={(v) => updateVariant(row.key, "sku", v)}
                placeholder="M-001"
              />
              <MiniField
                label="Dimensions"
                value={row.dimensions}
                onChange={(v) => updateVariant(row.key, "dimensions", v)}
                placeholder="24 x 23 x 54 cm"
              />
              <MiniField
                label="Price (₦)"
                value={row.price}
                onChange={(v) => updateVariant(row.key, "price", v)}
                placeholder="326000"
                type="number"
              />
              <button
                type="button"
                onClick={() => setVariants((rows) => rows.filter((r) => r.key !== row.key))}
                disabled={variants.length === 1}
                className="tag text-red-400/80 hover:text-red-400 transition-colors disabled:opacity-30 disabled:hover:text-red-400/80 pb-3"
                aria-label={`Remove variant ${i + 1}`}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setVariants((rows) => [...rows, emptyVariant()])}
          className="btn-outline mt-4 px-4 py-2 text-xs"
        >
          + Add purchase option
        </button>
      </div>

      {product && keepImages.length > 0 && (
        <div>
          <p className="tag text-ink/60">Current images (first is the cover)</p>
          <div className="mt-3 flex flex-wrap gap-3">
            {keepImages.map((src) => (
              <div key={src} className="relative">
                <input type="hidden" name="keepImages" value={src} />
                {/* Uploaded images are user content, not a bundled asset — plain <img> avoids next/image's remote-pattern setup. */}
                <img src={src} alt="" className="h-24 w-24 object-cover bg-stone" />
                <button
                  type="button"
                  onClick={() => setKeepImages((imgs) => imgs.filter((i) => i !== src))}
                  className="absolute -right-2 -top-2 bg-ink text-card w-6 h-6 text-xs"
                  aria-label="Remove image"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <label htmlFor="images" className="tag text-ink/60">
          {product ? "Add more images" : "Images"}
        </label>
        <input
          id="images"
          name="images"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="field mt-2 w-full px-4 py-3 text-sm"
        />
      </div>

      {state.error && <p className="text-sm text-red-400">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="btn-primary px-6 py-3 text-sm tracking-wide disabled:opacity-60"
      >
        {pending ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  defaultValue,
  required,
  type = "text",
}: {
  label: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="tag text-ink/60">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue}
        required={required}
        className="field mt-2 w-full px-4 py-3 text-sm"
      />
    </div>
  );
}

function MiniField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <span className="tag text-ink/50 text-[10px]">{label}</span>
      <input
        type={type}
        step={type === "number" ? "0.01" : undefined}
        min={type === "number" ? "0" : undefined}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="field mt-1 w-full px-3 py-2 text-sm"
      />
    </div>
  );
}
