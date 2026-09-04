"use client"
import { useEffect, useState } from "react"
import { Loader2, Receipt, Heart, CreditCard, Calendar, ArrowUpRight, ShieldCheck, CheckCircle2, Clock, XCircle, FileText } from "lucide-react"
import api from "@/service/api"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export default function Page() {
  const [donations, setDonations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDonations() {
      try {
        const res = await api.get("/donations/me")
        setDonations(res.data?.donations || [])
      } catch (err) {
        console.error(err)
        toast.error("Failed to load donation history")
      } finally {
        setLoading(false)
      }
    }
    fetchDonations()
  }, [])

  const totalDonated = donations.reduce((sum, d) => (d.paymentStatus === 'verified' || d.paymentStatus === 'success') ? sum + (d.amount || 0) : sum, 0)
  const verifiedCount = donations.filter(d => d.paymentStatus === 'verified' || d.paymentStatus === 'success').length
  const pendingCount = donations.filter(d => d.paymentStatus === 'pending' || d.paymentStatus === 'manual').length

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-navy p-6 text-white shadow-lg md:p-8">
        <div className="absolute -right-10 -top-10 size-48 rounded-full bg-accent/20 blur-2xl" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent backdrop-blur-md">
            <Heart className="size-3.5 fill-current text-accent" /> Tax Exemption (80G)
          </div>
          <h1 className="mt-3 font-serif text-3xl font-bold tracking-tight text-white md:text-4xl">Donation History</h1>
          <p className="mt-2 max-w-xl text-sm text-white/70">
            Track all your contributions, verify offline payments, and download your 80G tax receipts.
          </p>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Total Contributed</span>
            <span className="flex size-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              ₹
            </span>
          </div>
          <p className="mt-3 font-serif text-3xl font-bold text-navy">₹{totalDonated.toLocaleString("en-IN")}</p>
          <p className="mt-1 text-xs text-muted-foreground">Verified 80G Contributions</p>
        </div>

        <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Verified Receipts</span>
            <span className="flex size-9 items-center justify-center rounded-xl bg-accent/15 text-accent font-bold">
              <CheckCircle2 className="size-5" />
            </span>
          </div>
          <p className="mt-3 font-serif text-3xl font-bold text-navy">{verifiedCount}</p>
          <p className="mt-1 text-xs text-muted-foreground">80G Receipts Available</p>
        </div>

        <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Under Verification</span>
            <span className="flex size-9 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
              <Clock className="size-5" />
            </span>
          </div>
          <p className="mt-3 font-serif text-3xl font-bold text-navy">{pendingCount}</p>
          <p className="mt-1 text-xs text-muted-foreground">Verification in progress (24 hrs)</p>
        </div>
      </div>

      {/* History List */}
      <div className="rounded-2xl border border-border/60 bg-white p-6 shadow-soft md:p-8">
        <h2 className="font-serif text-xl font-bold text-navy mb-6">Recent Contributions</h2>

        {loading ? (
          <div className="py-12 text-center"><Loader2 className="mx-auto size-8 animate-spin text-navy" /></div>
        ) : donations.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground rounded-xl border border-dashed border-border/70 bg-secondary/30">
            <Heart className="mx-auto size-10 opacity-40 mb-3" />
            <p className="font-semibold text-foreground">No donations recorded yet.</p>
            <p className="text-xs text-muted-foreground mt-1">Your contributions will appear here with 80G tax receipts.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {donations.map((d) => {
              const isVerified = d.paymentStatus === 'verified' || d.paymentStatus === 'success'
              const isPending = d.paymentStatus === 'pending' || d.paymentStatus === 'manual'
              
              return (
                <div key={d._id} className="group relative overflow-hidden rounded-2xl border border-border/70 bg-white p-5 transition-all hover:border-accent/40 hover:shadow-md">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    
                    {/* Left: Info */}
                    <div className="flex items-start gap-4">
                      <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-navy/5 text-navy font-bold text-lg group-hover:bg-accent/15 group-hover:text-accent transition-colors">
                        ₹
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-serif text-2xl font-bold text-navy">₹{d.amount?.toLocaleString("en-IN")}</span>
                          <span className="rounded-md bg-secondary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-navy">
                            {d.paymentMethod}
                          </span>
                        </div>

                        <p className="mt-1 text-xs font-medium text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-1">
                          <span>Date: {new Date(d.createdAt).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                          <span>•</span>
                          <span>Receipt: <strong className="font-mono text-foreground">{d.receiptNumber || "N/A"}</strong></span>
                          {d.transactionId && (
                            <>
                              <span>•</span>
                              <span>Ref/UTR: <strong className="font-mono text-foreground">{d.transactionId}</strong></span>
                            </>
                          )}
                        </p>

                        {(d.project?.title || d.campaign?.title || d.purpose) && (
                          <div className="mt-2 text-xs font-semibold text-navy/80">
                            {d.campaign?.title ? `Campaign: ${d.campaign.title}` : d.project?.title ? `Project: ${d.project.title}` : `Purpose: ${d.purpose}`}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right: Status & Actions */}
                    <div className="flex items-center gap-3 sm:self-center">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                        isVerified 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : isPending 
                          ? 'bg-amber-100 text-amber-800' 
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {isVerified && <CheckCircle2 className="size-3.5 text-emerald-600" />}
                        {isPending && <Clock className="size-3.5 text-amber-600 animate-pulse" />}
                        {d.paymentStatus === 'rejected' && <XCircle className="size-3.5 text-rose-600" />}
                        <span className="capitalize">{isVerified ? "Verified (80G Issued)" : isPending ? "Verification Pending" : d.paymentStatus}</span>
                      </span>

                      {isVerified && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            toast.info("Your 80G PDF receipt has been sent to your registered email address.")
                          }}
                          className="h-9 rounded-xl font-bold border-navy/20 text-navy hover:bg-navy/5 text-xs"
                        >
                          <Receipt className="mr-1.5 size-3.5 text-accent" /> 80G Receipt
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
