"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, CheckCircle2, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/context/LanguageContext"
import { getLocalizedField } from "@/lib/localized-field"

export function ProjectDetailContent({ project }) {
  const { language, isRTL, t } = useLanguage()

  const title = getLocalizedField(project, "title", language)
  const description = getLocalizedField(project, "description", language)
  const imageUrl = project.image?.url || (typeof project.image === 'string' && project.image) ? (project.image?.url || project.image) : null

  const highlights = [
    t("projects.highlight1", "Academic excellence and continuous learning"),
    t("projects.highlight2", "Fostering moderate and balanced Islamic thought"),
    t("projects.highlight3", "Open to Al-Azhar graduates across India"),
    t("projects.highlight4", "Promoting interfaith dialogue and coexistence"),
  ]

  const dateLocale = language === "ar" ? "ar-EG" : language === "ur" ? "ur-PK" : language === "hi" ? "hi-IN" : "en-IN"

  return (
    <article dir={isRTL ? "rtl" : "ltr"}>
      <div className="relative isolate min-h-[48vh] overflow-hidden bg-navy text-white">
        {imageUrl && <Image src={imageUrl} alt="" fill className="object-cover opacity-50" priority sizes="100vw" />}
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/75 to-navy/40" />
        <div className="relative mx-auto flex min-h-[48vh] max-w-7xl flex-col justify-end px-4 pb-12 pt-28">
          <Link href="/projects" className="mb-6 inline-flex w-fit items-center gap-2 text-sm text-white/70 transition hover:text-white">
            <ArrowLeft className={`size-4 ${isRTL ? "rotate-180" : ""}`} /> {t("projects.all", "All Programs")}
          </Link>
          <span className="inline-flex w-fit rounded-full bg-accent/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-300">
            {project.status}
          </span>
          <h1 className="mt-4 max-w-3xl font-serif text-4xl font-bold tracking-tight md:text-5xl">{title}</h1>
          <p className="mt-4 max-w-2xl text-lg text-white/75">{description}</p>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <h2 className="font-serif text-2xl font-semibold text-navy">{t("projects.about", "About this program")}</h2>
          <div className="mt-6 prose prose-lg prose-slate text-muted-foreground leading-relaxed">
            <p className="whitespace-pre-wrap">{description}</p>
            <p>
              {t("projects.statement", "This initiative is designed to strengthen academic and professional cooperation, creating meaningful opportunities for collective service and community development.")}
            </p>
          </div>
          
          <div className="mt-10">
            <h3 className="font-serif text-xl font-semibold text-navy mb-5">{t("projects.highlights_title", "Key Highlights")}</h3>
            <ul className="grid gap-3 sm:grid-cols-2">
              {highlights.map((h, idx) => (
                <li key={idx} className="flex gap-3 rounded-xl border border-border/60 bg-card px-4 py-4 text-sm shadow-soft">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-lime" />
                  <span className="font-medium text-foreground">{h}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div>
          <aside className="sticky top-24 h-fit rounded-2xl border border-border/70 bg-card p-6 shadow-soft md:p-8">
            <h3 className="font-serif text-xl font-semibold text-navy">{t("common.support_causes", "Support Our Causes")}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{t("common.support_desc", "Your contribution helps fund various initiatives and outreach programs.")}</p>
            
            <Button asChild className="mt-6 h-12 w-full rounded-xl bg-accent text-base font-bold text-accent-foreground shadow-sm hover:bg-accent/90">
              <Link href="/crowdfunding">
                <Heart className="mr-2 size-5" />
                {t("nav.donate", "Donate now")}
              </Link>
            </Button>
            
            <div className="mt-6 border-t border-border/60 pt-6 space-y-4">
              {project.startDate && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t("projects.start_date", "Start Date")}</span>
                  <span className="font-semibold text-foreground">
                    {new Date(project.startDate).toLocaleDateString(dateLocale, { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                </div>
              )}
              {project.endDate && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t("projects.end_date", "End Date")}</span>
                  <span className="font-semibold text-foreground">
                    {new Date(project.endDate).toLocaleDateString(dateLocale, { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                </div>
              )}
            </div>

            <Button asChild variant="outline" className="mt-6 h-11 w-full rounded-xl">
              <Link href="/membership">{t("nav.membership", "Apply for Membership")}</Link>
            </Button>
          </aside>
        </div>
      </div>
    </article>
  )
}

