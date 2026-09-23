import { Link } from "react-router-dom";

export default function ProductTable({ products, onDelete }) {
  return (
    <table className="hidden w-full text-left text-sm sm:table">
      <thead className="border-b border-gray-200 text-xs uppercase text-gray-500">
        <tr>
          <th className="py-2 pr-4">Image</th>
          <th className="py-2 pr-4">Title</th>
          <th className="py-2 pr-4">Category</th>
          <th className="py-2 pr-4">Price</th>
          <th className="py-2 pr-4">Rating</th>
          <th className="py-2 pr-4">Stock</th>
          <th className="py-2 pr-4">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {products.map((product) => (
          <tr key={product.id}>
            <td className="py-2 pr-4">
              <img src={product.thumbnail} alt={product.title} className="h-12 w-12 rounded object-cover" />
            </td>
            <td className="py-2 pr-4">
              <Link to={`/products/${product.id}`} className="font-medium text-gray-900 hover:underline">
                {product.title}
              </Link>
            </td>
            <td className="py-2 pr-4 capitalize text-gray-600">{product.category}</td>
            <td className="py-2 pr-4">${product.price}</td>
            <td className="py-2 pr-4">{product.rating}</td>
            <td className="py-2 pr-4">{product.stock}</td>
            <td className="py-2 pr-4">
              <div className="flex gap-3">
                <Link to={`/products/${product.id}/edit`} className="text-blue-600 hover:underline">
                  Edit
                </Link>
                <button onClick={() => onDelete(product)} className="text-red-600 hover:underline">
                  Delete
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
