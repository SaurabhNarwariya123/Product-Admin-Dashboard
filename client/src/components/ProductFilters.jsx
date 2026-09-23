import { useEffect, useState } from "react";

const SORT_OPTIONS = [
  { value: "", label: "Default" },
  { value: "price", label: "Price" },
  { value: "rating", label: "Rating" },
  { value: "title", label: "Title" },
];

const PAGE_SIZES = [10, 20, 50];

export default function ProductFilters({ filters, categories, onChange }) {
  const [searchInput, setSearchInput] = useState(filters.q);
  const [syncedQ, setSyncedQ] = useState(filters.q);
  if (filters.q !== syncedQ) {
    setSyncedQ(filters.q);
    setSearchInput(filters.q);
  }

  const [debouncedSearch, setDebouncedSearch] = useState(searchInput);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchInput), 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const searching = filters.q.trim().length > 0;

  useEffect(() => {
    if (debouncedSearch !== filters.q) {
      onChange({ q: debouncedSearch, page: 1 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
      <div className="min-w-[200px] flex-1">
        <label className="mb-1 block text-xs font-medium text-gray-600">Search</label>
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search products..."
          className="input"
        />
      </div>

      <div className="min-w-[160px]">
        <label className="mb-1 block text-xs font-medium text-gray-600">
          Category {searching && <span className="text-gray-400">(disabled while searching)</span>}
        </label>
        <select
          value={filters.category}
          disabled={searching}
          onChange={(e) => onChange({ category: e.target.value, page: 1 })}
          className="input disabled:bg-gray-100"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="min-w-[140px]">
        <label className="mb-1 block text-xs font-medium text-gray-600">Sort by</label>
        <select
          value={filters.sortBy}
          onChange={(e) => onChange({ sortBy: e.target.value, page: 1 })}
          className="input"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="min-w-[120px]">
        <label className="mb-1 block text-xs font-medium text-gray-600">Order</label>
        <select
          value={filters.order}
          onChange={(e) => onChange({ order: e.target.value })}
          disabled={!filters.sortBy}
          className="input disabled:bg-gray-100"
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      <div className="min-w-[110px]">
        <label className="mb-1 block text-xs font-medium text-gray-600">Page size</label>
        <select
          value={filters.pageSize}
          onChange={(e) => onChange({ pageSize: Number(e.target.value), page: 1 })}
          className="input"
        >
          {PAGE_SIZES.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
