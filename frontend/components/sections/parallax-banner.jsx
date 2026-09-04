"use client"

import { useSelector } from "react-redux"
import { Reveal } from "@/components/shared/reveal"
import { Quote } from "lucide-react"

export function ParallaxBanner() {
  const { data: siteContent } = useSelector((state) => state.siteContent)

  let quote = '"The best of people are those that bring most benefit to the rest of mankind."'
  let author = "— PROPHET MUHAMMAD (PBUH)"

  if (siteContent?.parallax_banner?.content) {
    try {
      const parsed = JSON.parse(siteContent.parallax_banner.content)
      if (parsed.quote) quote = parsed.quote
      if (parsed.author) author = parsed.author
    } catch (e) { }
  }

  return (
    <section className="relative h-[60vh] min-h-[400px] w-full overflow-hidden flex items-center justify-center">
      {/* Background Image with Fixed Attachment for Parallax */}
      <div 
        className="absolute inset-0 bg-[url('/al-azhar-cairo.jpg')] bg-cover bg-center bg-no-repeat bg-fixed"
        style={{ transform: "translateZ(0)" }} // Hardware acceleration hint
      />
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-navy/80" />

      {/* Content */}
      <Reveal className="relative z-10 px-4 text-center max-w-4xl mx-auto">
        <Quote className="mx-auto mb-6 size-12 text-accent/60" />
        <h2 className="text-balance font-serif text-3xl md:text-5xl lg:text-5xl font-bold leading-tight text-white mb-8 space-y-3 italic">
          <p>“Moderation is our Method.</p>
          <p>Unity is our Strength.</p>
          <p>Knowledge is our Identity.</p>
          <p className="text-accent">Service to Humanity is our Mission.”</p>
        </h2>
        <p className="text-sm md:text-base font-bold tracking-[0.2em] text-accent uppercase">
          — OUR MOTTO
        </p>
      </Reveal>
    </section>
  )
}
