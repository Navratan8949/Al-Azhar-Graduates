"use client"
import { AdminCrudPage, StatusBadge } from "@/components/admin/crud-page"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const eventSchema = [
  { name: "title", label: "Event Title", type: "text", required: true },
  { name: "description", label: "Description", type: "textarea", required: true },
  { name: "location", label: "Location", type: "text", required: true },
  { name: "eventDate", label: "Event Date", type: "date", required: true },
  { name: "registrationLastDate", label: "Registration Last Date", type: "date" },
  { name: "maxParticipants", label: "Max Participants", type: "number" },
  { name: "image", label: "Event Image", type: "file" },
  { 
    name: "status", 
    label: "Status", 
    type: "select",
    options: [
      { label: "upcoming", value: "upcoming" },
      { label: "ongoing", value: "ongoing" },
      { label: "completed", value: "completed" },
      { label: "cancelled", value: "cancelled" }
    ],
    required: true
  }
]

import { Eye, Users } from "lucide-react"

export default function EventsAdminPage() {
  return (
    <AdminCrudPage
      title="Events"
      description="Manage upcoming, ongoing, and past events."
      endpoint="/events"
      schema={eventSchema}
      customActions={(item) => (
        <>
          <Button asChild variant="outline" size="sm" className="h-7 px-3 bg-navy/5 text-navy hover:bg-navy hover:text-white border-navy/20 rounded-lg ml-2">
            <Link href={`/events/${item._id}`} target="_blank">
              <Eye className="size-3.5 mr-1.5" /> View
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="h-7 px-3 bg-amber-50 text-amber-700 hover:bg-amber-600 hover:text-white border-amber-200 rounded-lg ml-2">
            <Link href={`/admin/events/${item._id}/registrations`}>
              <Users className="size-3.5 mr-1.5" /> Registrations
            </Link>
          </Button>
        </>
      )}
      columns={[
        { 
          key: "image", 
          label: "Image", 
          render: (row) => row.image?.url ? (
            <div className="h-12 w-20 overflow-hidden rounded-lg border border-slate-200 shadow-sm">
              <img src={row.image.url} alt={row.title} className="h-full w-full object-cover" />
            </div>
          ) : (
            <div className="h-12 w-20 bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400 rounded-lg border border-slate-200 shadow-sm">No IMG</div>
          )
        },
        { 
          key: "title", 
          label: "Title & Location", 
          render: (r) => (
            <div>
              <div className="font-bold text-navy max-w-[250px] truncate text-sm">{r.title}</div>
              <div className="text-[11px] text-slate-500 truncate max-w-[250px] font-medium mt-0.5">{r.location}</div>
            </div>
          ) 
        },
        { 
          key: "eventDate", 
          label: "Event Date", 
          render: (r) => r.eventDate ? (
            <div className="text-sm font-semibold text-slate-700">
              {new Date(r.eventDate).toLocaleDateString("en-IN", { day: '2-digit', month: 'short', year: 'numeric' })}
            </div>
          ) : (
            <span className="text-slate-400">-</span>
          )
        },
        { 
          key: "status", 
          label: "Status", 
          render: (r) => {
            const map = {
              upcoming: "bg-blue-100 text-blue-800 border-blue-200",
              ongoing: "bg-emerald-100 text-emerald-800 border-emerald-200",
              completed: "bg-slate-100 text-slate-700 border-slate-300",
              cancelled: "bg-rose-100 text-rose-800 border-rose-200"
            }
            const cls = map[r.status] || map.upcoming
            return <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${cls}`}>{r.status}</span>
          }
        }
      ]}
    />
  )
}
