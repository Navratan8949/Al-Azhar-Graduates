"use client"
import { useState } from "react"
import { AdminCrudPage, StatusBadge } from "@/components/admin/crud-page"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Eye, XCircle, Trophy, Medal, Building2, CalendarDays } from "lucide-react"

const awardSchema = [
  { name: "title", label: "Award Title", type: "text", required: true },
  { name: "awardedBy", label: "Awarded By", type: "text", required: false },
  { name: "year", label: "Year", type: "number", required: true },
  { name: "description", label: "Description", type: "textarea", required: false },
  { name: "image", label: "Award Image (Optional)", type: "file" },
  { 
    name: "status", 
    label: "Status", 
    type: "select", 
    required: true,
    options: [
      { label: "Active", value: "active" },
      { label: "Inactive", value: "inactive" }
    ] 
  }
]

const COLUMNS = [
  { 
    key: "image", 
    label: "Trophy / Image", 
    render: (r) => r.image?.url ? (
      <div className="relative h-12 w-16 overflow-hidden rounded-lg border border-slate-200 shadow-sm bg-slate-50">
        <Image src={r.image.url} alt="" fill className="object-contain p-1" />
      </div>
    ) : (
      <div className="h-12 w-16 bg-slate-100 flex flex-col items-center justify-center text-[10px] font-bold text-slate-400 rounded-lg border border-slate-200 shadow-sm">
        <Trophy className="size-5 text-amber-400/60 mb-0.5" />
      </div>
    ) 
  },
  { 
    key: "awardDetails", 
    label: "Award Details", 
    render: (r) => (
      <div>
        <div className="font-bold text-navy max-w-[250px] truncate text-sm flex items-center gap-1.5">
          {r.title}
        </div>
        <div className="text-[11px] font-medium text-slate-500 mt-1 flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1"><CalendarDays className="size-3 text-slate-400" /> {r.year}</span>
          <span className="text-slate-300">|</span>
          <span className="flex items-center gap-1 max-w-[150px] truncate"><Building2 className="size-3 text-slate-400" /> {r.awardedBy || "Unknown"}</span>
        </div>
      </div>
    ) 
  },
  { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> }
]

export default function Page() {
  const [viewItem, setViewItem] = useState(null)

  return (
    <>
      <AdminCrudPage
        title="Awards"
        description="Manage all awards, accolades, and certificates received by the Association."
        endpoint="/awards"
        schema={awardSchema}
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
              <div className="flex items-center gap-3">
                <div className="bg-amber-400/20 p-2 rounded-full border border-amber-400/30">
                  <Trophy className="size-5 text-amber-400" />
                </div>
                <h3 className="font-serif text-xl font-extrabold text-white tracking-wide">
                  Award Details
                </h3>
              </div>
              <button onClick={() => setViewItem(null)} className="rounded-full bg-white/10 p-2 text-white/80 transition-all hover:bg-rose-500 hover:text-white">
                <XCircle className="size-4" />
              </button>
            </div>

            {/* Body */}
            <div className="overflow-y-auto p-6 bg-slate-50/50">
              <div className="flex flex-col gap-6">
                
                {/* Meta Header */}
                <div className="flex flex-col md:flex-row gap-6 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  
                  {/* Image Presentation */}
                  <div className="w-full md:w-1/3 shrink-0 flex flex-col items-center justify-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                    {viewItem.image?.url ? (
                      <div className="relative h-32 w-full max-w-[150px]">
                        <Image src={viewItem.image.url} alt={viewItem.title} fill className="object-contain" />
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-slate-300 gap-2 h-32">
                        <Trophy className="size-16 opacity-50 text-amber-400/50" />
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">No Image</span>
                      </div>
                    )}
                  </div>

                  {/* Core Details */}
                  <div className="w-full md:w-2/3 flex flex-col justify-center">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-bold uppercase tracking-widest text-amber-600 flex items-center gap-1.5 bg-amber-50 px-2 py-1 rounded-md border border-amber-100 w-fit">
                        <Medal className="size-3.5" /> Award
                      </p>
                      <StatusBadge status={viewItem.status} />
                    </div>
                    
                    <h4 className="text-xl font-bold text-navy leading-tight mt-1 mb-4">{viewItem.title}</h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Awarded By</p>
                        <p className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                          <Building2 className="size-4 text-slate-400" />
                          {viewItem.awardedBy || "Unknown Organization"}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Received Year</p>
                        <p className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                          <CalendarDays className="size-4 text-slate-400" />
                          {viewItem.year}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                  <h4 className="font-bold text-navy text-sm uppercase tracking-widest mb-3">Award Description</h4>
                  {viewItem.description ? (
                    <div className="text-sm text-slate-600 font-medium leading-relaxed whitespace-pre-wrap">
                      {viewItem.description}
                    </div>
                  ) : (
                    <div className="text-sm text-slate-400 font-medium italic bg-slate-50 p-4 rounded-lg border border-slate-100 text-center">
                      No description provided for this award.
                    </div>
                  )}
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
