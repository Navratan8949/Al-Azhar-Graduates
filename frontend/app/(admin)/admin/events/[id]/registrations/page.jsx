"use client"
import { useState, useEffect, use } from "react"
import { ArrowLeft, Loader2, User, Phone, Mail, Calendar, CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"
import { getRegistrationsByEvent, updateRegistrationStatus } from "@/service/event-registration.service"

export default function AdminEventRegistrationsPage({ params }) {
  const resolvedParams = use(params)
  const eventId = resolvedParams.id
  
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchRegistrations()
  }, [eventId])

  const fetchRegistrations = async () => {
    try {
      const res = await getRegistrationsByEvent(eventId)
      setRegistrations(res?.registrations || [])
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to load registrations")
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id, status) => {
    try {
      await updateRegistrationStatus(id, status)
      setRegistrations(prev => prev.map(r => r._id === id ? { ...r, status } : r))
    } catch (err) {
      alert("Failed to update status")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/events" className="rounded-full p-2 hover:bg-slate-100">
          <ArrowLeft className="size-5" />
        </Link>
        <div>
          <h1 className="font-serif text-2xl font-bold">Event Registrations</h1>
          <p className="text-sm text-muted-foreground">Manage members who have registered for this event.</p>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center"><Loader2 className="mx-auto size-8 animate-spin text-navy" /></div>
      ) : error ? (
        <div className="rounded-xl bg-rose-50 p-6 text-rose-600 font-medium">{error}</div>
      ) : registrations.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/80 bg-white p-12 text-center text-muted-foreground">
          No members have registered for this event yet.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {registrations.map((reg) => (
            <div key={reg._id} className="rounded-2xl border border-border bg-white p-5 shadow-soft">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-serif font-bold text-navy flex items-center gap-2">
                    <User className="size-4 text-muted-foreground" />
                    {reg.fullName || reg.member?.user?.fullName || "Unknown Registrant"}
                  </h3>
                  <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                    <p className="flex items-center gap-2"><Mail className="size-3.5" /> {reg.email || reg.member?.user?.email}</p>
                    <p className="flex items-center gap-2"><Phone className="size-3.5" /> {reg.mobile || reg.member?.user?.mobile}</p>
                    <p className="flex items-center gap-2"><Calendar className="size-3.5" /> {new Date(reg.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {reg.remarks && (
                <div className="mt-3 rounded-lg bg-secondary/50 p-3 text-xs text-slate-600">
                  <span className="font-semibold block mb-1">Remarks:</span>
                  {reg.remarks}
                </div>
              )}

              <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                  reg.status === 'approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                  reg.status === 'cancelled' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                  'bg-amber-50 text-amber-700 border-amber-200'
                }`}>
                  {reg.status}
                </span>

                <div className="flex gap-2">
                  {reg.status !== 'approved' && (
                    <button 
                      onClick={() => updateStatus(reg._id, 'approved')}
                      className="rounded-lg p-1.5 text-emerald-600 hover:bg-emerald-50" title="Approve"
                    >
                      <CheckCircle className="size-4" />
                    </button>
                  )}
                  {reg.status !== 'cancelled' && (
                    <button 
                      onClick={() => updateStatus(reg._id, 'cancelled')}
                      className="rounded-lg p-1.5 text-rose-600 hover:bg-rose-50" title="Cancel/Reject"
                    >
                      <XCircle className="size-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
