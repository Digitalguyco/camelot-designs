import type { Metadata } from "next";
import { site } from "@/lib/content";
import DraftNotice from "@/components/DraftNotice";

export const metadata: Metadata = {
  title: "Cookies Policy",
  robots: { index: false, follow: true },
};

export default function CookiesPolicy() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <p className="eyebrow">Legal</p>
      <h1 className="font-serif text-4xl mt-2">Cookies Policy</h1>
      <p className="tag text-ink/55 mt-2">Last updated: 14 September 2026</p>

      <div className="mt-6">
        <DraftNotice />
      </div>

      <div className="mt-10 space-y-8 text-ink/75 leading-relaxed">
        <section>
          <h2 className="font-serif text-xl text-ink">What this page covers</h2>
          <p className="mt-2">
            A cookie is a small file a website can ask your browser to store. Here&rsquo;s exactly what
            this site actually uses today — nothing more.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-ink">Cookies we use</h2>
          <table className="mt-2 w-full text-sm">
            <thead>
              <tr className="border-b hairline text-left">
                <th className="py-2 pr-4 tag text-ink/60 font-normal">Cookie</th>
                <th className="py-2 pr-4 tag text-ink/60 font-normal">Purpose</th>
                <th className="py-2 tag text-ink/60 font-normal">Set for</th>
              </tr>
            </thead>
            <tbody className="divide-y hairline">
              <tr>
                <td className="py-2 pr-4">authjs.session-token</td>
                <td className="py-2 pr-4">Keeps a logged-in staff member signed in to /admin.</td>
                <td className="py-2">Staff only, after login</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">authjs.csrf-token</td>
                <td className="py-2 pr-4">Security — prevents forged login requests.</td>
                <td className="py-2">Staff only, on the login page</td>
              </tr>
            </tbody>
          </table>
          <p className="mt-3">
            Both are &ldquo;strictly necessary&rdquo; cookies — the site&rsquo;s admin login
            can&rsquo;t function without them, and under most cookie laws (including
            Nigeria&rsquo;s NDPA and the EU/UK&rsquo;s ePrivacy rules) they don&rsquo;t require
            visitor consent. If you&rsquo;re simply browsing the shop, journal, or contact page,
            none of these cookies are ever set for you.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-ink">What we don&rsquo;t use — yet</h2>
          <p className="mt-2">
            No analytics (e.g. Google Analytics), no advertising or retargeting pixels, and no
            third-party tracking scripts run on this site at present. The small banner you may
            see on your first visit reflects exactly that.
          </p>
          <p className="mt-2">
            If that changes — for instance, if we add analytics to understand how the site is
            used — we&rsquo;ll update this page first and ask for your consent through that same banner
            before anything non-essential loads.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-ink">Managing cookies</h2>
          <p className="mt-2">
            You can clear or block cookies at any time through your browser settings. Doing so
            will simply sign out any admin session in progress — it won&rsquo;t affect your ability to
            browse the public site.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-ink">Questions</h2>
          <p className="mt-2">
            Email{" "}
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
