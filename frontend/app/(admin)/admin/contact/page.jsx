"use client"
import { useState } from "react"
import { AdminCrudPage, StatusBadge } from "@/components/admin/crud-page"
import { Button } from "@/components/ui/button"
import { Eye, XCircle, Mail, Phone, User, CalendarDays, MessageSquare, Briefcase } from "lucide-react"

export default function Page() {
  const [viewItem, setViewItem] = useState(null)

  const schema = [
    { 
      name: "status", 
      label: "Status", 
      type: "select", 
      required: true,
      options: [
        { label: "Pending", value: "pending" },
        { label: "In Progress", value: "in_progress" },
        { label: "Resolved", value: "resolved" }
      ]
    }
  ]

  const columns = [
    { 
      key: "sender", 
      label: "Sender Details", 
      render: (r) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 border border-blue-100">
            <User className="size-5 text-blue-500" />
          </div>
          <div>
            <div className="font-bold text-navy text-sm">{r.name}</div>
            <div className="text-[11px] font-medium text-slate-500 mt-0.5">{r.email}</div>
          </div>
        </div>
      )
    },
    { 
      key: "subject", 
      label: "Enquiry Subject", 
      render: (r) => (
        <div>
          <div className="font-bold text-slate-800 text-sm max-w-[250px] truncate">{r.subject}</div>
          <div className="text-[11px] font-medium text-slate-500 mt-0.5 flex items-center gap-1.5">
            <CalendarDays className="size-3 text-slate-400" />
            {new Date(r.createdAt).toLocaleDateString("en-IN", { day: '2-digit', month: 'short', year: 'numeric' })}
          </div>
        </div>
      )
    },
    { 
      key: "mobile", 
      label: "Phone", 
      render: (r) => (
        <div className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
          <Phone className="size-3.5 text-slate-400" /> {r.mobile}
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
        title="Enquiries"
        description="Manage contact form submissions from the public website."
        endpoint="/contact"
        schema={schema}
        columns={columns}
        primaryAction={null} // Cannot create enquiries from admin panel
        hideDelete={true} // Enquiries should be resolved, not deleted
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
                <div className="bg-white/20 p-2 rounded-full">
                  <Briefcase className="size-5 text-white" />
                </div>
                <h3 className="font-serif text-xl font-extrabold text-white tracking-wide">
                  Enquiry Details
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
                <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 bg-blue-50 rounded-full flex items-center justify-center border border-blue-100 shrink-0">
                      <User className="size-7 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Sender Info</p>
                      <p className="text-base font-bold text-navy">{viewItem.name}</p>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2">
                        <a href={`mailto:${viewItem.email}`} className="text-xs font-semibold text-blue-600 flex items-center gap-1.5 hover:underline">
                          <Mail className="size-3.5" /> {viewItem.email}
                        </a>
                        {viewItem.mobile && (
                          <a href={`tel:${viewItem.mobile}`} className="text-xs font-semibold text-slate-600 flex items-center gap-1.5 hover:underline">
                            <Phone className="size-3.5" /> {viewItem.mobile}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right sm:border-l sm:border-slate-100 sm:pl-6">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Current Status</p>
                    <StatusBadge status={viewItem.status} />
                  </div>
                </div>

                {/* Message Content */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="bg-blue-50/50 p-4 border-b border-slate-100 flex items-center gap-2">
                    <MessageSquare className="size-4 text-blue-600" />
                    <h4 className="font-bold text-navy text-sm uppercase tracking-wide">Subject / Message</h4>
                  </div>
                  <div className="p-5">
                    <h5 className="text-lg font-bold text-slate-800 mb-3 leading-tight">{viewItem.subject}</h5>
                    <div className="text-sm text-slate-600 font-medium leading-relaxed whitespace-pre-wrap bg-slate-50 p-4 rounded-lg border border-slate-100">
                      {viewItem.message}
                    </div>
                    <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                        <CalendarDays className="size-3.5" />
                        Received on: {new Date(viewItem.createdAt).toLocaleString("en-IN", { dateStyle: 'medium', timeStyle: 'short' })}
                      </div>
                      
                      {viewItem.status === 'pending' && (
                        <div className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-md border border-amber-100">
                          Needs Attention
                        </div>
                      )}
                    </div>
                  </div>
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
