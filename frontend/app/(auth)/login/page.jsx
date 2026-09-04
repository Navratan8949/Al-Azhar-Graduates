"use client"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AuthShell } from "@/components/auth/auth-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { memberLogin } from "@/service/auth.service"
import { toast } from "sonner"
import { useDispatch, useSelector } from "react-redux"
import { setUser, fetchUser, selectUser } from "@/redux/features/userSlice"

export default function MemberLoginPage() {
  const router = useRouter()
  const dispatch = useDispatch()
  const user = useSelector(selectUser)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ emailOrMobile: "", password: "" })

  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        router.replace("/admin")
      } else {
        router.replace("/member")
      }
    }
  }, [user, router])

  async function onSubmit(e) {
    e.preventDefault(); 
    setLoading(true)
    try { 
      const response = await memberLogin(form.emailOrMobile, form.password); 
      dispatch(setUser({
        user: response.user || response.data,
        token: response.token
      }));
      // Fetch full profile data
      await dispatch(fetchUser()).unwrap();
      
      toast.success("Logged in successfully!"); 
      const loggedUser = response.user || response.data
      if (loggedUser?.role === "admin") {
        router.push("/admin") 
      } else {
        router.push("/member") 
      }
    } catch (err) { 
      toast.error(err?.response?.data?.message || err?.message || "Login failed") 
    } finally { 
      setLoading(false) 
    }
  }
  return (
    <AuthShell title="Member login" subtitle="Sign in with email or mobile." image="/al-azhar-cairo.jpg"
      footer={<>New here? <Link href="/signup" className="font-semibold text-navy hover:underline">Create account</Link></>}>
      <form onSubmit={onSubmit} className="grid gap-4">
        <div className="grid gap-2"><Label>Email or mobile</Label><Input className="h-11 rounded-xl" value={form.emailOrMobile} onChange={(e) => setForm({ ...form, emailOrMobile: e.target.value })} required /></div>
        <div className="grid gap-2"><Label>Password</Label><Input type="password" className="h-11 rounded-xl" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required /></div>
        <Button type="submit" disabled={loading} className="mt-2 h-11 rounded-xl bg-accent font-semibold text-accent-foreground hover:bg-accent/90">{loading ? "Signing in…" : "Login"}</Button>
      </form>
    </AuthShell>
  )
}
