import { PageHero } from "@/components/pages/page-hero"
import { CardsGrid } from "@/components/pages/cards-grid"
import { getCrowdfundings } from "@/service/crowdfunding.service"

export const metadata = { title: "Support Campaigns" }
export const dynamic = "force-dynamic"

export default async function Page() {
  let campaigns = []
  try {
    const res = await getCrowdfundings()
    if (res && res.success && res.campaigns) {
      campaigns = res.campaigns
    }
  } catch (error) {
    console.error("Failed to fetch campaigns:", error)
  }

  // Only show active or completed campaigns (not closed) if preferred, or all.
  // We'll show all that were fetched.

  return (
    <>
      <PageHero 
        title="Crowdfunding & Zakat" 
        description="Support our initiatives to provide education, healthcare, and welfare to the underprivileged. Calculate and pay your Zakat to purify your wealth."
        image="/logo.png" 
      />
      <CardsGrid items={campaigns} type="campaign" />
    </>
  )
}
