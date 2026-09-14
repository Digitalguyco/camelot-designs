import ProductForm from "../ProductForm";
import { createProduct } from "../actions";

export default function NewProductPage() {
  return (
    <div>
      <h1 className="font-serif text-3xl">New Product</h1>
      <div className="mt-8">
        <ProductForm action={createProduct} submitLabel="Create Product" />
      </div>
    </div>
  );
}
