import Image from "next/image";
import Link from "next/link";
import { legalLinks, nav, site } from "@/lib/content";
import SocialLinks from "@/components/SocialLinks";

export default function Footer() {
  return (
    <footer className="border-t hairline bg-parchment">
      <div className="mx-auto max-w-6xl px-6 py-16 grid gap-10 sm:grid-cols-4">
        <div className="sm:col-span-2">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/images/monogram-ink.png" alt="" width={28} height={29} className="invert" />
            <span className="font-serif text-lg">{site.name}</span>
          </Link>
          <p className="mt-3 max-w-sm text-sm text-ink/70 leading-relaxed">{site.tagline}</p>
        </div>
        <div className="text-sm">
          <p className="eyebrow mb-3">Studio</p>
          <ul className="space-y-2 text-ink/70">
            {nav.slice(1).map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-gold transition-colors">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="text-sm">
          <p className="eyebrow mb-3">Contact</p>
          <ul className="space-y-2 text-ink/70">
            <li>{site.phone}</li>
            <li>{site.email}</li>
            <li>{site.address}</li>
          </ul>
          <SocialLinks className="mt-4" />
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
