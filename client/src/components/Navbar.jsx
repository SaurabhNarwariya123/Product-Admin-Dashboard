import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  if (!user) return null;

  return (
    <header className="border-b border-gray-200">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link to="/products" className="font-semibold text-gray-900">
          Admin Dashboard
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-gray-600">Hi, {user.username}</span>
          <button onClick={logout} className="rounded-md border border-gray-300 px-3 py-1.5 hover:bg-gray-50">
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
