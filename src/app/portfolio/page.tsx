import Image from "next/image";
import type { Metadata } from "next";
import { portfolio, site } from "@/lib/content";

const description = `A selection of recent interior design projects by ${site.name}.`;

export const metadata: Metadata = {
  title: "Portfolio",
  description,
  alternates: { canonical: "/portfolio" },
  openGraph: { title: `Portfolio — ${site.name}`, description, url: "/portfolio" },
};

export default function Portfolio() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-20">
      <p className="eyebrow">Portfolio</p>
      <h1 className="font-serif text-4xl sm:text-5xl mt-2">Selected Projects</h1>
      <p className="mt-4 max-w-xl text-ink/65 leading-relaxed">
        A look at a few of the spaces we&apos;ve helped bring to life.
      </p>

      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {portfolio.map((item, i) => (
          <div key={item.src}>
            <div className="relative aspect-square overflow-hidden">
              <Image
                src={item.src}
                alt={item.alt}
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <p className="tag text-ink/60 mt-3">Fig. {String(i + 3).padStart(2, "0")}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
