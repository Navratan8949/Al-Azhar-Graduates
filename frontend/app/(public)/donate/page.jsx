"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Heart,
  Building2,
  Smartphone,
  Copy,
  Check,
  ArrowRight,
  ShieldCheck,
  BadgeCheck,
  Banknote,
  QrCode,
  ChevronRight,
  Users,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { getProjectById } from "@/service/project.service";
import { getCrowdfundingById } from "@/service/crowdfunding.service";
import { QRCodeSVG } from "qrcode.react";
import Script from "next/script";
import { FaqSection } from "@/components/sections/faq-section";

// Dynamic Bank Details are now fetched from Redux state

const QUICK_AMOUNTS = [500, 1000, 2100, 5000, 11000, 21000];

function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Copied!");
  };
  return (
    <button
      onClick={copy}
      className="ml-2 inline-flex items-center gap-1 rounded-md border border-border/60 bg-secondary px-2 py-0.5 text-xs font-semibold text-muted-foreground transition hover:bg-accent/10 hover:text-accent"
    >
      {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function ManualDonationFormInner() {
  const [loading, setLoading] = useState(false);
  const [linkedTitle, setLinkedTitle] = useState("");
  const [linkedType, setLinkedType] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();
  const projectId = searchParams.get("projectId");
  const campaignId = searchParams.get("campaignId");

  const [amount, setAmount] = useState("");
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    paymentMethod: "upi",
    transactionId: "",
    purpose: "",
  });
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (projectId) {
      getProjectById(projectId)
        .then((res) => {
          if (res?.success) {
            const title = res.project?.title || res.data?.title;
            if (title) {
              setLinkedTitle(title);
              setLinkedType("Project");
              setForm((f) => ({
                ...f,
                purpose: `Donation for project: ${title}`,
              }));
            }
          }
        })
        .catch((err) => console.error(err));
    } else if (campaignId) {
      getCrowdfundingById(campaignId)
        .then((res) => {
          if (res?.success) {
            const title = res.campaign?.title || res.data?.title;
            if (title) {
              setLinkedTitle(title);
              setLinkedType("Campaign");
              setForm((f) => ({
                ...f,
                purpose: `Donation for campaign: ${title}`,
              }));
            }
          }
        })
        .catch((err) => console.error(err));
    }
  }, [projectId, campaignId]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  async function handleRazorpayPayment() {
    setLoading(true);
    try {
      const apiBase =
        process.env.NEXT_PUBLIC_API_URL || "http://locahost:8000/api/v1";
      const res = await fetch(`${apiBase}/donations/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, amount, projectId, campaignId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Order creation failed");

      const { order, donationId } = data;

      if (typeof window.Razorpay === "undefined") {
        throw new Error(
          "Razorpay SDK failed to load. Please refresh the page.",
        );
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "World Association for Al-Azhar Graduates",
        description: form.purpose || "Donation",
        order_id: order.id,
        handler: async function (response) {
          try {
            const verifyRes = await fetch(
              `${apiBase}/donations/verify-payment`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  donationId,
                }),
              },
            );
            const verifyData = await verifyRes.json();
            if (!verifyRes.ok)
              throw new Error(
                verifyData.message || "Payment verification failed",
              );
            toast.success(
              "Payment successful! 80G Receipt sent to your email.",
            );
            router.push(`/donation-success?id=${donationId}`);
            setForm({
              fullName: "",
              email: "",
              phone: "",
              paymentMethod: "online",
              transactionId: "",
              purpose: "",
            });
            setAmount("");
          } catch (err) {
            toast.error(err.message || "Payment verification failed");
          }
        },
        prefill: {
          name: form.fullName,
          email: form.email,
          contact: form.phone,
        },
        theme: {
          color: "#16307a",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error(err.message || "Razorpay initiation failed");
    } finally {
      setLoading(false);
    }
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (form.paymentMethod === "online") {
      return handleRazorpayPayment();
    }
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries({ ...form, amount }).forEach(([k, v]) => fd.append(k, v));
      if (projectId) fd.append("projectId", projectId);
      if (campaignId) fd.append("campaignId", campaignId);
      if (file) fd.append("paymentProof", file);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"}/donations/manual`,
        {
          method: "POST",
          body: fd,
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success("Donation submitted! We'll verify within 24 hours.");
      router.push(`/donation-success?id=${data.donation._id}`);
      setForm({
        fullName: "",
        email: "",
        phone: "",
        paymentMethod: "upi",
        transactionId: "",
        purpose: "",
      });
      setAmount("");
      setFile(null);
    } catch (err) {
      toast.error(err.message || "Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />
      <form onSubmit={onSubmit} className="grid gap-5">
        {linkedTitle && (
          <div className="mb-2 flex items-start gap-3 rounded-2xl border border-lime/30 bg-lime/10 px-5 py-4 text-sm shadow-sm">
            <Info className="mt-0.5 size-5 shrink-0 text-lime" />
            <div>
              <p className="font-bold text-lime uppercase tracking-widest text-[11px] mb-1">
                Linked {linkedType}
              </p>
              <p className="font-semibold text-navy">
                You are donating specifically to: {linkedTitle}
              </p>
            </div>
          </div>
        )}

        {/* Quick amount selector */}
        <div className="rounded-3xl border border-border/50 bg-slate-50/50 p-6">
          <Label className="mb-4 block text-sm font-bold text-navy">
            Select Amount (₹) *
          </Label>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
            {QUICK_AMOUNTS.map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => setAmount(String(a))}
                className={`rounded-2xl py-3 text-sm font-bold transition-all duration-200 ${
                  amount === String(a)
                    ? "bg-navy text-white shadow-md scale-[1.02]"
                    : "bg-white border border-border/60 text-muted-foreground hover:border-lime hover:text-navy"
                }`}
              >
                ₹{a >= 1000 ? a / 1000 + "K" : a}
              </button>
            ))}
          </div>
          <div className="relative mt-5">
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-navy font-bold text-lg">
              ₹
            </span>
            <Input
              className="h-14 rounded-2xl pl-10 border border-border/60 bg-white font-bold text-lg text-navy placeholder:text-muted-foreground/60 shadow-sm focus-visible:border-lime focus-visible:ring-4 focus-visible:ring-lime/10 transition-all"
              type="number"
              placeholder="Enter custom amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              min={1}
            />
          </div>
        </div>

        {/* Personal info */}
        <div className="grid gap-5 sm:grid-cols-2 mt-2">
          <div className="grid gap-2.5">
            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
              Full Name *
            </Label>
            <Input
              className="h-14 rounded-2xl border border-border/60 bg-slate-50/50 px-5 font-semibold text-navy shadow-sm focus-visible:bg-white focus-visible:border-lime focus-visible:ring-4 focus-visible:ring-lime/10 transition-all"
              value={form.fullName}
              onChange={(e) => set("fullName", e.target.value)}
              placeholder="John Doe"
              required
            />
          </div>
          <div className="grid gap-2.5">
            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
              Email Address *
            </Label>
            <Input
              type="email"
              className="h-14 rounded-2xl border border-border/60 bg-slate-50/50 px-5 font-semibold text-navy shadow-sm focus-visible:bg-white focus-visible:border-lime focus-visible:ring-4 focus-visible:ring-lime/10 transition-all"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder="john@example.com"
              required
            />
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="grid gap-2.5">
            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
              Phone Number *
            </Label>
            <Input
              className="h-14 rounded-2xl border border-border/60 bg-slate-50/50 px-5 font-semibold text-navy shadow-sm focus-visible:bg-white focus-visible:border-lime focus-visible:ring-4 focus-visible:ring-lime/10 transition-all"
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              placeholder="+91 9876543210"
              required
            />
          </div>
          <div className="grid gap-2.5">
            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
              Payment Method *
            </Label>
            <div className="relative">
              <select
                className="h-14 w-full appearance-none rounded-2xl border border-border/60 bg-slate-50/50 px-5 font-semibold text-navy shadow-sm focus-visible:bg-white focus-visible:border-lime focus-visible:ring-4 focus-visible:ring-lime/10 transition-all outline-none"
                value={form.paymentMethod}
                onChange={(e) => set("paymentMethod", e.target.value)}
              >
                <option value="online">Instant Online (Card/UPI)</option>
                <option value="upi">Direct UPI (QR / VPA)</option>
                <option value="bank">Bank Transfer (NEFT)</option>
                <option value="cash">Cash Contribution</option>
              </select>
              <ChevronRight className="absolute right-5 top-1/2 -translate-y-1/2 size-5 rotate-90 text-navy pointer-events-none" />
            </div>
          </div>
        </div>

        {form.paymentMethod !== "online" && (
          <div className="rounded-3xl border border-amber-200 bg-amber-50/50 p-6 space-y-5 mt-2">
            <div className="grid gap-2.5">
              <Label className="text-xs font-bold uppercase tracking-widest text-amber-900 ml-1">
                Transaction ID / Reference (UTR) *
              </Label>
              <Input
                className="h-14 rounded-2xl border border-amber-200 bg-white px-5 font-semibold text-navy placeholder:text-amber-900/40 shadow-sm focus-visible:border-amber-400 focus-visible:ring-4 focus-visible:ring-amber-400/10 transition-all"
                placeholder="Enter 12-digit UPI Ref / UTR Number"
                value={form.transactionId}
                onChange={(e) => set("transactionId", e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2.5">
              <Label className="text-xs font-bold uppercase tracking-widest text-amber-900 ml-1">
                Payment Screenshot (Optional)
              </Label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files[0])}
                className="block w-full cursor-pointer rounded-2xl border border-dashed border-amber-300 bg-white/50 px-5 py-3 text-sm text-amber-900/60 font-medium file:mr-4 file:rounded-xl file:border-0 file:bg-amber-100 file:px-4 file:py-2 file:text-xs file:font-bold file:text-amber-800 transition hover:bg-white"
              />
            </div>
          </div>
        )}

        <div className="grid gap-2.5 mt-2">
          <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
            Donation Purpose (Optional)
          </Label>
          <Textarea
            className="min-h-[120px] rounded-2xl border border-border/60 bg-slate-50/50 p-5 font-medium text-navy placeholder:text-muted-foreground/60 shadow-sm focus-visible:bg-white focus-visible:border-lime focus-visible:ring-4 focus-visible:ring-lime/10 transition-all resize-none"
            placeholder="E.g. Education fund, General donation, or in memory of someone..."
            value={form.purpose}
            onChange={(e) => set("purpose", e.target.value)}
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="mt-4 h-16 w-full rounded-2xl bg-navy text-lg font-bold text-white shadow-xl shadow-navy/20 transition-all hover:-translate-y-1 hover:bg-navy/90 hover:shadow-2xl hover:shadow-navy/30"
        >
          {loading ? (
            "Processing Securely…"
          ) : form.paymentMethod === "online" ? (
            <span className="flex items-center justify-center gap-3">
              <ShieldCheck className="size-6" /> Pay Securely (₹{amount || "0"})
            </span>
          ) : (
            <span className="flex items-center justify-center gap-3">
              <Check className="size-6" /> Submit Donation Details
            </span>
          )}
        </Button>
        <p className="text-center text-xs font-medium text-muted-foreground">
          {form.paymentMethod === "online"
            ? "Instant 80G tax receipt will be sent directly to your email."
            : "Our team will verify your offline donation within 24 hours and email your receipt."}
        </p>
      </form>
    </>
  );
}

