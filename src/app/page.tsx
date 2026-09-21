import Image from "next/image";
import Link from "next/link";
import { services, site, stats } from "@/lib/content";
import { getAllProducts } from "@/lib/data/products";
import { getFeaturedProjects } from "@/lib/data/projects";
import ProductCard from "@/components/ProductCard";
import Constellation from "@/components/Constellation";
import CountUp from "@/components/CountUp";
import Reveal from "@/components/Reveal";

// Shop picks and featured projects come from the database — always render fresh.
export const dynamic = "force-dynamic";

export default async function Home() {
  const [allProducts, featuredProjects] = await Promise.all([
    getAllProducts(),
    getFeaturedProjects(3),
  ]);
  const shopPicks = allProducts.filter((p) => p.status !== "sold-out").slice(0, 3);

  return (
    <div>
      {/* Hero — the studio's headline, side by side with the founder's own presence */}
      <section className="mx-auto max-w-6xl px-6 pt-20 sm:pt-28 pb-20">
        <div className="grid gap-12 md:grid-cols-12 md:items-center">
          <Reveal className="md:col-span-7">
            <p className="eyebrow">Interior Design Studio — Lagos</p>
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

      {/* Services — editorial list, not a card grid */}
      <section className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <div className="grid gap-10 md:grid-cols-12">
          <Reveal className="md:col-span-4">
            <p className="eyebrow">What We Offer</p>
            <h2 className="font-serif text-3xl mt-2">Services</h2>
          </Reveal>
          <div className="md:col-span-8 divide-y hairline border-y hairline">
            {services.map((service, i) => (
              <Reveal key={service.title} delay={i * 80} className="block">
                <div className="grid gap-2 sm:grid-cols-3 py-6">
                  <h3 className="font-serif text-xl sm:col-span-1">{service.title}</h3>
                  <p className="text-ink/65 leading-relaxed sm:col-span-2">
                    {service.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Recent work — the studio's own projects, shown alongside the shop */}
      {featuredProjects.length > 0 && (
        <section className="relative overflow-hidden bg-card border-y hairline py-20 sm:py-28">
          <Constellation />
          <div className="relative mx-auto max-w-6xl px-6">
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
            <div className="grid gap-8 sm:grid-cols-3">
              {featuredProjects.map((project, i) => (
                <Reveal key={project.slug} delay={i * 100}>
                  <Link href={`/portfolio/${project.slug}`} className="group block">
                    <div className="relative aspect-[4/5] overflow-hidden">
                      {/* Admin-uploaded content — plain <img>, see ProductCard. */}
                      <img
                        src={project.images[0]}
                        alt={project.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <p className="tag text-ink/60 mt-3">{project.location}</p>
                    <h3 className="font-serif text-lg mt-1">{project.name}</h3>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Shop teaser */}
      {shopPicks.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
          <Reveal>
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="eyebrow">From the Shop</p>
                <h2 className="font-serif text-3xl mt-2">Pieces We&apos;re Sourcing Now</h2>
              </div>
              <Link href="/shop" className="eyebrow hover:text-ink transition-colors">
                Shop All →
              </Link>
            </div>
          </Reveal>
          <div className="grid gap-x-8 gap-y-14 sm:grid-cols-3">
            {shopPicks.map((product, i) => (
              <Reveal key={product.slug} delay={i * 100}>
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* Closing CTA */}
      <section className="mx-auto max-w-6xl px-6 py-24 text-center">
        <Reveal>
          <h2 className="font-serif text-3xl sm:text-4xl max-w-lg mx-auto">
            Ready to start your room?
          </h2>
          <Link
            href="/contact"
            className="btn-outline mt-8 inline-block px-8 py-3 text-sm transition-colors"
          >
            Book a Consultation
          </Link>
        </Reveal>
      </section>
    </div>
  );
}
