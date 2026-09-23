"use client";

import { useEffect, useRef, useState } from "react";

/**
 * An auto-advancing image carousel — this IS a project's main photo slot
 * (sitting where a single static hero image used to), not a separate
 * section; it just cycles through every photo on its own when there's
 * more than one. Pauses on hover/touch, swipeable, dots/arrows on hover.
 * Clicking the current slide opens the shared fullscreen viewer via
 * `onOpen`.
 *
 * Slides are absolutely positioned (inset-0) and cross-fade rather than
 * sliding via a flexbox + percentage-height track — percentage heights
 * inside an aspect-ratio box don't reliably resolve through nested flex
 * children across browsers, which let real (differently-sized) uploaded
 * photos render at their native size instead of the cropped box. inset-0
 * ties every slide directly to the parent's actual rendered dimensions,
 * so this holds regardless of each photo's own size.
 */
export default function ImageCarousel({
  images,
  alt,
  onOpen,
  aspectClassName = "aspect-[16/9]",
}: {
  images: string[];
  alt: string;
  onOpen: (index: number) => void;
  /** e.g. "aspect-[4/5]" to match a portrait hero slot. */
  aspectClassName?: string;
}) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const goTo = (i: number) => setCurrent((i + images.length) % images.length);
  const prev = () => goTo(current - 1);
  const next = () => goTo(current + 1);

  useEffect(() => {
    if (images.length <= 1 || paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const id = setInterval(() => setCurrent((i) => (i + 1) % images.length), 4500);
    return () => clearInterval(id);
  }, [images.length, paused, current]);

  function onTouchStart(e: React.TouchEvent) {
    setPaused(true);
    touchStartX.current = e.touches[0].clientX;
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current !== null) {
      const delta = e.changedTouches[0].clientX - touchStartX.current;
      if (Math.abs(delta) > 40) (delta > 0 ? prev : next)();
    }
    touchStartX.current = null;
  }

  return (
    <div
      className={`relative overflow-hidden bg-stone group ${aspectClassName}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {images.map((src, i) => (
        <button
          key={src}
          type="button"
          onClick={() => onOpen(current)}
          className={`absolute inset-0 cursor-zoom-in transition-opacity duration-700 ease-out ${
            i === current ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
          aria-hidden={i !== current}
          tabIndex={i === current ? 0 : -1}
          aria-label={`View photo ${i + 1} of ${images.length} full screen`}
        >
          <img src={src} alt={alt} className="absolute inset-0 h-full w-full object-cover" />
        </button>
      ))}

      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label="Previous photo"
            className="absolute z-20 left-2 top-1/2 -translate-y-1/2 tag text-ink/70 hover:text-gold transition-colors text-2xl leading-none px-2 py-3 opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next photo"
            className="absolute z-20 right-2 top-1/2 -translate-y-1/2 tag text-ink/70 hover:text-gold transition-colors text-2xl leading-none px-2 py-3 opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
          >
            ›
          </button>

          <div className="absolute z-20 bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((src, i) => (
              <button
                key={src}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to photo ${i + 1}`}
                aria-current={i === current}
                className={`h-1.5 w-1.5 rounded-full transition-colors ${
                  i === current ? "bg-gold" : "bg-ink/40 hover:bg-ink/70"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
