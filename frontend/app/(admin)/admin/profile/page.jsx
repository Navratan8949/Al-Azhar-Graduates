"use client"
import { AdminPageHeader } from "@/components/admin/page-header"
import { useSelector } from "react-redux"
import { selectUser } from "@/redux/features/userSlice"
import { toast } from "sonner"

export default function ProfilePage() {
  const user = useSelector(selectUser)

  if (!user) return null

  // Get initials for avatar (e.g., "Navratan Singh" -> "NS")
  const initials = user.fullName
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase() || "AD"

  // Format role for display
  const roleDisplay = user.role
    ?.split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ") || "Admin"

  return (
    <div>
      <AdminPageHeader 
        title="Admin Profile" 
        description="Manage your account settings and preferences." 
      />
      
      <div className="max-w-2xl rounded-2xl border border-border/60 bg-white p-8 shadow-sm">
        <div className="flex items-center gap-6 mb-8">
          <div className="flex size-24 items-center justify-center rounded-full bg-navy text-3xl font-bold text-white shadow-sm overflow-hidden">
            {user?.profileImage?.url ? (
              <img src={user.profileImage.url} alt="Profile" className="size-full object-cover" />
            ) : (
              initials
            )}
          </div>
          <div>
            <h2 className="font-serif text-2xl font-bold text-navy">{user.fullName || "Admin User"}</h2>
            <p className="text-sm font-medium text-muted-foreground mt-1">{roleDisplay}</p>
          </div>
        </div>

        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); toast.success("Profile updated successfully (Demo)"); }}>
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-navy border-b pb-2">Personal Information</h3>
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-foreground">Full Name</label>
                <input type="text" defaultValue={user?.fullName || ""} className="w-full rounded-xl border border-border/60 bg-secondary/30 px-4 py-3 text-sm focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-foreground">Email Address</label>
                <input type="email" value={user?.email || ""} disabled className="w-full rounded-xl border border-border/60 bg-secondary/50 px-4 py-3 text-sm text-muted-foreground cursor-not-allowed" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-foreground">Mobile Number</label>
                <input type="text" defaultValue={user?.mobile || ""} className="w-full rounded-xl border border-border/60 bg-secondary/30 px-4 py-3 text-sm focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-foreground">Gender</label>
                <select defaultValue={user?.gender || ""} className="w-full rounded-xl border border-border/60 bg-secondary/30 px-4 py-3 text-sm focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy appearance-none">
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-foreground">Date of Birth</label>
                <input type="date" defaultValue={user?.dob ? new Date(user.dob).toISOString().split('T')[0] : ""} className="w-full rounded-xl border border-border/60 bg-secondary/30 px-4 py-3 text-sm focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy" />
              </div>
            </div>
          </div>

          {/* Location Details */}
          <div className="space-y-4 pt-2">
            <h3 className="text-lg font-bold text-navy border-b pb-2">Location Details</h3>
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-foreground">State</label>
                <input type="text" defaultValue={user?.state || ""} className="w-full rounded-xl border border-border/60 bg-secondary/30 px-4 py-3 text-sm focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-foreground">District</label>
                <input type="text" defaultValue={user?.district || ""} className="w-full rounded-xl border border-border/60 bg-secondary/30 px-4 py-3 text-sm focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy" />
              </div>
              <div className="md:col-span-2">
                <label className="mb-1.5 block text-sm font-semibold text-foreground">Address</label>
                <textarea rows="3" defaultValue={user?.address || ""} className="w-full rounded-xl border border-border/60 bg-secondary/30 px-4 py-3 text-sm focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy resize-none"></textarea>
              </div>
            </div>
          </div>

          {/* Account Details */}
          <div className="space-y-4 pt-2">
            <h3 className="text-lg font-bold text-navy border-b pb-2">Account Details</h3>
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-foreground">System Role</label>
                <input type="text" value={roleDisplay} disabled className="w-full rounded-xl border border-border/60 bg-secondary/50 px-4 py-3 text-sm text-muted-foreground cursor-not-allowed" />
              </div>
              {user?.role === "member" && (
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-foreground">User Type</label>
                  <input type="text" value={user?.userType ? user.userType.charAt(0).toUpperCase() + user.userType.slice(1).replace('_', ' ') : "N/A"} disabled className="w-full rounded-xl border border-border/60 bg-secondary/50 px-4 py-3 text-sm text-muted-foreground cursor-not-allowed" />
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button type="submit" className="rounded-xl bg-accent px-6 py-2.5 text-sm font-bold text-accent-foreground shadow-sm transition hover:bg-accent/90">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
