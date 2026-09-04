"use client"
import { useState } from "react"
import { AdminCrudPage, StatusBadge } from "@/components/admin/crud-page"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Eye, XCircle, Star, User, MessageCircleHeart, Quote } from "lucide-react"

const testimonialSchema = [
  { name: "name", label: "Name", type: "text", required: true },
  { name: "designation", label: "Designation / Role", type: "text", required: false },
  { name: "message", label: "Message", type: "textarea", required: true },
  { 
    name: "rating", 
    label: "Rating (1 to 5)", 
    type: "number", 
    required: true,
  },
  { name: "image", label: "Profile Image (Optional)", type: "file" },
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
    key: "author", 
    label: "Author Details", 
    render: (r) => (
      <div className="flex items-center gap-3">
        {r.image?.url ? (
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 border-slate-200 shadow-sm">
            <Image src={r.image.url} alt="" fill className="object-cover" />
          </div>
        ) : (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-100 border-2 border-slate-200 text-slate-400">
            <User className="size-6 opacity-70" />
          </div>
        )}
        <div>
          <div className="font-bold text-navy text-sm leading-none">{r.name}</div>
          {r.designation && (
            <div className="text-[11px] font-semibold text-emerald-600 mt-1 uppercase tracking-wide">{r.designation}</div>
          )}
        </div>
      </div>
    )
  },
  { 
    key: "message", 
    label: "Message Preview", 
    render: (r) => (
      <div className="text-sm font-medium text-slate-600 max-w-[300px] line-clamp-2 italic">
        "{r.message}"
      </div>
    )
  },
  { 
    key: "rating", 
    label: "Rating",
    render: (r) => (
      <div className="flex items-center gap-1">
        <span className="font-bold text-slate-800 mr-1">{r.rating}</span>
        {[...Array(5)].map((_, i) => (
          <Star key={i} className={`size-3.5 ${i < r.rating ? 'fill-yellow-400 text-yellow-400' : 'fill-slate-200 text-slate-200'}`} />
        ))}
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
        title="Testimonials"
        description="Manage all community and beneficiary testimonials."
        endpoint="/testimonials"
        schema={testimonialSchema}
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
                  <MessageCircleHeart className="size-5 text-white" />
                </div>
                <h3 className="font-serif text-xl font-extrabold text-white tracking-wide">
                  Testimonial Details
                </h3>
              </div>
              <button onClick={() => setViewItem(null)} className="rounded-full bg-white/10 p-2 text-white/80 transition-all hover:bg-rose-500 hover:text-white">
                <XCircle className="size-4" />
              </button>
            </div>

            {/* Body */}
            <div className="overflow-y-auto p-6 bg-slate-50/50">
              <div className="flex flex-col gap-6">
                
                {/* Author Info */}
                <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center border-2 border-slate-200 shrink-0 overflow-hidden relative">
                      {viewItem.image?.url ? (
                        <Image src={viewItem.image.url} alt={viewItem.name} fill className="object-cover" />
                      ) : (
                        <User className="size-8 text-slate-400" />
                      )}
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-0.5">Author</p>
                      <p className="text-lg font-bold text-navy">{viewItem.name}</p>
                      {viewItem.designation && (
                        <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mt-1">{viewItem.designation}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right sm:border-l sm:border-slate-100 sm:pl-6">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Current Status</p>
                    <StatusBadge status={viewItem.status} />
                  </div>
                </div>

                {/* Testimonial Message */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden relative">
                  <div className="absolute top-4 right-4 opacity-5">
                    <Quote className="size-24 text-navy" />
                  </div>
                  
                  <div className="bg-indigo-50/50 p-4 border-b border-slate-100 flex items-center justify-between relative z-10">
                    <h4 className="font-bold text-indigo-900 text-sm uppercase tracking-wide flex items-center gap-2">
                      <Quote className="size-4" /> Message
                    </h4>
                    
                    <div className="flex items-center gap-1 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">
                      <span className="font-bold text-slate-800 text-xs mr-1">{viewItem.rating}</span>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`size-3.5 ${i < viewItem.rating ? 'fill-yellow-400 text-yellow-400' : 'fill-slate-200 text-slate-200'}`} />
                      ))}
                    </div>
                  </div>
                  <div className="p-6 relative z-10">
                    <div className="text-base text-slate-700 font-medium leading-relaxed whitespace-pre-wrap italic">
                      "{viewItem.message}"
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