function ManualDonationForm() {
  return (
    <Suspense
      fallback={
        <div className="h-40 animate-pulse rounded-xl bg-secondary/50"></div>
      }
    >
      <ManualDonationFormInner />
    </Suspense>
  );
}

import { useDispatch, useSelector } from "react-redux";
import { fetchSiteContent } from "@/redux/features/siteContentSlice";

export default function DonatePage() {
  const [activeTab, setActiveTab] = useState("upi");
  const dispatch = useDispatch();
  const { data: siteContent } = useSelector((state) => state.siteContent);

  useEffect(() => {
    dispatch(fetchSiteContent());
  }, [dispatch]);

  // Parse donate details from Redux or fallback to default
  let BANK = {
    accountName: "World Association for Al-Azhar Graduates",
    accountNumber: "1234567890123456",
    ifsc: "SBIN0001234",
    bank: "State Bank of India",
    branch: "Rajkot Main Branch",
    upi: "realhumantrust@sbi",
    qrImage: "",
  };

  if (siteContent?.donate_details?.content) {
    try {
      const parsed = JSON.parse(siteContent.donate_details.content);
      BANK = { ...BANK, ...parsed, upi: parsed.upiId, ifsc: parsed.ifscCode };
    } catch (e) {}
  }

  let FUND_ALLOCATION = [
    { label: "Education Programs", pct: 45, color: "#d4af37" },
    { label: "Healthcare & Nutrition", pct: 30, color: "#023d28" },
    { label: "Community Empowerment", pct: 15, color: "#4a90d9" },
    { label: "Administration", pct: 10, color: "#94a3b8" },
  ];

  if (siteContent?.fund_allocation?.content) {
    try {
      FUND_ALLOCATION = JSON.parse(siteContent.fund_allocation.content);
    } catch (e) {}
  }

  return (
    <div className="bg-background min-h-screen">
      {/* Premium Hero Section */}
      <section className="relative pt-32 pb-56 overflow-hidden bg-navy">
        {/* Soft glowing ambient light */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-lime/15 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-navy/80 pointer-events-none"></div>

        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-lime/30 bg-lime/10 px-5 py-2 text-xs font-bold uppercase tracking-widest text-lime mb-8 backdrop-blur-md">
            <Heart className="size-4 animate-pulse" /> Support Our Mission
          </div>
          <h1 className="font-serif text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl leading-[1.1]">
            Empower with{" "}
            <span className="text-lime text-gradient">Generosity</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg font-medium text-white/70">
            Your contribution directly empowers education, welfare, and
            community programs. Every donation creates a lasting impact.
          </p>
        </div>
      </section>

      {/* Floating Content Section */}
      <div className="relative z-20 mx-auto max-w-7xl px-4 -mt-32 pb-24">
        <div className="grid gap-8 lg:grid-cols-12">
          {/* LEFT COLUMN: Payment Methods */}
          <div className="lg:col-span-5 space-y-8">
            <div className="rounded-[2.5rem] bg-white p-8 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-border/50">
              <h2 className="font-serif text-3xl font-bold text-navy mb-6">
                How to donate
              </h2>

              <div className="flex rounded-2xl border border-border/50 bg-slate-50 p-1.5 mb-8">
                {[
                  [
                    "upi",
                    <Smartphone key="upi" className="size-4" />,
                    "UPI / QR",
                  ],
                  [
                    "bank",
                    <Building2 key="bank" className="size-4" />,
                    "Bank Transfer",
                  ],
                ].map(([key, icon, label]) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-all ${
                      activeTab === key
                        ? "bg-navy text-white shadow-md"
                        : "text-muted-foreground hover:text-navy hover:bg-black/5"
                    }`}
                  >
                    {icon}
                    {label}
                  </button>
                ))}
              </div>

              {activeTab === "upi" && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="flex flex-col items-center gap-6">
                    <div className="flex size-48 shrink-0 flex-col items-center justify-center rounded-[2rem] border-2 border-dashed border-border bg-slate-50 p-5">
                      {BANK.qrImage ? (
                        <div className="relative w-full h-full">
                          <Image
                            src={BANK.qrImage}
                            alt="UPI QR Code"
                            fill
                            className="object-contain"
                          />
                        </div>
                      ) : (
                        <QRCodeSVG
                          value={`upi://pay?pa=${BANK.upi}&pn=${encodeURIComponent(BANK.accountName)}&cu=INR`}
                          size={130}
                          level="Q"
                        />
                      )}
                    </div>
                    <div className="w-full space-y-5 rounded-2xl bg-slate-50 p-5 border border-border/50">
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                          UPI ID
                        </p>
                        <p className="mt-1 flex items-center font-mono text-lg font-bold text-navy">
                          {BANK.upi}
                          <CopyBtn text={BANK.upi} />
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                          Account Name
                        </p>
                        <p className="mt-1 text-base font-semibold text-navy">
                          {BANK.accountName}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "bank" && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-4">
                  {[
                    ["Account Name", BANK.accountName],
                    ["Account Number", BANK.accountNumber],
                    ["IFSC Code", BANK.ifsc],
                    ["Bank Name", BANK.bank],
                    ["Branch", BANK.branch],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-xl bg-slate-50 p-4 border border-border/50"
                    >
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 sm:mb-0">
                        {label}
                      </span>
                      <span className="flex items-center font-bold text-navy text-sm">
                        {value}
                        <CopyBtn text={value} />
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-6 rounded-2xl bg-amber-50 px-5 py-4 text-xs font-semibold text-amber-900 border border-amber-100 flex gap-3 items-start">
                <Info className="size-5 shrink-0 mt-0.5 text-amber-600" />
                <p>
                  After offline payment, please fill out the form on the right
                  to receive your donation receipt.
                </p>
              </div>
            </div>

            {/* Transparency section */}
            {/* <div className="rounded-[2.5rem] bg-navy p-8 text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-lime/10 rounded-bl-full pointer-events-none"></div>
              <h3 className="font-serif text-2xl font-bold">Where your money goes</h3>
              <div className="mt-8 space-y-5 relative z-10">
                {FUND_ALLOCATION.map((item) => (
                  <div key={item.label} className="group">
                    <div className="mb-2 flex justify-between text-sm">
                      <span className="font-semibold text-white/90">{item.label}</span>
                      <span className="font-bold text-lime">{item.pct}%</span>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-white/10">
                      <div className="h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${item.pct}%`, background: item.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div> */}

            {/* 80G Tax section */}
            <div className="flex items-start gap-4 rounded-[2rem] border border-emerald-200 bg-emerald-50/80 p-6 shadow-sm">
              <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 shadow-inner">
                <ShieldCheck className="size-7" />
              </span>
              <div>
                <p className="font-bold text-emerald-900 text-lg">
                  80G Tax Exemption
                </p>
                <p className="mt-1 text-sm font-medium leading-relaxed text-emerald-800/80">
                  Donations are eligible for 80G tax deduction. You'll
                  automatically receive an official receipt by email for IT
                  filing.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: The Form */}
          <div className="lg:col-span-7">
            <div className="sticky top-24 overflow-hidden rounded-[2.5rem] border border-border/50 bg-white shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)]">
              <div className="bg-white px-8 pt-8 pb-4">
                <h2 className="font-serif text-3xl font-bold text-navy">
                  Secure Donation Form
                </h2>
                <p className="mt-2 text-muted-foreground font-medium">
                  Please enter your details below.
                </p>
              </div>
              <div className="px-8 pb-8">
                <ManualDonationForm />
              </div>
            </div>
          </div>
        </div>
      </div>

      <FaqSection />
    </div>
  );
}
