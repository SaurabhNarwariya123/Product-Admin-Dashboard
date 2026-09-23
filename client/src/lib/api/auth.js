import api from "../axios";

export async function loginRequest(username, password) {
  const { data } = await api.post("/auth/login", {
    username,
    password,
    expiresInMins: 60,
  });
  return data;
}
