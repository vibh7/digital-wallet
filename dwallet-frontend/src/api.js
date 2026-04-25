import axios from "axios";

function resolveApiBase() {
  const raw = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8080").trim();
  const noTrailing = raw.replace(/\/+$/, "");
  return /\/api$/i.test(noTrailing) ? noTrailing : `${noTrailing}/api`;
}

export const API_BASE = resolveApiBase();

const api = axios.create({ baseURL: API_BASE });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("jwt");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
