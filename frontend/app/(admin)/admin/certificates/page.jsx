"use client"
import { useState, useEffect } from "react"
import { AdminCrudPage, StatusBadge } from "@/components/admin/crud-page"
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

  const certificateSchema = [
    { 
      name: "member", 
      label: "Select Member", 
      type: "select", 
      required: true,
      options: memberOptions
    },
    { name: "certificateNo", label: "Certificate Number", type: "text", required: true },
    { name: "title", label: "Certificate Title", type: "text", required: true },
    { name: "description", label: "Description", type: "textarea", required: false },
    { 
      name: "status", 
      label: "Status", 
      type: "select", 
      required: true,
      options: [
        { label: "Active", value: "active" },
        { label: "Cancelled", value: "cancelled" }
      ] 
    }
  ]

  const columns = [
    { key: "certificateNo", label: "Cert No." },
    { key: "title", label: "Title" },
    { 
      key: "member", 
      label: "Issued To",
      render: (r) => r.member?.user?.fullName || "Unknown"
    },
    { 
      key: "pdf", 
      label: "Document",
      render: (r) => {
        if (!r.pdf?.url) return <span className="text-muted-foreground text-xs">No File</span>
        const isImage = r.pdf.url.match(/\.(jpeg|jpg|gif|png|webp)$/i)
        return isImage ? (
          <div className="relative h-12 w-20 overflow-hidden rounded border">
            <img src={r.pdf.url} alt="Certificate" className="h-full w-full object-cover" />
          </div>
        ) : (
          <a href={r.pdf.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View PDF</a>
        )
      }
    },
    { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> }
  ]

  return (
    <AdminCrudPage
      title="Certificates"
      description="Issue and manage certificates for registered members and volunteers."
      endpoint="/certificates"
      schema={certificateSchema}
      columns={columns}
    />
  )
}
