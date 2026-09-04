"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Newspaper, ChevronRight, Calendar, ArrowRight } from "lucide-react"
import { getNews } from "@/service/news.service"

export default function NewsPage() {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getNews()
      .then(data => {
        if (data.success && data.news?.length > 0) {
          const published = data.news.filter(n => n.status === "published")
          setNews(published.length > 0 ? published : data.news)
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="bg-navy py-16 text-center text-white sm:py-24">
        <div className="mx-auto max-w-3xl px-4">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-accent backdrop-blur-md">
            <Newspaper className="size-4" /> Updates
          </span>
          <h1 className="font-serif text-4xl font-bold sm:text-5xl">
            Media <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-accent">Centre</span>
          </h1>
          <p className="mt-6 text-lg text-white/80 leading-relaxed max-w-2xl mx-auto">
            Stay connected with our latest News, Press Releases, Articles, Interviews, and Event Reports.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="size-10 animate-spin rounded-full border-4 border-navy border-t-transparent"></div>
          </div>
        ) : news.length > 0 ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {news.map((item) => (
              <Link 
                href={`/news/${item._id}`} 
                key={item._id}
                className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-border/50 transition-all hover:shadow-xl hover:ring-border"
              >
                {/* Image (Optional) */}
                {item.image?.url ? (
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                    <Image 
                      src={item.image.url} 
                      alt={item.title} 
                      fill 
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                ) : (
                  <div className="flex aspect-video w-full items-center justify-center bg-slate-100 text-muted-foreground">
                    <Newspaper className="size-12 opacity-20" />
                  </div>
                )}
                
                {/* Content */}
                <div className="flex flex-1 flex-col p-6">
                  <div className="mb-3 flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <span className="rounded-md bg-secondary px-2 py-1 text-navy">
                      {item.category?.replace("_", " ")}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="size-3.5" />
                      {new Date(item.publishedAt || item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  </div>
                  <h3 className="font-serif text-xl font-bold leading-tight text-navy group-hover:text-accent transition-colors">
                    {item.title}
                  </h3>
                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                  
                  <div className="mt-auto pt-6">
                    <span className="inline-flex items-center text-sm font-bold text-accent transition-colors group-hover:text-amber-500">
                      Read full article <ArrowRight className="ml-1.5 size-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-border/70 bg-white py-24 text-center">
            <Newspaper className="mx-auto size-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-bold text-navy">No news available</h3>
            <p className="mt-1 text-sm text-muted-foreground">Check back later for updates.</p>
          </div>
        )}
      </section>
    </div>
  )
}
