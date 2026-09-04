"use client"
import { useEffect, useState } from "react"
import api from "@/service/api"
import { Loader2, CalendarDays, MapPin } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Page() {
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchRegistrations() {
      try {
        const res = await api.get("/event-registration/me")
        setRegistrations(res.data?.registrations || [])
      } catch (err) {
        // Normal if 404
      } finally {
        setLoading(false)
      }
    }
    fetchRegistrations()
  }, [])

  if (loading) return <div className="py-10 text-center"><Loader2 className="mx-auto size-6 animate-spin text-navy" /></div>

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold">Event Registrations</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage your participation in upcoming trust events.</p>
        </div>
        <Button asChild className="rounded-xl bg-navy text-white hover:bg-navy/90">
          <Link href="/events">Explore New Events</Link>
        </Button>
      </div>

      {registrations.length === 0 ? (
        <div className="rounded-2xl border border-border/60 bg-white p-10 text-center shadow-soft">
          <CalendarDays className="mx-auto size-12 text-muted-foreground/40" />
          <h2 className="mt-4 font-serif text-lg font-bold">No Registrations Yet</h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">You have not registered for any events yet. Check out our upcoming events to get involved.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border/60 bg-white shadow-soft">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-secondary/40 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-6 py-4 font-semibold">Event</th>
                  <th className="px-6 py-4 font-semibold">Date & Location</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Registered On</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {registrations.map((reg) => (
                  <tr key={reg._id} className="transition-colors hover:bg-slate-50/50">
                    <td className="px-6 py-4">
                      <p className="font-serif text-base font-bold text-navy">{reg.event?.title || "Unknown Event"}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-slate-600">
                          <CalendarDays className="size-3.5 shrink-0" />
                          <span>{reg.event?.eventDate ? new Date(reg.event.eventDate).toLocaleDateString() : "TBD"}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <MapPin className="size-3.5 shrink-0" />
                          <span className="truncate max-w-[200px]">{reg.event?.location || "TBD"}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        reg.status === 'approved' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                        reg.status === 'cancelled' ? 'bg-rose-50 text-rose-600 border border-rose-100' :
                        'bg-amber-50 text-amber-600 border border-amber-100'
                      }`}>
                        {reg.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-muted-foreground">
                      {new Date(reg.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
