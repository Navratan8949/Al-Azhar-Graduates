"use client"
import { AdminCrudPage, StatusBadge } from "@/components/admin/crud-page"

const userSchema = [
  { name: "fullName", label: "Full Name", type: "text", required: true },
  { name: "email", label: "Email Address", type: "email", required: true },
  { name: "mobile", label: "Mobile Number", type: "text", required: true },
  { name: "isActive", label: "Account Active", type: "checkbox", required: false, default: true }
]

export default function Page() {
  return (
    <AdminCrudPage
      title="Registered Users"
      description="View all normal users who have signed up on the website but have not applied for NGO membership yet."
      endpoint="/users/public"
      schema={userSchema}
      primaryAction={false}
      columns={[
        { key: "fullName", label: "Full Name" },
        { key: "email", label: "Email" },
        { key: "mobile", label: "Mobile" },
        { key: "isActive", label: "Status", render: (r) => <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${r.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>{r.isActive ? "Active" : "Disabled"}</span> },
        { key: "createdAt", label: "Joined", render: (r) => new Date(r.createdAt).toLocaleDateString() },
        { key: "actions", label: "Actions", render: () => <span className="text-xs font-semibold text-muted-foreground">Read Only</span> }
      ]}
    />
  )
}
