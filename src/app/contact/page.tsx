import Image from "next/image";
import type { Metadata } from "next";
import { site } from "@/lib/content";
import ContactForm, { type EnquiryProduct } from "./ContactForm";
import { getProductBySlug } from "@/lib/data/products";
import SocialLinks from "@/components/SocialLinks";

const description =
  "Get in touch with Camelot Designs to schedule a consultation for your interior design project.";

export const metadata: Metadata = {
  title: "Contact",
  description,
  alternates: { canonical: "/contact" },
  openGraph: { title: `Contact — ${site.name}`, description, url: "/contact" },
};

export default async function Contact({
  searchParams,
}: {
  searchParams: Promise<{ product?: string; option?: string }>;
}) {
  // A shop item's Enquire button links here with ?product=<slug>, which
  // switches the form to a product enquiry with delivery details.
  const { product: slug, option } = await searchParams;
  const found = slug ? await getProductBySlug(slug) : undefined;
  const product: EnquiryProduct | undefined = found && {
    slug: found.slug,
    name: found.name,
    image: found.images[0],
    option: option && found.variants.some((v) => (v.label || v.sku) === option) ? option : "",
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-20">
      <div className="grid gap-14 md:grid-cols-2">
        <div>
          <p className="eyebrow">Contact</p>
          <h1 className="font-serif text-4xl sm:text-5xl mt-2">
            {product ? "Enquire to Purchase" : "Let\u2019s Meet"}
          </h1>
          <p className="mt-4 text-ink/70 max-w-md leading-relaxed">
            {product
              ? "Share your delivery details and we\u2019ll confirm availability, pricing and delivery for this piece."
              : "Tell us a little about your project and we\u2019ll be in touch to schedule a consultation."}
          </p>

          <dl className="mt-8 space-y-4 border-t hairline pt-6 text-sm max-w-xs">
            <div className="flex justify-between gap-4">
              <dt className="tag text-ink/65 shrink-0">Phone</dt>
              <dd className="text-right">{site.phone}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="tag text-ink/65 shrink-0">Email</dt>
              <dd className="text-right break-all">{site.email}</dd>
            </div>
            <div>
              <dt className="tag text-ink/65">Studio</dt>
              <dd className="mt-1 text-ink/80">{site.address}</dd>
            </div>
          </dl>

          <SocialLinks className="mt-6" />

          <div className="relative mt-8 aspect-[4/3] overflow-hidden hidden md:block">
            <Image
              src="/images/lets-meet.jpg"
              alt="Consultation meeting"
              fill
              className="object-cover object-top"
            />
          </div>
        </div>

        <ContactForm product={product} />
      </div>
    </div>
  );
}
