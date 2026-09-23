const STORAGE_KEY = "product-overrides";

function readStore() {
  if (typeof window === "undefined") return { added: [], edited: {}, deletedIds: [] };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { added: [], edited: {}, deletedIds: [] };
  } catch {
    return { added: [], edited: {}, deletedIds: [] };
  }
}

function writeStore(store) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

function nextLocalId(store) {
  const ids = store.added.map((p) => p.id);
  return ids.length ? Math.min(...ids) - 1 : -1;
}

export function addLocalProduct(product) {
  const store = readStore();
  const localProduct = {
    ...product,
    id: nextLocalId(store),
    rating: 0,
    images: product.thumbnail ? [product.thumbnail] : [],
    reviews: [],
  };
  store.added = [localProduct, ...store.added];
  writeStore(store);
  return localProduct;
}

export function editLocalProduct(id, changes) {
  const store = readStore();
  if (id < 0) {
    store.added = store.added.map((p) => (p.id === id ? { ...p, ...changes } : p));
  } else {
    store.edited[id] = { ...(store.edited[id] || {}), ...changes };
  }
  writeStore(store);
}

export function deleteLocalProduct(id) {
  const store = readStore();
  if (id < 0) {
    store.added = store.added.filter((p) => p.id !== id);
  } else {
    store.deletedIds = [...new Set([...store.deletedIds, id])];
    delete store.edited[id];
  }
  writeStore(store);
}

export function getLocalProduct(id) {
  const store = readStore();
  return store.added.find((p) => p.id === id) || null;
}

export function getEditedFields(id) {
  return readStore().edited[id] || {};
}

export function applyOverrides({ products, total }, { page }) {
  const store = readStore();
  const withoutDeleted = products.filter((p) => !store.deletedIds.includes(p.id));
  const withEdits = withoutDeleted.map((p) =>
    store.edited[p.id] ? { ...p, ...store.edited[p.id] } : p
  );
  const adjustedTotal = total - store.deletedIds.length + store.added.length;

  if (page === 1) {
    return { products: [...store.added, ...withEdits], total: adjustedTotal };
  }
  return { products: withEdits, total: adjustedTotal };
}
