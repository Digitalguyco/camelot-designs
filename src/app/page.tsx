import Image from "next/image";
import Link from "next/link";
import { site, stats } from "@/lib/content";
import { getMostRecentProject } from "@/lib/data/projects";
import { getRandomProducts } from "@/lib/data/products";
import Constellation from "@/components/Constellation";
import CountUp from "@/components/CountUp";
import Reveal from "@/components/Reveal";

// Featured projects and the shop teaser come from the database — always
// render fresh (the teaser is also randomized per request, see
// getRandomProducts).
export const dynamic = "force-dynamic";

export default async function Home() {
  const featuredProject = await getMostRecentProject();
  const shopPreview = await getRandomProducts(4);

  return (
    <div>
      {/* Hero — the studio's headline, side by side with the founder's own presence */}
      <section className="mx-auto max-w-6xl px-6 pt-20 sm:pt-28 pb-20">
        <div className="grid gap-12 md:grid-cols-12 md:items-center">
          <Reveal className="md:col-span-7">
            <p className="eyebrow">Interior Design Studio — Nigeria</p>
            <h1 className="font-serif text-4xl sm:text-5xl leading-[1.1] mt-4">
              Sophisticated interiors, <span className="italic">considered slowly.</span>
            </h1>
            <p className="mt-6 text-ink/65 leading-relaxed max-w-lg">{site.tagline}</p>
            <Link href="/contact" className="btn-primary mt-8 inline-block px-7 py-3 text-sm">
              Book a Consultation
            </Link>
          </Reveal>
          <Reveal delay={150} className="md:col-span-5">
            <div className="border border-gold/40 p-3">
              <div className="relative aspect-[3/4] overflow-hidden bg-stone">
                <Image
                  src="/images/team/founder-hero.jpg"
                  alt="Imuetinyan Daniel, Founder and Creative Director of Camelot Designs"
                  fill
                  priority
                  className="object-cover"
                />
              </div>
            </div>
            <p className="tag text-ink/60 mt-3">Imuetinyan Daniel — Founder &amp; Creative Director</p>
          </Reveal>
        </div>
      </section>

      {/* Stats strip */}
      <section className="relative overflow-hidden bg-card py-20 sm:py-28">
        <Constellation />
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <Reveal>
            <h2 className="font-serif text-3xl sm:text-4xl text-gold">Some Interesting Facts</h2>
            <p className="mt-4 text-ink/65 leading-relaxed max-w-xl mx-auto">
              We work with homeowners, or partner with architects, custom home builders, and
              artisans, to explore and discover meaningful solutions for every space we touch.
            </p>
          </Reveal>
        </div>
        <div className="relative mx-auto max-w-6xl px-6 mt-14">
          <div className="grid grid-cols-3 border-y hairline">
            {stats.map((stat, i) => (
              <Reveal key={stat.label} delay={i * 120}>
                <div className={`py-8 text-center ${i > 0 ? "border-l hairline" : ""}`}>
                  <p className="font-serif text-4xl sm:text-5xl">
                    <CountUp value={stat.value} />
                  </p>
                  <p className="tag text-ink/60 mt-2">{stat.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Recent work — one project, given room to breathe rather than a grid */}
      {featuredProject && (
        <section className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
          <Reveal>
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="eyebrow">Portfolio</p>
                <h2 className="font-serif text-3xl mt-2">Recent Work</h2>
              </div>
              <Link href="/portfolio" className="eyebrow hover:text-ink transition-colors">
                View All →
              </Link>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <Link
              href={`/portfolio/${featuredProject.slug}`}
              className="group grid gap-10 md:grid-cols-12 md:items-center"
            >
              <div className="md:col-span-7 relative aspect-[4/3] overflow-hidden">
                {/* Admin-uploaded content — plain <img>, see ProductCard. */}
                <img
                  src={featuredProject.images[0]}
                  alt={featuredProject.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="md:col-span-5">
                <p className="tag text-gold">{featuredProject.projectType}</p>
                <h3 className="font-serif text-3xl mt-2">{featuredProject.name}</h3>
                <p className="mt-2 text-ink/60">{featuredProject.location}</p>
                <p className="mt-4 text-ink/65 leading-relaxed max-w-sm">{featuredProject.scope}</p>
                <p className="eyebrow mt-6 inline-block group-hover:text-ink transition-colors">
                  View Project →
                </p>
              </div>
            </Link>
          </Reveal>
        </section>
      )}

      {/* Closing — two ways forward, side by side */}
      <section className="relative overflow-hidden bg-card border-y hairline py-20 sm:py-28">
        <Constellation />
        <div className="relative mx-auto max-w-6xl px-6 grid gap-14 sm:grid-cols-2 text-center">
          <Reveal>
            <h2 className="font-serif text-3xl sm:text-4xl max-w-sm mx-auto">
              Ready to design your space?
            </h2>
            <Link href="/contact" className="btn-primary mt-8 inline-block px-8 py-3 text-sm">
              Book a Consultation
            </Link>
          </Reveal>
          <Reveal delay={120} className="sm:border-l hairline sm:pl-14">
            {shopPreview.length > 0 && (
              <div className="flex justify-center gap-3 mb-8">
                {shopPreview.map((product, i) => (
                  <Link
                    key={product.id}
                    href={`/shop/${product.slug}`}
                    className={`group block w-16 sm:w-20 shrink-0 border border-gold/40 p-1 transition-transform hover:-translate-y-1 ${
                      i % 2 === 1 ? "translate-y-3" : ""
                    }`}
                  >
                    <div className="relative aspect-square overflow-hidden bg-stone">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                  </Link>
                ))}
              </div>
            )}
            <h2 className="font-serif text-3xl sm:text-4xl max-w-sm mx-auto">
              Shop our collections now
            </h2>
            <Link href="/shop" className="btn-outline mt-8 inline-block px-8 py-3 text-sm">
              Shop All
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
