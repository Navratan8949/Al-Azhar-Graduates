"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { X, Play, Search, Filter, ZoomIn } from "lucide-react"
import { getGalleryItems } from "@/service/gallery.service"

const CATEGORIES = ["All", "Conferences", "Seminars", "Educational Programs", "Community Initiatives", "Organizational Activities", "Lectures", "Interviews"]

function LightboxPhoto({ item, onClose }) {
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/90 backdrop-blur-sm" onClick={onClose}>
      <button onClick={onClose} className="absolute right-5 top-5 z-10 flex size-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm hover:bg-white/20">
        <X className="size-5" />
      </button>
      <div className="relative max-h-[90vh] max-w-5xl w-full px-4" onClick={e => e.stopPropagation()}>
        <div className="relative aspect-video overflow-hidden rounded-2xl">
          <Image src={item.image?.url || "/placeholder.svg"} alt={item.title} fill className="object-contain" sizes="90vw" />
        </div>
        <div className="mt-3 text-center">
          <p className="font-serif text-lg font-semibold text-white">{item.title}</p>
          {item.category && <span className="mt-1 inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/70">{item.category}</span>}
        </div>
      </div>
    </div>
  )
}

function LightboxVideo({ item, onClose }) {
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/90 backdrop-blur-sm" onClick={onClose}>
      <button onClick={onClose} className="absolute right-5 top-5 z-10 flex size-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20">
        <X className="size-5" />
      </button>
      <div className="w-full max-w-4xl px-4" onClick={e => e.stopPropagation()}>
        <div className="aspect-video overflow-hidden rounded-2xl bg-black">
          <iframe src={item.videoUrl + "?autoplay=1"} className="h-full w-full" allow="autoplay; fullscreen" allowFullScreen title={item.title} />
        </div>
        <p className="mt-3 text-center font-serif text-lg font-semibold text-white">{item.title}</p>
      </div>
    </div>
  )
}

