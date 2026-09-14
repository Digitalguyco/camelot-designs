import Link from "next/link";
import { getAllProducts } from "@/lib/data/products";
import { formatPrice } from "@/lib/format";
import ConfirmSubmit from "@/components/admin/ConfirmSubmit";
import { deleteProduct } from "./actions";

const STATUS_LABEL: Record<string, string> = {
  available: "Available",
  preorder: "Pre-Order",
  "sold-out": "Sold Out",
};

export default async function AdminProductsPage() {
  const items = await getAllProducts();

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-serif text-3xl">Products</h1>
        <Link href="/admin/products/new" className="btn-primary px-5 py-2.5 text-sm tracking-wide">
          New Product
        </Link>
      </div>

      <div className="mt-8 divide-y hairline border-t border-b hairline">
        {items.length === 0 && <p className="py-6 text-ink/60 text-sm">No products yet.</p>}
        {items.map((product) => (
          <div key={product.id} className="flex items-center gap-4 py-4">
            {/* Admin-uploaded content — plain <img>, see ProductForm for why. */}
            <img src={product.images[0]} alt="" className="h-16 w-16 object-cover bg-stone flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-serif text-lg truncate">{product.name}</p>
              <p className="tag text-ink/55 mt-0.5">
                {product.category} · ${formatPrice(product.priceCents)} · {STATUS_LABEL[product.status]}
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
    </div>
  );
}
