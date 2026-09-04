"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SectionHeading } from "@/components/shared/section-heading"
import { Reveal } from "@/components/shared/reveal"
import { EventCard } from "@/components/shared/event-card"
import api from "@/service/api"

export function UpcomingEvents() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await api.get("/events")
        // Filter upcoming events and slice first 3
        const upcoming = data.events.filter(e => e.status === "upcoming").slice(0, 3)
        // Fallback to latest events if no upcoming events
        setEvents(upcoming.length > 0 ? upcoming : data.events.slice(0, 3))
      } catch (err) {
        console.error("Failed to load events", err)
      } finally {
        setLoading(false)
      }
    }
    fetchEvents()
  }, [])

  return (
    <section className="bg-secondary/40 py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            align="left"
            eyebrow="Get Involved"
            title="Events & Forums"
            description="Discover our latest conferences, academic sessions, and intellectual forums."
          />
          <Button asChild variant="outline" className="shrink-0 border-navy/20">
            <Link href="/events">
              All Events
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
        </div>
        
        {loading ? (
          <div className="mt-12 flex justify-center py-12">
            <Loader2 className="size-8 animate-spin text-navy/40" />
          </div>
        ) : events.length === 0 ? (
          <div className="mt-12 text-center py-12 bg-white rounded-2xl border border-dashed border-border/80">
            <p className="text-muted-foreground font-medium">No events scheduled at the moment.</p>
          </div>
        ) : (
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {events.map((e, i) => (
              <Reveal key={e._id} delay={i * 0.1}>
                <EventCard event={e} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
