"use client";

import { PageHero } from "@/components/pages/page-hero";
import { ContentSections } from "@/components/pages/content-sections";
import { ImpactStats } from "@/components/sections/impact-stats";
import { FocusAreas } from "@/components/sections/focus-areas";
import { CtaBand } from "@/components/sections/cta-band";
import { useSelector } from "react-redux";
import { useLanguage } from "@/context/LanguageContext";

export default function Page() {
  const { t, isRTL, language } = useLanguage();
  const { data: siteContent } = useSelector((state) => state.siteContent);

  let image = "/al-azhar-cairo.jpg";
  let stats = isRTL
    ? ["شبكة عالمية", "العلم والوسطية", "خدمة الإنسانية"]
    : ["Global Network", "Islamic Scholarship", "Moderation & Peace"];

  const localizedAboutSections = [
    [
      t("about.al_azhar_title", "About Al-Azhar Al-Sharif"),
      t("about.al_azhar_text", "For over a millennium, Al-Azhar Al-Sharif has stood as a global beacon of knowledge, Islamic scholarship, and moderate thought."),
    ],
    [
      t("about.world_assoc_title", "About The World Association"),
      `${t("about.world_assoc_text", "Established in Cairo in 2006, the World Association for Al-Azhar Graduates fosters lifelong ties with alumni worldwide.")} ${t("about.world_assoc_patron", "")}`,
    ],
    [
      t("about.india_branch_title", "India Branch"),
      `${t("about.india_branch_p1", "The India Branch was officially inaugurated in Lucknow on November 14, 2010, and established its central office in New Delhi on November 14, 2011.")}\n\n${t("about.india_branch_p2", "The branch unites Al-Azhar graduates across India, promoting moderate Islamic thought and educational excellence.")}`,
    ],
    [
      t("about.distinctive_title", "Our Distinctive Character"),
      t("about.distinctive_text", "The organization is non-political and non-partisan. It does not represent any particular sectarian or political affiliation."),
    ],
  ];

  let sections = localizedAboutSections;

  if (siteContent?.about_main?.content && language === "en") {
    try {
      const parsed = JSON.parse(siteContent.about_main.content);
      if (parsed.image) image = parsed.image;
      if (Array.isArray(parsed.stats) && parsed.stats.length > 0)
        stats = parsed.stats;
      if (Array.isArray(parsed.sections) && parsed.sections.length > 0)
        sections = parsed.sections;
    } catch (e) {}
  }

  return (
    <>
      <PageHero
        eyebrow={t("about.title", "About Us")}
        title={t("org.name", "World Association for Al-Azhar Graduates – India")}
        description={t("home.intro", "Connecting Al-Azhar graduates across India and promoting the scholarly, intellectual and humanitarian values of Al-Azhar University.")}
        image="/al-azhar-cairo.jpg"
      />

      {/* About Content */}
      <ContentSections image={image} stats={stats} sections={sections} />

      <ImpactStats />
      <FocusAreas />
      <CtaBand />
    </>
  );
}
