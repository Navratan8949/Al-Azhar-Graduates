"use client"
import { useRef, useState, useEffect } from "react"
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { TestimonialCard } from "@/components/shared/testimonial-card"
import { getTestimonials } from "@/service/testimonial.service"
import { SectionHeading } from "@/components/shared/section-heading"
import { Button } from "@/components/ui/button"

export function Testimonials() {
  const scrollRef = useRef(null)
  const [testimonials, setTestimonials] = useState([])

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await getTestimonials()
        const active = res?.testimonials?.filter(t => t.status !== 'inactive') || []
        setTestimonials(active)
      } catch (err) {
        console.error("Failed to fetch testimonials:", err)
        setTestimonials([])
      }
    }
    fetchTestimonials()
  }, [])

  const scroll = (dir) => {
    if (scrollRef.current) {
      // Calculate scroll amount based on the first child's width + gap
      const firstChild = scrollRef.current.firstElementChild;
      if (firstChild) {
        const scrollAmount = firstChild.offsetWidth + 24; // 24px is gap-6
        scrollRef.current.scrollBy({ left: dir === "left" ? -scrollAmount : scrollAmount, behavior: "smooth" });
      }
    }
  }

  return (
    <section className="bg-primary py-16 md:py-20 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4">
        {/* Header Area with Top-Right Buttons */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <SectionHeading
          align="left"
          eyebrow="Voices of Change"
          title="Stories from our community"
          description="Real words from the people whose lives have been touched by your generosity."
          className="mx-0"
          inverted={true}
        />
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" className="rounded-full shadow-sm h-12 w-12 border-white/20 bg-white/5 text-white hover:bg-accent hover:text-primary hover:border-accent transition-colors" onClick={() => scroll("left")}>
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button variant="outline" size="icon" className="rounded-full shadow-sm h-12 w-12 border-white/20 bg-white/5 text-white hover:bg-accent hover:text-primary hover:border-accent transition-colors" onClick={() => scroll("right")}>
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
      </div>

      <div className="relative mt-12">
        {/* Carousel Container */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-8 pt-4 scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {testimonials.length > 0 ? (
            testimonials.map((t) => (
              <div key={t._id} className="w-[320px] md:w-[380px] shrink-0 snap-start">
                <TestimonialCard item={t} />
              </div>
            ))
          ) : (
            <div className="w-full text-center py-12 text-white/60">
              No testimonials available at the moment.
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <Button asChild size="lg" variant="outline" className="rounded-full border-white/20 bg-white/5 text-white hover:bg-accent hover:text-primary hover:border-accent transition-colors">
          <Link href="/testimonials">
            View All Testimonials <ArrowRight className="ml-2 size-4" />
          </Link>
        </Button>
      </div>
      </div>
    </section>
  )
}
