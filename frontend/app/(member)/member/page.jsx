"use client";
import Link from "next/link";
import {
  CalendarDays,
  CheckCircle2,
  FileBadge,
  IndianRupee,
  Loader2,
  IdCard,
  MessageSquarePlus,
  Heart,
  ArrowRight,
  ShieldCheck,
  Clock,
  FileText,
  BellRing,
  UserCheck,
  ChevronRight,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { selectUser } from "@/redux/features/userSlice";
import { useEffect, useState } from "react";
import api from "@/service/api";
import { cn } from "@/lib/utils";

export default function Page() {
  const user = useSelector(selectUser);
  const [member, setMember] = useState(null);
  const [stats, setStats] = useState({
    donations: 0,
    events: 0,
    certificates: 0,
    appointments: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);
        try {
          const memberRes = await api.get("/members/me");
          setMember(memberRes.data?.member);
        } catch (e) {}

        try {
          const donationRes = await api.get("/donations/me");
          setStats((s) => ({
            ...s,
            donations: donationRes.data?.donations?.length || 0,
          }));
        } catch (e) {}

        try {
          const eventRes = await api.get("/event-registration/me");
          setStats((s) => ({
            ...s,
            events:
              eventRes.data?.data?.length ||
              eventRes.data?.registrations?.length ||
              0,
          }));
        } catch (e) {}

        try {
          const certRes = await api.get("/certificates/me");
          setStats((s) => ({
            ...s,
            certificates: certRes.data?.certificates?.length || 0,
          }));
        } catch (e) {}

        try {
          const appRes = await api.get("/appointments/me");
          setStats((s) => ({ ...s, appointments: appRes.data?.count || 0 }));
        } catch (e) {}
      } finally {
        setLoading(false);
      }
    }

    if (user?._id) {
      fetchDashboardData();
    }
  }, [user]);

  if (!user)
    return (
      <div className="py-12 text-center">
        <Loader2 className="mx-auto size-10 animate-spin text-lime" />
      </div>
    );

  const initials =
    user.fullName
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase() || "U";
  const isApproved = member?.membershipStatus === "approved";
  const isPending = member?.membershipStatus === "pending";
  const isRejected = member?.membershipStatus === "rejected";

  return (
    <div className="space-y-8 pb-12">
      {/* Premium Welcome Banner */}
      <div className="relative overflow-hidden rounded-[2rem] bg-navy p-8 sm:p-10 text-white shadow-xl">
        <div className="absolute -right-20 -top-20 size-64 rounded-full bg-lime/20 blur-[80px] pointer-events-none"></div>
        <div className="absolute -left-20 -bottom-20 size-64 rounded-full bg-blue-500/20 blur-[80px] pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-lime mb-4 backdrop-blur-md">
              <Activity className="size-4 animate-pulse" /> Dashboard Overview
            </div>
            <h1 className="font-serif text-3xl font-bold md:text-5xl leading-tight">
              Welcome back, {user.fullName?.split(" ")[0]}!{" "}
              <span className="animate-wave inline-block origin-bottom-right">
                👋
              </span>
            </h1>
            <p className="mt-3 text-base text-white/80 font-medium leading-relaxed">
              Track your NGO membership, donations, registered events, and
              official documents from your personalized hub.
            </p>
          </div>

          <div className="flex shrink-0 flex-wrap gap-3">
            <Link
              href="/member/id-card"
              className="group relative overflow-hidden rounded-xl bg-lime px-5 py-3 text-sm font-bold text-navy shadow-lg transition-all hover:scale-105 hover:shadow-lime/20"
            >
              <span className="relative z-10 flex items-center gap-2">
                <IdCard className="size-4" /> My ID Card
              </span>
            </Link>
            <Link
              href="/donate"
              className="group relative overflow-hidden rounded-xl bg-white/10 border border-white/20 backdrop-blur-md px-5 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-white/20 hover:scale-105"
            >
              <span className="relative z-10 flex items-center gap-2">
                <Heart className="size-4 text-rose-400" /> Donate
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Membership Pipeline Tracker */}
      <div className="rounded-[2rem] border border-border/50 bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="font-serif text-2xl font-bold text-navy flex items-center gap-3">
              <UserCheck className="size-6 text-lime" /> Membership Status
              Tracker
            </h2>
            <p className="mt-1 text-sm font-medium text-muted-foreground">
              Monitor the progress of your official membership application in
              real-time.
            </p>
          </div>
          {!member && (
            <Button
              asChild
              className="rounded-xl bg-navy text-white hover:bg-navy/90 h-11 px-6 font-bold shadow-md"
            >
              <Link href="/membership">
                Apply for Membership <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
          )}
        </div>

        {/* 3 Step Connected Status Pipeline */}
        <div className="relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden sm:block absolute top-[2.75rem] left-8 right-8 h-1 bg-slate-100 rounded-full z-0">
            <div
              className={cn(
                "h-full bg-emerald-400 rounded-full transition-all duration-1000",
                !member
                  ? "w-0"
                  : isApproved
                    ? "w-full"
                    : isPending
                      ? "w-1/2"
                      : "w-1/4",
              )}
            ></div>
          </div>

          <div className="grid gap-6 sm:grid-cols-3 relative z-10">
            {/* Step 1 */}
            <div
              className={cn(
                "relative rounded-[1.5rem] border p-6 transition-all bg-white",
                member
                  ? "border-emerald-200 shadow-[0_10px_20px_-10px_rgba(16,185,129,0.15)]"
                  : "border-slate-200 shadow-sm opacity-60",
              )}
            >
              <div
                className={cn(
                  "flex size-12 items-center justify-center rounded-full mb-4 border-4 border-white shadow-sm",
                  member
                    ? "bg-emerald-100 text-emerald-600"
                    : "bg-slate-100 text-slate-400",
                )}
              >
                <CheckCircle2 className="size-6" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Step 1: Application
              </span>
              <p
                className={cn(
                  "mt-1 text-lg font-bold",
                  member ? "text-navy" : "text-slate-600",
                )}
              >
                {member ? "Submitted" : "Not Applied"}
              </p>
              <p className="text-xs text-muted-foreground mt-1 font-medium">
                {member
                  ? `Type: ${member.membershipType}`
                  : "Join the organization"}
              </p>
            </div>

            {/* Step 2 */}
            <div
              className={cn(
                "relative rounded-[1.5rem] border p-6 transition-all bg-white",
                isApproved
                  ? "border-emerald-200 shadow-[0_10px_20px_-10px_rgba(16,185,129,0.15)]"
                  : isPending
                    ? "border-amber-200 shadow-[0_10px_20px_-10px_rgba(245,158,11,0.15)]"
                    : isRejected
                      ? "border-rose-200 shadow-sm"
                      : "border-slate-200 shadow-sm opacity-60",
              )}
            >
              <div
                className={cn(
                  "flex size-12 items-center justify-center rounded-full mb-4 border-4 border-white shadow-sm",
                  isApproved
                    ? "bg-emerald-100 text-emerald-600"
                    : isPending
                      ? "bg-amber-100 text-amber-600"
                      : "bg-slate-100 text-slate-400",
                )}
              >
                {isApproved ? (
                  <ShieldCheck className="size-6" />
                ) : isPending ? (
                  <Clock className="size-6" />
                ) : (
                  <Clock className="size-6" />
                )}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Step 2: Verification
              </span>
              <p
                className={cn(
                  "mt-1 text-lg font-bold",
                  isApproved || isPending || isRejected
                    ? "text-navy"
                    : "text-slate-600",
                )}
              >
                {isApproved
                  ? "Approved"
                  : isPending
                    ? "In Review"
                    : isRejected
                      ? "Rejected"
                      : "Pending"}
              </p>
              <p className="text-xs text-muted-foreground mt-1 font-medium">
                {isApproved
                  ? "Admin verified"
                  : isPending
                    ? "Usually takes 24-48h"
                    : isRejected
                      ? member.rejectionReason || "Check profile"
                      : "Awaiting application"}
              </p>
            </div>

            {/* Step 3 */}
            <div
              className={cn(
                "relative rounded-[1.5rem] border p-6 transition-all bg-white",
                isApproved
                  ? "border-emerald-200 shadow-[0_10px_20px_-10px_rgba(16,185,129,0.15)]"
                  : "border-slate-200 shadow-sm opacity-60",
              )}
            >
              <div
                className={cn(
                  "flex size-12 items-center justify-center rounded-full mb-4 border-4 border-white shadow-sm",
                  isApproved
                    ? "bg-emerald-100 text-emerald-600"
                    : "bg-slate-100 text-slate-400",
                )}
              >
                <IdCard className="size-6" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Step 3: Official ID
              </span>
              <p
                className={cn(
                  "mt-1 text-lg font-bold",
                  isApproved ? "text-navy" : "text-slate-600",
                )}
              >
                {isApproved ? "Card Active" : "Locked"}
              </p>
              <p className="text-xs text-muted-foreground mt-1 font-medium">
                {isApproved
                  ? `ID: ${member.memberId}`
                  : "Unlocks after approval"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Profile & Metric Cards */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Profile Card & Notice */}
        <div className="space-y-8 lg:col-span-1">
          {/* Member Profile Box */}
          <div className="overflow-hidden rounded-[2rem] border border-border/50 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="h-28 bg-gradient-to-r from-navy to-[#0a192f] relative">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.8)_0,transparent_100%)]"></div>
            </div>

            <div className="px-6 pb-6 relative">
              <div className="absolute -top-12 left-6 rounded-[1.25rem] bg-white p-1.5 shadow-md">
                <div className="flex size-20 items-center justify-center overflow-hidden rounded-[1rem] bg-navy text-2xl font-bold text-white shrink-0">
                  {member?.profileImage?.url ? (
                    <img
                      src={member.profileImage.url}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    initials
                  )}
                </div>
              </div>

              <div className="pt-12">
                <h3 className="font-serif text-xl font-bold text-navy truncate">
                  {user.fullName}
                </h3>
                {member ? (
                  <div className="mt-1 flex flex-col gap-2">
                    <p className="text-xs font-mono font-bold text-muted-foreground bg-slate-100 inline-flex px-2 py-1 rounded w-fit">
                      {member.memberId}
                    </p>
                    <span
                      className={cn(
                        "inline-flex w-fit items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider",
                        isApproved
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200",
                      )}
                    >
                      {isApproved && <CheckCircle2 className="size-3.5" />}
                      {member.membershipStatus} Member
                    </span>
                  </div>
                ) : (
                  <p className="mt-1 text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                    Public Account
                  </p>
                )}
              </div>

              <div className="mt-6 space-y-3 rounded-2xl bg-slate-50 p-4 border border-border/50 text-sm">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="font-medium text-xs uppercase tracking-widest">
                    Email
                  </span>
                  <span className="font-bold text-navy truncate max-w-[150px]">
                    {user.email}
                  </span>
                </div>
                {member?.bloodGroup && (
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span className="font-medium text-xs uppercase tracking-widest">
                      Blood Grp
                    </span>
                    <span className="font-bold text-rose-600">
                      {member.bloodGroup}
                    </span>
                  </div>
                )}
                {member?.occupation && (
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span className="font-medium text-xs uppercase tracking-widest">
                      Occupation
                    </span>
                    <span className="font-bold text-navy truncate max-w-[120px]">
                      {member.occupation}
                    </span>
                  </div>
                )}
              </div>

              <Button
                asChild
                variant="outline"
                className="mt-6 h-12 w-full rounded-xl text-sm font-bold border-2 border-border hover:bg-slate-50 transition-all"
              >
                <Link href="/member/profile">View Profile Details</Link>
              </Button>
            </div>
          </div>

          {/* Announcement Box */}
          <div className="rounded-[2rem] border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50/30 p-6 shadow-sm">
            <h3 className="font-serif text-sm font-bold text-blue-950 flex items-center gap-2 mb-3">
              <div className="flex size-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <BellRing className="size-4" />
              </div>
              Community Notice
            </h3>
            <p className="text-sm font-medium text-blue-900/80 leading-relaxed">
              Keep your profile and ID proof updated to download your official
              verified Member QR Card for upcoming NGO events.
            </p>
          </div>
        </div>

        {/* Metric Cards Grid */}
        <div className="space-y-6 lg:col-span-2">
          <div className="grid gap-6 sm:grid-cols-2">
            {/* Donations Card */}
            <Link
              href="/member/donations"
              className="group rounded-[2rem] border border-border/50 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] relative overflow-hidden"
            >
              <div className="absolute right-0 top-0 size-32 bg-emerald-500/5 blur-[50px] rounded-bl-full pointer-events-none group-hover:bg-emerald-500/10 transition-colors"></div>
              <div className="flex items-center justify-between relative z-10">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 shadow-inner group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-300">
                  <IndianRupee className="size-6" />
                </div>
                <div className="flex size-8 items-center justify-center rounded-full bg-slate-50 text-muted-foreground group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                  <ChevronRight className="size-4" />
                </div>
              </div>
              <div className="mt-6 relative z-10">
                {loading ? (
                  <Loader2 className="size-6 animate-spin text-muted-foreground mb-2" />
                ) : (
                  <p className="font-serif text-4xl font-bold text-navy">
                    {stats.donations}
                  </p>
                )}
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground mt-2 block">
                  Total Donations
                </span>
              </div>
            </Link>

            {/* Events Card */}
            <Link
              href="/member/event-registration"
              className="group rounded-[2rem] border border-border/50 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] relative overflow-hidden"
            >
              <div className="absolute right-0 top-0 size-32 bg-blue-500/5 blur-[50px] rounded-bl-full pointer-events-none group-hover:bg-blue-500/10 transition-colors"></div>
              <div className="flex items-center justify-between relative z-10">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 shadow-inner group-hover:bg-blue-500 group-hover:text-white transition-colors duration-300">
                  <CalendarDays className="size-6" />
                </div>
                <div className="flex size-8 items-center justify-center rounded-full bg-slate-50 text-muted-foreground group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                  <ChevronRight className="size-4" />
                </div>
              </div>
              <div className="mt-6 relative z-10">
                {loading ? (
                  <Loader2 className="size-6 animate-spin text-muted-foreground mb-2" />
                ) : (
                  <p className="font-serif text-4xl font-bold text-navy">
                    {stats.events}
                  </p>
                )}
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground mt-2 block">
                  Registered Events
                </span>
              </div>
            </Link>

            {/* Certificates Card */}
            <Link
              href="/member/certificates"
              className="group rounded-[2rem] border border-border/50 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] relative overflow-hidden"
            >
              <div className="absolute right-0 top-0 size-32 bg-violet-500/5 blur-[50px] rounded-bl-full pointer-events-none group-hover:bg-violet-500/10 transition-colors"></div>
              <div className="flex items-center justify-between relative z-10">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-violet-50 text-violet-600 shadow-inner group-hover:bg-violet-500 group-hover:text-white transition-colors duration-300">
                  <FileBadge className="size-6" />
                </div>
                <div className="flex size-8 items-center justify-center rounded-full bg-slate-50 text-muted-foreground group-hover:bg-violet-50 group-hover:text-violet-600 transition-colors">
                  <ChevronRight className="size-4" />
                </div>
              </div>
              <div className="mt-6 relative z-10">
                {loading ? (
                  <Loader2 className="size-6 animate-spin text-muted-foreground mb-2" />
                ) : (
                  <p className="font-serif text-4xl font-bold text-navy">
                    {stats.certificates}
                  </p>
                )}
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground mt-2 block">
                  Certificates Earned
                </span>
              </div>
            </Link>

            {/* Appointment Letters Card */}
            <Link
              href="/member/appointment-letter"
              className="group rounded-[2rem] border border-border/50 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] relative overflow-hidden"
            >
              <div className="absolute right-0 top-0 size-32 bg-amber-500/5 blur-[50px] rounded-bl-full pointer-events-none group-hover:bg-amber-500/10 transition-colors"></div>
              <div className="flex items-center justify-between relative z-10">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 shadow-inner group-hover:bg-amber-500 group-hover:text-white transition-colors duration-300">
                  <FileText className="size-6" />
                </div>
                <div className="flex size-8 items-center justify-center rounded-full bg-slate-50 text-muted-foreground group-hover:bg-amber-50 group-hover:text-amber-600 transition-colors">
                  <ChevronRight className="size-4" />
                </div>
              </div>
              <div className="mt-6 relative z-10">
                {loading ? (
                  <Loader2 className="size-6 animate-spin text-muted-foreground mb-2" />
                ) : (
                  <p className="font-serif text-4xl font-bold text-navy">
                    {stats.appointments}
                  </p>
                )}
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground mt-2 block">
                  Appointment Letters
                </span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
