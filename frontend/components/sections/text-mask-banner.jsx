"use client"

import { Reveal } from "@/components/shared/reveal"

export function TextMaskBanner() {
  return (
    <section className="relative flex min-h-[40vh] items-center justify-center overflow-hidden bg-navy py-10">
      <Reveal>
        <div className="mx-auto w-full max-w-[100vw] px-4 text-center">
          <h2
            className="bg-[url('/al-azhar-cairo.jpg')] bg-cover bg-fixed bg-center bg-no-repeat bg-clip-text font-sans text-[15vw] font-black uppercase leading-[0.85] tracking-tighter text-transparent md:text-[12vw]"
            style={{
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0px 10px 20px rgba(0,0,0,0.5))"
            }}
          >
            KNOWLEDGE
          </h2>

          <p className="mt-8 font-sans text-sm font-bold uppercase tracking-[0.4em] text-accent sm:text-lg">
            EMPOWERING MINDS • SHAPING FUTURES
          </p>
        </div>
      </Reveal>
    </section>
  )
}
