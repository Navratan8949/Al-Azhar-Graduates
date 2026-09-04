"use client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Menu, Search, LogOut, ExternalLink } from "lucide-react"
import { AdminNavLinks, AdminSidebar } from "@/components/admin/sidebar"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { AdminAuthGuard } from "@/components/admin/auth-guard"
import { useDispatch, useSelector } from "react-redux"
import { selectUser, clearUser } from "@/redux/features/userSlice"
import api from "@/service/api"
import { toast } from "sonner"
import { useEffect, useState } from "react"

export default function AdminLayout({ children }) {
  const router = useRouter()
  const dispatch = useDispatch()
  const user = useSelector(selectUser)
  const [greeting, setGreeting] = useState("Welcome")

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting("Good morning")
    else if (hour < 18) setGreeting("Good afternoon")
    else setGreeting("Good evening")
  }, [])

  const initials = user?.fullName
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase() || "AD"

  const handleLogout = async () => {
    try {
      await api.get("/auth/logout")
      dispatch(clearUser())
      toast.success("Logged out successfully")
      router.push("/admin-login")
    } catch (err) {
      toast.error("Error logging out")
    }
  }

  return (
    <AdminAuthGuard>
      <div className="flex min-h-dvh bg-[#f4f7f6]">
        <AdminSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b border-navy/5 bg-white/70 px-4 backdrop-blur-xl md:px-8 shadow-[0_4px_24px_rgba(2,61,40,0.04)]">
            <div className="flex items-center gap-3 lg:hidden">
              <Sheet>
                <SheetTrigger className="inline-flex size-9 items-center justify-center rounded-lg border border-navy/20 bg-white text-navy shadow-sm hover:bg-navy/5 transition-colors">
                  <Menu className="size-4" />
                </SheetTrigger>
                <SheetContent side="left" className="w-[260px] bg-gradient-to-b from-navy via-navy to-[#022c1d] p-0 text-white border-none shadow-2xl">
                  <SheetTitle className="sr-only">Admin menu</SheetTitle>
                  <div className="border-b border-white/10 px-5 py-6 relative overflow-hidden">
                    <div className="absolute inset-0 bg-lime/10 blur-3xl rounded-full"></div>
                    <p className="font-serif text-[17px] font-extrabold text-white tracking-wide relative z-10">
                      Al-Azhar <span className="text-lime">Graduates</span>
                    </p>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-bold mt-1 relative z-10">Administration</p>
                  </div>
                  <div className="flex-1 overflow-y-auto px-3 py-5 scroll-expand--scroller">
                    <nav className="space-y-1">
                      <AdminNavLinks user={user} />
                    </nav>
                  </div>
                </SheetContent>
              </Sheet>
              <span className="font-serif font-bold text-navy text-lg">Admin Workspace</span>
            </div>
            
            <div className="relative hidden flex-1 items-center gap-4 sm:flex text-sm">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-emerald-700/70 uppercase tracking-widest">{greeting}</span>
                <span className="text-navy font-serif font-bold text-lg leading-none">
                  {user?.fullName?.split(" ")[0] || "Admin"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-4">
              <Link 
                href="/" 
                target="_blank" 
                className="hidden sm:flex items-center gap-1.5 rounded-full bg-white px-4 py-1.5 text-xs font-bold text-navy shadow-sm border border-navy/10 transition hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-800"
              >
                <ExternalLink className="size-3.5" />
                View Site
              </Link>

              <div className="h-6 w-px bg-navy/10 hidden sm:block"></div>

              <Link href="/admin/profile" className="flex size-9 overflow-hidden items-center justify-center rounded-full bg-slate-100 border-2 border-white shadow-md transition hover:ring-2 hover:ring-emerald-500 hover:ring-offset-2 hover:ring-offset-[#f4f7f6]">
                {user?.profileImage?.url ? (
                  <img src={user.profileImage.url} alt="Profile" className="size-full object-cover" />
                ) : (
                  <span className="text-xs font-extrabold text-navy">{initials}</span>
                )}
              </Link>

              <button
                onClick={handleLogout}
                title="Log out"
                className="flex size-9 items-center justify-center rounded-full bg-rose-50 text-rose-600 shadow-sm border border-rose-100 transition-all hover:bg-rose-100 hover:text-rose-700 hover:shadow"
              >
                <LogOut className="size-4" />
                <span className="sr-only">Logout</span>
              </button>
            </div>
          </header>
          <main className="flex-1 p-4 md:p-8">{children}</main>
        </div>
      </div>
    </AdminAuthGuard>
  )
}
