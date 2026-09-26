"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ImageCarousel from "@/components/ImageCarousel";

/**
 * A product's photo slot — a single static image when there's only one
 * photo, or an auto-advancing carousel when there's more than one (e.g.
 * products merged from several angles/props of the same physical item).
 * Clicking the current photo opens a shared fullscreen, swipeable viewer.
 * Mirrors ProjectGallery's carousel + lightbox pattern.
 */
export default function ProductGallery({
  images,
  alt,
  soldOut,
  preorder,
}: {
  images: string[];
  alt: string;
  soldOut?: boolean;
  preorder?: boolean;
}) {
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

  return (
    <>
      <div className={`relative ${soldOut ? "grayscale opacity-60" : ""}`}>
        <ImageCarousel images={images} alt={alt} aspectClassName="aspect-[4/5]" onOpen={setOpenAt} />
        {soldOut && (
          <span className="absolute left-0 top-4 z-30 bg-ink text-card px-3 py-1 tag">Sold Out</span>
        )}
        {preorder && (
          <span className="absolute left-0 top-4 z-30 bg-gold text-parchment px-3 py-1 tag">
            Pre-Order
          </span>
        )}
      </div>

      {openAt !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${alt} — photo ${openAt + 1} of ${images.length}`}
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
            alt={`${alt} — photo ${openAt + 1} of ${images.length}`}
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
