import { PageHero } from "@/components/pages/page-hero"
import { CardsGrid } from "@/components/pages/cards-grid"
import { getProjects } from "@/service/project.service"

export const metadata = { title: "Programs & Activities" }

export default async function Page() {
  let projects = []
  try {
    const data = await getProjects()
    if (data?.success) {
      projects = data.data || data.projects || []
    }
  } catch (error) {
    console.error("Failed to fetch projects:", error)
  }

  return (
    <>
      <PageHero 
        eyebrow="Our Work" 
        title="Programs & Activities" 
        description="Educational initiatives, outreach programs, and intellectual forums." 
        image="/rural-classroom-children-learning-india.png" 
      />
      <CardsGrid items={projects} type="project" />
    </>
  )
}
