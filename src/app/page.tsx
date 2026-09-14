import Image from "next/image";
import Link from "next/link";
import { processSteps, services, site, portfolio, stats } from "@/lib/content";
import { getAllProducts } from "@/lib/data/products";
import { getPublishedPosts } from "@/lib/data/posts";
import ProductCard from "@/components/ProductCard";
import ArticleCard from "@/components/ArticleCard";

// Shop picks and the journal teaser come from Postgres — always render fresh.
export const dynamic = "force-dynamic";

export default async function Home() {
  const [allProducts, allPosts] = await Promise.all([getAllProducts(), getPublishedPosts()]);
  const shopPicks = allProducts.filter((p) => p.status !== "sold-out").slice(0, 3);
  const [latestPost] = allPosts;

  return (
    <div>
      {/* Hero — asymmetric, text against a single deliberate image */}
      <section className="mx-auto max-w-6xl px-6 pt-14 sm:pt-20">
        <div className="grid gap-10 md:grid-cols-12 md:items-end">
          <div className="md:col-span-5">
            <p className="eyebrow">Interior Design Studio — Lagos</p>
            <h1 className="font-serif text-5xl sm:text-6xl leading-[1.05] mt-4">
              Sophisticated interiors, <span className="italic">considered slowly.</span>
            </h1>
            <p className="mt-6 text-ink/65 leading-relaxed max-w-sm">{site.tagline}</p>
            <Link
              href="/contact"
              className="btn-primary mt-8 inline-block px-7 py-3 text-sm tracking-wide"
            >
              Book a Consultation
            </Link>
          </div>
          <div className="md:col-span-7">
            <div className="relative aspect-[4/3]">
              <Image
                src="/images/living-room-1.jpg"
                alt="Living room designed by Camelot Designs, layered textiles and warm neutrals"
                fill
                priority
                className="object-cover"
              />
            </div>
            <p className="tag text-ink/60 mt-3">Fig. 01 — Featured Project, Living Room</p>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="mx-auto max-w-6xl px-6 mt-20 sm:mt-28">
        <div className="grid grid-cols-3 border-y hairline">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`py-8 text-center ${i > 0 ? "border-l hairline" : ""}`}
            >
              <p className="font-serif text-4xl sm:text-5xl">{stat.value}</p>
              <p className="tag text-ink/60 mt-2">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Process — a real, ordered sequence, so numbering earns its place */}
      <section className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
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
      </section>

      {/* Services — editorial list, not a card grid */}
      <section className="mx-auto max-w-6xl px-6 pb-20 sm:pb-28">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="eyebrow">What We Offer</p>
            <h2 className="font-serif text-3xl mt-2">Services</h2>
          </div>
          <div className="md:col-span-8 divide-y hairline border-y hairline">
            {services.map((service) => (
              <div key={service.title} className="grid gap-2 sm:grid-cols-3 py-6">
                <h3 className="font-serif text-xl sm:col-span-1">{service.title}</h3>
                <p className="text-ink/65 leading-relaxed sm:col-span-2">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest work */}
      <section className="bg-card border-y hairline py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="eyebrow">Portfolio</p>
              <h2 className="font-serif text-3xl mt-2">Recent Work</h2>
            </div>
            <Link href="/portfolio" className="eyebrow hover:text-ink transition-colors">
              View All →
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {portfolio.slice(0, 3).map((item) => (
              <div key={item.src} className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Shop teaser */}
      {shopPicks.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="eyebrow">From the Shop</p>
              <h2 className="font-serif text-3xl mt-2">Pieces We&apos;re Sourcing Now</h2>
            </div>
            <Link href="/shop" className="eyebrow hover:text-ink transition-colors">
              Shop All →
            </Link>
          </div>
          <div className="grid gap-x-8 gap-y-14 sm:grid-cols-3">
            {shopPicks.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Journal teaser */}
      {latestPost && (
        <section className="bg-card border-t hairline py-20 sm:py-28">
          <div className="mx-auto max-w-6xl px-6">
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
          </div>
        </section>
      )}

      {/* Closing CTA */}
      <section className="mx-auto max-w-6xl px-6 py-24 text-center">
        <h2 className="font-serif text-3xl sm:text-4xl max-w-lg mx-auto">
          Ready to start your room?
        </h2>
        <Link
          href="/contact"
          className="mt-8 inline-block border border-gold text-gold px-8 py-3 text-sm tracking-wide hover:bg-gold hover:text-card transition-colors"
        >
          Book a Consultation
        </Link>
      </section>
    </div>
  );
}
