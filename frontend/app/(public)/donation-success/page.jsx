"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { CheckCircle2, Clock, XCircle, ArrowLeft, Printer, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import api from "@/service/api"

function formatNativeDate(dateString) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }).replace(',', ' -');
}

function DonationSuccessInner() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const donationId = searchParams.get("id")
  
  const [donation, setDonation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const fetchDonation = async () => {
    if (!donationId) {
      setError("No donation ID provided.")
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      const res = await api.get(`/donations/${donationId}`)
      if (res.data.success) {
        setDonation(res.data.donation)
      } else {
        setError(res.data.message || "Failed to load donation details.")
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load donation details.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDonation()
  }, [donationId])

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <RefreshCw className="size-8 animate-spin text-accent" />
      </div>
    )
  }

  if (error || !donation) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center p-4 text-center">
        <XCircle className="size-16 text-rose-500 mb-4" />
        <h2 className="text-2xl font-bold text-navy mb-2">Oops!</h2>
        <p className="text-muted-foreground mb-6">{error || "Something went wrong."}</p>
        <Button onClick={() => router.push("/")} variant="outline">
          <ArrowLeft className="mr-2 size-4" /> Return to Home
        </Button>
      </div>
    )
  }

  const isPending = donation.paymentStatus === "pending"
  const isVerified = donation.paymentStatus === "success" || donation.paymentStatus === "verified"
  const isFailed = donation.paymentStatus === "failed" || donation.paymentStatus === "rejected"

  return (
    <div className="min-h-screen bg-muted/30 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow-xl shadow-navy/5 rounded-3xl overflow-hidden border border-border/50">
          
          {/* Header */}
          <div className={`p-8 sm:p-12 text-center text-white relative overflow-hidden ${isVerified ? "bg-emerald-600" : isFailed ? "bg-rose-600" : "bg-amber-500"}`}>
            <div className="absolute inset-0 bg-black/10 mix-blend-overlay"></div>
            <div className="relative z-10 flex flex-col items-center">
              {isVerified && <CheckCircle2 className="size-20 mb-4 text-white drop-shadow-md" />}
              {isPending && <Clock className="size-20 mb-4 text-white drop-shadow-md" />}
              {isFailed && <XCircle className="size-20 mb-4 text-white drop-shadow-md" />}
              
              <h1 className="text-3xl font-serif font-bold tracking-tight mb-2">
                {isVerified && "Donation Verified!"}
                {isPending && "Donation Received!"}
                {isFailed && "Verification Failed"}
              </h1>
              
              <p className="text-white/90 text-sm max-w-sm mx-auto">
                {isVerified && "Thank you for your generous contribution. Your 80G receipt has been sent to your email."}
                {isPending && "Thank you! We have received your request. Your payment is currently under verification by our team."}
                {isFailed && "Unfortunately, we could not verify your payment. Please contact our support team."}
              </p>
            </div>
          </div>

          {/* Receipt Body */}
          <div className="p-8 sm:p-12">
            <div className="flex items-center justify-between mb-8 pb-8 border-b border-dashed border-border">
              <h3 className="text-xl font-bold text-navy uppercase tracking-widest">Digital Receipt</h3>
              <p className="font-mono text-sm font-semibold text-muted-foreground">
                #{donation.receiptNumber || "N/A"}
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-sm text-muted-foreground uppercase tracking-wider font-bold mb-1">Donor Name</p>
                  <p className="font-bold text-foreground text-lg">{donation.fullName || "Anonymous"}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground uppercase tracking-wider font-bold mb-1">Donation Amount</p>
                  <p className="font-bold text-emerald-600 text-3xl">₹{donation.amount?.toLocaleString("en-IN")}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 pt-6 border-t border-border/50">
                <div>
                  <p className="text-sm text-muted-foreground font-bold mb-1">Email ID</p>
                  <p className="font-medium text-foreground">{donation.email || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-bold mb-1">Phone</p>
                  <p className="font-medium text-foreground">{donation.phone || "N/A"}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 pt-4 border-t border-border/50">
                <div>
                  <p className="text-sm text-muted-foreground font-bold mb-1">Payment Method</p>
                  <p className="font-medium text-foreground uppercase">{donation.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-bold mb-1">Transaction Ref.</p>
                  <p className="font-mono font-bold text-navy">{donation.transactionId || donation.paymentId || "N/A"}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6 pt-4 border-t border-border/50">
                <div>
                  <p className="text-sm text-muted-foreground font-bold mb-1">Date Submitted</p>
                  <p className="font-medium text-foreground">
                    {formatNativeDate(donation.createdAt)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-bold mb-1">Current Status</p>
                  <p className={`font-bold inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs uppercase tracking-wider
                    ${isVerified ? "bg-emerald-100 text-emerald-700" : isFailed ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700"}
                  `}>
                    {isVerified ? "Verified" : isFailed ? "Rejected" : "Pending Verification"}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Actions */}
            <div className="mt-12 flex flex-col sm:flex-row items-center gap-4">
              <Button onClick={() => window.print()} variant="outline" className="w-full sm:w-auto flex-1 font-bold">
                <Printer className="mr-2 size-4" /> Print Receipt
              </Button>
              <Button onClick={() => fetchDonation()} variant="secondary" className="w-full sm:w-auto flex-1 font-bold">
                <RefreshCw className="mr-2 size-4" /> Refresh Status
              </Button>
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8 font-medium">
          Need help? <a href="/contact" className="text-accent hover:underline">Contact our support team</a>
        </p>
      </div>
    </div>
  )
}

export default function DonationSuccessPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><RefreshCw className="size-8 animate-spin text-accent" /></div>}>
      <DonationSuccessInner />
    </Suspense>
  )
}
