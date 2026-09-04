import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SectionHeading } from "@/components/shared/section-heading"
import { Reveal } from "@/components/shared/reveal"
import { ProjectCard } from "@/components/shared/project-card"
import { getProjects } from "@/service/project.service"

export async function FeaturedProjects() {
  let projects = []
  try {
    const data = await getProjects()
    if (data?.success) {
      const allProjects = data.data || data.projects || []
      projects = allProjects.filter(p => p.isFeatured).slice(0, 3)
      if (projects.length === 0) {
        projects = allProjects.slice(0, 3) // Fallback to first 3 if none featured
      }
    }
  } catch (error) {
    console.error("Failed to fetch featured projects:", error)
  }

  if (projects.length === 0) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-16 md:py-20">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            align="left"
            eyebrow="Our Work"
            title="Featured projects"
            description="Ongoing initiatives creating real change in the lives of thousands across Gujarat."
          />
        </div>
        <div className="mt-12 rounded-2xl border border-dashed border-border/80 bg-card p-12 text-center shadow-sm">
          <h3 className="font-serif text-xl font-semibold text-navy">No featured projects</h3>
          <p className="mt-2 text-muted-foreground">We will highlight our ongoing initiatives here soon.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:py-20">
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <SectionHeading
          align="left"
          eyebrow="Our Work"
          title="Featured projects"
          description="Ongoing initiatives creating real change in the lives of thousands across Gujarat."
        />
        <Button asChild variant="outline" className="shrink-0 border-navy/20">
          <Link href="/projects">
            View All Projects
            <ArrowRight className="ml-2 size-4" />
          </Link>
        </Button>
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {projects.map((p, i) => (
          <Reveal key={p._id} delay={i * 0.1}>
            <ProjectCard project={p} />
          </Reveal>
        ))}
      </div>
    </section>
  )
}
