"use client"
import { useState, useEffect } from "react"
import { Plus, Download, Loader2, Trash2, Edit, ShieldCheck } from "lucide-react"
import { AdminPageHeader } from "@/components/admin/page-header"
import { StatsCard } from "@/components/admin/stats-card"
import { DataTable, StatusBadge } from "@/components/admin/data-table"
import { Button } from "@/components/ui/button"
import { useCrud } from "@/lib/hooks/use-crud"
import { CrudModal } from "@/components/admin/crud-modal"
import { useSelector } from "react-redux"
import { selectUser } from "@/redux/features/userSlice"
import { canAccessAdminModule, getAdminModuleForEndpoint } from "@/lib/admin-permissions"
import { toast } from "sonner"

const EXPORTABLE_ENDPOINTS = [
  "/donations",
  "/members",
  "/users",
  "/users/public",
  "/complaints",
  "/contact",
  "/reports",
  "/appointments",
  "/newsletter"
]

export function AdminCrudPage({
  title,
  description,
  endpoint,
  schema,
  stats = [],
  columns,
  primaryAction = "Add new",
  headerActions,
  disableActions,
  customActions,
  hideDelete,
  hideEdit,
  hideExport,
  crudRef,
  mapEditData
}) {
  const crud = useCrud(endpoint)
  const { data, loading, error, createItem, updateItem, deleteItem } = crud

  useEffect(() => {
    if (crudRef) {
      crudRef.current = crud
    }
  }, [crud, crudRef])

  const user = useSelector(selectUser)
  const isAdmin = user?.role === "admin"
  const canCreate = isAdmin
  const canEdit = isAdmin
  const canDelete = isAdmin

  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)

  const isExportAllowed = hideExport === false || (hideExport !== true && EXPORTABLE_ENDPOINTS.some(ep => endpoint?.startsWith(ep)))

  const handleExportCSV = () => {
    if (!data || data.length === 0) {
      toast.error("No data available to export")
      return
    }

    const exportCols = columns.filter(c => c.key !== "actions" && c.key !== "image")
    const headers = exportCols.map(c => c.label || c.key).join(",")

    const extractTextFromReact = (node) => {
      if (node === null || node === undefined) return ""
      if (typeof node === "string" || typeof node === "number") return String(node)
      if (Array.isArray(node)) return node.map(extractTextFromReact).join(" ")
      if (typeof node === "object") {
        if (node.props?.status) return String(node.props.status)
        if (node.props?.children) return extractTextFromReact(node.props.children)
      }
      return ""
    }

    const rows = data.map(row => {
      return exportCols.map(c => {
        let val = undefined

        if (row[c.key] !== undefined && row[c.key] !== null) {
          val = row[c.key]
        }

        if (!val) {
          if (c.key === "status") {
            val = row.status || row.membershipStatus || row.paymentStatus
          } else if (c.key === "name") {
            val = row.name || row.fullName || row.user?.fullName
          } else if (c.key === "email") {
            val = row.email || row.user?.email
          } else if (c.key === "mobile") {
            val = row.mobile || row.user?.mobile
          } else if (c.key === "type") {
            val = row.type || row.membershipType || row.role
          }
        }

        if ((!val || typeof val === "object") && typeof c.render === "function") {
          try {
            const rendered = c.render(row)
            const extracted = extractTextFromReact(rendered)
            if (extracted) val = extracted
          } catch (e) {
            // ignore
          }
        }

        if (typeof val === "object" && val !== null) {
          val = val.fullName || val.name || val.title || val.email || val.url || JSON.stringify(val)
        }

        if (val === undefined || val === null) val = ""
        const stringVal = String(val).replace(/"/g, '""')
        return `"${stringVal}"`
      }).join(",")
    })

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers, ...rows].join("\n")
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `${title.toLowerCase().replace(/\s+/g, "_")}_export_${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast.success(`Exported ${data.length} records to CSV`)
  }

  const handleAdd = () => {
    setEditingItem(null)
    setModalOpen(true)
  }

  const handleEdit = (item) => {
    const editItem = mapEditData ? mapEditData(item) : item
    setEditingItem(editItem)
    setModalOpen(true)
  }

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this item?")) {
      await deleteItem(id)
    }
  }

  const handleSubmit = async (formData) => {
    if (editingItem) {
      await updateItem(editingItem._id || editingItem.id, formData)
    } else {
      await createItem(formData)
    }
  }

  // Auto-inject action columns if they don't exist
  const finalColumns = [...columns]
  if (!finalColumns.find(c => c.key === "actions")) {
    finalColumns.push({
      key: "actions",
      label: "Actions",
      render: (row) => {
        const custom = customActions?.(row, crud, { canCreate, canEdit, canDelete })
        const showEdit = canEdit && !hideEdit
        const showDelete = canDelete && !hideDelete

        if (disableActions && disableActions(row)) {
          return <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground opacity-60 flex gap-2"><ShieldCheck className="size-3.5" /> Protected</span>
        }

        if (!showEdit && !showDelete && !custom) {
          return <span className="text-xs font-semibold text-muted-foreground">Read only</span>
        }

        return (
          <div className="flex gap-3 text-xs font-semibold items-center">
            {showEdit && (
              <button type="button" onClick={() => handleEdit(row)} className="text-navy hover:underline flex items-center gap-1"><Edit className="size-3" /> Edit</button>
            )}
            {showDelete && (
              <button type="button" onClick={() => handleDelete(row._id || row.id)} className="text-rose-600 hover:underline flex items-center gap-1"><Trash2 className="size-3" /> Delete</button>
            )}
            {custom}
          </div>
        )
      }
    })
  }

  return (
    <div>
      <AdminPageHeader
        title={title}
        description={description}
        actions={<>
          {isExportAllowed && (
            <Button variant="outline" size="sm" onClick={handleExportCSV} className="rounded-lg">
              <Download className="size-3.5" />Export CSV
            </Button>
          )}
          {headerActions}
          {primaryAction && canCreate && <Button size="sm" onClick={handleAdd} className="rounded-lg bg-accent font-semibold text-accent-foreground hover:bg-accent/90"><Plus className="size-3.5" />{primaryAction}</Button>}
        </>}
      />

      {error && (
        <div className="mb-4 rounded-xl bg-rose-50 p-4 text-sm text-rose-700 font-medium">
          Error: {error}
        </div>
      )}

      {stats.length > 0 && <div className="mb-6 grid gap-3 sm:grid-cols-3">{stats.map((s) => <StatsCard key={s.label} {...s} />)}</div>}

      <DataTable columns={finalColumns} rows={data} loading={loading} />

      <CrudModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingItem ? `Edit ${title}` : `Add New ${title}`}
        schema={schema}
        initialData={editingItem}
        onSubmit={handleSubmit}
      />
    </div>
  )
}
export { StatusBadge }

