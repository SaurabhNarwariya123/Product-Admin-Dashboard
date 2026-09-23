import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProduct, fetchCategories } from "../lib/api/products";
import { addLocalProduct } from "../lib/localOverrides";
import ProductForm from "../components/ProductForm";

export default function NewProductPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const controller = new AbortController();
    fetchCategories(controller.signal)
      .then(setCategories)
      .catch(() => {});
    return () => controller.abort();
  }, []);

  async function handleSubmit(values) {
    await createProduct(values);
    addLocalProduct(values);
    navigate("/products");
  }

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold">Add product</h1>
      <ProductForm categories={categories} submitLabel="Create" onSubmit={handleSubmit} />
    </div>
  );
}
