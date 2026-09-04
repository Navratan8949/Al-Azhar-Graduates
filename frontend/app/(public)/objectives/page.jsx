"use client"

import { PageHero } from "@/components/pages/page-hero"
import { ImpactStats } from "@/components/sections/impact-stats"
import { CtaBand } from "@/components/sections/cta-band"
import { BookOpen, HeartPulse, Sparkles, HandHeart, ShieldCheck, Users, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useSelector } from "react-redux"

const DEFAULT_OBJECTIVES = [
  {
    title: "Promote Awareness",
    description: "Promote awareness of Al-Azhar's global scholarly and civilizational contribution.",
    icon: BookOpen,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  }
]

export default function Page() {
  const { data: siteContent } = useSelector((state) => state.siteContent)

  let objectives = DEFAULT_OBJECTIVES

  if (siteContent?.objectives?.content) {
    try {
      const parsed = JSON.parse(siteContent.objectives.content)
      if (Array.isArray(parsed) && parsed.length > 0) {
        objectives = parsed.map(obj => ({
          ...obj,
          icon: obj.icon === "BookOpen" ? BookOpen :
                obj.icon === "Users" ? Users :
                obj.icon === "Sparkles" ? Sparkles :
                obj.icon === "ShieldCheck" ? ShieldCheck :
                obj.icon === "HeartPulse" ? HeartPulse :
                obj.icon === "HandHeart" ? HandHeart : BookOpen
        }))
      }
    } catch (e) {}
  }

  return (
    <>
      <PageHero
        eyebrow="Our Objectives"
        title="Fostering Knowledge, Moderation and Service"
        description="Our core mission is divided into actionable objectives that guide every initiative we undertake."
        image="/hero-community-education-india.png"
      />

      {/* Intro Section */}
      <section className="overflow-hidden bg-white py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <div className="relative aspect-square max-w-md mx-auto lg:mx-0 lg:max-w-none w-full">
              <div className="absolute inset-0 rounded-3xl bg-navy/5 -rotate-6 scale-105 transition-transform duration-500 hover:rotate-0"></div>
              <div className="relative h-full w-full overflow-hidden rounded-3xl shadow-2xl border-4 border-white">
                <Image
                  src="/community-health-camp-india.png"
                  alt="Our Focus"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="flex flex-col justify-center">
              <span className="mb-4 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-accent">
                <span className="h-[2px] w-8 bg-accent"></span> Our Purpose
              </span>
              <h2 className="font-serif text-3xl font-bold tracking-tight text-navy sm:text-4xl md:text-5xl mb-6">
                Strengthening ties, spreading knowledge, and building communities.
              </h2>
              <p className="text-lg leading-relaxed text-muted-foreground mb-6">
                The World Association for Al-Azhar Graduates works to connect Al-Azhar alumni across India and empower them to serve society.
              </p>
              <p className="text-lg leading-relaxed text-muted-foreground mb-8">
                Our objectives reflect the balanced, humane, and scholarly traditions of Al-Azhar University, focusing on intellectual exchange, peaceful coexistence, and educational development.
              </p>
              <div className="flex items-center gap-4">
                <Link href="/about" className="inline-flex items-center justify-center rounded-xl bg-navy px-6 py-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-navy/90 hover:shadow-xl">
                  Learn About Us <ArrowRight className="ml-2 size-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Objectives Grid Section */}
      <section className="relative isolate overflow-hidden bg-slate-50 py-16 md:py-24">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-50"></div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-12 md:mb-20">
            <h2 className="font-serif text-3xl font-bold tracking-tight text-navy sm:text-4xl">What We Strive to Achieve</h2>
            <p className="mt-4 text-lg leading-8 text-muted-foreground">
              These objectives shape our programs, direct our focus, and define our commitment to society.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {objectives.map((obj, index) => {
              const Icon = obj.icon
              return (
                <div
                  key={index}
                  className="group relative flex flex-col rounded-3xl bg-white p-8 shadow-sm ring-1 ring-border/50 transition-all hover:shadow-xl hover:-translate-y-1 hover:ring-navy/20"
                >
                  <div className={`mb-6 inline-flex size-14 shrink-0 items-center justify-center rounded-2xl ${obj.bgColor} ${obj.color} transition-transform duration-300 group-hover:scale-110`}>
                    <Icon className="size-7" />
                  </div>

                  <h3 className="mb-3 text-xl font-bold text-navy group-hover:text-accent transition-colors">
                    {obj.title}
                  </h3>

                  <p className="text-muted-foreground leading-relaxed">
                    {obj.description}
                  </p>

                  <div className="absolute -inset-px -z-10 rounded-3xl bg-gradient-to-br from-navy/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 blur-xl"></div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <ImpactStats />
    </>
  )
}
