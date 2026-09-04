import { apiFetch, setToken } from "./client"
export async function registerUser(payload) {
  const data = await apiFetch("/auth/register", { method: "POST", body: JSON.stringify(payload) })
  if (data.token) setToken(data.token)
  return data
}
export async function memberLogin({ emailOrMobile, password }) {
  const data = await apiFetch("/auth/login/member", { method: "POST", body: JSON.stringify({ email: emailOrMobile, mobile: emailOrMobile, password }) })
  if (data.token) setToken(data.token)
  return data
}
export async function adminLogin({ email, password }) {
  const data = await apiFetch("/auth/login/admin", { method: "POST", body: JSON.stringify({ email, password }) })
  if (data.token) setToken(data.token)
  return data
}
export async function logout() { try { await apiFetch("/auth/logout") } finally { setToken(null) } }
export async function getMe() { return apiFetch("/auth/me") }
