"use client"
import { useState } from "react"
import { AdminCrudPage, StatusBadge } from "@/components/admin/crud-page"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Eye, XCircle } from "lucide-react"

const PROJECT_SCHEMA = [
  { name: "title", label: "Program Title", type: "text", required: true },
  { name: "description", label: "Description", type: "textarea", required: true },
  { name: "image", label: "Image", type: "file" },
  { 
    name: "status", 
    label: "Status", 
    type: "select", 
    options: [
      { label: "Active", value: "active" },
      { label: "Completed", value: "completed" },
      { label: "Upcoming", value: "upcoming" }
    ],
    required: true
  },
  { name: "isFeatured", label: "Is Featured?", type: "boolean" }
]

const COLUMNS = [
  { 
    key: "image", 
    label: "Image", 
    render: (r) => r.image?.url ? (
      <div className="relative h-12 w-20 overflow-hidden rounded-lg border border-slate-200 shadow-sm">
        <Image src={r.image.url} alt="" fill className="object-cover" />
      </div>
    ) : (
      <div className="h-12 w-20 bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400 rounded-lg border border-slate-200 shadow-sm">No IMG</div>
    )
  },
  { 
    key: "title", 
    label: "Title", 
    render: (r) => <div className="font-bold text-navy max-w-[250px] truncate text-sm">{r.title}</div> 
  },
  { 
    key: "status", 
    label: "Status", 
    render: (r) => <StatusBadge status={r.status} /> 
  },
  { 
    key: "isFeatured", 
    label: "Featured", 
    render: (r) => r.isFeatured ? (
      <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest border bg-amber-100 text-amber-800 border-amber-200">Yes</span>
    ) : (
      <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest border bg-slate-100 text-slate-500 border-slate-200">No</span>
    )
  }
]

export default function Page() {
  const [viewItem, setViewItem] = useState(null)

  return (
    <>
      <AdminCrudPage
        title="Programs & Activities"
        description="Manage ongoing educational and outreach programs."
        endpoint="/projects"
        schema={PROJECT_SCHEMA}
        columns={COLUMNS}
        customActions={(item) => (
          <Button 
            onClick={() => setViewItem(item)} 
            variant="outline" 
            size="sm" 
            className="h-7 px-3 bg-navy/5 text-navy hover:bg-navy hover:text-white border-navy/20 rounded-lg ml-2"
          >
            <Eye className="size-3.5 mr-1.5" /> View
          </Button>
        )}
      />

      {viewItem && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-navy/60 backdrop-blur-md p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl overflow-hidden flex flex-col max-h-[90vh] ring-1 ring-black/5">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-navy/5 bg-gradient-to-r from-navy to-[#022c1d] px-6 py-5 shrink-0">
              <h3 className="font-serif text-xl font-extrabold text-white tracking-wide">Program Details</h3>
              <button onClick={() => setViewItem(null)} className="rounded-full bg-white/10 p-2 text-white/80 transition-all hover:bg-rose-500 hover:text-white">
                <XCircle className="size-4" />
              </button>
            </div>

            {/* Body */}
            <div className="overflow-y-auto p-6 bg-slate-50/50">
              <div className="flex flex-col md:flex-row gap-6">
                
                {/* Image */}
                <div className="shrink-0">
                  {viewItem.image?.url ? (
                    <div className="relative h-40 w-full md:w-56 overflow-hidden rounded-xl border border-slate-200 shadow-sm">
                      <Image src={viewItem.image.url} alt="" fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="h-40 w-full md:w-56 rounded-xl bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-400 border border-slate-200 shadow-sm">
                      No Image Provided
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 space-y-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Title</p>
                    <h4 className="text-lg font-bold text-navy leading-tight">{viewItem.title}</h4>
                  </div>
                  
                  <div className="flex flex-wrap gap-4">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Status</p>
                      <StatusBadge status={viewItem.status} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Featured</p>
                      {viewItem.isFeatured ? (
                        <span className="inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-widest border bg-amber-100 text-amber-800 border-amber-200">Yes</span>
                      ) : (
                        <span className="inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-widest border bg-slate-100 text-slate-500 border-slate-200">No</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Description</p>
                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {viewItem.description}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 shrink-0 flex justify-end">
              <Button variant="outline" onClick={() => setViewItem(null)} className="h-10 rounded-xl px-6 font-bold uppercase tracking-widest text-xs text-slate-600 hover:bg-slate-200 hover:text-navy">
                Close
              </Button>
            </div>

          </div>
        </div>
      )}
    </>
  )
}
