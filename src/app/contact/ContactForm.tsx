"use client";

import { useActionState } from "react";
import { submitContactForm, type ContactFormState } from "./actions";

const initialState: ContactFormState = {};

/** The piece being enquired about, when the form is opened from a shop item. */
export type EnquiryProduct = { slug: string; name: string; image?: string; option: string };

function Field({
  id,
  label,
  optional,
  ...input
}: { id: string; label: string; optional?: boolean } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="block tag text-ink/65 mb-1.5" htmlFor={id}>
        {label} {optional && <span className="text-ink/60">(optional)</span>}
      </label>
      <input id={id} name={id} required={!optional} className="field w-full px-4 py-3" {...input} />
    </div>
  );
}

export default function ContactForm({ product }: { product?: EnquiryProduct }) {
  const [state, formAction, pending] = useActionState(submitContactForm, initialState);

  if (state.success) {
    return (
      <div className="field px-6 py-8 text-center">
        {product ? (
          <>
            <p className="font-serif text-xl">Thank you for your interest in this piece! ❤️</p>
            <p className="mt-2 text-sm text-ink/65">
              We&rsquo;re excited to help you bring something special into your space. We&rsquo;ve
              received your enquiry and will be in touch shortly.
            </p>
          </>
        ) : (
          <>
            <p className="font-serif text-xl">We&rsquo;d love to hear about your project! ❤️</p>
            <p className="mt-2 text-sm text-ink/65">
              Thank you for choosing Camelot Designs. We&rsquo;ve received your consultation request
              and will be in touch shortly to discuss your vision.
            </p>
          </>
        )}
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      {product && (
        <>
          <input type="hidden" name="product" value={product.slug} />
          <input type="hidden" name="option" value={product.option} />
          <div className="field flex items-center gap-4 p-3">
            {product.image && (
              <img src={product.image} alt="" className="h-16 w-16 shrink-0 object-cover" />
            )}
            <div className="min-w-0">
              <p className="tag text-ink/60">Enquiring about</p>
              <p className="font-serif text-lg leading-snug">{product.name}</p>
              {product.option && <p className="text-sm text-ink/65">{product.option}</p>}
            </div>
          </div>
        </>
      )}

      <Field id="name" label="Name" type="text" autoComplete="name" />
      <Field id="email" label="Email" type="email" autoComplete="email" />
      <Field id="phone" label="Phone" type="tel" autoComplete="tel" optional={!product} />

      {product && (
        <>
          <Field id="quantity" label="Quantity" type="number" min={1} defaultValue={1} />
          <p className="eyebrow pt-2">Delivery details</p>
          <Field id="address" label="Delivery address" type="text" autoComplete="street-address" />
          <div className="grid gap-5 sm:grid-cols-2">
            <Field id="city" label="City" type="text" autoComplete="address-level2" />
            <Field id="state" label="State / Region" type="text" autoComplete="address-level1" />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field id="postalCode" label="Postal / ZIP code" type="text" autoComplete="postal-code" optional />
            <Field id="country" label="Country" type="text" autoComplete="country-name" defaultValue="Nigeria" />
          </div>
        </>
      )}

      <div>
        <label className="block tag text-ink/65 mb-1.5" htmlFor="message">
          {product ? "Notes" : "Message"}{" "}
          {product && <span className="text-ink/60">(optional)</span>}
        </label>
        <textarea
          id="message"
          name="message"
          rows={product ? 3 : 5}
          required={!product}
          className="field w-full px-4 py-3"
        />
      </div>

      {state.error && <p className="text-sm text-red-400">{state.error}</p>}

      <p className="text-xs text-ink/55 leading-relaxed">
        By sending this, you agree we can use these details to respond to your enquiry — see our{" "}
        <a href="/privacy" className="text-gold hover:underline">
          Privacy Policy
        </a>
        .
      </p>

      <button
        type="submit"
        disabled={pending}
        className="btn-primary px-8 py-3 text-sm tracking-wide disabled:opacity-60"
      >
        {pending ? "Sending…" : product ? "Send Enquiry" : "Send Message"}
      </button>
    </form>
  );
}
