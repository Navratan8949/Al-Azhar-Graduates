"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Award,
  Bell,
  CalendarDays,
  ClipboardList,
  Download,
  FileBadge,
  FileText,
  FolderKanban,
  ImageIcon,
  LayoutDashboard,
  LogOut,
  Mail,
  MessageSquare,
  Newspaper,
  Settings,
  ShieldCheck,
  UserCircle2,
  UserPlus,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSelector } from "react";
import { selectUser } from "@/redux/features/userSlice";
import { canAccessAdminPath } from "@/lib/admin-permissions";

export const ADMIN_NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },

  { href: "/admin/users", label: "Registered Users", icon: UserCircle2 },
  { href: "/admin/members", label: "Members", icon: Users },
  { href: "/admin/events", label: "Events", icon: CalendarDays },
  {
    href: "/admin/projects",
    label: "Programs & Activities",
    icon: FolderKanban,
  },
  { href: "/admin/donations", label: "Donations", icon: FolderKanban },
  { href: "/admin/crowdfunding", label: "Crowdfunding", icon: FolderKanban },
  { href: "/admin/gallery", label: "Gallery", icon: ImageIcon },
  { href: "/admin/news", label: "News", icon: Newspaper },
  { href: "/admin/complaints", label: "Complaints", icon: MessageSquare },
  { href: "/admin/contact", label: "Enquiries", icon: Mail },
  { href: "/admin/team", label: "Team", icon: UserCircle2 },
  { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquare },
  { href: "/admin/awards", label: "Awards", icon: Award },
  { href: "/admin/reports", label: "Reports", icon: ClipboardList },
  {
    href: "/admin/downloads",
    label: "Publications & Resources",
    icon: Download,
  },
  { href: "/admin/certificates", label: "Certificates", icon: FileBadge },
  { href: "/admin/appointments", label: "Appointments", icon: FileText },
  { href: "/admin/newsletter", label: "Newsletter", icon: Bell },
  { href: "/admin/site-content", label: "Site Content", icon: Settings },
  // { href: "/admin/backup", label: "Backup", icon: ShieldCheck },
];

export function getAllowedAdminNav(user) {
  return ADMIN_NAV.filter((item) => canAccessAdminPath(item.href, user));
}

import { useState, useEffect } from "react";
import api from "@/service/api";
import { useSelector as reduxUseSelector } from "react-redux";

export function AdminNavLinks({ user, onNavigate, className }) {
  const pathname = usePathname();
  const [badges, setBadges] = useState({});

  useEffect(() => {
    let isMounted = true;
    api
      .get("/dashboard/stats")
      .then((res) => {
        if (!isMounted) return;
        const alerts = res.data?.stats?.actionableAlerts || {};
        setBadges({
          "/admin/members": alerts.pendingMembers?.count || 0,
          "/admin/complaints": alerts.openComplaints?.count || 0,
        });
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  return getAllowedAdminNav(user).map((item) => {
    const active = item.exact
      ? pathname === item.href
      : pathname === item.href || pathname.startsWith(item.href + "/");
    const Icon = item.icon;
    const count = badges[item.href] || 0;

    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={onNavigate}
        className={cn(
          "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all group relative overflow-hidden",
          active
            ? "bg-white/10 text-white font-bold shadow-[inset_2px_0_0_0_#d4af37]"
            : "text-white/60 hover:bg-white/5 hover:text-white",
          className,
        )}
      >
        {active && (
          <div className="absolute inset-0 bg-gradient-to-r from-lime/10 to-transparent pointer-events-none" />
        )}
        <div
          className={cn(
            "relative z-10 flex size-7 items-center justify-center rounded-lg transition-colors shadow-sm",
            active
              ? "bg-gradient-to-br from-lime to-emerald-600 text-navy"
              : "bg-white/5 text-white/60 group-hover:bg-white/15 group-hover:text-white group-hover:shadow-md",
          )}
        >
          <Icon className="size-4 shrink-0" />
        </div>
        <span className="truncate flex-1 relative z-10">{item.label}</span>
        {count > 0 && (
          <span
            className={cn(
              "relative z-10 ml-auto flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-extrabold shadow-sm animate-pulse border border-white/20",
              item.href === "/admin/members"
                ? "bg-amber-400 text-amber-950"
                : item.href === "/admin/complaints"
                  ? "bg-rose-500 text-white"
                  : "bg-emerald-400 text-emerald-950",
            )}
          >
            {count}
          </span>
        )}
      </Link>
    );
  });
}

export function AdminSidebar() {
  const user = reduxUseSelector(selectUser);

  return (
    <aside className="sticky top-0 hidden h-screen w-[260px] shrink-0 flex-col bg-gradient-to-b from-navy via-navy to-[#022c1d] text-white shadow-[4px_0_24px_rgba(2,61,40,0.15)] lg:flex overflow-hidden relative border-r border-white/5">
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none z-0"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }}
      ></div>
      <div className="absolute -top-32 -left-32 w-64 h-64 bg-lime/20 blur-[100px] rounded-full pointer-events-none z-0"></div>

      <div className="border-b border-white/10 px-6 py-7 relative z-10">
        <Link href="/admin" className="flex flex-col gap-1.5 group">
          <div className="font-serif text-sm leading-tight font-extrabold text-white tracking-wider uppercase transition-transform group-hover:translate-x-1">
            World Association <br />
            <span className="text-lime text-[11px] drop-shadow-sm">
              For Al-Azhar Graduates
            </span>
          </div>
          <div className="text-[9px] uppercase tracking-[0.25em] text-white/50 font-bold">
            Administration
          </div>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 relative z-10 scroll-expand--scroller">
        <div className="mb-3 px-2 text-[10px] font-extrabold uppercase tracking-widest text-white/40">
          Main Menu
        </div>
        <nav className="space-y-1">
          <AdminNavLinks user={user} />
        </nav>
      </div>

      <div className="border-t border-white/10 p-5 relative z-10 bg-black/10 backdrop-blur-md">
        <Link
          href="/"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-xs font-bold text-white shadow-sm transition hover:bg-white/10 hover:-translate-y-0.5"
        >
          <LogOut className="size-4" />
          Log out / Website
        </Link>
      </div>
    </aside>
  );
}
