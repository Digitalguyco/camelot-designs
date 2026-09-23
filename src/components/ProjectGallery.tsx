"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Project } from "@/lib/data/projects";

/**
 * Renders a project's images (a large hero shot next to its details, plus
 * any remaining photos in a grid below) and a shared fullscreen, swipeable
 * viewer — clicking any image opens the viewer at that photo.
 */
export default function ProjectGallery({ project }: { project: Project }) {
  const { images, name, location, projectType, role, scope } = project;
  const [openAt, setOpenAt] = useState<number | null>(null);
  const touchStartX = useRef<number | null>(null);

  const close = useCallback(() => setOpenAt(null), []);
  const prev = useCallback(
    () => setOpenAt((i) => (i === null ? null : (i - 1 + images.length) % images.length)),
    [images.length],
  );
  const next = useCallback(
    () => setOpenAt((i) => (i === null ? null : (i + 1) % images.length)),
    [images.length],
  );

  useEffect(() => {
    if (openAt === null) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [openAt, close, prev, next]);

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 50) (delta > 0 ? prev : next)();
    touchStartX.current = null;
  }

  const details = [
    ["Location", location],
    ["Project Type", projectType],
    ["Our Role", role],
  ] as const;

  return (
    <>
      <div className="mx-auto max-w-6xl px-6 mt-8 grid gap-12 md:grid-cols-2">
        <button
          type="button"
          onClick={() => setOpenAt(0)}
          className="relative aspect-[4/5] overflow-hidden bg-stone cursor-zoom-in"
          aria-label={`View ${name} full screen`}
        >
          {/* Admin-uploaded content — plain <img>, see ProductCard. */}
          <img src={images[0]} alt={name} className="w-full h-full object-cover" />
        </button>

        <div>
          <p className="eyebrow">{projectType}</p>
          <h1 className="font-serif text-3xl sm:text-4xl mt-2">{name}</h1>
          <p className="mt-3 text-ink/65">{location}</p>

          <p className="mt-6 text-ink/70 leading-relaxed max-w-md">{scope}</p>

          <dl className="mt-8 space-y-2 border-t hairline pt-6">
            {details.map(([label, value]) => (
              <div key={label} className="flex justify-between gap-4 text-sm">
                <dt className="tag text-ink/60">{label}</dt>
                <dd className="text-ink/80 text-right">{value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-8">
            <Link href="/contact" className="btn-primary inline-block px-6 py-3 text-sm">
              Start a Project Like This
            </Link>
          </div>
        </div>
      </div>

      {images.length > 1 && (
        <div className="mx-auto max-w-6xl px-6 pb-16">
          <div className="grid gap-4 sm:grid-cols-2">
            {images.slice(1).map((src, i) => (
              <button
                key={src}
                type="button"
                onClick={() => setOpenAt(i + 1)}
                className="relative aspect-[4/3] overflow-hidden bg-stone cursor-zoom-in"
                aria-label={`View photo ${i + 2} of ${name} full screen`}
              >
                <img src={src} alt={name} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}

      {openAt !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${name} — photo ${openAt + 1} of ${images.length}`}
          className="fixed inset-0 z-[100] bg-parchment/97 backdrop-blur-sm flex items-center justify-center"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="absolute right-4 top-4 sm:right-8 sm:top-8 tag text-ink/70 hover:text-gold transition-colors text-2xl leading-none"
          >
            ×
          </button>

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={prev}
                aria-label="Previous photo"
                className="absolute left-2 sm:left-6 tag text-ink/70 hover:text-gold transition-colors text-3xl leading-none px-2 py-4"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Next photo"
                className="absolute right-2 sm:right-6 tag text-ink/70 hover:text-gold transition-colors text-3xl leading-none px-2 py-4"
              >
                ›
              </button>
            </>
          )}

          <img
            src={images[openAt]}
            alt={`${name} — photo ${openAt + 1} of ${images.length}`}
            className="max-h-[85vh] max-w-[90vw] object-contain select-none"
          />

          {images.length > 1 && (
            <p className="tag text-ink/50 absolute bottom-6 left-1/2 -translate-x-1/2">
              {openAt + 1} / {images.length}
            </p>
          )}
        </div>
      )}
    </>
  );
}
