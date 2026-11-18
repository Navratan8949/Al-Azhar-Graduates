"use client";

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SectionHeading } from "@/components/shared/section-heading"
import { Reveal } from "@/components/shared/reveal"
import { ProjectCard } from "@/components/shared/project-card"
import { useLanguage } from "@/context/LanguageContext"
import api from "@/service/api"

export function FeaturedProjects() {
  const { t } = useLanguage()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data } = await api.get("/projects")
        const allProjects = data?.projects || data?.data || []
        const featured = allProjects.filter((p) => p.isFeatured).slice(0, 3)
        setProjects(featured.length > 0 ? featured : allProjects.slice(0, 3))
      } catch (err) {
        console.error("Failed to fetch featured projects:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchProjects()
  }, [])

  if (loading) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-16 md:py-20 flex justify-center">
        <Loader2 className="size-8 animate-spin text-navy/40" />
      </section>
    )
  }

  if (projects.length === 0) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-16 md:py-20">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            align="left"
            eyebrow={t("nav.our_work", "Our Activities")}
            title={t("featured_projects.title", "Featured Projects")}
            description={t("featured_projects.subtitle", "Ongoing initiatives creating real change in communities across India.")}
          />
        </div>
        <div className="mt-12 rounded-2xl border border-dashed border-border/80 bg-card p-12 text-center shadow-sm">
          <h3 className="font-serif text-xl font-semibold text-navy">{t("featured_projects.no_projects", "No featured projects")}</h3>
          <p className="mt-2 text-muted-foreground">{t("featured_projects.no_projects_desc", "We will highlight our ongoing initiatives here soon.")}</p>
        </div>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:py-20">
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <SectionHeading
          align="left"
          eyebrow={t("nav.our_work", "Our Activities")}
          title={t("featured_projects.title", "Featured Projects")}
          description={t("featured_projects.subtitle", "Ongoing initiatives creating real change in communities across India.")}
        />
        <Button asChild variant="outline" className="shrink-0 border-navy/20">
          <Link href="/projects">
            {t("featured_projects.view_all", "View All Projects")}
            <ArrowRight className="ml-2 size-4 rtl-flip" />
          </Link>
        </Button>
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {projects.map((p, i) => (
          <Reveal key={p._id || i} delay={i * 0.1}>
            <ProjectCard project={p} />
          </Reveal>
        ))}
      </div>
    </section>
  )
}
