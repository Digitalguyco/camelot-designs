"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { nav, site } from "@/lib/content";

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close the mobile menu whenever navigation happens.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock page scroll and allow Escape to close while the menu is open.
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <>
      {/* Transparent, floating over the page rather than a solid bar — the
          studio's original header had no fill and no border, just the logo
          and nav sitting on the dark ground. */}
      <header className="sticky top-0 z-50 bg-transparent">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4">
          <Link href="/" className="flex shrink-0 items-center gap-3">
            <Image src="/images/brand/monogram.png" alt="" width={40} height={31} priority />
            <span className="font-serif text-base tracking-wide">{site.name}</span>
          </Link>

          <nav className="hidden md:flex items-center gap-7 tag text-ink/80">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-gold transition-colors">
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/contact" className="hidden md:inline-block shrink-0 btn-outline px-4 py-2 text-xs">
              Enquire
            </Link>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
              className="md:hidden relative z-50 flex h-9 w-9 shrink-0 flex-col items-center justify-center gap-[5px]"
            >
              <span
                className={`block h-px w-5 bg-ink transition-transform ${open ? "translate-y-[3px] rotate-45" : ""}`}
              />
              <span
                className={`block h-px w-5 bg-ink transition-transform ${open ? "-translate-y-[3px] -rotate-45" : ""}`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu — a sibling of <header>, not a descendant, so its `fixed`
          positioning resolves against the viewport rather than getting scoped
          to header's box. */}
      <div
        id="mobile-menu"
        className={`md:hidden fixed left-0 right-0 bottom-0 top-[68px] z-40 bg-parchment transition-opacity duration-200 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <nav className="flex h-full flex-col px-6 pt-4 overflow-y-auto">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-serif text-2xl py-4 border-b hairline hover:text-gold transition-colors"
            >
              {item.label}
            </Link>
          ))}

          <div className="mt-auto pb-10 pt-8">
            <Link href="/contact" className="btn-primary block text-center px-6 py-3 text-sm">
              Enquire
            </Link>
            <p className="tag text-ink/60 mt-6">{site.phone}</p>
            <p className="tag text-ink/60 mt-2">{site.email}</p>
          </div>
        </nav>
      </div>
    </>
  );
}
