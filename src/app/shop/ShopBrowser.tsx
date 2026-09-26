"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/lib/data/products";

const PAGE_SIZE = 24;

export default function ShopBrowser({ products }: { products: Product[] }) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const gridTopRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      return !q || p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
    });
  }, [products, query]);

  // Changing the search should always land back on page 1 of the new result set.
  useEffect(() => {
    setPage(1);
  }, [query]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  // Scroll back to the top of the grid on page changes, but not on first
  // mount (there's nothing to scroll away from yet).
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    gridTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [currentPage]);

  return (
    <div>
      <div ref={gridTopRef} className="flex justify-end">
        <label className="relative block w-full sm:w-64">
          <span className="sr-only">Search products</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search…"
            className="field w-full px-4 py-2.5 text-sm"
          />
        </label>
      </div>

      {filtered.length === 0 ? (
        <p className="mt-14 text-ink/60">
          Nothing matches &ldquo;{query}&rdquo; — try a different search.
        </p>
      ) : (
        <>
          <div className="mt-10 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {paged.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>

          {pageCount > 1 && (
            <div className="mt-16 flex items-center justify-center gap-6">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="tag px-4 py-2 border border-ink/25 text-ink/70 transition-colors hover:border-gold hover:text-gold disabled:opacity-30 disabled:hover:border-ink/25 disabled:hover:text-ink/70"
              >
                ← Prev
              </button>
              <p className="tag text-ink/60">
                Page {currentPage} of {pageCount}
              </p>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                disabled={currentPage === pageCount}
                className="tag px-4 py-2 border border-ink/25 text-ink/70 transition-colors hover:border-gold hover:text-gold disabled:opacity-30 disabled:hover:border-ink/25 disabled:hover:text-ink/70"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
