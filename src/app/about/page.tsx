import Image from "next/image";
import type { Metadata } from "next";
import { processSteps, site } from "@/lib/content";

const description = `Learn about ${site.name}, a Lagos-based interior design and procurement studio established in 2015.`;

export const metadata: Metadata = {
  title: "About",
  description,
  alternates: { canonical: "/about" },
  openGraph: { title: `About — ${site.name}`, description, url: "/about" },
};

export default function About() {
  return (
    <div>
      <div className="mx-auto max-w-6xl px-6 pt-20 pb-16">
        <div className="grid gap-12 md:grid-cols-2 items-center">
          <div>
            <p className="eyebrow">About Us</p>
            <h1 className="font-serif text-4xl sm:text-5xl mt-2">Our Story</h1>
            <p className="mt-6 text-ink/70 leading-relaxed">{site.tagline}</p>
            <p className="mt-4 text-ink/70 leading-relaxed">
              We believe a home should feel as considered as it looks. Our approach pairs
              close listening with an eye for proportion, texture, and light — translating
              the way you actually live into rooms you love coming home to.
            </p>
            <p className="mt-4 text-ink/70 leading-relaxed">
              From first sketch to final styling, every project is handled by a small,
              hands-on team who treat your home like our own.
            </p>
          </div>
          <div>
            <div className="relative aspect-[4/5] overflow-hidden bg-card">
              <Image
                src="/images/hero.png"
                alt="Founder of Camelot Designs"
                fill
                className="object-cover"
              />
            </div>
            <p className="tag text-ink/60 mt-3">Fig. 02 — Principal Designer</p>
          </div>
        </div>
      </div>

      <div className="border-t hairline">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="grid gap-10 md:grid-cols-12">
            <div className="md:col-span-4">
              <p className="eyebrow">How We Work</p>
              <h2 className="font-serif text-3xl mt-2">Our Process</h2>
            </div>
            <ol className="md:col-span-8 divide-y hairline border-y hairline">
              {processSteps.map((step, i) => (
                <li key={step} className="flex items-baseline gap-6 py-6">
                  <span className="tag text-gold">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-serif text-2xl">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
