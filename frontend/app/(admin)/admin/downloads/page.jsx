"use client"
import { AdminCrudPage, StatusBadge } from "@/components/admin/crud-page"

const DOWNLOAD_SCHEMA = [
  { name: "title", label: "Title", type: "text", required: true },
  { name: "description", label: "Description", type: "textarea" },
  { 
    name: "category", 
    label: "Category", 
    type: "select", 
    options: [
      { label: "Fatwa", value: "fatwa" },
      { label: "Book", value: "book" },
      { label: "Article", value: "article" },
      { label: "Document", value: "document" },
      { label: "Report", value: "report" },
      { label: "Other", value: "other" }
    ],
    required: true
  },
  { name: "file", label: "File (PDF/DOC)", type: "file" },
  { 
    name: "status", 
    label: "Status", 
    type: "select", 
    options: [
      { label: "Active", value: "active" },
      { label: "Inactive", value: "inactive" }
    ],
    required: true
  }
]

const COLUMNS = [
  { key: "title", label: "Title" },
  { key: "category", label: "Category", render: (r) => <span className="capitalize">{r.category}</span> },
  { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
  { 
    key: "file", 
    label: "Document", 
    render: (r) => r.file?.url ? (
      <a href={r.file.url} target="_blank" rel="noreferrer" className="text-xs font-semibold text-navy hover:underline">
        View File
      </a>
    ) : (
      <span className="text-xs text-muted-foreground">No file</span>
    )
  }
]

export default function Page() {
  return (
    <AdminCrudPage
      title="Publications & Resources"
      description="Manage digital library: Fatwas, books, articles and public documents."
      endpoint="/downloads"
      schema={DOWNLOAD_SCHEMA}
      columns={COLUMNS}
    />
  )
}