export default function GalleryPage() {
  const [galleryItems, setGalleryItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState("All")
  const [activeType, setActiveType] = useState("all") // all | photo | video
  const [search, setSearch] = useState("")
  const [lightbox, setLightbox] = useState(null) // { item }

  useEffect(() => {
    getGalleryItems()
      .then(data => {
        if (data.success) {
          setGalleryItems(data.galleryItems)
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  const filtered = galleryItems.filter(item => {
    const matchType = activeType === "all" || item.type === activeType
    const matchCat = activeFilter === "All" || item.category === activeFilter
    const matchSearch = !search || item.title.toLowerCase().includes(search.toLowerCase())
    return matchType && matchCat && matchSearch
  })

  const photos = filtered.filter(i => i.type === "photo")
  const videos = filtered.filter(i => i.type === "video")

  return (
    <>
      {lightbox && lightbox.item.type === "photo" && (
        <LightboxPhoto item={lightbox.item} onClose={() => setLightbox(null)} />
      )}
      {lightbox && lightbox.item.type === "video" && (
        <LightboxVideo item={lightbox.item} onClose={() => setLightbox(null)} />
      )}

      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-navy py-20 text-white md:py-28">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,rgba(255,153,51,0.15),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(19,136,8,0.12),transparent_55%)]" />
        <div className="mx-auto max-w-3xl px-4 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white/80">
            Moments of Impact
          </span>
          <h1 className="mt-5 font-serif text-4xl font-bold text-white md:text-6xl">
            Our Gallery
          </h1>
          <p className="mt-4 text-lg text-white/70">
            A visual record of our conferences, seminars, educational programs, community initiatives and organizational activities.
          </p>
          {/* Quick stats */}
          {!loading && (
            <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm font-semibold text-white/60">
              <span className="flex items-center gap-1.5"><span className="text-accent">{galleryItems.filter(i => i.type === "photo").length}</span> Photos</span>
              <span className="h-4 w-px bg-white/20" />
              <span className="flex items-center gap-1.5"><span className="text-accent">{galleryItems.filter(i => i.type === "video").length}</span> Videos</span>
              <span className="h-4 w-px bg-white/20" />
              <span className="flex items-center gap-1.5"><span className="text-accent">{CATEGORIES.length - 1}</span> Categories</span>
            </div>
          )}
        </div>
      </section>

      {/* Filters */}
      <div className="sticky top-[68px] z-40 border-b bg-white/95 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 py-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {/* Type tabs */}
            <div className="flex rounded-xl border border-border/60 bg-secondary/50 p-1">
              {[["all", "All Media"], ["photo", "Photos"], ["video", "Videos"]].map(([val, label]) => (
                <button key={val} onClick={() => setActiveType(val)}
                  className={`flex-1 rounded-lg px-4 py-1.5 text-sm font-semibold transition sm:flex-none ${activeType === val ? "bg-white shadow-sm text-navy" : "text-muted-foreground hover:text-foreground"}`}>
                  {label}
                </button>
              ))}
            </div>
            {/* Search */}
            <div className="relative max-w-xs w-full">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search gallery..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="h-10 w-full rounded-xl border border-border/60 bg-white pl-9 pr-4 text-sm outline-none ring-0 focus:border-accent focus:ring-2 focus:ring-accent/20"
              />
            </div>
          </div>
          {/* Category chips */}
          <div className="mt-2 flex flex-wrap gap-1.5">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setActiveFilter(cat)}
                className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${activeFilter === cat
                  ? "border-navy bg-navy text-white"
                  : "border-border/60 text-muted-foreground hover:border-navy/30 hover:text-navy"}`}>
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 md:py-14 min-h-[50vh]">
        
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="size-10 animate-spin rounded-full border-4 border-navy border-t-transparent"></div>
          </div>
        ) : (
          <>
            {/* No results */}
            {filtered.length === 0 && (
              <div className="py-24 text-center text-muted-foreground">
                <Filter className="mx-auto mb-4 size-12 opacity-30" />
                <p className="text-lg font-semibold">No items found</p>
                <p className="mt-1 text-sm">Try changing the filter or search term</p>
              </div>
            )}

            {/* Photos — Masonry Grid */}
            {photos.length > 0 && (
              <section className="mb-14">
                {activeType !== "video" && <h2 className="mb-6 font-serif text-2xl font-bold text-navy">Photos <span className="ml-2 text-base font-normal text-muted-foreground">({photos.length})</span></h2>}
                <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4">
                  {photos.map((item, i) => (
                    <div key={item._id}
                      onClick={() => setLightbox({ item })}
                      className="group mb-4 break-inside-avoid cursor-pointer overflow-hidden rounded-2xl border border-border/60 bg-card shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                    >
                      <div className={`relative ${[4, 5, 0].includes(i % 6) ? "aspect-square" : "aspect-[4/3]"} overflow-hidden bg-slate-100`}>
                        <Image
                          src={item.image?.url || "/placeholder.svg"}
                          alt={item.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />
                        {/* Overlay on hover */}
                        <div className="absolute inset-0 flex items-center justify-center bg-navy/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                          <div className="flex size-12 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm">
                            <ZoomIn className="size-6 text-white" />
                          </div>
                        </div>
                      </div>
                      <div className="p-3">
                        <p className="text-sm font-semibold text-navy line-clamp-1">{item.title}</p>
                        {item.category && <span className="mt-1 inline-block rounded-full bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">{item.category}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Videos — Row Grid */}
            {videos.length > 0 && (
              <section>
                {activeType !== "photo" && <h2 className="mb-6 font-serif text-2xl font-bold text-navy">Videos <span className="ml-2 text-base font-normal text-muted-foreground">({videos.length})</span></h2>}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {videos.map(item => (
                    <div key={item._id}
                      onClick={() => setLightbox({ item })}
                      className="group cursor-pointer overflow-hidden rounded-2xl border border-border/60 bg-card shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                    >
                      <div className="relative aspect-video overflow-hidden bg-slate-100">
                        <Image
                          src={item.image?.url || "/placeholder.svg"}
                          alt={item.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                        {/* Play overlay */}
                        <div className="absolute inset-0 flex items-center justify-center bg-navy/40 transition-colors duration-300 group-hover:bg-navy/55">
                          <div className="flex size-16 items-center justify-center rounded-full bg-white/15 ring-2 ring-white/30 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                            <Play className="ml-1 size-7 fill-white text-white" />
                          </div>
                        </div>
                        <span className="absolute left-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">Video</span>
                      </div>
                      <div className="p-4">
                        <p className="font-semibold text-navy">{item.title}</p>
                        {item.category && <span className="mt-1 inline-block rounded-full bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">{item.category}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>

      {/* CTA */}
      <section className="bg-navy py-14 text-center text-white">
        <h2 className="font-serif text-2xl font-bold">Want to share your photos with us?</h2>
        <p className="mt-2 text-white/60">Attend an event and become part of our story.</p>
        <a href="/events" className="mt-5 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-accent/90">
          View Upcoming Events
        </a>
      </section>
    </>
  )
}
