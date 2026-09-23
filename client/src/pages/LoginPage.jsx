import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (submitting) return;
    setError("");
    setSubmitting(true);
    try {
      await login(username, password);
      navigate(searchParams.get("redirectTo") || "/products");
    } catch (err) {
      setError(err.message || "Invalid username or password.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto mt-16 max-w-sm">
      <h1 className="mb-6 text-xl font-semibold">Log in</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-gray-700">Username</span>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input"
            autoComplete="username"
            required
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-gray-700">Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
            autoComplete="current-password"
            required
          />
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-gray-900 px-4 py-2 text-sm text-white hover:bg-gray-700 disabled:opacity-60"
        >
          {submitting ? "Logging in..." : "Log in"}
        </button>
      </form>
      <p className="mt-4 text-xs text-gray-500">
        Use username <code>emilys</code> and password <code>emilyspass</code>.
      </p>
    </div>
  );
}
