export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1"
const TIMEOUT_MS = 8000
const TOKEN_KEY = "rht_token"
export class ApiError extends Error {
  constructor(message, status, payload) { super(message); this.status = status; this.payload = payload }
}
export function getToken() { if (typeof window === "undefined") return null; return window.localStorage.getItem(TOKEN_KEY) }
export function setToken(token) { if (typeof window === "undefined") return; if (token) window.localStorage.setItem(TOKEN_KEY, token); else window.localStorage.removeItem(TOKEN_KEY) }
export async function apiFetch(path, options = {}) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS)
  const token = getToken()
  const isForm = typeof FormData !== "undefined" && options.body instanceof FormData
  const headers = { ...(isForm ? {} : { "Content-Type": "application/json" }), ...options.headers }
  if (token) headers.Authorization = `Bearer ${token}`
  try {
    const res = await fetch(`${API_BASE_URL}${path}`, { ...options, headers, signal: controller.signal, credentials: "include" })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) throw new ApiError(data.message || `Request failed: ${res.status}`, res.status, data)
    return data
  } finally { clearTimeout(timeout) }
}
export async function apiGetWithFallback(path, fallback) {
  try { return await apiFetch(path) } catch { return typeof fallback === "function" ? fallback() : fallback }
}
