import api from "../axios";

export async function fetchProducts({ page, pageSize, q, category, sortBy, order }, signal) {
  const skip = (page - 1) * pageSize;
  const params = { limit: pageSize, skip };
  if (sortBy) {
    params.sortBy = sortBy;
    params.order = order || "asc";
  }

  let url = "/products";
  if (q) {
    url = "/products/search";
    params.q = q;
  } else if (category) {
    url = `/products/category/${encodeURIComponent(category)}`;
  }

  const { data } = await api.get(url, { params, signal });
  return { products: data.products, total: data.total };
}

export async function fetchProductById(id, signal) {
  const { data } = await api.get(`/products/${id}`, { signal });
  return data;
}

export async function fetchCategories(signal) {
  const { data } = await api.get("/products/categories", { signal });
  return data.map((item) =>
    typeof item === "string" ? { slug: item, name: item } : { slug: item.slug, name: item.name }
  );
}

export async function createProduct(payload) {
  const { data } = await api.post("/products/add", payload);
  return data;
}

export async function updateProductById(id, payload) {
  const { data } = await api.put(`/products/${id}`, payload);
  return data;
}

export async function deleteProductById(id) {
  const { data } = await api.delete(`/products/${id}`);
  return data;
}
