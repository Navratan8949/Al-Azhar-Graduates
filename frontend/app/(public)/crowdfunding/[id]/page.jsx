import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getCrowdfundings, getCrowdfundingById } from "@/service/crowdfunding.service"

export async function generateStaticParams() {
  try {
    const res = await getCrowdfundings()
    if (res && res.success && res.campaigns) {
      return res.campaigns.map((c) => ({ id: c._id }))
    }
  } catch (error) {
    console.error("Failed to fetch campaigns for static params", error)
  }
  return []
}

export async function generateMetadata({ params }) {
  const { id } = await params
  try {
    const res = await getCrowdfundingById(id)
    if (res && res.success && res.campaign) {
      return { title: res.campaign.title }
    }
  } catch (error) {
    console.error("Failed to fetch campaign metadata", error)
  }
  return { title: "Campaign" }
}

export default async function CampaignDetailPage({ params }) {
  const { id } = await params
  
  let campaign = null
  try {
    const res = await getCrowdfundingById(id)
    if (res && res.success && res.campaign) {
      campaign = res.campaign
    }
  } catch (error) {
    console.error("Failed to fetch campaign details", error)
  }

  if (!campaign) notFound()

  const raised = campaign.raisedAmount || 0
  const target = campaign.targetAmount || 1
  const pct = Math.min(100, Math.round((raised / target) * 100))
  const imageUrl = campaign.image?.url || (typeof campaign.image === 'string' ? campaign.image : null)

  return (
    <article>
      <div className="relative isolate min-h-[46vh] overflow-hidden bg-navy text-white">
        {imageUrl && <Image src={imageUrl} alt={campaign.title} fill className="object-cover opacity-50" priority sizes="100vw" />}
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/80 to-navy/40" />
        <div className="relative mx-auto flex min-h-[46vh] max-w-7xl flex-col justify-end px-4 pb-12 pt-28">
          <Link href="/crowdfunding" className="mb-6 inline-flex w-fit items-center gap-2 text-sm text-white/70 hover:text-white">
            <ArrowLeft className="size-4" /> All campaigns
          </Link>
          <span className="inline-flex w-fit rounded-full bg-accent/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-300">
            {campaign.status || "Campaign"}
          </span>
          <h1 className="mt-4 max-w-3xl font-serif text-4xl font-bold tracking-tight md:text-5xl">{campaign.title}</h1>
          <p className="mt-4 max-w-2xl text-lg text-white/75 line-clamp-2">{campaign.description}</p>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <h2 className="font-serif text-2xl font-semibold">Why this campaign matters</h2>
          <p className="mt-4 leading-relaxed text-muted-foreground whitespace-pre-wrap">
            {campaign.description}
          </p>
          <p className="mt-6 leading-relaxed text-muted-foreground text-sm font-semibold">
            Funds are tracked against the published target. Receipts are issued after verification.
          </p>
        </div>
        <aside className="h-fit rounded-2xl border border-border/70 bg-card p-6 shadow-lift">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Raised</p>
              <p className="mt-1 font-serif text-3xl font-bold text-navy">₹{raised.toLocaleString("en-IN")}</p>
            </div>
            <p className="text-sm text-muted-foreground">of ₹{target.toLocaleString("en-IN")}</p>
          </div>
          <div className="mt-4 h-3 overflow-hidden rounded-full bg-secondary">
            <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${pct}%` }} />
          </div>
          <p className="mt-2 text-sm font-semibold text-muted-foreground">{pct}% funded</p>
          
          {campaign.startDate && campaign.endDate && (
            <div className="mt-6 border-t pt-4 border-border/50 text-sm text-muted-foreground flex justify-between">
              <span>Start: {new Date(campaign.startDate).toLocaleDateString()}</span>
              <span>End: {new Date(campaign.endDate).toLocaleDateString()}</span>
            </div>
          )}

          <Button asChild className="mt-6 h-12 w-full rounded-xl bg-accent text-base font-bold text-accent-foreground hover:bg-accent/90">
            <Link href={`/donate?campaignId=${campaign._id}`}>
              <Heart className="mr-2 size-4" />
              Donate to this campaign
            </Link>
          </Button>
        </aside>
      </div>
    </article>
  )
}
