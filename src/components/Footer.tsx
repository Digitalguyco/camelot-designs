import Image from "next/image";
import Link from "next/link";
import { legalLinks, site } from "@/lib/content";
import SocialLinks from "@/components/SocialLinks";

export default function Footer() {
  return (
    <footer className="bg-card">
      <div className="mx-auto max-w-6xl px-6 py-16 grid gap-10 sm:grid-cols-4">
        <div className="sm:col-span-2">
          <Link href="/" className="flex items-center">
            <Image src="/images/brand/logo-white.png" alt={site.name} width={180} height={68} />
          </Link>
          <p className="mt-4 max-w-sm text-sm text-ink/70 leading-relaxed">
            We specialize in full-service interior and exterior design, procurement of custom
            furniture, lighting and art procurement and installation.
          </p>
        </div>
        <div className="text-sm">
          <p className="eyebrow mb-3">Call</p>
          <a href={`tel:${site.phone.replace(/[^+\d]/g, "")}`} className="text-ink/70 hover:text-gold transition-colors">
            {site.phone}
          </a>
        </div>
        <div className="text-sm">
          <p className="eyebrow mb-3">Write</p>
          <a href={`mailto:${site.email}`} className="text-ink/70 hover:text-gold transition-colors">
            Send Us An Email
          </a>
        </div>
        <div className="text-sm sm:col-start-3 sm:row-start-2">
          <p className="eyebrow mb-3">Visit</p>
          <p className="text-ink/70">{site.address}</p>
        </div>
        <div className="text-sm sm:col-start-4 sm:row-start-2">
          <p className="eyebrow mb-3">Follow</p>
          <SocialLinks />
        </div>
      </div>
      <div className="border-t hairline py-5">
        <div className="mx-auto max-w-6xl px-6 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-center tag">
          <span>
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </span>
          <span className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1">
            {legalLinks.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-gold transition-colors">
                {link.label}
              </Link>
            ))}
          </span>
        </div>
      </div>
    </footer>
  );
}
