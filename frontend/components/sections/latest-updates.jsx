"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowRight, BookOpen, CalendarDays, HeartHandshake, Newspaper, ChevronRight, Clock, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getNews } from "@/service/news.service"
import { getEvents } from "@/service/event.service"



const serviceLinks = [
  {
    title: "Fatwas & Guidance",
    href: "/publications?type=fatwa",
    icon: BookOpen,
    desc: "Islamic rulings and statements by Al-Azhar scholars.",
    color: "bg-emerald-500/10 text-emerald-600 border-emerald-200/60"
  },
  {
    title: "Books & Articles",
    href: "/publications?type=book",
    icon: Newspaper,
    desc: "Digital library of academic papers and publications.",
    color: "bg-amber-500/10 text-amber-600 border-amber-200/60"
  },
  {
    title: "Membership Registration",
    href: "/membership",
    icon: HeartHandshake,
    desc: "Join our global network of Al-Azhar graduates.",
    color: "bg-blue-500/10 text-blue-600 border-blue-200/60"
  },
]

export function LatestUpdates() {
  const [news, setNews] = useState([])
  const [events, setEvents] = useState([])

  useEffect(() => {
    // Fetch News
    getNews()
      .then(data => {
        if (data.success && data.news?.length > 0) {
          const published = data.news.filter(n => n.status === "published")
          setNews(published.length > 0 ? published.slice(0, 3) : data.news.slice(0, 3))
        }
      })
      .catch(console.error)

    // Fetch Events (Upcoming)
    getEvents()
      .then(data => {
        if (data.success && data.events) {
          setEvents(data.events.filter(e => e.status === "upcoming").slice(0, 1))
        }
      })
      .catch(console.error)
  }, [])



  return (
    <section className="border-y border-border/60 bg-gradient-to-b from-card via-background to-card py-10 md:py-12">
      <div className="mx-auto grid grid-cols-1 max-w-7xl gap-8 px-4 lg:grid-cols-12 lg:gap-10">

        {/* Left Column: Latest News & Updates (Col 7) */}
        <div className="lg:col-span-7 flex flex-col justify-between min-w-0">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="flex size-8 items-center justify-center rounded-lg bg-accent/15 text-accent font-bold">
                  <Newspaper className="size-4" />
                </span>
                <h2 className="font-serif text-2xl font-bold text-navy">Latest Updates</h2>
              </div>

              <Button asChild variant="ghost" size="sm" className="font-bold text-navy hover:text-accent hover:bg-navy/5">
                <Link href="/news" className="inline-flex items-center gap-1 text-xs">
                  View All Updates <ArrowRight className="size-3.5" />
                </Link>
              </Button>
            </div>

            <div className="space-y-3">
              {news.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border/80 bg-card/50 p-8 text-center shadow-sm">
                  <p className="text-sm font-medium text-muted-foreground">No recent updates published yet.</p>
                </div>
              ) : (
                news.map((item) => (
                  <Link
                    key={item._id}
                    href={`/news/${item._id}`}
                    className="group relative block overflow-hidden rounded-[2rem] border border-primary/20 bg-primary p-6 sm:p-8 shadow-soft transition-all duration-300 hover:border-accent/40 hover:-translate-y-1.5 hover:shadow-xl"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <span className="inline-flex items-center gap-1.5 rounded-md bg-accent/10 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-accent">
                        {item.category?.replace("_", " ") || "NEWS"}
                      </span>
                      <span className="text-[11px] font-medium text-white/70 flex items-center gap-1 shrink-0">
                        <Clock className="size-3" />
                        {new Date(item.createdAt || Date.now()).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                      </span>
                    </div>

                    <h3 className="font-serif text-lg sm:text-xl font-bold text-white group-hover:text-accent transition-colors line-clamp-1">
                      {item.title}
                    </h3>

                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-white/80 font-medium">
                      {item.description}
                    </p>

                    <div className="mt-5 flex items-center gap-1 text-sm font-bold uppercase tracking-wider text-accent group-hover:text-white group-hover:translate-x-1 transition-all">
                      Read Story <ChevronRight className="size-3.5" />
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Quick Services & Next Event (Col 5) */}
        <div className="lg:col-span-5 flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <span className="flex size-8 items-center justify-center rounded-lg bg-navy/10 text-navy font-bold">
                <Sparkles className="size-4 text-accent" />
              </span>
              <h2 className="font-serif text-2xl font-bold text-navy">Al-Azhar Resources</h2>
            </div>

            <div className="grid gap-3.5">
              {serviceLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex items-center gap-4 sm:gap-5 rounded-[1.5rem] border border-primary/20 bg-primary p-4 sm:p-5 pr-4 sm:pr-5 shadow-soft transition-all duration-300 hover:border-accent/40 hover:-translate-y-1 hover:shadow-xl text-white"
                >
                  <div className={`flex size-12 sm:size-14 shrink-0 items-center justify-center rounded-2xl border ${item.color} group-hover:scale-105 transition-transform bg-white/5`}>
                    <item.icon className="size-5 sm:size-6" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white text-base sm:text-[17px] group-hover:text-accent transition-colors flex items-center justify-between gap-2">
                      <span className="truncate">{item.title}</span>
                      <ChevronRight className="size-5 text-white/50 group-hover:text-accent group-hover:translate-x-1 transition-all shrink-0" />
                    </h3>
                    <p className="mt-1 text-xs sm:text-sm text-white/70 font-medium truncate">{item.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {events.length > 0 && (
            <div className="mt-6 overflow-hidden rounded-2xl bg-navy p-5 text-white shadow-md relative">
              <div className="absolute -right-6 -top-6 size-24 rounded-full bg-accent/20 blur-xl" />
              <div className="relative z-10">
                <span className="inline-flex items-center gap-1 rounded-full bg-accent/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent backdrop-blur-sm">
                  ★ Next Featured Drive
                </span>
                <h3 className="mt-2 font-serif text-base font-bold text-white line-clamp-1">{events[0].title}</h3>
                <p className="mt-1 text-xs text-white/75 line-clamp-1">{events[0].location}</p>
              </div>
            </div>
          )}
        </div>

      </div>
    </section>
  )
}
