import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Logged-in user ko login page se door rakho
export default function RequireGuest({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (user) {
    const params = new URLSearchParams(location.search);
    const redirectTo = params.get("redirectTo") || "/products";
    return <Navigate to={redirectTo} replace />;
  }

  return children;
}
