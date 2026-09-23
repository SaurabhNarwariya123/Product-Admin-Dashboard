import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Anonymous user ko app ke andar aane se roko aur login pe bhejo
export default function RequireAuth({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    const redirectTo = `${location.pathname}${location.search}`;
    return <Navigate to={`/login?redirectTo=${encodeURIComponent(redirectTo)}`} replace />;
  }

  return children;
}
