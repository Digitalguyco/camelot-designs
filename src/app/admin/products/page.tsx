import Link from "next/link";
import { getAllProducts } from "@/lib/data/products";
import { formatNaira, PRICE_ON_REQUEST } from "@/lib/format";
import ConfirmSubmit from "@/components/admin/ConfirmSubmit";
import { deleteProduct } from "./actions";

function priceLabel(cents: number | null) {
  return cents === null ? PRICE_ON_REQUEST : formatNaira(cents);
}

const STATUS_LABEL: Record<string, string> = {
  available: "Available",
  preorder: "Pre-Order",
  "sold-out": "Sold Out",
};

const PAGE_SIZE = 50;

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string }>;
}) {
  const { page: pageParam, q } = await searchParams;
  const query = (q ?? "").trim();
  const all = await getAllProducts();

  const filtered = query
    ? all.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.sku.toLowerCase().includes(query.toLowerCase()),
      )
    : all;

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const page = Math.min(Math.max(1, Number(pageParam) || 1), pageCount);
  const items = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const pageHref = (p: number) => `/admin/products?${new URLSearchParams({ ...(query && { q: query }), page: String(p) })}`;

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-serif text-3xl">Products</h1>
        <Link href="/admin/products/new" className="btn-primary px-5 py-2.5 text-sm tracking-wide">
          New Product
        </Link>
      </div>

      <form className="mt-6 flex gap-3" action="/admin/products">
        <input
          type="search"
          name="q"
          defaultValue={query}
          placeholder="Search by name or SKU…"
          className="field w-full max-w-sm px-4 py-2.5 text-sm"
        />
        <button type="submit" className="btn-outline px-4 py-2.5 text-sm">
          Search
        </button>
      </form>

      <p className="tag text-ink/50 mt-4">
        {filtered.length} {filtered.length === 1 ? "product" : "products"}
        {query && ` matching "${query}"`}
      </p>

      <div className="mt-4 divide-y hairline border-t border-b hairline">
        {items.length === 0 && <p className="py-6 text-ink/60 text-sm">No products found.</p>}
        {items.map((product) => (
          <div key={product.id} className="flex items-center gap-4 py-4">
            {/* Admin-uploaded content — plain <img>, see ProductForm for why. */}
            <img src={product.images[0]} alt="" className="h-16 w-16 object-cover bg-stone flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-serif text-lg truncate">{product.name}</p>
              <p className="tag text-ink/55 mt-0.5">
                {product.sku} · {product.category} · {priceLabel(product.priceCents)} ·{" "}
                {STATUS_LABEL[product.status]}
              </p>
            </div>
            <Link href={`/admin/products/${product.id}`} className="tag text-ink/70 hover:text-gold transition-colors">
              Edit
            </Link>
            <form action={deleteProduct}>
              <input type="hidden" name="id" value={product.id} />
              <ConfirmSubmit
                message={`Delete "${product.name}"? This can't be undone.`}
                className="tag text-red-400/80 hover:text-red-400 transition-colors"
              >
                Delete
              </ConfirmSubmit>
            </form>
          </div>
        ))}
      </div>

      {pageCount > 1 && (
        <div className="mt-8 flex items-center justify-center gap-6">
          <Link
            href={pageHref(Math.max(1, page - 1))}
            aria-disabled={page === 1}
            className={`tag px-4 py-2 border border-ink/25 text-ink/70 transition-colors hover:border-gold hover:text-gold ${
              page === 1 ? "pointer-events-none opacity-30" : ""
            }`}
          >
            ← Prev
          </Link>
          <p className="tag text-ink/60">
            Page {page} of {pageCount}
          </p>
          <Link
            href={pageHref(Math.min(pageCount, page + 1))}
            aria-disabled={page === pageCount}
            className={`tag px-4 py-2 border border-ink/25 text-ink/70 transition-colors hover:border-gold hover:text-gold ${
              page === pageCount ? "pointer-events-none opacity-30" : ""
            }`}
          >
            Next →
          </Link>
        </div>
      )}
    </div>
  );
}
