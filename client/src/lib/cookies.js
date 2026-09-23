const TOKEN_COOKIE = "token";
const ONE_DAY_SECONDS = 60 * 60 * 24;

export function setToken(token) {
  document.cookie = `${TOKEN_COOKIE}=${encodeURIComponent(token)}; path=/; max-age=${ONE_DAY_SECONDS}; SameSite=Lax`;
}

export function getToken() {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${TOKEN_COOKIE}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export function clearToken() {
  document.cookie = `${TOKEN_COOKIE}=; path=/; max-age=0`;
}
