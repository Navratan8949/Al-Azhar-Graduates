import Image from "next/image"
import Link from "next/link"
import { CalendarDays, MapPin } from "lucide-react"

export function EventCard({ event }) {
  const date = event.eventDate
    ? new Date(event.eventDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
    : ""

  return (
    <Link href={`/events/${event._id}`} className="group block h-full">
      <article className="flex h-full flex-col overflow-hidden rounded-[2rem] border border-primary/20 bg-primary text-white shadow-soft transition-all duration-300 hover:-translate-y-2 hover:border-accent/40 hover:shadow-2xl">
        <div className="relative aspect-[16/10] overflow-hidden bg-muted flex items-center justify-center">
          <Image
            src={event.image?.url || (typeof event.image === 'string' ? event.image : null) || "/placeholder.svg"}
            alt={event.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
        <div className="flex flex-1 flex-col p-6 sm:p-8">
          <h3 className="font-serif text-2xl font-bold leading-snug text-white group-hover:text-accent transition-colors">{event.title}</h3>
          <p className="mt-3 line-clamp-2 flex-1 text-base leading-relaxed text-white/80">{event.description}</p>
          <div className="mt-6 space-y-2 text-sm font-medium text-white/80 border-t border-white/10 pt-5">
            {date && (
              <p className="flex items-center gap-2">
                <CalendarDays className="size-4 text-accent" />
                {date}
              </p>
            )}
            {event.location && (
              <p className="flex items-center gap-2">
                <MapPin className="size-4 text-accent" />
                {event.location}
              </p>
            )}
          </div>
        </div>
      </article>
    </Link>
  )
}
