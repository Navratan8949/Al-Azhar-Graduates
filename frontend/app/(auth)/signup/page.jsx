"use client"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AuthShell } from "@/components/auth/auth-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { registerUser } from "@/service/auth.service"
import { toast } from "sonner"
import { useDispatch, useSelector } from "react-redux"
import { setUser, fetchUser, selectUser } from "@/redux/features/userSlice"

const INITIAL = { fullName: "", email: "", mobile: "", password: "", gender: "", dob: "", state: "Gujarat", district: "Rajkot", address: "", userType: "ngo_member" }

export default function SignupPage() {
  const router = useRouter()
  const dispatch = useDispatch()
  const user = useSelector(selectUser)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState(INITIAL)
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        router.replace("/admin")
      } else {
        router.replace("/member")
      }
    }
  }, [user, router])

  const [profileImage, setProfileImage] = useState(null)

  async function onSubmit(e) {
    e.preventDefault(); 
    setLoading(true)
    try { 
      // Prepare FormData to support image upload
      const formData = new FormData();
      Object.keys(form).forEach(key => {
        if (form[key]) formData.append(key, form[key]);
      });
      if (profileImage) {
        formData.append("profileImage", profileImage);
      }

      const response = await registerUser(formData); 
      dispatch(setUser({
        user: response.user || response.data,
        token: response.token
      }));
      await dispatch(fetchUser()).unwrap();

      toast.success("Account created successfully!"); 
      router.push("/") 
    } catch (err) { 
      toast.error(err?.response?.data?.message || err?.message || "Registration failed") 
    } finally { 
      setLoading(false) 
    }
  }
  return (
    <AuthShell title="Create account" subtitle="Fill out your details to join World Association for Al-Azhar Graduates." image="/smiling-school-children-india-education.png"
      footer={<>Already registered? <Link href="/login" className="font-semibold text-navy hover:underline">Login</Link></>}>
      <form onSubmit={onSubmit} className="grid gap-3.5">
        <div className="grid gap-2">
          <Label>Profile Image (Optional)</Label>
          <Input type="file" accept="image/*" className="h-10 rounded-xl bg-transparent" onChange={(e) => setProfileImage(e.target.files[0])} />
        </div>
        <div className="grid gap-2"><Label>Full name *</Label><Input className="h-10 rounded-xl" value={form.fullName} onChange={(e) => set("fullName", e.target.value)} required /></div>
        <div className="grid gap-3.5 sm:grid-cols-2">
          <div className="grid gap-2"><Label>Email *</Label><Input type="email" className="h-10 rounded-xl" value={form.email} onChange={(e) => set("email", e.target.value)} required /></div>
          <div className="grid gap-2"><Label>Mobile *</Label><Input className="h-10 rounded-xl" value={form.mobile} onChange={(e) => set("mobile", e.target.value)} required /></div>
        </div>
        <div className="grid gap-2"><Label>Password *</Label><Input type="password" className="h-10 rounded-xl" value={form.password} onChange={(e) => set("password", e.target.value)} required minLength={6} /></div>
        <div className="grid gap-3.5 sm:grid-cols-2">
          <div className="grid gap-2"><Label>Gender</Label><select className="h-10 rounded-xl border border-input bg-transparent px-3 text-sm" value={form.gender} onChange={(e) => set("gender", e.target.value)}><option value="">Select</option><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option></select></div>
          <div className="grid gap-2"><Label>Date of birth</Label><Input type="date" className="h-10 rounded-xl" value={form.dob} onChange={(e) => set("dob", e.target.value)} /></div>
        </div>
        <div className="grid gap-3.5 sm:grid-cols-2">
          <div className="grid gap-2"><Label>State</Label><Input className="h-10 rounded-xl" value={form.state} onChange={(e) => set("state", e.target.value)} /></div>
          <div className="grid gap-2"><Label>District</Label><Input className="h-10 rounded-xl" value={form.district} onChange={(e) => set("district", e.target.value)} /></div>
        </div>

        <div className="grid gap-2"><Label>Address</Label><Textarea className="min-h-20 rounded-xl" value={form.address} onChange={(e) => set("address", e.target.value)} /></div>
        <Button type="submit" disabled={loading} className="mt-1 h-11 rounded-xl bg-accent font-semibold text-accent-foreground hover:bg-accent/90">{loading ? "Creating…" : "Create account"}</Button>
      </form>
    </AuthShell>
  )
}
