import { notFound } from "next/navigation"
import { getProjects, getProjectById } from "@/service/project.service"
import { ProjectDetailContent } from "@/components/pages/project-detail-content"

export async function generateStaticParams() {
  try {
    const data = await getProjects()
    if (data && data.success && data.projects) {
      return data.projects.map((p) => ({ id: p._id }))
    }
  } catch (error) {
    console.error("Failed to fetch projects for static params", error)
  }
  return []
}

export async function generateMetadata({ params }) {
  const { id } = await params
  try {
    const data = await getProjectById(id)
    return { title: data?.project?.title || data?.data?.title || "Program Details" }
  } catch (err) {
    return { title: "Program Details" }
  }
}

export default async function ProjectDetailPage({ params }) {
  const { id } = await params
  
  let project = null
  try {
    const data = await getProjectById(id)
    if (data?.success) {
      project = data.project || data.data
    }
  } catch (error) {
    console.error("Failed to fetch project details:", error)
  }

  if (!project) notFound()

  return <ProjectDetailContent project={project} />
}
