"use client"
import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { fetchUser, selectIsAuthenticated, selectUser, selectAuthStatus } from "@/redux/features/userSlice"
import { Loader2 } from "lucide-react"
import { ADMIN_NAV } from "@/components/admin/sidebar"
import { canAccessAdminPath, getFirstAllowedAdminPath, isAdminRole } from "@/lib/admin-permissions"

export function AdminAuthGuard({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const dispatch = useDispatch()
  
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const user = useSelector(selectUser)
  const status = useSelector(selectAuthStatus)
  
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

    // If there's no token at all, redirect immediately
    if (!token) {
      router.replace("/admin-login")
      return
    }

    // If we have a token but no user in Redux, fetch the user profile
    if (token && !isAuthenticated && status !== "loading") {
      dispatch(fetchUser())
    }
  }, [dispatch, isAuthenticated, status, router])

  useEffect(() => {
    // If the user is already in Redux after login, or fetch finished, stop checking
    if ((isAuthenticated && user) || status === "succeeded" || status === "failed") {
      setIsChecking(false)
    }

    // If it failed, or user is fetched but role/path is not allowed, redirect
    if (status === "failed") {
      router.replace("/admin-login")
    } else if (status === "succeeded" && user) {
      if (!isAdminRole(user.role)) {
        router.replace("/admin-login")
        return
      }

      if (!canAccessAdminPath(pathname, user)) {
        router.replace(getFirstAllowedAdminPath(user, ADMIN_NAV))
      }
    }
  }, [isAuthenticated, pathname, status, user, router])

  // While checking token or fetching profile, show a loading screen
  if (isChecking || status === "loading") {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#f3f5f8]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="size-10 animate-spin text-navy" />
          <p className="font-serif text-lg font-medium text-navy animate-pulse">Verifying Access...</p>
        </div>
      </div>
    )
  }

  // If authenticated, render the protected admin pages
  if (isAuthenticated && isAdminRole(user?.role) && canAccessAdminPath(pathname, user)) {
    return children
  }

  // Fallback (should theoretically not be reached due to redirects)
  return null
}
