export default function Pagination({ page, pageSize, total, onPageChange }) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);
  const pages = getPageWindow(page, totalPages);

  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t border-gray-200 py-4 sm:flex-row">
      <p className="text-sm text-gray-600">
        Showing {from}-{to} of {total}
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm disabled:opacity-40"
        >
          Previous
        </button>
        {pages.map((p, idx) =>
          p === "..." ? (
            <span key={`gap-${idx}`} className="px-2 text-gray-400">
              ...
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`min-w-[2.25rem] rounded-md border px-3 py-1.5 text-sm ${
                p === page ? "border-gray-900 bg-gray-900 text-white" : "border-gray-300 hover:bg-gray-50"
              }`}
            >
              {p}
            </button>
          )
        )}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}

function getPageWindow(current, totalPages, spread = 1) {
  const pages = [];
  const start = Math.max(1, current - spread);
  const end = Math.min(totalPages, current + spread);

  if (start > 1) {
    pages.push(1);
    if (start > 2) pages.push("...");
  }
  for (let p = start; p <= end; p++) pages.push(p);
  if (end < totalPages) {
    if (end < totalPages - 1) pages.push("...");
    pages.push(totalPages);
  }
  return pages;
}
