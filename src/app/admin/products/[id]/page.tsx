import { notFound } from "next/navigation";
import { getProductById } from "@/lib/data/products";
import ProductForm from "../ProductForm";
import { updateProduct } from "../actions";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) notFound();

  const boundAction = updateProduct.bind(null, product.id);

  return (
    <div>
      <h1 className="font-serif text-3xl">Edit Product</h1>
      <div className="mt-8">
        <ProductForm action={boundAction} product={product} submitLabel="Save Changes" />
      </div>
    </div>
  );
}
