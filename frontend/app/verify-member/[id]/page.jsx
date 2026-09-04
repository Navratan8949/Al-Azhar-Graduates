"use client"

import { useEffect, useState } from "react"
import { ShieldAlert, CheckCircle2, Building2, Loader2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import api from "@/service/api"
import { useParams } from "next/navigation"

export default function VerifyMemberPage() {
  const params = useParams()
  const memberId = params?.id

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  console.log("VerifyMemberPage mounted. useParams:", params, "memberId:", memberId)

  useEffect(() => {
    if (!memberId) return

    api.get(`/members/verify/${memberId}`)
      .then(res => {
        setData(res.data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.response?.data?.message || "Invalid or unverified Member ID")
        setLoading(false)
      })
  }, [memberId])

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-900 text-white px-4">
        <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-4 rounded-2xl backdrop-blur-xl">
          <Loader2 className="size-6 animate-spin text-emerald-400" />
          <p className="text-sm font-semibold tracking-wide">Authenticating Member Credentials...</p>
        </div>
      </div>
    )
  }

  const member = data?.member
  const isApproved = data?.verified

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-emerald-500 selection:text-slate-950 flex flex-col justify-between p-4 md:p-8">
      {/* Top Header */}
      <div className="max-w-2xl mx-auto w-full flex items-center justify-between py-4 border-b border-white/10">
        <Link href="/" className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="size-4" /> Back to Official Portal
        </Link>
        <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-950/80 border border-emerald-800/50 px-3 py-1 rounded-full">
          Official Identity System
        </span>
      </div>

      {/* Main Card */}
      <div className="max-w-md mx-auto w-full my-auto py-6">
        {error || !isApproved ? (
          <div className="rounded-3xl bg-slate-900/90 border border-rose-500/30 p-8 shadow-2xl backdrop-blur-2xl text-center space-y-6 animate-in fade-in zoom-in-95">
            <div className="size-20 mx-auto rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-500">
              <ShieldAlert className="size-10" />
            </div>
            <div>
              <h1 className="text-2xl font-serif font-bold text-rose-400">Verification Failed</h1>
              <p className="text-sm text-slate-400 mt-2">{error || "This Member ID is either unverified, expired, or invalid."}</p>
            </div>
            <div className="bg-slate-950/60 rounded-2xl p-4 border border-white/5 font-mono text-xs text-slate-300">
              Scanned ID: <span className="text-rose-400 font-bold">{memberId}</span>
            </div>
            <p className="text-xs text-slate-500">If you believe this is an error, please contact World Association for Al-Azhar Graduates Administration.</p>
          </div>
        ) : (
          <div className="rounded-3xl bg-slate-900/90 border border-emerald-500/30 p-6 md:p-8 shadow-2xl backdrop-blur-2xl space-y-6 relative overflow-hidden animate-in fade-in zoom-in-95">
            {/* Background Glow */}
            <div className="absolute -top-24 -right-24 size-48 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

            {/* Verified Badge Header */}
            <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/30 p-3.5 rounded-2xl">
              <div className="size-10 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="size-6" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-400">Official NGO Member</p>
                <p className="text-xs text-slate-300">Identity Verified & Authentic</p>
              </div>
            </div>

            {/* Member Details */}
            <div className="text-center pt-2">
              {member.profileImage ? (
                <img
                  src={member.profileImage}
                  alt={member.fullName}
                  className="size-28 mx-auto rounded-2xl object-cover border-2 border-emerald-400/40 shadow-xl shadow-slate-950/80"
                />
              ) : (
                <div className="size-28 mx-auto rounded-2xl bg-slate-800 border-2 border-emerald-400/40 flex items-center justify-center font-bold text-3xl text-emerald-400 shadow-xl">
                  {member.fullName?.charAt(0)}
                </div>
              )}

              <h2 className="text-2xl font-serif font-bold text-white mt-4">{member.fullName}</h2>
              <p className="text-xs font-mono font-semibold text-emerald-400 mt-1">ID: {member.memberId}</p>
            </div>

            {/* Spec Sheet Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs border-t border-white/10 pt-5">
              <div className="bg-slate-950/50 p-3 rounded-xl border border-white/5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Membership Type</p>
                <p className="font-semibold text-slate-200 capitalize mt-0.5">{member.membershipType || "General"}</p>
              </div>
              <div className="bg-slate-950/50 p-3 rounded-xl border border-white/5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Blood Group</p>
                <p className="font-bold text-rose-400 mt-0.5">{member.bloodGroup || "N/A"}</p>
              </div>
              <div className="bg-slate-950/50 p-3 rounded-xl border border-white/5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Occupation</p>
                <p className="font-semibold text-slate-200 mt-0.5 truncate">{member.occupation || "N/A"}</p>
              </div>
              <div className="bg-slate-950/50 p-3 rounded-xl border border-white/5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Joining Date</p>
                <p className="font-semibold text-slate-200 mt-0.5">
                  {member.joiningDate ? new Date(member.joiningDate).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }) : "N/A"}
                </p>
              </div>
            </div>

            {/* Organization Footer Seal */}
            <div className="flex items-center justify-between border-t border-white/10 pt-4 text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5 font-serif font-bold text-slate-300">
                <Building2 className="size-3.5 text-emerald-400" /> World Association for Al-Azhar Graduates
              </span>
              <span className="font-mono text-[10px] text-slate-500">Secured via Real-Time API</span>
            </div>
          </div>
        )}
      </div>

      {/* Page Footer */}
      <div className="max-w-2xl mx-auto w-full text-center text-xs text-slate-500 py-4 border-t border-white/10">
        World Association for Al-Azhar Graduates &copy; {new Date().getFullYear()} &bull; All Rights Reserved
      </div>
    </div>
  )
}
