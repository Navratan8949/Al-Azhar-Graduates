"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Target, Eye, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Reveal } from "@/components/shared/reveal"
import { useSelector } from "react-redux"

export function AboutPreview() {
  const { data: siteContent } = useSelector((state) => state.siteContent)

  let title = "Welcome to the India Branch"
  let description = "The World Association for Al-Azhar Graduates – India is a national platform connecting Al-Azhar graduates across India and promoting the scholarly, intellectual and humanitarian values of Al-Azhar University.\n\nRooted in the traditions of knowledge, moderation, dialogue and service, the organization works to strengthen cooperation among Al-Azhar graduates and contribute to the educational, intellectual and social development of Indian society."
  let mission = "To connect Al-Azhar graduates, promote the message of moderation and balanced Islamic thought, support academic and intellectual initiatives, and serve society through knowledge, dialogue and constructive engagement."
  let vision = "To build a strong and united network of Al-Azhar graduates across India and make their collective academic, intellectual and social contribution a meaningful force for peace, knowledge and human development."

  if (siteContent?.about_preview?.content) {
    try {
      const parsed = JSON.parse(siteContent.about_preview.content)
      if (siteContent.about_preview.title) title = siteContent.about_preview.title
      if (parsed.description) description = parsed.description
      if (parsed.mission) mission = parsed.mission
      if (parsed.vision) vision = parsed.vision
    } catch (e) { }
  }

  return (
    <section className="relative overflow-hidden bg-background px-6 py-24 lg:py-32">
      {/* Decorative Background Element */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />
      <div className="absolute -left-20 top-20 opacity-[0.03] pointer-events-none">
        <BookOpen className="w-96 h-96 text-primary" />
      </div>

      <div className="mx-auto max-w-[1440px] grid items-center gap-16 lg:grid-cols-[1fr_1.1fr] relative z-10 lg:px-8">

        {/* Left: Premium Editorial Image */}
        <Reveal className="relative mx-auto w-full max-w-lg lg:max-w-none">
          <div className="relative aspect-[4/5] overflow-hidden rounded-t-full rounded-b-[2rem] shadow-[0_20px_60px_rgba(2,61,40,0.15)] border-[8px] border-white bg-white">
            <Image
              src="/al-azhar-cairo.jpg"
              alt="Al-Azhar University"
              fill
              className="object-cover transition-transform duration-700 hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#011c13]/50 via-transparent to-transparent" />
          </div>
          
          {/* Elegant Static Crest */}
          <div className="absolute -bottom-8 -right-8 flex size-36 items-center justify-center rounded-full bg-white shadow-2xl p-2">
            <div className="flex size-full items-center justify-center rounded-full border border-accent bg-accent/10">
              <div className="text-center">
                <span className="block text-accent font-serif font-bold text-2xl leading-none" style={{ fontFamily: "var(--font-cinzel), serif" }}>EST.</span>
                <span className="block text-primary font-bold text-lg mt-1 tracking-widest">2010</span>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Right: Editorial Text */}
        <div className="lg:pl-12">
          <Reveal>
            <div className="flex items-center gap-4 mb-8">
              <span className="h-px w-16 bg-accent"></span>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent">{title}</span>
            </div>

            <h2 
              className="text-balance font-bold leading-[1.15] text-primary text-4xl sm:text-5xl lg:text-[3.25rem] mb-8" 
              style={{ fontFamily: "var(--font-cinzel), serif" }}
            >
              Connecting Graduates. Promoting <span className="text-accent italic font-normal">Scholarly Values.</span>
            </h2>

            <div className="space-y-6">
              {description.split('\n\n').map((paragraph, index) => (
                <p key={index} className="text-pretty text-lg leading-relaxed text-muted-foreground font-medium">
                  {paragraph}
                </p>
              ))}
            </div>
          </Reveal>

          {/* Mission & Vision Cards */}
          <div className="mt-12 grid gap-6 sm:grid-cols-2 pt-8 border-t border-border">
            <Reveal delay={0.1}>
              <div className="flex flex-col h-full rounded-2xl bg-primary/5 p-6 shadow-sm border border-primary/10 hover:border-accent/40 transition-colors backdrop-blur-md">
                <div className="flex items-center gap-3 text-primary font-bold text-lg mb-4" style={{ fontFamily: "var(--font-cinzel), serif" }}>
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <Target className="size-5 text-accent" />
                  </div>
                  Our Mission
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {mission}
                </p>
              </div>
            </Reveal>
            
            <Reveal delay={0.2}>
              <div className="flex flex-col h-full rounded-2xl bg-primary/5 p-6 shadow-sm border border-primary/10 hover:border-accent/40 transition-colors backdrop-blur-md">
                <div className="flex items-center gap-3 text-primary font-bold text-lg mb-4" style={{ fontFamily: "var(--font-cinzel), serif" }}>
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <Eye className="size-5 text-accent" />
                  </div>
                  Our Vision
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {vision}
                </p>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.3} className="mt-12">
            <Button 
              asChild 
              size="lg"
              className="h-14 rounded-full bg-accent px-8 text-base font-bold text-primary shadow-lg shadow-accent/20 transition-all hover:-translate-y-1 hover:bg-[#ebd074] hover:shadow-accent/40"
            >
              <Link href="/about">
                Explore About Us
                <ArrowRight className="ml-2 size-5" />
              </Link>
            </Button>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
