"use client";

import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/context/LanguageContext"
import { getLocalizedField } from "@/lib/localized-field"

export function ProjectCard({ project }) {
  const { t, language, isRTL } = useLanguage()
  const title = getLocalizedField(project, "title", language)
  const description = getLocalizedField(project, "description", language)

  return (
    <Link href={`/projects/${project._id}`} className="group block h-full">
      <article className="flex h-full flex-col overflow-hidden rounded-[2rem] bg-primary text-white shadow-xl shadow-navy/5 border border-primary/20
       transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:border-accent/40
       ">
        <div className="relative aspect-[16/10] overflow-hidden bg-muted flex items-center justify-center">
          {(project.image?.url || (typeof project.image === 'string' && project.image)) ? (
            <Image
              src={project.image?.url || project.image}
              alt={title}
              fill
              className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          ) : (
            <span className="text-muted-foreground font-serif">{t("common.no_data", "No Image")}</span>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-navy/40 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
          {project.category && (
            <Badge className="absolute left-3 top-3 bg-accent text-accent-foreground hover:bg-accent">
              {t("category." + (project.category?.toLowerCase() || "academic"), project.category)}
            </Badge>
          )}
        </div>
        <div className="flex flex-1 flex-col p-6 sm:p-8">
          <h3
            className="font-serif text-2xl font-bold leading-snug text-white group-hover:text-accent transition-colors"
            style={{ fontFamily: isRTL ? "inherit" : "var(--font-cinzel), serif" }}
          >
            {title}
          </h3>
          <p className="mt-3 flex-1 line-clamp-2 text-base leading-relaxed text-white/80 font-medium">{description}</p>

          <div className="mt-6 border-t border-white/10 pt-5">
            <span className="inline-flex items-center gap-1.5 text-sm font-bold uppercase tracking-widest text-accent transition-colors group-hover:text-white">
              {t("common.view_details", "View project")}
              <ArrowUpRight className="size-3.5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl-flip" />
            </span>
          </div>
        </div>
      </article>
    </Link>
  )
}
