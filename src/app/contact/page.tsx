import Image from "next/image";
import type { Metadata } from "next";
import { site } from "@/lib/content";
import ContactForm from "./ContactForm";
import SocialLinks from "@/components/SocialLinks";

const description =
  "Get in touch with Camelot Designs to schedule a consultation for your interior design project.";

export const metadata: Metadata = {
  title: "Contact",
  description,
  alternates: { canonical: "/contact" },
  openGraph: { title: `Contact — ${site.name}`, description, url: "/contact" },
};

export default function Contact() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-20">
      <div className="grid gap-14 md:grid-cols-2">
        <div>
          <p className="eyebrow">Contact</p>
          <h1 className="font-serif text-4xl sm:text-5xl mt-2">Let&apos;s Meet</h1>
          <p className="mt-4 text-ink/70 max-w-md leading-relaxed">
            Tell us a little about your project and we&apos;ll be in touch to schedule a
            consultation.
          </p>

          <dl className="mt-8 space-y-2 border-t hairline pt-6 text-sm max-w-xs">
            <div className="flex justify-between">
              <dt className="tag text-ink/65">Phone</dt>
              <dd>{site.phone}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="tag text-ink/65">Email</dt>
              <dd>{site.email}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="tag text-ink/65">Studio</dt>
              <dd>{site.address}</dd>
            </div>
          </dl>

          <SocialLinks className="mt-6" />

          <div className="relative mt-8 aspect-[4/3] overflow-hidden hidden md:block">
            <Image src="/images/lets-meet.jpg" alt="Consultation meeting" fill className="object-cover" />
          </div>
        </div>

        <ContactForm />
      </div>
    </div>
  );
}
