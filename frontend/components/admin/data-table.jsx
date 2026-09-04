"use client"

import { useEffect, useMemo, useState } from "react"
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100]

export function DataTable({ columns, rows, empty = "No records yet.", pagination = true, initialPageSize = 10, loading = false }) {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(initialPageSize)
  const totalRows = rows?.length || 0
  const shouldPaginate = pagination && totalRows > initialPageSize
  const totalPages = shouldPaginate ? Math.max(1, Math.ceil(totalRows / pageSize)) : 1

  useEffect(() => {
    setPage(1)
  }, [totalRows, pageSize])

  useEffect(() => {
    if (page > totalPages) setPage(totalPages)
  }, [page, totalPages])

  const visibleRows = useMemo(() => {
    if (!shouldPaginate) return rows || []

    const start = (page - 1) * pageSize
    return rows.slice(start, start + pageSize)
  }, [page, pageSize, rows, shouldPaginate])

  if (loading) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-white px-6 py-16 flex flex-col items-center justify-center text-sm text-muted-foreground shadow-soft gap-2">
        <Loader2 className="size-6 animate-spin text-navy" />
        <p>Loading data...</p>
      </div>
    )
  }

  if (!rows?.length) return <div className="rounded-2xl border border-dashed border-border bg-white px-6 py-16 text-center text-sm text-muted-foreground shadow-soft">{empty}</div>

  const startRow = shouldPaginate ? (page - 1) * pageSize + 1 : 1
  const endRow = shouldPaginate ? Math.min(page * pageSize, totalRows) : totalRows

  return (
    <div className="overflow-hidden rounded-2xl border border-border/40 bg-white shadow-[0_4px_20px_rgba(2,61,40,0.03)] transition-all hover:shadow-[0_4px_24px_rgba(2,61,40,0.06)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead><tr className="border-b border-primary/20 bg-primary">{columns.map((col) => <th key={col.key} className="px-4 py-3.5 text-[11px] font-extrabold uppercase tracking-widest text-primary-foreground">{col.label}</th>)}</tr></thead>
          <tbody>{visibleRows.map((row, i) => (
            <tr key={row.id || row._id || i} className="border-b border-border/30 last:border-0 hover:bg-primary/5 transition-colors">
              <td className="px-0 py-0 hidden"></td>{/* Dummy for spacing/layout consistency if needed */}
              {columns.map((col) => <td key={col.key} className="px-4 py-4 align-middle text-slate-700">{col.render ? col.render(row) : row[col.key]}</td>)}
            </tr>
          ))}</tbody>
        </table>
      </div>
      {shouldPaginate && (
        <div className="flex flex-col gap-3 border-t border-primary/10 bg-emerald-50/30 px-5 py-4 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <div>
            Showing <span className="font-bold text-primary">{startRow}-{endRow}</span> of <span className="font-bold text-primary">{totalRows}</span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
              Rows
              <select
                value={pageSize}
                onChange={(event) => setPageSize(Number(event.target.value))}
                className="h-8 rounded-lg border border-border bg-white px-2.5 text-sm font-semibold text-navy outline-none focus:border-navy focus:ring-2 focus:ring-navy/10 shadow-sm cursor-pointer"
              >
                {PAGE_SIZE_OPTIONS.map((size) => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </label>
            <div className="flex items-center overflow-hidden rounded-lg border border-border bg-white shadow-sm">
              <button
                type="button"
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                disabled={page === 1}
                className={cn("inline-flex size-8 items-center justify-center text-navy transition hover:bg-slate-100 disabled:pointer-events-none disabled:opacity-40")}
                aria-label="Previous page"
              >
                <ChevronLeft className="size-4" />
              </button>
              <span className="min-w-[4rem] border-x border-border px-3 text-center text-xs font-bold leading-8 text-navy bg-slate-50">
                {page} / {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                disabled={page === totalPages}
                className={cn("inline-flex size-8 items-center justify-center text-navy transition hover:bg-slate-100 disabled:pointer-events-none disabled:opacity-40")}
                aria-label="Next page"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
export function StatusBadge({ status }) {
  const map = { 
    approved: "bg-emerald-100 text-emerald-800 border-emerald-200", 
    verified: "bg-emerald-100 text-emerald-800 border-emerald-200", 
    success: "bg-emerald-100 text-emerald-800 border-emerald-200", 
    active: "bg-emerald-100 text-emerald-800 border-emerald-200", 
    pending: "bg-amber-100 text-amber-800 border-amber-200", 
    rejected: "bg-rose-100 text-rose-800 border-rose-200", 
    resolved: "bg-blue-100 text-blue-800 border-blue-200" 
  }
  const cls = map[String(status || "").toLowerCase()] || "bg-slate-100 text-slate-700 border-slate-200"
  return <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider border ${cls}`}>{status}</span>
}
