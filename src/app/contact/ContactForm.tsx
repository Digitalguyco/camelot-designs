"use client";

import { useActionState } from "react";
import { submitContactForm, type ContactFormState } from "./actions";

const initialState: ContactFormState = {};

export default function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContactForm, initialState);

  if (state.success) {
    return (
      <div className="field px-6 py-8 text-center">
        <p className="font-serif text-xl">Thank you.</p>
        <p className="mt-2 text-sm text-ink/65">
          Your message is in — we&apos;ll be in touch shortly to schedule a consultation.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label className="block tag text-ink/65 mb-1.5" htmlFor="name">
          Name
        </label>
        <input id="name" name="name" type="text" required className="field w-full px-4 py-3" />
      </div>
      <div>
        <label className="block tag text-ink/65 mb-1.5" htmlFor="email">
          Email
        </label>
        <input id="email" name="email" type="email" required className="field w-full px-4 py-3" />
      </div>
      <div>
        <label className="block tag text-ink/65 mb-1.5" htmlFor="phone">
          Phone <span className="text-ink/60">(optional)</span>
        </label>
        <input id="phone" name="phone" type="tel" className="field w-full px-4 py-3" />
      </div>
      <div>
        <label className="block tag text-ink/65 mb-1.5" htmlFor="message">
          Message
        </label>
        <textarea id="message" name="message" rows={5} required className="field w-full px-4 py-3" />
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
        {pending ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}
