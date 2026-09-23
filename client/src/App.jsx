import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import RequireAuth from "./components/RequireAuth";
import RequireGuest from "./components/RequireGuest";
import LoginPage from "./pages/LoginPage";
import ProductsPage from "./pages/ProductsPage";
import NewProductPage from "./pages/NewProductPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import EditProductPage from "./pages/EditProductPage";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      <Navbar />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">
        <Routes>
          <Route path="/" element={<Navigate to="/products" replace />} />
          <Route
            path="/login"
            element={
              <RequireGuest>
                <LoginPage />
              </RequireGuest>
            }
          />
          <Route
            path="/products"
            element={
              <RequireAuth>
                <ProductsPage />
              </RequireAuth>
            }
          />
          <Route
            path="/products/new"
            element={
              <RequireAuth>
                <NewProductPage />
              </RequireAuth>
            }
          />
          <Route
            path="/products/:id"
            element={
              <RequireAuth>
                <ProductDetailPage />
              </RequireAuth>
            }
          />
          <Route
            path="/products/:id/edit"
            element={
              <RequireAuth>
                <EditProductPage />
              </RequireAuth>
            }
          />
          <Route path="*" element={<Navigate to="/products" replace />} />
        </Routes>
      </main>
    </div>
  );
}
