import Image from "next/image";
import Link from "next/link";
import { processSteps, services, site, portfolio, stats } from "@/lib/content";
import { getAllProducts } from "@/lib/data/products";
import { getPublishedPosts } from "@/lib/data/posts";
import ProductCard from "@/components/ProductCard";
import ArticleCard from "@/components/ArticleCard";
import Constellation from "@/components/Constellation";
import CountUp from "@/components/CountUp";
import Reveal from "@/components/Reveal";

// Shop picks and the journal teaser come from Postgres — always render fresh.
export const dynamic = "force-dynamic";

export default async function Home() {
  const [allProducts, allPosts] = await Promise.all([getAllProducts(), getPublishedPosts()]);
  const shopPicks = allProducts.filter((p) => p.status !== "sold-out").slice(0, 3);
  const [latestPost] = allPosts;

  return (
    <div>
      {/* Hero — the studio's headline, typographic, against the dark ground */}
      <section className="mx-auto max-w-4xl px-6 pt-24 sm:pt-32 pb-16 text-center">
        <Reveal>
          <p className="eyebrow">Interior Design Studio — Lagos</p>
          <h1 className="font-serif text-5xl sm:text-6xl leading-[1.05] mt-4">
            Sophisticated interiors, <span className="italic">considered slowly.</span>
          </h1>
          <p className="mt-6 text-ink/65 leading-relaxed max-w-xl mx-auto">{site.tagline}</p>
          <Link href="/contact" className="btn-primary mt-8 inline-block px-7 py-3 text-sm">
            Book a Consultation
          </Link>
        </Reveal>
      </section>

      {/* Brand banner — the studio's own signature visual */}
      <section className="relative aspect-[16/9] sm:aspect-[21/9]">
        <Image
          src="/images/brand/hero-banner.jpg"
          alt="Camelot Designs — interior design studio"
          fill
          priority
          className="object-cover"
        />
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

      {/* Process — a real, ordered sequence, so numbering earns its place */}
      <section className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <div className="grid gap-10 md:grid-cols-12">
          <Reveal className="md:col-span-4">
            <p className="eyebrow">How We Work</p>
            <h2 className="font-serif text-3xl mt-2">Our Process</h2>
          </Reveal>
          <ol className="md:col-span-8 divide-y hairline border-y hairline">
            {processSteps.map((step, i) => (
              <Reveal
                key={step}
                as="li"
                delay={i * 100}
                className="flex items-baseline gap-6 py-6"
              >
                <span className="tag text-gold">{String(i + 1).padStart(2, "0")}</span>
                <span className="font-serif text-2xl">{step}</span>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Services — editorial list, not a card grid */}
      <section className="mx-auto max-w-6xl px-6 pb-20 sm:pb-28">
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

      {/* Latest work */}
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
          <div className="grid gap-6 sm:grid-cols-3">
            {portfolio.slice(0, 3).map((item, i) => (
              <Reveal key={item.src} delay={i * 100}>
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

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

      {/* Journal teaser */}
      {latestPost && (
        <section className="relative overflow-hidden bg-card border-t hairline py-20 sm:py-28">
          <Constellation />
          <div className="relative mx-auto max-w-6xl px-6">
            <Reveal>
              <div className="flex items-end justify-between mb-10">
                <div>
                  <p className="eyebrow">Journal</p>
                  <h2 className="font-serif text-3xl mt-2">From the Studio Floor</h2>
                </div>
                <Link href="/blog" className="eyebrow hover:text-ink transition-colors">
                  Read More →
                </Link>
              </div>
              <ArticleCard post={latestPost} featured />
            </Reveal>
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
