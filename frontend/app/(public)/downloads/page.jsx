import { Download, FileText } from "lucide-react"
import { PageHero } from "@/components/pages/page-hero"
import { Button } from "@/components/ui/button"
import { getDownloads } from "@/service/download.service"

export const metadata = { title: "Downloads" }
export const dynamic = 'force-dynamic'

export default async function Page() {
  let downloads = []
  try {
    const data = await getDownloads({ status: "active" })
    if (data?.success) {
      downloads = data.data || data.downloads || []
      // ensure we only show active ones
      downloads = downloads.filter(d => d.status === 'active')
    }
  } catch (error) {
    console.error("Failed to fetch downloads:", error)
  }

  return (
    <>
      <PageHero eyebrow="Resources" title="Downloads" description="Official documents and forms." image="/al-azhar-cairo.jpg" />
      <div className="mx-auto max-w-3xl px-4 py-12 md:py-16">
        {downloads.length > 0 ? (
          <div className="divide-y divide-border/60 overflow-hidden rounded-2xl border border-border/70 bg-card shadow-soft">
            {downloads.map((row) => (
              <div key={row._id} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-navy/8 text-navy">
                    <FileText className="size-5" />
                  </span>
                  <div>
                    <span className="font-medium">{row.title}</span>
                    {row.description && <p className="text-sm text-muted-foreground">{row.description}</p>}
                  </div>
                </div>
                {row.file?.url && (
                  <Button asChild variant="outline" size="sm" className="shrink-0 rounded-lg">
                    <a href={row.file.url} target="_blank" rel="noreferrer">
                      <Download className="mr-2 size-4" />
                      Download
                    </a>
                  </Button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/70 p-12 text-center bg-secondary/30">
            <FileText className="size-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold text-foreground">No downloads available</h3>
            <p className="text-sm text-muted-foreground mt-1">We haven't uploaded any public documents yet.</p>
          </div>
        )}
      </div>
    </>
  )
}
