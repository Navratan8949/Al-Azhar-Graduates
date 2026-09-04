"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import api from "@/service/api"
import { Loader2, Printer, ShieldAlert } from "lucide-react"
import { Button } from "@/components/ui/button"
import { IdCard } from "@/components/shared/id-card"
import { useSiteBranding } from "@/hooks/useSiteBranding"

export default function Page() {
  const [member, setMember] = useState(null)
  const [loading, setLoading] = useState(true)
  const { siteName } = useSiteBranding()

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await api.get("/members/me")
        setMember(res.data?.member)
      } catch (err) {
        // Normal if 404
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-10 animate-spin text-navy" />
      </div>
    )
  }

  if (!member) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
        <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/20 bg-white/40 p-8 shadow-[0_8px_32px_rgba(0,0,0,0.04)] backdrop-blur-xl text-center">
          <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-white/10 pointer-events-none" />
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="mb-6 flex size-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 shadow-sm border border-amber-200/60 ring-4 ring-amber-50">
              <ShieldAlert className="size-8" />
            </div>
            
            <h3 className="font-serif text-2xl font-bold text-navy mb-3">No Membership Found</h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-8 max-w-[280px]">
              You haven't applied for membership yet, or your application is not in our system. Become a part of our global network today!
            </p>
            
            <Link href="/membership">
              <Button className="h-11 rounded-xl bg-navy px-8 text-sm font-bold tracking-wide text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-navy/90 hover:shadow-navy/20">
                Apply for Membership
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (member.membershipStatus !== "approved") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
        <div className="rounded-3xl border border-amber-200 bg-amber-50/50 backdrop-blur-md p-10 text-center shadow-lg max-w-md w-full relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5" />
          <div className="relative z-10 flex flex-col items-center">
            <div className="mb-6 flex size-16 items-center justify-center rounded-full bg-amber-100 text-amber-600 shadow-inner">
              <Loader2 className="size-8 animate-spin" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-amber-900 mb-2">Application Under Review</h2>
            <p className="text-sm text-amber-700/80 leading-relaxed max-w-[280px]">
              Your membership application is currently <span className="font-bold">{member.membershipStatus}</span>. Your ID card will be generated automatically once approved by the administration.
            </p>
          </div>
        </div>
      </div>
    )
  }

  const origin = typeof window !== "undefined" ? window.location.origin : (process.env.NEXT_PUBLIC_SITE_URL || "https://real-human-trust-nu.vercel.app")
  const verificationUrl = `${origin}/verify-member/${member.memberId}`

  return (
    <div className="mx-auto max-w-5xl p-4 sm:p-6 lg:p-8 animate-in fade-in duration-500">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-border/50">
        <div>
          <h1 className="font-serif text-2xl font-bold text-navy">Digital ID Card</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Your official identification card for {siteName}.
          </p>
        </div>
        <Button onClick={() => window.print()} className="bg-navy text-white hover:bg-navy/90 rounded-xl px-6 print:hidden">
          <Printer className="size-4 mr-2" /> Print ID Card
        </Button>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          @page { size: auto; margin: 0; }
          body { 
            -webkit-print-color-adjust: exact !important; 
            print-color-adjust: exact !important; 
            background: white !important;
          }
          body * { visibility: hidden; }
          #id-card, #id-card * { visibility: visible; }
          #id-card { 
            position: absolute; 
            left: 50%; 
            top: 50%; 
            transform: translate(-50%, -50%); 
          }
        }
      `}} />

      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 bg-slate-50/50 rounded-[2rem] border border-slate-200/60 shadow-inner relative overflow-hidden">
        {/* Subtle Background Elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-emerald-100/30 blur-[80px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-amber-100/30 blur-[100px] pointer-events-none" />
        
        <div className="relative z-10 w-full flex justify-center">
          <IdCard member={member} user={member.user} verificationUrl={verificationUrl} />
        </div>
        
        <p className="mt-10 text-sm font-medium text-slate-500 max-w-md text-center print:hidden relative z-10">
          This ID card is digitally verified. Scan the QR code to verify active membership status.
        </p>
      </div>
    </div>
  )
}

