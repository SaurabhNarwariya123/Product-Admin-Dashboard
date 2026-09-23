import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchProductById, updateProductById, fetchCategories } from "../lib/api/products";
import { editLocalProduct, getLocalProduct, getEditedFields } from "../lib/localOverrides";
import ProductForm from "../components/ProductForm";

function Loader({ label = "Loading..." }) {
  return (
    <div className="flex items-center justify-center gap-2 py-12 text-gray-500">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
      <span>{label}</span>
    </div>
  );
}

function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center gap-3 py-12 text-center">
      <p className="text-red-600">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="rounded-md bg-gray-900 px-4 py-2 text-sm text-white hover:bg-gray-700"
        >
          Retry
        </button>
      )}
    </div>
  );
}

export default function EditProductPage() {
  const { id } = useParams();
  const numericId = Number(id);
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const controller = new AbortController();
    fetchCategories(controller.signal)
      .then(setCategories)
      .catch(() => {});
    return () => controller.abort();
  }, []);
  const [state, setState] = useState({ product: null, loading: true, error: null });

  useEffect(() => {
    if (numericId < 0) {
      setState({ product: getLocalProduct(numericId), loading: false, error: null });
      return;
    }
    const controller = new AbortController();
    fetchProductById(numericId, controller.signal)
      .then((product) =>
        setState({ product: { ...product, ...getEditedFields(numericId) }, loading: false, error: null })
      )
      .catch((err) => {
        if (err.code === "ERR_CANCELED") return;
        setState({ product: null, loading: false, error: err.message });
      });
    return () => controller.abort();
  }, [numericId]);

  async function handleSubmit(values) {
    if (numericId > 0) {
      await updateProductById(numericId, values);
    }
    editLocalProduct(numericId, values);
    navigate(`/products/${numericId}`);
  }

  if (state.loading) return <Loader />;
  if (state.error) return <ErrorState message={state.error} />;
  if (!state.product) return <ErrorState message="Product not found." />;

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold">Edit product</h1>
      <ProductForm
        initialValues={state.product}
        categories={categories}
        submitLabel="Save changes"
        onSubmit={handleSubmit}
      />
    </div>
  );
}
