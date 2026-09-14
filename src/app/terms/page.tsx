import type { Metadata } from "next";
import { site } from "@/lib/content";
import DraftNotice from "@/components/DraftNotice";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  robots: { index: false, follow: true },
};

export default function Terms() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <p className="eyebrow">Legal</p>
      <h1 className="font-serif text-4xl mt-2">Terms &amp; Conditions</h1>
      <p className="tag text-ink/55 mt-2">Last updated: 14 September 2026</p>

      <div className="mt-6">
        <DraftNotice />
      </div>

      <div className="mt-10 space-y-8 text-ink/75 leading-relaxed">
        <section>
          <h2 className="font-serif text-xl text-ink">1. Using this website</h2>
          <p className="mt-2">
            These terms cover your use of this website ({site.url}). By browsing it, submitting
            the contact form, or enquiring about a product, you agree to them. They don't cover
            the terms of an actual design project or product sale with {site.name} — those are
            agreed separately, in writing, once we've spoken with you directly.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-ink">2. No online checkout</h2>
          <p className="mt-2">
            Everything in the Shop is enquiry-based. Clicking "Enquire to Purchase" or "Reserve a
            Pre-Order" sends us a message — it does not create an order, take payment, or form a
            contract of sale. Pricing shown is a guide and may change; product availability
            (in stock, pre-order, sold out) is set by us and can change without notice.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-ink">3. Content and intellectual property</h2>
          <p className="mt-2">
            The text, photography, and design of this site belong to {site.name} unless stated
            otherwise, and are shown here to represent our work — please don't reproduce them
            without asking us first. Journal posts reflect our own opinions and working methods;
            they're not professional advice for your specific project or space.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-ink">4. Accuracy</h2>
          <p className="mt-2">
            We try to keep pricing, availability, and project information accurate and current,
            but we can't guarantee the site is always error-free or fully up to date. If
            something looks wrong, please tell us — {site.email}.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-ink">5. Liability</h2>
          <p className="mt-2">
            This website and its content are provided as-is. To the extent permitted by law, we
            aren't liable for losses arising from your use of the site itself (as distinct from
            any separate written agreement for design or procurement services).
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-ink">6. Governing law</h2>
          <p className="mt-2">
            These terms are governed by the laws of the Federal Republic of Nigeria.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-ink">7. Changes</h2>
          <p className="mt-2">
            We may update these terms from time to time; the date at the top shows when they were
            last revised.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-ink">8. Contact</h2>
          <p className="mt-2">
            {site.name}, {site.address} —{" "}
            <a href={`mailto:${site.email}`} className="text-gold hover:underline">
              {site.email}
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
