import { Link } from "react-router-dom";

export default function ProductCard({ product, onDelete }) {
  return (
    <div className="flex gap-3 rounded-lg border border-gray-200 p-3 sm:hidden">
      <img src={product.thumbnail} alt={product.title} className="h-16 w-16 rounded object-cover" />
      <div className="flex-1">
        <Link to={`/products/${product.id}`} className="font-medium text-gray-900 hover:underline">
          {product.title}
        </Link>
        <p className="text-xs capitalize text-gray-500">{product.category}</p>
        <div className="mt-1 flex items-center gap-3 text-sm text-gray-700">
          <span>${product.price}</span>
          <span>{product.rating} ★</span>
          <span>Stock: {product.stock}</span>
        </div>
        <div className="mt-2 flex gap-3 text-sm">
          <Link to={`/products/${product.id}/edit`} className="text-blue-600">
            Edit
          </Link>
          <button onClick={() => onDelete(product)} className="text-red-600">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
