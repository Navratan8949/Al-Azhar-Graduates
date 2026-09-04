"use client"
import { useState } from "react"
import { AdminCrudPage, StatusBadge } from "@/components/admin/crud-page"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Eye, XCircle, User, Mail, Phone, Link as LinkIcon, BadgeCheck, UsersRound } from "lucide-react"

const TEAM_SCHEMA = [
  { name: "name", label: "Name", type: "text", required: true },
  { name: "designation", label: "Designation", type: "text", required: true },
  { name: "email", label: "Email (Optional)", type: "email" },
  { name: "phone", label: "Phone (Optional)", type: "text" },
  { name: "website", label: "Website / Social Link (Optional)", type: "text" },
  { name: "photo", label: "Photo (Optional)", type: "file" },
  { name: "order", label: "Display Order", type: "number" },
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
  { 
    key: "member", 
    label: "Team Member", 
    render: (r) => (
      <div className="flex items-center gap-3">
        {r.photo?.url ? (
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 border-slate-200 shadow-sm">
            <Image src={r.photo.url} alt="" fill className="object-cover" />
          </div>
        ) : (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-100 border-2 border-slate-200 text-slate-400">
            <User className="size-6 opacity-70" />
          </div>
        )}
        <div>
          <div className="font-bold text-navy text-sm leading-none">{r.name}</div>
          <div className="text-[11px] font-semibold text-emerald-600 mt-1 uppercase tracking-wide">{r.designation}</div>
        </div>
      </div>
    )
  },
  { 
    key: "contact", 
    label: "Contact Info", 
    render: (r) => (
      <div className="flex flex-col gap-1">
        {r.email && (
          <div className="text-[11px] font-medium text-slate-600 flex items-center gap-1.5">
            <Mail className="size-3" /> {r.email}
          </div>
        )}
        {r.phone && (
          <div className="text-[11px] font-medium text-slate-600 flex items-center gap-1.5">
            <Phone className="size-3" /> {r.phone}
          </div>
        )}
        {!r.email && !r.phone && <span className="text-xs text-slate-400 font-medium">N/A</span>}
      </div>
    )
  },
  { key: "order", label: "Order", render: (r) => <span className="font-bold text-navy/70">{r.order || 0}</span> },
  { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> }
]

export default function Page() {
  const [viewItem, setViewItem] = useState(null)

  return (
    <>
      <AdminCrudPage
        title="Team"
        description="Manage the management team and leadership members."
        endpoint="/team"
        schema={TEAM_SCHEMA}
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
                <div className="bg-white/20 p-2 rounded-full">
                  <UsersRound className="size-5 text-white" />
                </div>
                <h3 className="font-serif text-xl font-extrabold text-white tracking-wide">
                  Team Member Profile
                </h3>
              </div>
              <button onClick={() => setViewItem(null)} className="rounded-full bg-white/10 p-2 text-white/80 transition-all hover:bg-rose-500 hover:text-white">
                <XCircle className="size-4" />
              </button>
            </div>

            {/* Body */}
            <div className="overflow-y-auto p-6 bg-slate-50/50">
              <div className="flex flex-col gap-6">
                
                {/* Profile Card */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col sm:flex-row">
                  
                  {/* Photo Side */}
                  <div className="w-full sm:w-1/3 bg-slate-100 flex flex-col items-center justify-center p-6 border-b sm:border-b-0 sm:border-r border-slate-200">
                    <div className="relative h-32 w-32 rounded-full overflow-hidden border-4 border-white shadow-md mb-4 bg-white">
                      {viewItem.photo?.url ? (
                        <Image src={viewItem.photo.url} alt={viewItem.name} fill className="object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-slate-300">
                          <User className="size-16" />
                        </div>
                      )}
                    </div>
                    <StatusBadge status={viewItem.status} />
                  </div>

                  {/* Details Side */}
                  <div className="w-full sm:w-2/3 p-6 flex flex-col justify-center">
                    <h4 className="text-2xl font-bold text-navy leading-tight">{viewItem.name}</h4>
                    <p className="text-sm font-bold text-emerald-600 uppercase tracking-widest mt-1 mb-6 flex items-center gap-1.5">
                      <BadgeCheck className="size-4" /> {viewItem.designation}
                    </p>

                    <div className="space-y-3">
                      {viewItem.email && (
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                            <Mail className="size-4 text-slate-600" />
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase">Email Address</p>
                            <a href={`mailto:${viewItem.email}`} className="text-sm font-semibold text-navy hover:text-blue-600">{viewItem.email}</a>
                          </div>
                        </div>
                      )}

                      {viewItem.phone && (
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                            <Phone className="size-4 text-slate-600" />
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase">Phone Number</p>
                            <a href={`tel:${viewItem.phone}`} className="text-sm font-semibold text-navy hover:text-blue-600">{viewItem.phone}</a>
                          </div>
                        </div>
                      )}

                      {viewItem.website && (
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                            <LinkIcon className="size-4 text-slate-600" />
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase">Social / Website</p>
                            <a href={viewItem.website} target="_blank" rel="noreferrer" className="text-sm font-semibold text-blue-600 hover:underline line-clamp-1">{viewItem.website}</a>
                          </div>
                        </div>
                      )}
                      
                      {!viewItem.email && !viewItem.phone && !viewItem.website && (
                         <div className="text-sm text-slate-500 font-medium italic mt-2">
                           No additional contact information provided.
                         </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Display Order Meta */}
                <div className="bg-white px-6 py-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Display Order</p>
                    <p className="text-xs font-medium text-slate-700 mt-0.5">Determines the sequence in the Team section</p>
                  </div>
                  <div className="h-10 w-10 bg-navy text-white font-bold rounded-lg flex items-center justify-center shadow-inner">
                    {viewItem.order || 0}
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
