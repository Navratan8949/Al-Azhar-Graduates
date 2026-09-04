"use client"
import { useState } from "react"
import { AdminCrudPage, StatusBadge } from "@/components/admin/crud-page"
import { Button } from "@/components/ui/button"
import { Eye, XCircle, FileText, CalendarDays, ExternalLink, Activity, BookOpen, Landmark, DollarSign, Download } from "lucide-react"

const REPORT_SCHEMA = [
  { name: "title", label: "Report Title", type: "text", required: true },
  { 
    name: "type", 
    label: "Report Type", 
    type: "select", 
    options: [
      { label: "Annual Report", value: "annual" },
      { label: "Audit Report", value: "audit" },
      { label: "Activity Report", value: "activity" },
      { label: "Financial Report", value: "financial" }
    ],
    required: true
  },
  { name: "year", label: "Year (e.g. 2024)", type: "number", required: true },
  { name: "description", label: "Description", type: "textarea" },
  { name: "pdf", label: "PDF File", type: "file" },
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

const getReportIcon = (type) => {
  switch (type) {
    case 'annual': return <BookOpen className="size-4" />;
    case 'audit': return <Landmark className="size-4" />;
    case 'financial': return <DollarSign className="size-4" />;
    case 'activity': return <Activity className="size-4" />;
    default: return <FileText className="size-4" />;
  }
}

const getReportColor = (type) => {
  switch (type) {
    case 'annual': return 'text-purple-600 bg-purple-50 border-purple-200';
    case 'audit': return 'text-rose-600 bg-rose-50 border-rose-200';
    case 'financial': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    case 'activity': return 'text-blue-600 bg-blue-50 border-blue-200';
    default: return 'text-slate-600 bg-slate-50 border-slate-200';
  }
}

const COLUMNS = [
  { 
    key: "document", 
    label: "Document Info", 
    render: (r) => (
      <div className="flex items-center gap-3">
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border shadow-sm ${getReportColor(r.type)}`}>
          {getReportIcon(r.type)}
        </div>
        <div>
          <div className="font-bold text-navy text-sm max-w-[250px] truncate">{r.title}</div>
          <div className="text-[11px] font-semibold text-slate-500 mt-1 uppercase tracking-widest flex items-center gap-1.5">
            {r.type} <span className="text-slate-300">|</span> {r.year}
          </div>
        </div>
      </div>
    )
  },
  { 
    key: "pdf", 
    label: "File", 
    render: (r) => r.pdf?.url ? (
      <a href={r.pdf.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-700 text-xs font-bold hover:bg-red-100 transition-colors border border-red-200 shadow-sm">
        <FileText className="size-3.5" /> PDF
      </a>
    ) : (
      <span className="text-[11px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-md border border-slate-200">No File</span>
    )
  },
  { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> }
]

export default function Page() {
  const [viewItem, setViewItem] = useState(null)

  return (
    <>
      <AdminCrudPage
        title="Reports"
        description="Manage Annual, Audit, and Financial Reports."
        endpoint="/reports"
        schema={REPORT_SCHEMA}
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
                <div className="bg-white/20 p-2 rounded-full border border-white/30">
                  <FileText className="size-5 text-white" />
                </div>
                <h3 className="font-serif text-xl font-extrabold text-white tracking-wide">
                  Report Details
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
                <div className="flex flex-col sm:flex-row gap-6 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  
                  {/* File Preview Icon Box */}
                  <div className="w-full sm:w-32 shrink-0 flex flex-col items-center justify-center p-4 bg-slate-50 rounded-xl border border-slate-200 shadow-inner">
                    <div className={`p-4 rounded-full bg-white shadow-sm border mb-3 ${getReportColor(viewItem.type)}`}>
                      {getReportIcon(viewItem.type)}
                    </div>
                    {viewItem.pdf?.url ? (
                      <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-1 rounded border border-emerald-100">PDF Ready</span>
                    ) : (
                      <span className="text-[10px] font-bold uppercase tracking-widest text-rose-500 bg-rose-50 px-2 py-1 rounded border border-rose-100">Missing</span>
                    )}
                  </div>

                  {/* Core Details */}
                  <div className="w-full flex flex-col justify-center">
                    <div className="flex items-center justify-between mb-2">
                      <p className={`text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 px-2 py-1 rounded-md border ${getReportColor(viewItem.type)} w-fit`}>
                        {viewItem.type} Report
                      </p>
                      <StatusBadge status={viewItem.status} />
                    </div>
                    
                    <h4 className="text-xl font-bold text-navy leading-tight mt-1 mb-4">{viewItem.title}</h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Financial Year</p>
                        <p className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                          <CalendarDays className="size-4 text-slate-400" />
                          {viewItem.year}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Document Action</p>
                        {viewItem.pdf?.url ? (
                          <a href={viewItem.pdf.url} target="_blank" rel="noreferrer" className="text-sm font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1.5 hover:underline">
                            <ExternalLink className="size-4" /> View / Download
                          </a>
                        ) : (
                          <span className="text-sm font-medium text-slate-400 italic">No document attached</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                  <h4 className="font-bold text-navy text-sm uppercase tracking-widest mb-3">Report Summary</h4>
                  {viewItem.description ? (
                    <div className="text-sm text-slate-600 font-medium leading-relaxed whitespace-pre-wrap">
                      {viewItem.description}
                    </div>
                  ) : (
                    <div className="text-sm text-slate-400 font-medium italic bg-slate-50 p-4 rounded-lg border border-slate-100 text-center">
                      No summary or description provided for this report.
                    </div>
                  )}
                </div>

              </div>
            </div>

            {/* Footer */}
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 shrink-0 flex justify-end gap-3">
              {viewItem.pdf?.url && (
                 <a href={viewItem.pdf.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 h-10 rounded-xl px-6 font-bold uppercase tracking-widest text-xs bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 transition-colors shadow-sm">
                   <Download className="size-4" /> Download PDF
                 </a>
              )}
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
