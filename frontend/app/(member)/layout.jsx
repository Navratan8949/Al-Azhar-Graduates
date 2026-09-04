"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  CalendarDays,
  FileBadge,
  FileText,
  IdCard,
  IndianRupee,
  LogOut,
  MessageSquare,
  UserCircle2,
  Loader2,
  LayoutDashboard,
  Menu,
  Bell,
  Search,
  ShieldCheck,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectUser,
  selectIsAuthenticated,
  selectAuthStatus,
  clearUser,
  fetchUser,
} from "@/redux/features/userSlice";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import api from "@/service/api";

const NAV = [
  { href: "/member", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/member/profile", label: "My Profile", icon: UserCircle2 },
  { href: "/member/id-card", label: "QR ID Card", icon: IdCard },
  { href: "/member/donations", label: "Donations", icon: IndianRupee },
  { href: "/member/certificates", label: "Certificates", icon: FileBadge },
  { href: "/member/appointment-letter", label: "Appointment", icon: FileText },
  { href: "/member/event-registration", label: "Events", icon: CalendarDays },
  { href: "/member/complaint", label: "Complaints", icon: MessageSquare },
];

export default function MemberLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();

  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const status = useSelector(selectAuthStatus);
  const [isChecking, setIsChecking] = useState(true);
  const [memberInfo, setMemberInfo] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      router.replace("/login");
      return;
    }
    if (token && !isAuthenticated && status !== "loading") {
      dispatch(fetchUser());
    }
  }, [dispatch, isAuthenticated, status, router]);

  useEffect(() => {
    if (isAuthenticated) {
      api
        .get("/members/me")
        .then((res) => setMemberInfo(res.data?.member))
        .catch(() => {});
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (status === "succeeded" || status === "failed") {
      setIsChecking(false);
    }
    if (status === "failed") {
      router.replace("/login");
    }
  }, [status, router]);

  if (isChecking || status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="size-10 animate-spin text-lime" />
          <p className="font-semibold text-navy animate-pulse">
            Loading Member Panel...
          </p>
        </div>
      </div>
    );
  }

  const navContent = (
    <div className="flex h-full flex-col bg-navy">
      <div className="flex items-center gap-3 px-6 py-8">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-lime text-navy shadow-inner">
          <ShieldCheck className="size-6" />
        </div>
        <div>
          <h2 className="font-serif text-lg font-bold text-white leading-tight">
            Member Portal
          </h2>
          <p className="text-[10px] font-bold uppercase tracking-widest text-lime/80 max-w-[200px] truncate">
            World Association for Al-Azhar Graduates
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto custom-scrollbar py-2">
        {NAV.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          const Icon = item.icon;

          let badge = null;
          if (item.href === "/member/id-card" && memberInfo) {
            if (memberInfo.membershipStatus === "approved") {
              badge = (
                <span className="ml-auto rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
                  Active
                </span>
              );
            } else if (memberInfo.membershipStatus === "pending") {
              badge = (
                <span className="ml-auto rounded-full bg-amber-500/20 px-2.5 py-0.5 text-[10px] font-bold text-amber-300 border border-amber-500/30">
                  Pending
                </span>
              );
            }
          } else if (
            item.href === "/member/certificates" &&
            memberInfo?.certificate?.length > 0
          ) {
            badge = (
              <span className="ml-auto flex h-5 min-w-[20px] items-center justify-center rounded-full bg-emerald-400 text-[10px] font-extrabold text-navy px-1.5">
                {memberInfo.certificate.length}
              </span>
            );
          } else if (
            item.href === "/member/appointment-letter" &&
            memberInfo?.appointmentLetter
          ) {
            badge = (
              <span className="ml-auto rounded-full bg-blue-500/20 px-2.5 py-0.5 text-[10px] font-bold text-blue-300 border border-blue-500/30">
                Ready
              </span>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={cn(
                "group flex items-center gap-3.5 px-6 py-3.5 text-sm font-medium transition-all duration-200 border-l-4 rounded-r-2xl mr-4",
                active
                  ? "bg-lime text-navy border-lime shadow-md"
                  : "border-transparent text-white/70 hover:bg-white/5 hover:text-white hover:border-white/20",
              )}
            >
              <Icon
                className={cn(
                  "size-5",
                  active
                    ? "text-navy"
                    : "text-white/50 group-hover:text-white/80 transition-colors",
                )}
              />
              <span className="truncate flex-1 font-semibold">
                {item.label}
              </span>
              {badge}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto">
        <div className="rounded-2xl bg-white/5 p-2 space-y-1">
          <Link
            href="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-white/70 hover:bg-white/10 hover:text-white transition-colors"
          >
            <LayoutDashboard className="size-4 text-white/50" /> Website Home
          </Link>
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              dispatch(clearUser());
              router.push("/login");
            }}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-rose-300/80 hover:bg-rose-500/10 hover:text-rose-300 transition-colors"
          >
            <LogOut className="size-4" /> Log out
          </button>
        </div>
      </div>
    </div>
  );

  const activePage =
    NAV.find((item) =>
      item.exact ? pathname === item.href : pathname.startsWith(item.href),
    )?.label || "Dashboard";

  return (
    <div className="flex min-h-dvh bg-[#f8fafc]">
      {/* Desktop Sidebar */}
      <aside className="sticky top-0 hidden h-screen shrink-0 md:flex border-r border-border/40">
        {navContent}
      </aside>

      {/* Main Content Area */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Desktop Header */}
        <header className="sticky top-0 z-20 hidden md:flex h-20 items-center justify-between border-b border-border/50 bg-white/80 px-8 backdrop-blur-xl">
          <div>
            <h1 className="font-serif text-2xl font-bold text-navy">
              {activePage}
            </h1>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mt-0.5">
              Welcome back, {user?.fullName || "Member"}
            </p>
          </div>

          <div className="flex items-center gap-5">
            {/* <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Quick search..."
                className="h-10 w-64 rounded-full border border-border/60 bg-slate-50 pl-10 pr-4 text-sm font-medium outline-none transition-all focus:border-navy focus:ring-1 focus:ring-navy placeholder:text-muted-foreground"
              />
            </div> */}

            {/* <button className="relative flex size-10 items-center justify-center rounded-full border border-border/60 bg-white text-navy hover:bg-slate-50 transition-colors">
              <Bell className="size-4.5" />
              <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-rose-500 border-2 border-white"></span>
            </button> */}

            <div className="h-8 w-px bg-border/60"></div>

            <Link
              href="/member/profile"
              className="flex items-center gap-3 group"
            >
              <div className="text-right hidden lg:block">
                <p className="text-sm font-bold text-navy group-hover:text-lime transition-colors">
                  {user?.fullName || "Member"}
                </p>
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  My Account
                </p>
              </div>
              <div className="flex size-11 items-center justify-center rounded-full bg-navy text-sm font-bold text-white shadow-sm ring-2 ring-transparent group-hover:ring-lime/30 transition-all">
                {user?.fullName?.[0]?.toUpperCase() || "M"}
              </div>
            </Link>
          </div>
        </header>

        {/* Mobile Header Bar */}
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border/60 bg-white/90 px-4 backdrop-blur-md md:hidden">
          <div className="flex items-center gap-3">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger className="inline-flex size-10 items-center justify-center rounded-xl border border-border/60 bg-slate-50 text-navy hover:bg-slate-100 transition-colors">
                <Menu className="size-5" />
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] p-0 border-none">
                <SheetTitle className="sr-only">Member menu</SheetTitle>
                {navContent}
              </SheetContent>
            </Sheet>
            <span className="font-serif text-lg font-bold text-navy">
              {activePage}
            </span>
          </div>

          <Link
            href="/member/profile"
            className="flex size-9 items-center justify-center rounded-full bg-navy text-xs font-bold text-white shadow-sm"
          >
            {user?.fullName?.[0]?.toUpperCase() || "M"}
          </Link>
        </header>

        <main className="min-w-0 flex-1 p-4 md:p-8 lg:p-10">{children}</main>
      </div>
    </div>
  );
}
