import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { deleteLocalProduct, applyOverrides } from "../lib/localOverrides";
import { deleteProductById, fetchProducts, fetchCategories } from "../lib/api/products";
import ProductFilters from "../components/ProductFilters";
import ProductTable from "../components/ProductTable";
import ProductCard from "../components/ProductCard";
import Pagination from "../components/Pagination";

const PAGE_SIZES = [10, 20, 50];

function Loader({ label = "Loading..." }) {
  return (
    <div className="flex items-center justify-center gap-2 py-12 text-gray-500">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
      <span>{label}</span>
    </div>
  );
}

function EmptyState({ message = "No results found." }) {
  return <div className="py-12 text-center text-gray-500">{message}</div>;
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

function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  onConfirm,
  onCancel,
  loading,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-sm rounded-lg bg-white p-5 shadow-lg">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        {description && <p className="mt-2 text-sm text-gray-600">{description}</p>}
        <div className="mt-5 flex justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="rounded-md bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700 disabled:opacity-60"
          >
            {loading ? "Please wait..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

function parsePositiveInt(value, fallback) {
  const n = parseInt(value, 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

export default function ProductsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const page = parsePositiveInt(searchParams.get("page"), 1);
  const rawPageSize = parsePositiveInt(searchParams.get("pageSize"), 10);
  const pageSize = PAGE_SIZES.includes(rawPageSize) ? rawPageSize : 10;
  const q = searchParams.get("q") || "";
  const category = q ? "" : searchParams.get("category") || "";
  const sortBy = searchParams.get("sortBy") || "";
  const order = searchParams.get("order") || "asc";

  const [refreshKey, setRefreshKey] = useState(0);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const controller = new AbortController();
    fetchCategories(controller.signal)
      .then(setCategories)
      .catch(() => {});
    return () => controller.abort();
  }, []);

  // Products list fetch karo current filters/pagination ke hisaab se, refreshKey change par refetch
  const [productsState, setProductsState] = useState({ products: [], total: 0, loading: true, error: null });
  useEffect(() => {
    const controller = new AbortController();
    setProductsState((prev) => ({ ...prev, loading: true, error: null }));

    fetchProducts({ page, pageSize, q, category, sortBy, order }, controller.signal)
      .then((result) => {
        const merged = applyOverrides(result, { page });
        setProductsState({ products: merged.products, total: merged.total, loading: false, error: null });
      })
      .catch((err) => {
        if (err.code === "ERR_CANCELED" || err.name === "CanceledError") return;
        setProductsState({ products: [], total: 0, loading: false, error: err.message });
      });

    return () => controller.abort();
  }, [page, pageSize, q, category, sortBy, order, refreshKey]);
  const { products, total, loading, error } = productsState;

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  function updateParams(patch) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(patch).forEach(([key, value]) => {
      if (value === "" || value === undefined || value === null) {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });
    navigate(`/products?${params.toString()}`);
  }

  useEffect(() => {
    if (!loading && !error && total > 0 && page > totalPages) {
      updateParams({ page: totalPages });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, error, page, totalPages, total]);

  async function handleConfirmDelete() {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      if (pendingDelete.id > 0) {
        await deleteProductById(pendingDelete.id);
      }
      deleteLocalProduct(pendingDelete.id);
      setPendingDelete(null);
      setRefreshKey((k) => k + 1);
    } catch {
      setPendingDelete(null);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Products</h1>
        <Link
          to="/products/new"
          className="rounded-md bg-gray-900 px-4 py-2 text-sm text-white hover:bg-gray-700"
        >
          Add product
        </Link>
      </div>

      <ProductFilters filters={{ q, category, sortBy, order, pageSize }} categories={categories} onChange={updateParams} />

      {loading && <Loader />}
      {!loading && error && <ErrorState message={error} onRetry={() => setRefreshKey((k) => k + 1)} />}
      {!loading && !error && products.length === 0 && <EmptyState message="No products found." />}

      {!loading && !error && products.length > 0 && (
        <>
          <div className="overflow-x-auto rounded-lg border border-gray-200 p-3">
            <ProductTable products={products} onDelete={setPendingDelete} />
          </div>
          <div className="flex flex-col gap-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} onDelete={setPendingDelete} />
            ))}
          </div>
          <Pagination page={page} pageSize={pageSize} total={total} onPageChange={(p) => updateParams({ page: p })} />
        </>
      )}

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete product"
        description={pendingDelete ? `Delete "${pendingDelete.title}"? This cannot be undone.` : ""}
        confirmLabel="Delete"
        loading={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
