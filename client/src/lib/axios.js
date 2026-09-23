import axios from "axios";
import { getToken, clearToken } from "./cookies";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://dummyjson.com",
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }

    const isLoginRequest = error.config?.url?.includes("/auth/login");
    if (error.response?.status === 401 && !isLoginRequest) {
      clearToken();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }

    const message =
      error.response?.data?.message || error.message || "Something went wrong. Please try again.";
    return Promise.reject(new Error(message));
  }
);

export default api;
