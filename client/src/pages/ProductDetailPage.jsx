import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchProductById } from "../lib/api/products";
import { getLocalProduct, getEditedFields } from "../lib/localOverrides";

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

export default function ProductDetailPage() {
  const { id } = useParams();
  const numericId = Number(id);
  const [state, setState] = useState({ product: null, loading: true, notFound: false, error: null });

  useEffect(() => {
    if (!Number.isFinite(numericId)) {
      setState({ product: null, loading: false, notFound: true, error: null });
      return;
    }

    if (numericId < 0) {
      const localProduct = getLocalProduct(numericId);
      setState({ product: localProduct, loading: false, notFound: !localProduct, error: null });
      return;
    }

    const controller = new AbortController();
    setState((s) => ({ ...s, loading: true, error: null }));
    fetchProductById(numericId, controller.signal)
      .then((product) => {
        setState({ product: { ...product, ...getEditedFields(numericId) }, loading: false, notFound: false, error: null });
      })
      .catch((err) => {
        if (err.code === "ERR_CANCELED") return;
        if (err.message?.toLowerCase().includes("not found")) {
          setState({ product: null, loading: false, notFound: true, error: null });
        } else {
          setState({ product: null, loading: false, notFound: false, error: err.message });
        }
      });
    return () => controller.abort();
  }, [numericId]);

  if (state.loading) return <Loader />;
  if (state.notFound) return <NotFoundBlock />;
  if (state.error) return <ErrorState message={state.error} />;

  const product = state.product;
  const images = product.images?.length ? product.images : [product.thumbnail];

  return (
    <div className="flex flex-col gap-6">
      <Link to="/products" className="text-sm text-gray-500 hover:underline">
        &larr; Back to products
      </Link>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="flex gap-3 overflow-x-auto">
          {images.map((src, idx) => (
            <img key={idx} src={src} alt={product.title} className="h-48 w-48 shrink-0 rounded-lg object-cover" />
          ))}
        </div>

        <div>
          <h1 className="text-2xl font-semibold">{product.title}</h1>
          <p className="mt-1 text-sm capitalize text-gray-500">
            {product.category} {product.brand && `• ${product.brand}`}
          </p>
          <p className="mt-4 text-xl font-semibold">${product.price}</p>
          <p className="mt-1 text-sm text-gray-600">
            Rating {product.rating} • Stock {product.stock}
          </p>
          <p className="mt-4 text-sm text-gray-700">{product.description}</p>
          <Link
            to={`/products/${product.id}/edit`}
            className="mt-4 inline-block rounded-md bg-gray-900 px-4 py-2 text-sm text-white hover:bg-gray-700"
          >
            Edit product
          </Link>
        </div>
      </div>

      {product.reviews?.length > 0 && (
        <div>
          <h2 className="mb-3 text-lg font-semibold">Reviews</h2>
          <div className="flex flex-col gap-3">
            {product.reviews.map((review, idx) => (
              <div key={idx} className="rounded-lg border border-gray-200 p-3 text-sm">
                <p className="font-medium">
                  {review.reviewerName} • {review.rating}★
                </p>
                <p className="mt-1 text-gray-600">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function NotFoundBlock() {
  return (
    <div className="py-16 text-center">
      <h1 className="text-xl font-semibold">Product not found</h1>
      <p className="mt-2 text-sm text-gray-500">We couldn&apos;t find a product with that id.</p>
      <Link to="/products" className="mt-4 inline-block text-sm text-blue-600 hover:underline">
        Back to products
      </Link>
    </div>
  );
}
