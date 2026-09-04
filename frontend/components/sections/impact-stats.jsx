"use client";

import * as LucideIcons from "lucide-react";
import { Counter } from "@/components/shared/counter";
import { Reveal } from "@/components/shared/reveal";
import { useSelector } from "react-redux";

const DEFAULT_STATS = [
  { label: "Arabic Language Courses", value: "25+", icon: "GraduationCap" },
  { label: "Academic Gatherings", value: "100+", icon: "Users" },
  { label: "Welfare Programs", value: "10+", icon: "HandHeart" },
];

export function ImpactStats() {
  const { data: siteContent } = useSelector((state) => state.siteContent);

  let stats = DEFAULT_STATS;
  if (siteContent?.impact_stats?.content) {
    try {
      const parsed = JSON.parse(siteContent.impact_stats.content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        stats = parsed;
      }
    } catch (e) {}
  }

  // Parse string value (e.g. "25,000+") into number (25000) and suffix ("+")
  const parseStat = (valStr) => {
    if (typeof valStr !== "string") valStr = String(valStr);
    const clean = valStr.replace(/,/g, "");
    const match = clean.match(/^(\d+)(.*)$/);
    if (match) {
      return { num: parseInt(match[1], 10), suffix: match[2] };
    }
    return { num: null, suffix: valStr }; // Fallback if not a number (e.g. "80G & 12A")
  };

  return (
    <section className="relative bg-background py-16 md:py-20 z-10">
      <div className="mx-auto max-w-7xl px-4">
        <div
          className={`grid grid-cols-2 gap-3 overflow-hidden rounded-2xl border border-border/60 bg-card p-2 shadow-lift ${stats.length >= 4 ? "lg:grid-cols-4" : `lg:grid-cols-${stats.length}`} lg:gap-0 lg:divide-x lg:divide-border/60 lg:p-0`}
        >
          {stats.map((stat, i) => {
            const Icon = LucideIcons[stat.icon] || LucideIcons.Heart;
            const parsed = parseStat(stat.value);

            return (
              <Reveal key={i} delay={i * 0.08}>
                <div className="flex h-full flex-col items-center gap-2 rounded-xl bg-card px-4 py-8 text-center lg:rounded-none">
                  <span className="flex size-12 items-center justify-center rounded-2xl bg-navy/8 text-navy">
                    <Icon className="size-6" />
                  </span>

                  {parsed.num !== null ? (
                    <Counter
                      to={parsed.num}
                      suffix={parsed.suffix}
                      className="mt-1 font-serif text-3xl font-bold text-foreground md:text-4xl"
                    />
                  ) : (
                    <span className="mt-1 font-serif text-3xl font-bold text-foreground md:text-4xl">
                      {stat.value}
                    </span>
                  )}

                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
