"use client";

import { PageHero } from "@/components/pages/page-hero";
import { ImpactStats } from "@/components/sections/impact-stats";
import { CtaBand } from "@/components/sections/cta-band";
import {
  BookOpen,
  HeartPulse,
  Sparkles,
  HandHeart,
  ShieldCheck,
  Users,
  ArrowRight,
  GraduationCap,
  Scale,
  Globe2,
  Library,
  Layers,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

const ICONS = [
  Globe2,
  Users,
  Library,
  Scale,
  BookOpen,
  GraduationCap,
  Sparkles,
  HeartPulse,
  HandHeart,
  ShieldCheck,
  Layers,
];

const COLORS = [
  { color: "text-blue-600", bg: "bg-blue-500/10" },
  { color: "text-emerald-600", bg: "bg-emerald-500/10" },
  { color: "text-amber-600", bg: "bg-amber-500/10" },
  { color: "text-indigo-600", bg: "bg-indigo-500/10" },
  { color: "text-teal-600", bg: "bg-teal-500/10" },
  { color: "text-purple-600", bg: "bg-purple-500/10" },
  { color: "text-rose-600", bg: "bg-rose-500/10" },
  { color: "text-sky-600", bg: "bg-sky-500/10" },
  { color: "text-orange-600", bg: "bg-orange-500/10" },
  { color: "text-cyan-600", bg: "bg-cyan-500/10" },
  { color: "text-violet-600", bg: "bg-violet-500/10" },
];

export default function Page() {
  const { t, isRTL, locale } = useLanguage();

  const objectiveItems = Array.isArray(locale?.objectives?.items)
    ? locale.objectives.items
    : [
        "Promote awareness of Al-Azhar's global scholarly and civilizational contribution.",
        "Connect Al-Azhar graduates across India within a strong national network.",
        "Foster academic cooperation, scientific research, and intellectual exchange.",
        "Promote the values of moderation, balance, dialogue, and mutual respect.",
        "Support the learning of the Arabic language and Islamic studies.",
        "Organize educational, intellectual, and training programs and workshops.",
        "Nurture and empower youth and develop their academic and intellectual capabilities.",
        "Promote peaceful coexistence and interfaith understanding.",
        "Present the compassionate teachings and human values of Islam to society.",
        "Support the scholarly, educational, and outreach activities of Al-Azhar graduates.",
        "Connect Al-Azhar graduates in India to international academic and research platforms.",
      ];

  return (
    <>
      <PageHero
        eyebrow={t("nav.about", "About Us")}
        title={t("objectives.title", "Our Objectives")}
        description={t("home.motto", "Moderation is our methodology, unity is our strength, knowledge is our identity, and service to humanity is our mission.")}
        image="/al-azhar-cairo.jpg"
      />

      {/* Intro Section */}
      <section className="overflow-hidden bg-white py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <div className="relative aspect-square max-w-md mx-auto lg:mx-0 lg:max-w-none w-full">
              <div className="absolute inset-0 rounded-3xl bg-navy/5 -rotate-6 scale-105 transition-transform duration-500 hover:rotate-0"></div>
              <div className="relative h-full w-full overflow-hidden rounded-3xl shadow-2xl border-4 border-white">
                <Image
                  src="/community-health-camp-india.png"
                  alt="Our Objectives"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="flex flex-col justify-center">
              <span className="mb-4 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-accent">
                <span className="h-[2px] w-8 bg-accent"></span> {t("objectives.title", "Our Objectives")}
              </span>
              <h2
                className="font-serif text-3xl font-bold tracking-tight text-navy sm:text-4xl md:text-5xl mb-6"
                style={{ fontFamily: isRTL ? "inherit" : "var(--font-cinzel), serif" }}
              >
                {t("home.vision", "Building a strong national network of Al-Azhar graduates in India contributing to knowledge, peace, understanding, and human development.")}
              </h2>
              <p className="text-lg leading-relaxed text-muted-foreground mb-6">
                {t("home.intro", "World Association for Al-Azhar Graduates – India is an academic and intellectual institution uniting Al-Azhar graduates across India, promoting Al-Azhar's message of moderation, scholarship, dialogue, and community service.")}
              </p>
              <p className="text-lg leading-relaxed text-muted-foreground mb-8">
                {t("home.mission", "To unite Al-Azhar graduates across India, foster academic and intellectual collaboration, spread moderate values, and serve society through knowledge and dialogue.")}
              </p>
              <div className="flex items-center gap-4">
                <Link
                  href="/about"
                  className="inline-flex items-center justify-center rounded-xl bg-navy px-6 py-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-navy/90 hover:shadow-xl"
                >
                  {t("about.title", "About Us")} <ArrowRight className="ml-2 size-4 rtl-flip" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Objectives Grid Section */}
      <section className="relative isolate overflow-hidden bg-slate-50 py-16 md:py-24">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-50"></div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-12 md:mb-20">
            <h2
              className="font-serif text-3xl font-bold tracking-tight text-navy sm:text-4xl"
              style={{ fontFamily: isRTL ? "inherit" : "var(--font-cinzel), serif" }}
            >
              {t("objectives.title", "Our Objectives")}
            </h2>
            <p className="mt-4 text-lg leading-8 text-muted-foreground">
              {t("home.tagline", "Knowledge | Moderation | Unity | Service to Humanity")}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {objectiveItems.map((text, index) => {
              const Icon = ICONS[index % ICONS.length];
              const style = COLORS[index % COLORS.length];
              return (
                <div
                  key={index}
                  className="group relative flex flex-col rounded-3xl bg-white p-8 shadow-sm ring-1 ring-border/50 transition-all hover:shadow-xl hover:-translate-y-1 hover:ring-navy/20"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div
                      className={`inline-flex size-14 shrink-0 items-center justify-center rounded-2xl ${style.bg} ${style.color} transition-transform duration-300 group-hover:scale-110`}
                    >
                      <Icon className="size-7" />
                    </div>
                    <span className="font-mono text-2xl font-bold text-navy/20 group-hover:text-accent transition-colors">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <p className="text-foreground/90 font-medium leading-relaxed text-base sm:text-lg">
                    {text}
                  </p>

                  <div className="absolute -inset-px -z-10 rounded-3xl bg-gradient-to-br from-navy/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 blur-xl"></div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <ImpactStats />
      <CtaBand />
    </>
  );
}
