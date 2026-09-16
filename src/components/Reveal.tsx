"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Fades and lifts its children in once they scroll into view. Starts
 * hidden so the reveal is visible at all — the `.reveal` class has a
 * `scripting: none` fallback in globals.css that forces full opacity when
 * JS is unavailable, so content never gets permanently stuck invisible.
 *
 * Renders as a `div` by default; pass `as="li"` etc. when wrapping content
 * that needs a specific parent-child relationship (a list, a table row).
 */
export default function Reveal({
  children,
  className = "",
  delay = 0,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "li";
}) {
  // A generic element ref — IntersectionObserver only needs an Element,
  // regardless of which concrete tag `Tag` renders as.
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      // Polymorphic tag + a single element ref type is a known TS friction
      // point — the cast is safe since every branch is a plain DOM element.
      ref={ref as unknown as React.Ref<HTMLDivElement>}
      className={`reveal transition-all duration-700 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      } ${className}`}
      style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
    >
      {children}
    </Tag>
  );
}
