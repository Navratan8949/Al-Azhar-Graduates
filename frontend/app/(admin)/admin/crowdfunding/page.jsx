"use client"
import { useState, useEffect } from "react"
import { AdminCrudPage, StatusBadge } from "@/components/admin/crud-page"
import { getProjects } from "@/service/project.service"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Eye, XCircle, TrendingUp, Target } from "lucide-react"

export default function Page() {
  const [viewItem, setViewItem] = useState(null)

  const schema = [
    { name: "title", label: "Campaign Title", required: true },
    { name: "description", label: "Description", type: "textarea", required: true },
    { name: "targetAmount", label: "Target Amount (₹)", type: "number", required: true },
    { name: "raisedAmount", label: "Raised Amount (₹)", type: "number", required: false },
    { name: "startDate", label: "Start Date", type: "date", required: false },
    { name: "endDate", label: "End Date", type: "date", required: false },
    { name: "status", label: "Status", type: "select", required: true, options: [
      { label: "Active", value: "active" },
      { label: "Completed", value: "completed" },
      { label: "Closed", value: "closed" }
    ]},
    { name: "image", label: "Campaign Image", type: "file", required: false }
  ]

  const columns = [
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
      label: "Campaign Info", 
      render: (r) => (
        <div>
          <div className="font-bold text-navy max-w-[220px] truncate text-sm">{r.title}</div>
        </div>
      ) 
    },
    { 
      key: "funds", 
      label: "Funds", 
      render: (r) => (
        <div>
          <div className="text-[11px] font-semibold text-slate-500 mb-0.5"><Target className="size-3 inline-block mr-1 text-slate-400" />Target: ₹{r.targetAmount?.toLocaleString("en-IN") || 0}</div>
          <div className="text-sm font-bold text-emerald-600"><TrendingUp className="size-3.5 inline-block mr-1 text-emerald-500" />Raised: ₹{r.raisedAmount?.toLocaleString("en-IN") || 0}</div>
        </div>
      )
    },
    { 
      key: "status", 
      label: "Status", 
      render: (r) => <StatusBadge status={r.status} /> 
    }
  ]

  return (
    <>
      <AdminCrudPage
        title="Campaigns"
        description="Manage crowdfunding campaigns and track donations."
        endpoint="/crowdfunding"
        schema={schema}
        columns={columns}
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
              <h3 className="font-serif text-xl font-extrabold text-white tracking-wide">Campaign Details</h3>
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
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Campaign Title</p>
                    <h4 className="text-lg font-bold text-navy leading-tight">{viewItem.title}</h4>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 pt-2">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Status</p>
                      <StatusBadge status={viewItem.status} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Start Date</p>
                      <p className="text-sm font-semibold text-slate-800">{viewItem.startDate ? new Date(viewItem.startDate).toLocaleDateString() : "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">End Date</p>
                      <p className="text-sm font-semibold text-slate-800">{viewItem.endDate ? new Date(viewItem.endDate).toLocaleDateString() : "N/A"}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Funding Progress */}
              <div className="mt-8 rounded-xl border border-emerald-100 bg-emerald-50 p-5 shadow-sm">
                <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-700 mb-4">Funding Progress</p>
                <div className="flex justify-between items-end mb-2">
                  <div>
                    <p className="text-sm font-semibold text-emerald-800 mb-0.5">Raised Amount</p>
                    <p className="text-2xl font-bold text-emerald-600">₹{viewItem.raisedAmount?.toLocaleString("en-IN") || 0}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-semibold text-slate-500 mb-1">Target Amount</p>
                    <p className="text-lg font-bold text-slate-700">₹{viewItem.targetAmount?.toLocaleString("en-IN") || 0}</p>
                  </div>
                </div>
                {/* Progress Bar */}
                <div className="w-full bg-emerald-200/50 rounded-full h-2.5 mt-4 overflow-hidden">
                  <div className="bg-emerald-500 h-2.5 rounded-full transition-all" style={{ width: `${Math.min(((viewItem.raisedAmount || 0) / (viewItem.targetAmount || 1)) * 100, 100)}%` }}></div>
                </div>
                <div className="text-right mt-1.5">
                  <span className="text-[11px] font-bold text-emerald-700">{Math.round(((viewItem.raisedAmount || 0) / (viewItem.targetAmount || 1)) * 100)}% Funded</span>
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
