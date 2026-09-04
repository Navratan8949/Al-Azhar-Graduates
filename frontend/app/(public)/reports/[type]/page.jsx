import Link from "next/link"
import { Download, FileText, ShieldCheck, CheckCircle2, FileSpreadsheet, ArrowRight, ExternalLink } from "lucide-react"
import { PageHero } from "@/components/pages/page-hero"
import { Button } from "@/components/ui/button"
import { getReports } from "@/service/report.service"

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }) {
  const resolvedParams = await params
  const type = resolvedParams?.type || "annual"
  const title = type === "annual" ? "Annual Reports" : type === "audit" ? "Audit & Financial Reports" : "Public Transparency Reports"
  return { title }
}

export default async function Page({ params }) {
  const resolvedParams = await params
  const type = resolvedParams?.type || "annual"
  const title = type === "annual" ? "Annual Impact Reports" : type === "audit" ? "Audit & Financial Statements" : "Reports"
  const description = type === "annual"
    ? "A transparent summary of our activities, community achievements, and social impact across India."
    : "Verified financial statements, CA audit reports, and 80G Income Tax compliance filings."
  
  let reports = []
  try {
    const data = await getReports({ type })
    if (data?.success) {
      const fetched = data.data || data.reports || []
      reports = fetched.filter(r => r.type === type && (r.status === 'active' || !r.status))
      reports.sort((a, b) => (b.year || 0) - (a.year || 0))
    }
  } catch (error) {
    console.error(`Failed to fetch ${type} reports:`, error)
  }

  return (
    <>
      <PageHero 
        eyebrow="Transparency & Accountability" 
        title={title} 
        description={description} 
        image="/al-azhar-cairo.jpg" 
      />

      <div className="mx-auto max-w-5xl px-4 py-12 md:py-16">
        
        {/* Navigation Tabs for Reports */}
        <div className="mb-10 flex flex-wrap items-center justify-center gap-3 border-b border-border/60 pb-6">
          <Link
            href="/reports/annual"
            className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold transition-all ${
              type === "annual"
                ? "bg-navy text-white shadow-md"
                : "bg-secondary text-muted-foreground hover:bg-navy/10 hover:text-navy"
            }`}
          >
            <FileText className="size-4 text-accent" /> Annual Impact Reports
          </Link>

          <Link
            href="/reports/audit"
            className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold transition-all ${
              type === "audit"
                ? "bg-navy text-white shadow-md"
                : "bg-secondary text-muted-foreground hover:bg-navy/10 hover:text-navy"
            }`}
          >
            <FileSpreadsheet className="size-4 text-accent" /> Audit & Financial Reports
          </Link>
        </div>

        {/* 80G & 12A Trust Compliance Banner */}
        <div className="mb-10 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-6 text-emerald-950 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white font-bold shadow-sm">
              <ShieldCheck className="size-6" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold">100% Tax Exempt & Govt Registered</h3>
              <p className="text-xs text-emerald-800/90 mt-0.5 max-w-xl">
                World Association for Al-Azhar Graduates is registered under Section 12A and Section 80G of the Income Tax Act, 1961. All donations are tax deductible.
              </p>
            </div>
          </div>
          <div className="shrink-0 flex items-center gap-2 text-xs font-bold text-emerald-900 bg-white/80 px-3.5 py-1.5 rounded-full border border-emerald-200">
            <CheckCircle2 className="size-4 text-emerald-600" /> 80G Approved
          </div>
        </div>

        {/* Reports Cards Grid or Empty State */}
        {reports.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2">
            {reports.map((report) => (
              <div 
                key={report._id} 
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/70 bg-card p-6 shadow-soft transition-all duration-300 hover:border-accent/40 hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-navy/8 px-3 py-1 text-xs font-bold text-navy">
                      <FileText className="size-3.5 text-accent" /> {report.year ? `FY ${report.year}-${report.year + 1}` : "Official Report"}
                    </span>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                      PDF Document
                    </span>
                  </div>

                  <h3 className="font-serif text-xl font-bold text-navy group-hover:text-accent transition-colors">
                    {report.title}
                  </h3>
                  
                  {report.description && (
                    <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                      {report.description}
                    </p>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-muted-foreground">
                    Verified Trust Document
                  </span>

                  {report.pdf?.url && (
                    <Button asChild size="sm" className="rounded-xl bg-accent font-bold text-accent-foreground hover:bg-accent/90">
                      <a href={report.pdf.url} target="_blank" rel="noreferrer">
                        <Download className="mr-1.5 size-3.5" /> Download PDF
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/70 p-12 text-center bg-secondary/30">
            <FileText className="size-12 text-muted-foreground/40 mb-3" />
            <h3 className="text-base font-bold text-navy">No Reports Available</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm">
              No {type} reports have been published yet. Reports uploaded from the admin panel will appear here.
            </p>
          </div>
        )}

      </div>
    </>
  )
}
