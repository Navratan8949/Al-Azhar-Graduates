"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/context/LanguageContext"
import { getLocalizedField } from "@/lib/localized-field"

export function CampaignDetailContent({ campaign }) {
  const { language, isRTL, t } = useLanguage()

  const title = getLocalizedField(campaign, "title", language)
  const description = getLocalizedField(campaign, "description", language)

  const raised = campaign.raisedAmount || 0
  const target = campaign.targetAmount || 1
  const pct = Math.min(100, Math.round((raised / target) * 100))
  const imageUrl = campaign.image?.url || (typeof campaign.image === 'string' ? campaign.image : null)

  const dateLocale = language === "ar" ? "ar-EG" : language === "ur" ? "ur-PK" : language === "hi" ? "hi-IN" : "en-IN"

  return (
    <article dir={isRTL ? "rtl" : "ltr"}>
      <div className="relative isolate min-h-[46vh] overflow-hidden bg-navy text-white">
        {imageUrl && <Image src={imageUrl} alt={title} fill className="object-cover opacity-50" priority sizes="100vw" />}
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/80 to-navy/40" />
        <div className="relative mx-auto flex min-h-[46vh] max-w-7xl flex-col justify-end px-4 pb-12 pt-28">
          <Link href="/crowdfunding" className="mb-6 inline-flex w-fit items-center gap-2 text-sm text-white/70 hover:text-white">
            <ArrowLeft className={`size-4 ${isRTL ? "rotate-180" : ""}`} /> {t("crowdfunding.all", "All campaigns")}
          </Link>
          <span className="inline-flex w-fit rounded-full bg-accent/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-300">
            {campaign.status || "Campaign"}
          </span>
          <h1 className="mt-4 max-w-3xl font-serif text-4xl font-bold tracking-tight md:text-5xl">{title}</h1>
          <p className="mt-4 max-w-2xl text-lg text-white/75 line-clamp-2">{description}</p>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <h2 className="font-serif text-2xl font-semibold">{t("crowdfunding.why_matters", "Why this campaign matters")}</h2>
          <p className="mt-4 leading-relaxed text-muted-foreground whitespace-pre-wrap">
            {description}
          </p>
          <p className="mt-6 leading-relaxed text-muted-foreground text-sm font-semibold">
            {t("crowdfunding.transparency", "Funds are tracked against the published target. Receipts are issued after verification.")}
          </p>
        </div>
        <aside className="h-fit rounded-2xl border border-border/70 bg-card p-6 shadow-lift">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("crowdfunding.raised", "Raised")}</p>
              <p className="mt-1 font-serif text-3xl font-bold text-navy">₹{raised.toLocaleString("en-IN")}</p>
            </div>
            <p className="text-sm text-muted-foreground">{t("crowdfunding.of", "of")} ₹{target.toLocaleString("en-IN")}</p>
          </div>
          <div className="mt-4 h-3 overflow-hidden rounded-full bg-secondary">
            <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${pct}%` }} />
          </div>
          <p className="mt-2 text-sm font-semibold text-muted-foreground">{pct}% {t("crowdfunding.funded", "funded")}</p>
          
          {campaign.startDate && campaign.endDate && (
            <div className="mt-6 border-t pt-4 border-border/50 text-sm text-muted-foreground flex justify-between">
              <span>{t("projects.start_date", "Start")}: {new Date(campaign.startDate).toLocaleDateString(dateLocale)}</span>
              <span>{t("projects.end_date", "End")}: {new Date(campaign.endDate).toLocaleDateString(dateLocale)}</span>
            </div>
          )}

          <Button asChild className="mt-6 h-12 w-full rounded-xl bg-accent text-base font-bold text-accent-foreground hover:bg-accent/90">
            <Link href={`/donate?campaignId=${campaign._id}`}>
              <Heart className="mr-2 size-4" />
              {t("crowdfunding.donate_btn", "Donate to this campaign")}
            </Link>
          </Button>
        </aside>
      </div>
    </article>
  )
}

