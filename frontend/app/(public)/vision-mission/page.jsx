"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchSiteContent } from "@/redux/features/siteContentSlice"
import { PageHero } from "@/components/pages/page-hero"
import { ContentSections } from "@/components/pages/content-sections"
import { CtaBand } from "@/components/sections/cta-band"
import { SectionHeading } from "@/components/shared/section-heading"
import { Reveal } from "@/components/shared/reveal"
import { HeartHandshake, Eye, Target, ShieldCheck } from "lucide-react"

const fallbackSections = [
  [
    "Our Vision",
    "To build a compassionate, inclusive society where every individual has the resources to lead a dignified life. We envision a future where poverty and lack of opportunity do not dictate a child's educational outcome or a family's health. By empowering the most vulnerable sections of our communities, we aim to eradicate inequality and foster a world driven by mutual support, continuous learning, and shared prosperity.",
  ],
  [
    "Our Mission",
    "Our mission is to implement sustainable, localized programs that provide immediate relief and long-term empowerment. We are committed to bridging the gap in primary education through school supplies and coaching, delivering essential healthcare via mobile camps, and offering vocational skills to women and youth. Through the collective effort of dedicated volunteers, donors, and partners, we turn compassion into measurable, on-the-ground action every single day.",
  ],
]

const values = [
  {
    title: "Compassion in Action",
    description: "We don't just feel empathy; we act on it. Every initiative is driven by a deep desire to alleviate hardship.",
    icon: HeartHandshake,
  },
  {
    title: "Absolute Transparency",
    description: "We hold ourselves accountable to our donors and the communities we serve with open financial reporting.",
    icon: Eye,
  },
  {
    title: "Targeted Impact",
    description: "We focus our resources where they are needed most, ensuring every effort yields tangible, lasting results.",
    icon: Target,
  },
  {
    title: "Integrity & Trust",
    description: "Our work is grounded in honesty and ethical practices, building enduring trust with our stakeholders.",
    icon: ShieldCheck,
  },
]

export default function Page() {
  const dispatch = useDispatch()
  const { data: siteContent } = useSelector((state) => state.siteContent)

  useEffect(() => {
    dispatch(fetchSiteContent())
  }, [dispatch])

  let image = "/rural-classroom-children-learning-india.png"
  let stats = ["Education for All", "Accessible Healthcare", "Community Empowerment"]
  let sections = fallbackSections

  if (siteContent?.vision_mission?.content) {
    try {
      const parsed = JSON.parse(siteContent.vision_mission.content)
      if (parsed.image) image = parsed.image
      if (Array.isArray(parsed.stats) && parsed.stats.length > 0) stats = parsed.stats
      if (Array.isArray(parsed.sections) && parsed.sections.length > 0) sections = parsed.sections
    } catch (e) {}
  }

  return (
    <>
      <PageHero
        eyebrow="Vision & Mission"
        title="A fair chance to learn, grow and live with dignity."
        description="Our guiding principles for education, health, livelihood and public welfare."
        image={image}
      />

      <ContentSections
        image={image}
        stats={stats}
        sections={sections}
      />

      <section className="bg-secondary/30 py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4">
          <SectionHeading
            eyebrow="What Drives Us"
            title="Our Core Values"
            description="The fundamental beliefs that guide our daily operations, our long-term strategies, and our interactions with the community."
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.1}>
                <div className="flex h-full flex-col items-center rounded-2xl border border-border/60 bg-card p-8 text-center shadow-soft transition-all hover:-translate-y-1.5 hover:border-accent/40 hover:shadow-lift">
                  <div className="mb-5 flex size-14 items-center justify-center rounded-full bg-navy text-white">
                    <v.icon className="size-6" />
                  </div>
                  <h3 className="mb-3 font-serif text-xl font-bold text-navy">{v.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{v.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* <CtaBand /> */}
    </>
  )
}
