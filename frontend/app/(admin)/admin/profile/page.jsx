"use client"
import { useState, useEffect } from "react"
import { AdminPageHeader } from "@/components/admin/page-header"
import { useSelector, useDispatch } from "react-redux"
import { selectUser, fetchUser } from "@/redux/features/userSlice"
import { toast } from "sonner"
import api from "@/service/api"
import { Loader2 } from "lucide-react"

export default function ProfilePage() {
  const dispatch = useDispatch()
  const user = useSelector(selectUser)

  const [isSavingProfile, setIsSavingProfile] = useState(false)
  const [isSavingPassword, setIsSavingPassword] = useState(false)

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    fullName: "",
    mobile: "",
    gender: "",
    dob: "",
    state: "",
    district: "",
    address: ""
  })

  // Password Form State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })

  useEffect(() => {
    if (user) {
      setProfileForm({
        fullName: user.fullName || "",
        mobile: user.mobile || "",
        gender: user.gender || "",
        dob: user.dob ? new Date(user.dob).toISOString().split('T')[0] : "",
        state: user.state || "",
        district: user.district || "",
        address: user.address || ""
      })
    }
  }, [user])

  if (!user) return null

  // Get initials for avatar
  const initials = user.fullName
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase() || "AD"

  const roleDisplay = user.role
    ?.split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ") || "Admin"

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setIsSavingProfile(true)
    try {
      await api.put("/auth/profile", profileForm)
      toast.success("Profile updated successfully")
      dispatch(fetchUser())
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile")
    } finally {
      setIsSavingProfile(false)
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New passwords do not match")
      return
    }
    
    setIsSavingPassword(true)
    try {
      await api.put("/auth/password", {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      })
      toast.success("Password updated successfully")
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" })
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update password")
    } finally {
      setIsSavingPassword(false)
    }
  }

  return (
    <div>
      <AdminPageHeader 
        title="Admin Profile" 
        description="Manage your account settings, profile details, and security preferences." 
      />
      
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column: Profile Card */}
        <div className="lg:col-span-1 space-y-8">
          <div className="rounded-2xl border border-border/60 bg-white p-6 shadow-sm flex flex-col items-center text-center">
            <div className="flex size-24 items-center justify-center rounded-full bg-navy text-3xl font-bold text-white shadow-sm overflow-hidden mb-4">
              {user?.profileImage?.url ? (
                <img src={user.profileImage.url} alt="Profile" className="size-full object-cover" />
              ) : (
                initials
              )}
            </div>
            <h2 className="font-serif text-xl font-bold text-navy">{user.fullName || "Admin User"}</h2>
            <p className="text-sm font-medium text-muted-foreground mt-1">{roleDisplay}</p>
            <div className="mt-4 w-full border-t border-border/60 pt-4 text-left space-y-2">
              <div>
                <p className="text-[10px] font-bold uppercase text-slate-500">Email Address</p>
                <p className="font-semibold text-slate-800 text-sm truncate">{user.email}</p>
              </div>
              {user?.role === "member" && (
                <div>
                  <p className="text-[10px] font-bold uppercase text-slate-500">User Type</p>
                  <p className="font-semibold text-slate-800 text-sm">
                    {user?.userType ? user.userType.charAt(0).toUpperCase() + user.userType.slice(1).replace('_', ' ') : "N/A"}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Change Password Section */}
          <div className="rounded-2xl border border-border/60 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-navy border-b pb-2 mb-4">Change Password</h3>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-foreground">Current Password</label>
                <input 
                  type="password" 
                  required
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                  className="w-full rounded-xl border border-border/60 bg-secondary/30 px-3 py-2.5 text-sm focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy" 
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-foreground">New Password</label>
                <input 
                  type="password" 
                  required
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                  className="w-full rounded-xl border border-border/60 bg-secondary/30 px-3 py-2.5 text-sm focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy" 
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-foreground">Confirm New Password</label>
                <input 
                  type="password" 
                  required
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                  className="w-full rounded-xl border border-border/60 bg-secondary/30 px-3 py-2.5 text-sm focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy" 
                />
              </div>
              <button 
                type="submit" 
                disabled={isSavingPassword}
                className="w-full rounded-xl flex items-center justify-center bg-navy px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-navy/90 disabled:opacity-70"
              >
                {isSavingPassword ? <Loader2 className="size-4 animate-spin mr-2" /> : null}
                Update Password
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Update Profile Details */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-border/60 bg-white p-8 shadow-sm">
            <form onSubmit={handleProfileSubmit} className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-navy border-b pb-2">Personal Information</h3>
                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-foreground">Full Name</label>
                    <input 
                      type="text" 
                      value={profileForm.fullName}
                      onChange={(e) => setProfileForm({...profileForm, fullName: e.target.value})}
                      className="w-full rounded-xl border border-border/60 bg-secondary/30 px-4 py-3 text-sm focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy" 
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-foreground">Mobile Number</label>
                    <input 
                      type="text" 
                      value={profileForm.mobile}
                      onChange={(e) => setProfileForm({...profileForm, mobile: e.target.value})}
                      className="w-full rounded-xl border border-border/60 bg-secondary/30 px-4 py-3 text-sm focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy" 
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-foreground">Gender</label>
                    <select 
                      value={profileForm.gender}
                      onChange={(e) => setProfileForm({...profileForm, gender: e.target.value})}
                      className="w-full rounded-xl border border-border/60 bg-secondary/30 px-4 py-3 text-sm focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy appearance-none"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-foreground">Date of Birth</label>
                    <input 
                      type="date" 
                      value={profileForm.dob}
                      onChange={(e) => setProfileForm({...profileForm, dob: e.target.value})}
                      className="w-full rounded-xl border border-border/60 bg-secondary/30 px-4 py-3 text-sm focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy" 
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <h3 className="text-lg font-bold text-navy border-b pb-2">Location Details</h3>
                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-foreground">State</label>
                    <input 
                      type="text" 
                      value={profileForm.state}
                      onChange={(e) => setProfileForm({...profileForm, state: e.target.value})}
                      className="w-full rounded-xl border border-border/60 bg-secondary/30 px-4 py-3 text-sm focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy" 
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-foreground">District</label>
                    <input 
                      type="text" 
                      value={profileForm.district}
                      onChange={(e) => setProfileForm({...profileForm, district: e.target.value})}
                      className="w-full rounded-xl border border-border/60 bg-secondary/30 px-4 py-3 text-sm focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy" 
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="mb-1.5 block text-sm font-semibold text-foreground">Address</label>
                    <textarea 
                      rows="3" 
                      value={profileForm.address}
                      onChange={(e) => setProfileForm({...profileForm, address: e.target.value})}
                      className="w-full rounded-xl border border-border/60 bg-secondary/30 px-4 py-3 text-sm focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy resize-none"
                    ></textarea>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button 
                  type="submit" 
                  disabled={isSavingProfile}
                  className="rounded-xl flex items-center bg-accent px-8 py-3 text-sm font-bold text-accent-foreground shadow-sm transition hover:bg-accent/90 disabled:opacity-70"
                >
                  {isSavingProfile ? <Loader2 className="size-4 animate-spin mr-2" /> : null}
                  Save Profile Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
