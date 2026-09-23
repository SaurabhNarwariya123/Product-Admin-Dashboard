import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getToken, setToken, clearToken } from "../lib/cookies";
import { loginRequest } from "../lib/api/auth";

const AuthContext = createContext(null);
const USER_STORAGE_KEY = "user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    if (typeof window === "undefined") return null;
    const token = getToken();
    const storedUser = window.localStorage.getItem(USER_STORAGE_KEY);
    return token && storedUser ? JSON.parse(storedUser) : null;
  });
  const navigate = useNavigate();

  async function login(username, password) {
    const { accessToken, ...profile } = await loginRequest(username, password);
    setToken(accessToken);
    window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(profile));
    setUser(profile);
    return profile;
  }

  function logout() {
    clearToken();
    window.localStorage.removeItem(USER_STORAGE_KEY);
    setUser(null);
    navigate("/login");
  }

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
