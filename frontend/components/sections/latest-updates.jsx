"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  HeartHandshake,
  Newspaper,
  ChevronRight,
  Clock,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getNews } from "@/service/news.service";
import { getEvents } from "@/service/event.service";
import { useLanguage } from "@/context/LanguageContext";
import { getLocalizedField } from "@/lib/localized-field";

export function LatestUpdates() {
  const { t, isRTL, language } = useLanguage();
  const [news, setNews] = useState([]);
  const [events, setEvents] = useState([]);

  const serviceLinks = [
    {
      title: t("publications.fatwas_title", "Fatwas & Guidance"),
      href: "/publications?type=fatwa",
      icon: BookOpen,
      desc: t(
        "publications.fatwas_desc",
        "Islamic rulings and statements by Al-Azhar scholars."
      ),
      color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    },
    {
      title: t("publications.books_title", "Books & Articles"),
      href: "/publications?type=book",
      icon: Newspaper,
      desc: t(
        "publications.books_desc",
        "Digital library of academic papers and publications."
      ),
      color: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    },
    {
      title: t("membership.title", "Membership Registration"),
      href: "/membership",
      icon: HeartHandshake,
      desc: t(
        "membership.service_desc",
        "Join our global network of Al-Azhar graduates."
      ),
      color: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    },
  ];

  useEffect(() => {
    // Fetch News
    getNews()
      .then((data) => {
        if (data.success && data.news?.length > 0) {
          const published = data.news.filter((n) => n.status === "published");
          setNews(
            published.length > 0 ? published.slice(0, 3) : data.news.slice(0, 3)
          );
        }
      })
      .catch(console.error);

    // Fetch Events (Upcoming)
    getEvents()
      .then((data) => {
        if (data.success && data.events) {
          setEvents(
            data.events.filter((e) => e.status === "upcoming").slice(0, 1)
          );
        }
      })
      .catch(console.error);
  }, []);

  return (
    <section className="w-full overflow-hidden border-y border-border/60 bg-gradient-to-b from-card via-background to-card py-10 md:py-16">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid w-full min-w-0 grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
          {/* Left Column: Latest News & Updates (Col 7) */}
          <div className="flex w-full min-w-0 flex-col justify-between lg:col-span-7">
            <div className="w-full min-w-0">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <div className="flex min-w-0 items-center gap-2">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent/15 text-accent font-bold">
                    <Newspaper className="size-4" />
                  </span>
                  <h2
                    className="truncate font-serif text-2xl font-bold text-navy"
                    style={{
                      fontFamily: isRTL ? "inherit" : "var(--font-cinzel), serif",
                    }}
                  >
                    {t("news.title", "Latest Updates")}
                  </h2>
                </div>

                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="shrink-0 font-bold text-navy hover:bg-navy/5 hover:text-accent"
                >
                  <Link
                    href="/news"
                    className="inline-flex items-center gap-1 text-xs"
                  >
                    {t("news.all_articles", "View All Updates")}{" "}
                    <ArrowRight className="size-3.5 rtl-flip" />
                  </Link>
                </Button>
              </div>

              <div className="w-full min-w-0 space-y-3.5">
                {news.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-border/80 bg-card/50 p-8 text-center shadow-sm">
                    <p className="text-sm font-medium text-muted-foreground">
                      {t("news.no_articles", "No recent updates published yet.")}
                    </p>
                  </div>
                ) : (
                  news.map((item) => {
                    const itemTitle = getLocalizedField(item, "title", language);
                    const itemDesc = getLocalizedField(
                      item,
                      "description",
                      language
                    );
                    return (
                      <Link
                        key={item._id}
                        href={`/news/${item._id}`}
                        className="group relative block w-full min-w-0 overflow-hidden rounded-[1.75rem] border border-primary/20 bg-primary p-5 sm:p-7 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-xl"
                      >
                        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                          <span className="inline-flex items-center gap-1.5 rounded-md bg-accent/10 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-accent">
                            {t("category." + (item.category?.toLowerCase() || "news"), item.category?.replace("_", " ") || "NEWS")}
                          </span>
                          <span className="flex shrink-0 items-center gap-1 text-[11px] font-medium text-white/70">
                            <Clock className="size-3" />
                            {new Date(
                              item.createdAt || Date.now()
                            ).toLocaleDateString(
                              language === "ar"
                                ? "ar-EG"
                                : language === "ur"
                                ? "ur-PK"
                                : "en-IN",
                              { month: "short", day: "numeric" }
                            )}
                          </span>
                        </div>

                        <h3
                          className="line-clamp-1 font-serif text-base font-bold text-white transition-colors group-hover:text-accent sm:text-lg"
                          style={{
                            fontFamily: isRTL
                              ? "inherit"
                              : "var(--font-cinzel), serif",
                          }}
                        >
                          {itemTitle}
                        </h3>

                        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-white/80 font-medium sm:text-sm">
                          {itemDesc}
                        </p>

                        <div className="mt-4 flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-accent transition-all group-hover:translate-x-1 group-hover:text-white sm:text-sm">
                          {t("common.read_more", "Read Story")}{" "}
                          <ChevronRight className="size-3.5 rtl-flip" />
                        </div>
                      </Link>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Quick Services & Next Event (Col 5) */}
          <div className="flex w-full min-w-0 flex-col justify-between lg:col-span-5">
            <div className="w-full min-w-0">
              <div className="mb-6 flex min-w-0 items-center gap-2">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-navy/10 text-navy font-bold">
                  <Sparkles className="size-4 text-accent" />
                </span>
                <h2
                  className="truncate font-serif text-2xl font-bold text-navy"
                  style={{
                    fontFamily: isRTL ? "inherit" : "var(--font-cinzel), serif",
                  }}
                >
                  {t("publications.title", "Al-Azhar Resources")}
                </h2>
              </div>

              {/* Stacked Service Cards */}
              <div className="flex w-full min-w-0 flex-col gap-3.5">
                {serviceLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group flex w-full min-w-0 items-center gap-3.5 overflow-hidden rounded-[1.5rem] border border-primary/20 bg-primary p-4 text-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-xl sm:gap-4 sm:p-5"
                  >
                    <div
                      className={`flex size-11 shrink-0 items-center justify-center rounded-xl border ${item.color} bg-white/5 transition-transform group-hover:scale-105 sm:size-13`}
                    >
                      <item.icon className="size-5 sm:size-6" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-sm font-semibold text-white transition-colors group-hover:text-accent sm:text-base">
                        {item.title}
                      </h3>
                      <p className="mt-1 line-clamp-2 text-xs font-medium leading-relaxed text-white/70 sm:text-sm">
                        {item.desc}
                      </p>
                    </div>

                    <ChevronRight className="size-5 shrink-0 text-white/50 transition-all group-hover:translate-x-1 group-hover:text-accent rtl-flip" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Featured Event preview if any */}
            {events.length > 0 && (
              <div className="relative mt-6 w-full min-w-0 overflow-hidden rounded-2xl bg-navy p-5 text-white shadow-md">
                <div className="pointer-events-none absolute -right-6 -top-6 size-24 rounded-full bg-accent/20 blur-xl" />
                <div className="relative z-10 min-w-0">
                  <span className="inline-flex items-center gap-1 rounded-full bg-accent/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent backdrop-blur-sm">
                    ★ {t("conferences.featured_event", "Featured Event")}
                  </span>
                  <h3 className="mt-2 line-clamp-1 font-serif text-sm font-bold text-white sm:text-base">
                    {getLocalizedField(events[0], "title", language)}
                  </h3>
                  <p className="mt-1 line-clamp-1 text-xs text-white/75">
                    {getLocalizedField(events[0], "location", language)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
