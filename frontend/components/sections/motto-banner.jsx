"use client"

import { Reveal } from "@/components/shared/reveal"
import { Quote } from "lucide-react"

export function MottoBanner() {
  return (
    <section className="bg-navy py-16 sm:py-24">
      <div className="mx-auto max-w-4xl px-4 text-center">
        <Reveal>
          <Quote className="mx-auto mb-8 size-12 text-accent/50" />
          <h2 className="font-serif text-3xl font-bold leading-tight tracking-tight text-white md:text-5xl lg:text-6xl">
            OUR MOTTO
          </h2>
          <div className="mx-auto mt-12 max-w-3xl space-y-4 font-serif text-2xl italic leading-relaxed text-white/90 md:text-3xl lg:text-4xl">
            <p>“Moderation is our Method.</p>
            <p>Unity is our Strength.</p>
            <p>Knowledge is our Identity.</p>
            <p className="text-accent">Service to Humanity is our Mission.”</p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
