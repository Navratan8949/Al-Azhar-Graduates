"use client"
import { useState, useEffect } from "react"
import { getMyCertificates } from "@/service/certificate.service"
import { Award, FileBadge, Download, Loader2 } from "lucide-react"

export default function MemberCertificatesPage() {
  const [certificates, setCertificates] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMyCertificates()
      .then(res => {
        if (res.success) {
          setCertificates(res.certificates || [])
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold md:text-3xl">My Certificates</h1>
      <p className="mt-1 text-sm text-muted-foreground">View and download your official certificates and awards.</p>
      
      <div className="mt-8">
        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="size-6 animate-spin text-navy" /></div>
        ) : certificates.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {certificates.map((cert) => (
              <div key={cert._id} className="relative flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-white p-6 shadow-sm transition-all hover:shadow-md">
                {cert.status === "cancelled" && (
                  <div className="absolute right-0 top-0 rounded-bl-xl bg-rose-100 px-3 py-1 text-xs font-bold text-rose-700">
                    Cancelled
                  </div>
                )}
                
                <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-accent/20 text-accent-foreground">
                  <FileBadge className="size-6" />
                </div>
                
                <h3 className="font-serif text-lg font-bold text-navy leading-tight">{cert.title}</h3>
                <p className="mt-1 text-xs font-mono text-muted-foreground">No: {cert.certificateNo}</p>
                
                {cert.description && (
                  <p className="mt-3 text-sm text-muted-foreground line-clamp-3">{cert.description}</p>
                )}
                
                <div className="mt-6 flex items-center justify-between pt-4 border-t border-border/50">
                  <span className="text-xs font-semibold text-muted-foreground">
                    Issued: {new Date(cert.issueDate).toLocaleDateString()}
                  </span>
                  
                  {cert.pdf?.url && cert.status !== "cancelled" ? (
                    <a 
                      href={cert.pdf.url} 
                      download
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center gap-1.5 rounded-lg bg-navy px-3 py-1.5 text-xs font-semibold text-white hover:bg-navy/90"
                    >
                      <Download className="size-3.5" />
                      Download
                    </a>
                  ) : (
                    <span className="text-xs text-muted-foreground italic">File not available</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-border/70 bg-white py-20 text-center">
            <Award className="mx-auto size-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-bold text-navy">No Certificates Yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">You will see your official certificates here once they are issued by the administration.</p>
          </div>
        )}
      </div>
    </div>
  )
}
