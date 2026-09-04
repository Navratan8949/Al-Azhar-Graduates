"use client"
import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, CalendarDays, MapPin, Users, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { registerForEvent } from "@/service/event-registration.service"
import { getEventById } from "@/service/event.service"

import { useParams } from "next/navigation"

export default function EventDetailPage() {
  const params = useParams()
  const id = params?.id
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data = await getEventById(id)
        if (data?.success) {
          setEvent(data.event || data.data)
        }
      } catch (err) {
        console.error("Failed to load event", err)
      } finally {
        setLoading(false)
      }
    }
    fetchEvent()
  }, [id])

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-10 animate-spin text-navy/50" />
      </div>
    )
  }

  if (!event) return notFound()

  const date = event.eventDate
    ? new Date(event.eventDate).toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : ""

  const last = event.registrationLastDate
    ? new Date(event.registrationLastDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
    : null

  const imageUrl = event.image?.url || (typeof event.image === 'string' ? event.image : null) || "/placeholder.svg"

  return (
    <article>
      <div className="relative isolate min-h-[46vh] overflow-hidden bg-navy text-white">
        <Image src={imageUrl} alt="" fill className="object-cover opacity-50" priority sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/80 to-navy/35" />
        <div className="relative mx-auto flex min-h-[46vh] max-w-7xl flex-col justify-end px-4 pb-12 pt-28">
          <Link href="/events" className="mb-6 inline-flex w-fit items-center gap-2 text-sm text-white/70 hover:text-white">
            <ArrowLeft className="size-4" /> All events
          </Link>
          <h1 className="max-w-3xl font-serif text-4xl font-bold tracking-tight md:text-5xl">{event.title}</h1>
          <div className="mt-5 flex flex-wrap gap-4 text-sm text-white/80">
            {date && <span className="inline-flex items-center gap-2"><CalendarDays className="size-4 text-accent" />{date}</span>}
            <span className="inline-flex items-center gap-2"><MapPin className="size-4 text-accent" />{event.location}</span>
            {event.maxParticipants > 0 && (
              <span className="inline-flex items-center gap-2"><Users className="size-4 text-accent" />{event.maxParticipants} seats</span>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <h2 className="font-serif text-2xl font-semibold">Event details</h2>
          <p className="mt-4 leading-relaxed text-muted-foreground whitespace-pre-wrap">{event.description}</p>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Al-Azhar graduates and general participants can register below. Walk-ins are welcome subject to capacity.
          </p>
        </div>
        <RegistrationSidebar event={event} lastDate={last} />
      </div>
    </article>
  )
}

function RegistrationSidebar({ event, lastDate }) {
  const [isOpen, setIsOpen] = useState(false)
  
  const [formData, setFormData] = useState({ fullName: "", email: "", mobile: "" })
  const [registering, setRegistering] = useState(false)
  const [isRegistered, setIsRegistered] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => setFormData(p => ({ ...p, [e.target.name]: e.target.value }))

  const handleRegister = async (e) => {
    e.preventDefault()
    setRegistering(true)
    setError(null)
    try {
      const res = await registerForEvent({ eventId: event._id, ...formData })
      if (res.success) {
        setIsRegistered(true)
        setIsOpen(false)
      } else {
        setError(res.message || 'Failed to register')
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to register')
    } finally {
      setRegistering(false)
    }
  }
  
  const isDeadlinePassed = event.registrationLastDate && new Date() > new Date(event.registrationLastDate)

  return (
    <>
      <aside className="h-fit rounded-2xl border border-border/70 bg-card p-6 shadow-soft">
        <h3 className="font-serif text-xl font-semibold">Register</h3>
        {lastDate && <p className="mt-2 text-sm text-muted-foreground">Registration closes {lastDate}</p>}
        
        {isRegistered ? (
          <div className="mt-6 rounded-xl bg-emerald-50 border border-emerald-100 p-4 text-center text-sm font-medium text-emerald-700">
            You are successfully registered for this event!
          </div>
        ) : (
          <Button 
            onClick={() => setIsOpen(true)}
            disabled={isDeadlinePassed}
            className="mt-6 h-11 w-full rounded-xl bg-navy font-semibold text-white hover:bg-navy/90"
          >
            {isDeadlinePassed ? "Registration Closed" : "Register Now"}
          </Button>
        )}
      </aside>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl overflow-hidden">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            
            <h3 className="font-serif text-xl font-bold text-navy mb-1">Event Registration</h3>
            <p className="text-sm text-muted-foreground mb-6">Enter your details to register for this event.</p>
            
            <form onSubmit={handleRegister} className="space-y-4">
              {error && <div className="rounded-lg bg-rose-50 p-3 text-sm text-rose-600 font-medium">{error}</div>}
              
              <div className="space-y-1">
                <label className="text-sm font-medium">Full Name</label>
                <input required type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy" placeholder="John Doe" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Email Address</label>
                <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy" placeholder="john@example.com" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Phone Number</label>
                <input required type="tel" name="mobile" value={formData.mobile} onChange={handleChange} className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy" placeholder="+91 9876543210" />
              </div>

              <Button type="submit" disabled={registering} className="w-full h-11 rounded-xl bg-accent text-accent-foreground font-bold hover:bg-accent/90 mt-2">
                {registering ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
                CONFIRM REGISTRATION
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
