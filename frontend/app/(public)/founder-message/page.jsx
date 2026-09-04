import { PageHero } from "@/components/pages/page-hero"
import { FounderMessageSection } from "@/components/sections/founder-message"

export const metadata = { title: "President's Message" }

export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="President's Message"
        title="Knowledge, Moderation, and Service."
        description="A message from the President of the World Association for Al-Azhar Graduates – India Branch."
        image="/hero-community-education-india.png"
      />

      <FounderMessageSection />
    </>
  )
}
