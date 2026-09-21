import type { Metadata } from "next";
import { Jost } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import CookieBanner from "@/components/CookieBanner";
import { site } from "@/lib/content";
import "./globals.css";

// One typeface, three weights — mirrors the studio's original site, which
// used a single family (FuturaLT) cut into Book/Light/Heavy/Bold statics for
// body, links, and headings respectively. Jost is a free geometric sans in
// the same spirit (it's explicitly modeled on Futura's proportions).
const jostBody = Jost({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400"],
  style: ["normal", "italic"],
});

const jostHeading = Jost({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["600", "700"],
});

const jostLabel = Jost({
  variable: "--font-label",
  subsets: ["latin"],
  weight: ["500"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.name, template: `%s — ${site.name}` },
  description: site.tagline,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: site.name,
    title: site.name,
    description: site.tagline,
    url: "/",
    images: ["/images/team/founder-hero.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: site.name,
    description: site.tagline,
    images: ["/images/team/founder-hero.jpg"],
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: site.name,
  description: site.tagline,
  url: site.url,
  telephone: site.phone,
  email: site.email,
  // Structured to match site.address (src/lib/content.ts) — update both together.
  address: {
    "@type": "PostalAddress",
    streetAddress: "332 Close, Banana Island, Ikoyi",
    addressLocality: "Lagos",
    addressCountry: "NG",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${jostBody.variable} ${jostHeading.variable} ${jostLabel.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col overflow-x-hidden font-sans bg-parchment text-ink">
        <JsonLd data={organizationJsonLd} />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-gold focus:text-parchment focus:px-4 focus:py-2 focus:text-sm"
        >
          Skip to content
        </a>
        <Header />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
        <CookieBanner />
      </body>
    </html>
  );
}
