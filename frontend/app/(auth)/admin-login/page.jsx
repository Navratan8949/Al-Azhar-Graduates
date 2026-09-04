"use client"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { AuthShell } from "@/components/auth/auth-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { adminLogin } from "@/service/auth.service"
import { toast } from "sonner"
import { useDispatch, useSelector } from "react-redux"
import { setUser, selectIsAuthenticated, fetchUser, selectUser } from "@/redux/features/userSlice"
import { useEffect } from "react"

export default function AdminLoginPage() {
  const router = useRouter()
  const dispatch = useDispatch()
  const user = useSelector(selectUser)
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ email: "", password: "" })

  useEffect(() => {
    // If the user is already authenticated in Redux, redirect based on role
    if (user) {
      if (user.role === "admin") {
        router.replace("/admin")
      } else {
        router.replace("/member")
      }
      return
    }
    // Also check token in localStorage to see if we should fetch profile
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
    if (token && !isAuthenticated) {
      dispatch(fetchUser())
    }
  }, [user, isAuthenticated, router, dispatch])

  async function onSubmit(e) {
    e.preventDefault(); 
    setLoading(true)
    try { 
      const response = await adminLogin(form.email, form.password); 
      dispatch(setUser({
        user: response.user || response.data,
        token: response.token
      }));
      // Fetch full profile data since login API only returns basic details
      await dispatch(fetchUser()).unwrap();
      toast.success("Welcome back, Admin!"); 
      router.push("/admin") 
    } catch (err) { 
      toast.error(err?.response?.data?.message || err?.message || "Login failed"); 
    } finally { 
      setLoading(false) 
    }
  }
  return (
    <AuthShell title="Admin login" subtitle="Log in as an Administrator" image="/community-health-camp-india.png"
      footer={<>Member? <Link href="/login" className="font-semibold text-navy hover:underline">Member login</Link></>}>
      <form onSubmit={onSubmit} className="grid gap-4">
        <div className="grid gap-2"><Label>Email</Label><Input type="email" className="h-11 rounded-xl" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></div>
        <div className="grid gap-2"><Label>Password</Label><Input type="password" className="h-11 rounded-xl" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required /></div>
        <Button type="submit" disabled={loading} className="mt-2 h-11 rounded-xl bg-navy font-semibold text-white hover:bg-navy/90">{loading ? "Signing in…" : "Login as Admin"}</Button>
      </form>
    </AuthShell>
  )
}
