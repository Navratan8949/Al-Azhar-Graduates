"use client"
import { useState } from "react"
import { AdminCrudPage, StatusBadge } from "@/components/admin/crud-page"
import { Button } from "@/components/ui/button"
import { Eye, XCircle, AlertCircle, User, CalendarDays, MessageSquare, ReplyAll, Send } from "lucide-react"

export default function Page() {
  const [viewItem, setViewItem] = useState(null)

  const schema = [
    { name: "reply", label: "Admin Reply", type: "textarea", required: true },
    {
      name: "status",
      label: "Status",
      type: "select",
      required: true,
      options: [
        { label: "Pending", value: "pending" },
        { label: "In Progress", value: "in_progress" },
        { label: "Resolved", value: "resolved" },
        { label: "Closed", value: "closed" }
      ]
    }
  ]

  const columns = [
    { 
      key: "member", 
      label: "Member Details", 
      render: (r) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 border border-slate-200">
            <User className="size-5 text-slate-500" />
          </div>
          <div>
            <div className="font-bold text-navy text-sm">{r.member?.user?.fullName || "Unknown Member"}</div>
            {r.member?.membershipId && (
              <div className="text-[10px] font-bold text-slate-500">ID: {r.member.membershipId}</div>
            )}
          </div>
        </div>
      )
    },
    { 
      key: "subject", 
      label: "Complaint Info", 
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
      key: "status", 
      label: "Status", 
      render: (r) => <StatusBadge status={r.status} /> 
    },
    { 
      key: "reply", 
      label: "Reply Status", 
      render: (r) => (
        <span className={`text-[11px] font-bold uppercase px-2 py-1 rounded-full ${r.reply ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
          {r.reply ? "Replied" : "No Reply"}
        </span>
      )
    }
  ]

  return (
    <>
      <AdminCrudPage
        title="Member Complaints"
        description="View and resolve complaints or queries raised by registered members."
        endpoint="/complaints"
        schema={schema}
        columns={columns}
        primaryAction={null} // Disable creation from admin
        hideDelete={true} // Complaints should only be resolved, not deleted
        disableActions={(row) => row.status === "closed"} // cannot edit if closed
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
                  <AlertCircle className="size-5 text-white" />
                </div>
                <h3 className="font-serif text-xl font-extrabold text-white tracking-wide">
                  Complaint Details
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
                <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200">
                      <User className="size-6 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-0.5">Submitted By</p>
                      <p className="text-sm font-bold text-navy">{viewItem.member?.user?.fullName || "Unknown Member"}</p>
                      {viewItem.member?.membershipId && (
                        <p className="text-xs font-semibold text-slate-500">ID: {viewItem.member.membershipId}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">Current Status</p>
                    <StatusBadge status={viewItem.status} />
                  </div>
                </div>

                {/* Complaint Content */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="bg-rose-50/50 p-4 border-b border-slate-100 flex items-center gap-2">
                    <MessageSquare className="size-4 text-rose-600" />
                    <h4 className="font-bold text-navy text-sm uppercase tracking-wide">Issue / Subject</h4>
                  </div>
                  <div className="p-5">
                    <h5 className="text-lg font-bold text-slate-800 mb-3 leading-tight">{viewItem.subject}</h5>
                    <div className="text-sm text-slate-600 font-medium leading-relaxed whitespace-pre-wrap bg-slate-50 p-4 rounded-lg border border-slate-100">
                      {viewItem.message}
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-slate-400">
                      <CalendarDays className="size-3.5" />
                      Submitted on: {new Date(viewItem.createdAt).toLocaleString("en-IN", { dateStyle: 'medium', timeStyle: 'short' })}
                    </div>
                  </div>
                </div>

                {/* Admin Reply */}
                {viewItem.reply && (
                  <div className="bg-emerald-50/30 rounded-xl border border-emerald-100 shadow-sm overflow-hidden">
                    <div className="bg-emerald-100/50 p-4 border-b border-emerald-100 flex items-center gap-2">
                      <ReplyAll className="size-4 text-emerald-700" />
                      <h4 className="font-bold text-emerald-900 text-sm uppercase tracking-wide">Admin Response</h4>
                    </div>
                    <div className="p-5">
                      <div className="text-sm text-emerald-800 font-medium leading-relaxed whitespace-pre-wrap">
                        {viewItem.reply}
                      </div>
                      <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-emerald-600/70">
                        <Send className="size-3.5" />
                        Response recorded in system
                      </div>
                    </div>
                  </div>
                )}
                {!viewItem.reply && viewItem.status !== 'closed' && (
                  <div className="bg-orange-50/50 border border-orange-100 p-4 rounded-xl flex items-start gap-3">
                    <AlertCircle className="size-5 text-orange-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-orange-800">Action Required</p>
                      <p className="text-xs font-medium text-orange-700 mt-1">This complaint has not been replied to yet. Please use the edit (pencil) icon in the table to add your response and update the status.</p>
                    </div>
                  </div>
                )}
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
