"use client"
import { useState, useEffect } from "react"
import { AdminCrudPage } from "@/components/admin/crud-page"
import { getMembers } from "@/service/member.service"

export default function Page() {
  const [memberOptions, setMemberOptions] = useState([])

  useEffect(() => {
    // Fetch members to populate the select dropdown
    getMembers()
      .then(res => {
        if (res.success) {
          const options = res.members.map(m => ({
            label: `${m.user?.fullName || 'Unknown'} (${m.memberId})`,
            value: m._id
          }))
          setMemberOptions(options)
        }
      })
      .catch(console.error)
  }, [])

  const appointmentSchema = [
    {
      name: "memberId",
      label: "Select Member",
      type: "select",
      required: true,
      options: memberOptions
    },
    { name: "designation", label: "Designation (Post)", type: "text", required: true, placeholder: "e.g., Senior Volunteer" },
    { name: "department", label: "Department", type: "text", required: false, placeholder: "e.g., Education" },
    { name: "joiningDate", label: "Joining Date", type: "date", required: true }
  ]

  const columns = [
    { key: "letterNo", label: "Letter No." },
    {
      key: "member",
      label: "Issued To",
      render: (r) => r.member?.user?.fullName || "Unknown"
    },
    { key: "designation", label: "Designation" },
    {
      key: "pdf",
      label: "Document",
      render: (r) => r.pdf?.url ? (
        <a href={r.pdf.url} download target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Download PDF</a>
      ) : <span className="text-muted-foreground text-xs">No PDF</span>
    }
  ]

  return (
    <AdminCrudPage
      title="Appointment Letters"
      description="Issue official appointment letters to members and staff."
      endpoint="/appointments"
      schema={appointmentSchema}
      columns={columns}
      disableActions={() => true} // Appointment letters are immutable
    />
  )
}
