"use client";

import { PageHero } from "@/components/pages/page-hero";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { Eye, Compass, BookOpen, Scale, Heart, Sparkles, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function Page() {
  const { t, locale, isRTL } = useLanguage();

  const identityIcons = [BookOpen, Scale, Heart];

  // Raw locale data for lists
  let identityItems = [];
  try {
    const raw = t("vision_mission.identity_items");
    if (Array.isArray(raw)) identityItems = raw;
  } catch (e) {}

  let philosophySteps = [];
  try {
    const rawSteps = t("vision_mission.philosophy_steps");
    if (Array.isArray(rawSteps)) philosophySteps = rawSteps;
  } catch (e) {}

  return (
    <>
      <PageHero
        eyebrow={t("vision_mission.page_title", "Vision & Mission")}
        title={t("vision_mission.subtitle", "Knowledge | Moderation | Unity | Service to Humanity")}
        description={t("home.motto", "Moderation is our methodology, unity is our strength, knowledge is our identity, and service to humanity is our mission.")}
        image="/rural-classroom-children-learning-india.png"
      />

      {/* Mission & Vision Side-by-Side Cards */}
      <section className="py-20 bg-background relative overflow-hidden">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Vision Card */}
            <Reveal>
              <div className="h-full rounded-3xl border border-border/60 bg-gradient-to-br from-white to-slate-50 p-8 sm:p-12 shadow-soft hover:shadow-lift transition-all flex flex-col">
                <div className="mb-6 flex size-16 items-center justify-center rounded-2xl bg-navy text-lime shadow-md">
                  <Eye className="size-8" />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 mb-2">
                  {t("vision_mission.vision_badge", "OUR VISION")}
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-navy mb-4">
                  {t("vision_mission.vision_title", "Building a Cohesive National Network")}
                </h2>
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed flex-1">
                  {t("vision_mission.vision_desc", "To build a cohesive national network of Al-Azhar graduates across India that contributes to disseminating knowledge, promoting peace, mutual understanding, and human development.")}
                </p>
              </div>
            </Reveal>

            {/* Mission Card */}
            <Reveal delay={0.1}>
              <div className="h-full rounded-3xl border border-border/60 bg-gradient-to-br from-white to-slate-50 p-8 sm:p-12 shadow-soft hover:shadow-lift transition-all flex flex-col">
                <div className="mb-6 flex size-16 items-center justify-center rounded-2xl bg-navy text-lime shadow-md">
                  <Compass className="size-8" />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 mb-2">
                  {t("vision_mission.mission_badge", "OUR MISSION")}
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-navy mb-4">
                  {t("vision_mission.mission_title", "Dedicated to Knowledge, Moderation & Service")}
                </h2>
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed flex-1">
                  {t("vision_mission.mission_desc", "To unite Al-Azhar graduates across India, foster academic and intellectual collaboration, spread moderate values across all sections of Indian society, support educational and research initiatives, and serve society through knowledge, dialogue, and constructive work.")}
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Identity Pillars */}
      {identityItems.length > 0 && (
        <section className="bg-secondary/30 py-20 border-y border-border/40">
          <div className="mx-auto max-w-7xl px-4">
            <SectionHeading
              eyebrow={t("vision_mission.identity_badge", "OUR IDENTITY")}
              title={t("vision_mission.identity_title", "Grounded in the Noble Al-Azhar Heritage")}
              description={t("vision_mission.identity_desc", "For more than a thousand years, Al-Azhar Al-Sharif has been the world preeminent beacon of balanced Islamic learning, scholarly moderation, and service to humanity.")}
            />
            <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {identityItems.map((item, idx) => {
                const IconComponent = identityIcons[idx % identityIcons.length] || Sparkles;
                return (
                  <Reveal key={idx} delay={idx * 0.1}>
                    <div className="flex h-full flex-col rounded-3xl border border-border/60 bg-card p-8 shadow-soft transition-all hover:-translate-y-1.5 hover:border-accent/40 hover:shadow-lift">
                      <div className="mb-6 flex size-14 items-center justify-center rounded-2xl bg-navy text-lime shadow-md">
                        <IconComponent className="size-7" />
                      </div>
                      <h3 className="mb-3 font-serif text-xl font-bold text-navy">{item.title}</h3>
                      <p className="text-sm sm:text-base leading-relaxed text-muted-foreground flex-1">
                        {item.desc}
                      </p>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Philosophy Steps */}
      {philosophySteps.length > 0 && (
        <section className="py-20 bg-background">
          <div className="mx-auto max-w-7xl px-4">
            <SectionHeading
              eyebrow={t("vision_mission.philosophy_badge", "CORE PHILOSOPHY")}
              title={t("vision_mission.philosophy_title", "Education with Purpose")}
              description={t("vision_mission.philosophy_desc", "Excellence with values. We believe education must empower minds, build righteous character, and inspire people to serve humanity:")}
            />
            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
              {philosophySteps.map((step, idx) => (
                <Reveal key={idx} delay={idx * 0.1}>
                  <div className="h-full rounded-2xl border border-border/60 bg-white p-6 shadow-sm hover:shadow-md transition-all flex flex-col text-center relative overflow-hidden group">
                    <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-navy/10 text-navy font-bold text-lg mb-4 group-hover:bg-navy group-hover:text-lime transition-colors">
                      {step.num || idx + 1}
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1">
                      {step.title}
                    </span>
                    <h4 className="font-serif text-lg font-bold text-navy mb-2">
                      {step.subtitle}
                    </h4>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed flex-1">
                      {step.desc}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
