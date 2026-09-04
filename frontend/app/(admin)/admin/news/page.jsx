"use client"
import { useState } from "react"
import { AdminCrudPage, StatusBadge } from "@/components/admin/crud-page"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Eye, XCircle, Newspaper, Tag, CalendarDays } from "lucide-react"

const NEWS_SCHEMA = [
  { name: "title", label: "Title", type: "text", required: true },
  { name: "description", label: "Content / Description", type: "textarea", required: true },
  { name: "image", label: "Cover Image (Optional)", type: "file" },
  { 
    name: "category", 
    label: "Category", 
    type: "select", 
    options: [
      { label: "News", value: "news" },
      { label: "Press Release", value: "press_release" },
      { label: "Article", value: "article" },
      { label: "Interview", value: "interview" },
      { label: "Event Report", value: "event_report" }
    ],
    required: true
  },
  { 
    name: "status", 
    label: "Status", 
    type: "select", 
    options: [
      { label: "Draft", value: "draft" },
      { label: "Published", value: "published" }
    ],
    required: true
  }
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
      <div className="h-12 w-20 bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400 rounded-lg border border-slate-200 shadow-sm">
        <Newspaper className="size-5 opacity-50" />
      </div>
    ) 
  },
  { 
    key: "title", 
    label: "News Title", 
    render: (r) => (
      <div>
        <div className="font-bold text-navy max-w-[250px] truncate text-sm">{r.title}</div>
        <div className="text-[11px] text-slate-500 font-medium mt-0.5 flex items-center gap-1.5">
          <Tag className="size-3 text-slate-400" /> <span className="capitalize">{r.category?.replace("_", " ")}</span>
        </div>
      </div>
    )
  },
  { 
    key: "publishedAt", 
    label: "Date", 
    render: (r) => (
      <div className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
        <CalendarDays className="size-3.5 text-slate-400" />
        {new Date(r.publishedAt || r.createdAt).toLocaleDateString("en-IN", { day: '2-digit', month: 'short', year: 'numeric' })}
      </div>
    ) 
  },
  { 
    key: "status", 
    label: "Status", 
    render: (r) => <StatusBadge status={r.status} /> 
  }
]

export default function Page() {
  const [viewItem, setViewItem] = useState(null)

  return (
    <>
      <AdminCrudPage
        title="News & Press"
        description="Manage news articles and press releases."
        endpoint="/news"
        schema={NEWS_SCHEMA}
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
          <div className="w-full max-w-3xl rounded-2xl bg-white shadow-2xl overflow-hidden flex flex-col max-h-[90vh] ring-1 ring-black/5">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-navy/5 bg-gradient-to-r from-navy to-[#022c1d] px-6 py-5 shrink-0">
              <h3 className="font-serif text-xl font-extrabold text-white tracking-wide">
                News Article
              </h3>
              <button onClick={() => setViewItem(null)} className="rounded-full bg-white/10 p-2 text-white/80 transition-all hover:bg-rose-500 hover:text-white">
                <XCircle className="size-4" />
              </button>
            </div>

            {/* Body */}
            <div className="overflow-y-auto p-6 bg-slate-50/50">
              {/* Image Section */}
              {viewItem.image?.url ? (
                <div className="relative w-full h-64 md:h-80 overflow-hidden rounded-xl border border-slate-200 shadow-sm mb-6 bg-slate-900">
                  <Image src={viewItem.image.url} alt={viewItem.title} fill className="object-cover opacity-90" />
                </div>
              ) : (
                <div className="w-full h-32 rounded-xl bg-slate-100 flex flex-col items-center justify-center text-sm font-bold text-slate-400 border border-slate-200 shadow-sm mb-6">
                  <Newspaper className="size-8 opacity-50 mb-2" />
                  No Cover Image
                </div>
              )}

              {/* Title & Meta Info */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-6">
                <h4 className="text-2xl font-bold text-navy leading-tight mb-4">{viewItem.title}</h4>
                
                <div className="flex flex-wrap gap-4 sm:gap-8 border-t border-slate-100 pt-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Status</p>
                    <StatusBadge status={viewItem.status} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Category</p>
                    <p className="text-sm font-semibold text-slate-800 capitalize flex items-center gap-1.5">
                      <Tag className="size-4 text-emerald-600" /> {viewItem.category?.replace("_", " ")}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Published Date</p>
                    <p className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                      <CalendarDays className="size-4 text-blue-600" /> {new Date(viewItem.publishedAt || viewItem.createdAt).toLocaleDateString("en-IN", { day: '2-digit', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Content / Description */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">Content</p>
                <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap font-medium">
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
