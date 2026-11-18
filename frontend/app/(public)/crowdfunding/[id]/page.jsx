import { notFound } from "next/navigation"
import { getCrowdfundings, getCrowdfundingById } from "@/service/crowdfunding.service"
import { CampaignDetailContent } from "@/components/pages/campaign-detail-content"

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

  return <CampaignDetailContent campaign={campaign} />
}
