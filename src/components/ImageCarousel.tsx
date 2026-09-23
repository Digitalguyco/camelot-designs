"use client";

import { useEffect, useRef, useState } from "react";

/**
 * An auto-advancing image carousel — used for a project's non-hero photos,
 * which used to just sit in a static grid. Slides on a timer, pauses on
 * hover/touch, and can be swiped or stepped with the dots/arrows. Clicking
 * the current slide opens the shared fullscreen viewer via `onOpen`.
 */
export default function ImageCarousel({
  images,
  alt,
  onOpen,
}: {
  images: string[];
  alt: string;
  onOpen: (index: number) => void;
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
      className="relative aspect-[16/9] overflow-hidden bg-stone group"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div
        className="flex h-full transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {images.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => onOpen(i)}
            className="relative h-full w-full flex-shrink-0 cursor-zoom-in"
            aria-label={`View photo ${i + 1} of ${images.length} full screen`}
          >
            <img src={src} alt={alt} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>

      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label="Previous photo"
            className="absolute left-2 top-1/2 -translate-y-1/2 tag text-ink/70 hover:text-gold transition-colors text-2xl leading-none px-2 py-3 opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next photo"
            className="absolute right-2 top-1/2 -translate-y-1/2 tag text-ink/70 hover:text-gold transition-colors text-2xl leading-none px-2 py-3 opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
          >
            ›
          </button>

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
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
