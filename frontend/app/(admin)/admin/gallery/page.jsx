"use client"
import { useState } from "react"
import { AdminCrudPage, StatusBadge } from "@/components/admin/crud-page"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Eye, XCircle, Image as ImageIcon, Video, Tag } from "lucide-react"

const CATEGORIES = ["Conferences", "Seminars", "Educational Programs", "Community Initiatives", "Organizational Activities", "Lectures", "Interviews"]

const GALLERY_SCHEMA = [
  { name: "title", label: "Title", type: "text", required: true },
  { name: "description", label: "Description", type: "textarea" },
  { 
    name: "type", 
    label: "Media Type", 
    type: "select", 
    options: [
      { label: "Photo", value: "photo" },
      { label: "Video", value: "video" }
    ],
    required: true
  },
  { name: "image", label: "Image / Thumbnail (Optional)", type: "file" },
  { name: "videoUrl", label: "YouTube Embed URL (For Videos only)", type: "text" },
  { 
    name: "category", 
    label: "Category", 
    type: "select", 
    options: CATEGORIES.map(c => ({ label: c, value: c })),
  },
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
    key: "image", 
    label: "Media", 
    render: (r) => r.image?.url ? (
      <div className="relative h-12 w-20 overflow-hidden rounded-lg border border-slate-200 shadow-sm group">
        <Image src={r.image.url} alt="" fill className="object-cover" />
        {r.type === 'video' && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <Video className="size-5 text-white/90 drop-shadow-md" />
          </div>
        )}
      </div>
    ) : (
      <div className="h-12 w-20 bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400 rounded-lg border border-slate-200 shadow-sm">
        {r.type === 'video' ? <Video className="size-5" /> : <ImageIcon className="size-5" />}
      </div>
    )
  },
  { 
    key: "title", 
    label: "Title & Info", 
    render: (r) => (
      <div>
        <div className="font-bold text-navy max-w-[250px] truncate text-sm">{r.title}</div>
        <div className="text-[11px] text-slate-500 font-medium mt-0.5 flex items-center gap-1.5">
          <span className="capitalize font-bold text-slate-700">{r.type}</span> &bull; <Tag className="size-3 text-slate-400" /> <span className="truncate max-w-[150px]">{r.category || "Uncategorized"}</span>
        </div>
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
        title="Gallery"
        description="Manage photos and videos across different categories."
        endpoint="/gallery"
        schema={GALLERY_SCHEMA}
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
                Gallery Item Details
              </h3>
              <button onClick={() => setViewItem(null)} className="rounded-full bg-white/10 p-2 text-white/80 transition-all hover:bg-rose-500 hover:text-white">
                <XCircle className="size-4" />
              </button>
            </div>

            {/* Body */}
            <div className="overflow-y-auto p-6 bg-slate-50/50">
              <div className="flex flex-col gap-6">
                
                {/* Media Presentation */}
                <div className="w-full bg-slate-900 rounded-xl overflow-hidden shadow-md flex items-center justify-center border border-slate-200" style={{ minHeight: '300px', maxHeight: '450px' }}>
                  {viewItem.type === 'video' && viewItem.videoUrl ? (
                    <div className="w-full h-full aspect-video">
                      <iframe 
                        src={viewItem.videoUrl} 
                        className="w-full h-full"
                        allowFullScreen
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      ></iframe>
                    </div>
                  ) : viewItem.image?.url ? (
                    <img src={viewItem.image.url} alt={viewItem.title} className="w-full h-full object-contain max-h-[450px]" />
                  ) : (
                    <div className="text-slate-500 font-medium flex flex-col items-center gap-3">
                      {viewItem.type === 'video' ? <Video className="size-10 opacity-50" /> : <ImageIcon className="size-10 opacity-50" />}
                      <p>No Media Source Provided</p>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <div className="md:col-span-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Title</p>
                    <h4 className="text-lg font-bold text-navy leading-tight">{viewItem.title}</h4>
                    
                    {viewItem.description && (
                      <div className="mt-4">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Description</p>
                        <p className="text-sm text-slate-700 leading-relaxed">{viewItem.description}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-4 md:border-l border-slate-100 md:pl-6">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Status</p>
                      <StatusBadge status={viewItem.status} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Media Type</p>
                      <p className="text-sm font-bold text-slate-700 capitalize flex items-center gap-1.5">
                        {viewItem.type === 'video' ? <Video className="size-4 text-emerald-600" /> : <ImageIcon className="size-4 text-blue-600" />} {viewItem.type}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Category</p>
                      <p className="text-sm font-semibold text-slate-800">{viewItem.category || "Uncategorized"}</p>
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
