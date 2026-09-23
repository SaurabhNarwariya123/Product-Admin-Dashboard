import { useState } from "react";

export default function ProductForm({ initialValues, categories, submitLabel = "Save", onSubmit }) {
  const [values, setValues] = useState({
    title: initialValues?.title || "",
    description: initialValues?.description || "",
    category: initialValues?.category || "",
    price: initialValues?.price ?? "",
    stock: initialValues?.stock ?? "",
    brand: initialValues?.brand || "",
    thumbnail: initialValues?.thumbnail || "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  function handleChange(field, value) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  function validate() {
    const nextErrors = {};
    if (values.title.trim().length < 3) nextErrors.title = "Title must be at least 3 characters.";
    if (values.description.trim().length < 10)
      nextErrors.description = "Description must be at least 10 characters.";
    if (!values.category) nextErrors.category = "Category is required.";
    if (!(Number(values.price) > 0)) nextErrors.price = "Price must be greater than 0.";
    if (!(Number.isInteger(Number(values.stock)) && Number(values.stock) >= 0))
      nextErrors.stock = "Stock must be a non-negative whole number.";
    if (!/^https?:\/\/.+/.test(values.thumbnail)) nextErrors.thumbnail = "Enter a valid image URL.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (submitting) return;
    if (!validate()) return;

    setSubmitting(true);
    try {
      await onSubmit({ ...values, price: Number(values.price), stock: Number(values.stock) });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-lg flex-col gap-4">
      <Field label="Title" error={errors.title}>
        <input value={values.title} onChange={(e) => handleChange("title", e.target.value)} className="input" />
      </Field>

      <Field label="Description" error={errors.description}>
        <textarea
          value={values.description}
          onChange={(e) => handleChange("description", e.target.value)}
          rows={3}
          className="input"
        />
      </Field>

      <Field label="Category" error={errors.category}>
        <select
          value={values.category}
          onChange={(e) => handleChange("category", e.target.value)}
          className="input"
        >
          <option value="">Select category</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Price" error={errors.price}>
          <input
            type="number"
            step="0.01"
            value={values.price}
            onChange={(e) => handleChange("price", e.target.value)}
            className="input"
          />
        </Field>
        <Field label="Stock" error={errors.stock}>
          <input
            type="number"
            value={values.stock}
            onChange={(e) => handleChange("stock", e.target.value)}
            className="input"
          />
        </Field>
      </div>

      <Field label="Brand">
        <input value={values.brand} onChange={(e) => handleChange("brand", e.target.value)} className="input" />
      </Field>

      <Field label="Thumbnail URL" error={errors.thumbnail}>
        <input
          value={values.thumbnail}
          onChange={(e) => handleChange("thumbnail", e.target.value)}
          className="input"
        />
      </Field>

      <button
        type="submit"
        disabled={submitting}
        className="mt-2 rounded-md bg-gray-900 px-4 py-2 text-sm text-white hover:bg-gray-700 disabled:opacity-60"
      >
        {submitting ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}

function Field({ label, error, children }) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="font-medium text-gray-700">{label}</span>
      {children}
      {error && <span className="text-xs text-red-600">{error}</span>}
    </label>
  );
}
