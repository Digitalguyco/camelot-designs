import type { Metadata } from "next";
import { site } from "@/lib/content";
import DraftNotice from "@/components/DraftNotice";

export const metadata: Metadata = {
  title: "Privacy Policy",
  robots: { index: false, follow: true },
};

export default function PrivacyPolicy() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <p className="eyebrow">Legal</p>
      <h1 className="font-serif text-4xl mt-2">Privacy Policy</h1>
      <p className="tag text-ink/55 mt-2">Last updated: 14 September 2026</p>

      <div className="mt-6">
        <DraftNotice />
      </div>

      <div className="mt-10 space-y-8 text-ink/75 leading-relaxed">
        <section>
          <h2 className="font-serif text-xl text-ink">1. Who we are</h2>
          <p className="mt-2">
            {site.name} (&ldquo;we&rdquo;, &ldquo;us&rdquo;) is an interior design and procurement studio based at{" "}
            {site.address}. This policy explains what personal information this website
            collects, why, and what you can do about it. You can reach us at{" "}
            <a href={`mailto:${site.email}`} className="text-gold hover:underline">
              {site.email}
            </a>{" "}
            with any privacy question or request.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-ink">2. What we collect</h2>
          <p className="mt-2">This site collects personal information in one place only:</p>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>
              <strong className="text-ink">The contact form.</strong> When you send an enquiry we
              store your name, email address, phone number (if you give one), and your message.
            </li>
          </ul>
          <p className="mt-2">
            There is no online checkout on this site. &ldquo;Enquire to Purchase&rdquo; and
            &ldquo;Reserve a Pre-Order&rdquo; both route through this same contact form — no
            payment or card details are collected here.
          </p>
          <p className="mt-2">
            We don&rsquo;t run analytics, advertising, or tracking scripts on this site at
            present, and we don&rsquo;t buy, sell, or share your information with third parties
            for marketing.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-ink">3. Cookies</h2>
          <p className="mt-2">
            The public site does not set any cookies for ordinary visitors. The only cookies this
            site uses are strictly necessary ones that keep our staff logged in when they manage
            the site through the admin area — they&rsquo;re never set for a visitor browsing the shop,
            journal, or contact page. See our{" "}
            <a href="/cookies" className="text-gold hover:underline">
              Cookies Policy
            </a>{" "}
            for details.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-ink">4. Why we use your information</h2>
          <p className="mt-2">
            Solely to read, respond to, and follow up on the enquiry you sent us — to talk to you
            about a project, a product, or a question. We keep enquiry records for as long as is
            reasonably useful for that purpose, then delete them at our discretion.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-ink">5. Your rights</h2>
          <p className="mt-2">
            You can ask us at any time what information we hold about you, ask us to correct it,
            or ask us to delete it. Email {site.email} and we&rsquo;ll handle it directly — we
            don&rsquo;t yet have an automated self-service tool for this, so requests are handled
            by a person.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-ink">6. Governing law</h2>
          <p className="mt-2">
            This policy is intended to be read alongside the Nigeria Data Protection Act 2023 and
            regulations issued by the Nigeria Data Protection Commission. If you&rsquo;re contacting us
            from outside Nigeria, other data protection laws (such as the EU/UK GDPR) may also
            give you rights — the same contact above applies.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-ink">7. Changes</h2>
          <p className="mt-2">
            If what we collect or how we use it changes — for example, if we add analytics or
            marketing cookies — we&rsquo;ll update this page and the date at the top, and where the law
            requires it, ask for your consent first via a cookie banner.
          </p>
        </section>
      </div>
    </div>
  );
}
