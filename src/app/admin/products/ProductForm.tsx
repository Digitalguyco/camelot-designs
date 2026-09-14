"use client";

import { useActionState, useState } from "react";
import type { Product } from "@/lib/data/products";
import type { ProductFormState } from "./actions";

const STATUS_OPTIONS: { value: "available" | "preorder" | "sold-out"; label: string }[] = [
  { value: "available", label: "Available now" },
  { value: "preorder", label: "Pre-order" },
  { value: "sold-out", label: "Sold out" },
];

const initialState: ProductFormState = {};

export default function ProductForm({
  action,
  product,
  submitLabel,
}: {
  action: (prev: ProductFormState, formData: FormData) => Promise<ProductFormState>;
  product?: Product;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const [keepImages, setKeepImages] = useState<string[]>(product?.images ?? []);

  return (
    <form action={formAction} className="space-y-6 max-w-xl">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" name="name" defaultValue={product?.name} required />
        <Field label="Category" name="category" defaultValue={product?.category} required />
        <Field
          label="Price (USD)"
          name="price"
          type="number"
          step="0.01"
          min="0"
          defaultValue={product ? (product.priceCents / 100).toFixed(2) : undefined}
          required
        />
        <Field label="SKU" name="sku" defaultValue={product?.sku} required />
        <Field label="Material" name="material" defaultValue={product?.material} required />
        <Field label="Dimensions" name="dimensions" defaultValue={product?.dimensions} required />
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
  step,
  min,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
  type?: string;
  step?: string;
  min?: string;
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
        step={step}
        min={min}
        defaultValue={defaultValue}
        required={required}
        className="field mt-2 w-full px-4 py-3 text-sm"
      />
    </div>
  );
}
