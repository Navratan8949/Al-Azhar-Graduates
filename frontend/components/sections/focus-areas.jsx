"use client";

import Image from "next/image";
import * as LucideIcons from "lucide-react";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { useSelector } from "react-redux";
import { useLanguage } from "@/context/LanguageContext";

export function FocusAreas() {
  const { t, isRTL, language } = useLanguage();
  const { data: siteContent } = useSelector((state) => state.siteContent);

  const localizedAreas = [
    {
      icon: "GraduationCap",
      title: t("activities.academic_title", "Academic & Educational Programs"),
      desc: t("activities.academic_text", "Comprehensive academic and educational programs designed to promote lifelong learning, research, and scholarly development."),
      image: "/rural-classroom-children-learning-india.png",
    },
    {
      icon: "BookOpen",
      title: t("activities.arabic_title", "Arabic Language Programs"),
      desc: t("activities.arabic_text", "Conducting specialized workshops, intensive diploma courses, and certificate programs in Arabic language and linguistics."),
      image: "/al-azhar-cairo.jpg",
    },
    {
      icon: "BookMarked",
      title: t("activities.hadith_title", "Hadith & Tafsir Programs"),
      desc: t("activities.hadith_text", "Scholarly lectures and study circles focused on Quranic interpretation, prophetic traditions, and jurisprudence."),
      image: "/community-health-camp-india.png",
    },
    {
      icon: "Video",
      title: t("activities.lectures_title", "Lectures from Al-Azhar Scholars"),
      desc: t("activities.lectures_text", "Online lectures and webinars led by eminent professors and scholars from Al-Azhar University, Cairo."),
      image: "/women-skill-training-workshop-india.png",
    },
    {
      icon: "Users2",
      title: t("activities.outreach_title", "Intellectual & Outreach Programs"),
      desc: t("activities.empowerment_text", "Empowering Indian scholars through international academic exposure, seminars, conferences, and youth engagement."),
      image: "/community-kitchen-serving-food-india.png",
    },
    {
      icon: "Heart",
      title: t("activities.humanitarian_title", "Humanitarian & Community Relief"),
      desc: t("activities.humanitarian_text", "Promoting social solidarity through healthcare drives, support for underserved families, educational scholarships, and community relief."),
      image: "/tree-plantation-volunteers-india.png",
    },
  ];

  let areas = localizedAreas;
  if (siteContent?.focus_areas?.content && language === "en") {
    try {
      const parsed = JSON.parse(siteContent.focus_areas.content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        areas = parsed;
      }
    } catch (e) {}
  }

  return (
    <section className="relative bg-slate-50 py-24 md:py-32 overflow-hidden">
      {/* Subtle Background Pattern */}
      <div
        className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cg fill='%23023d28' fill-opacity='0.04'%3E%3Cpath fill-rule='evenodd' d='M0 0h40v40H0V0zm40 40h40v40H40V40zm20-20h20v20H60V20zM0 60h20v20H0V60zm20-20h20v20H20V40zM20 0h20v20H20V0zM0 20h20v20H0V20zm60 40h20v20H60V60z'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: "80px 80px",
        }}
      />

      {/* Decorative Glowing Orbs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] translate-x-1/4 translate-y-1/4 pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-[1440px] px-6 lg:px-12">
        <Reveal>
          <SectionHeading
            eyebrow={t("nav.our_work", "What We Do")}
            title={t("activities.title", "Our Areas of Impact")}
            description={t("activities.academic_text", "Six focused programs working together to uplift communities and create lasting, measurable change.")}
          />
        </Reveal>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {areas.map((a, i) => {
            const Icon = LucideIcons[a.icon] || LucideIcons.Heart;

            return (
              <Reveal key={i} delay={(i % 3) * 0.1}>
                <div className="group relative flex flex-col h-full bg-primary text-white rounded-[2rem] overflow-hidden shadow-lg hover:shadow-2xl shadow-navy/5 hover:shadow-primary/20 hover:-translate-y-2 transition-all duration-500 border border-primary/20 hover:border-accent/50">
                  {/* Image Container */}
                  <div className="relative h-56 w-full overflow-hidden bg-navy">
                    <Image
                      src={a.image}
                      alt={a.title}
                      fill
                      className="object-cover transition-all duration-700 ease-in-out group-hover:scale-110 group-hover:opacity-80"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    {/* Gradient Overlay to blend image with card body smoothly */}
                    <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/20 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-100" />
                  </div>

                  {/* Content Container */}
                  <div className="relative flex-1 p-6 pt-5 flex flex-col bg-primary">
                    {/* Floating Icon */}
                    <div className="absolute -top-10 left-6 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-[#b8952a] text-primary shadow-[0_10px_25px_-5px_rgba(212,175,55,0.4)] transition-all duration-500 group-hover:-translate-y-2 group-hover:scale-110">
                      <Icon className="h-6 w-6" />
                    </div>

                    <h3
                      className="mt-3 mb-2 text-2xl font-bold text-white transition-colors duration-300 group-hover:text-accent tracking-wide"
                      style={{ fontFamily: isRTL ? "inherit" : "var(--font-cinzel), serif" }}
                    >
                      {a.title}
                    </h3>
                    <p className="text-white/70 leading-relaxed flex-1 font-medium text-[15px]">
                      {a.desc}
                    </p>

                    {/* Learn More link */}
                    <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-sm font-bold uppercase tracking-widest text-accent overflow-hidden transition-colors group-hover:text-white">
                      <span>{t("common.read_more", "Explore Program")}</span>
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 transition-colors group-hover:bg-accent group-hover:text-primary">
                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 rtl-flip" />
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
