"use client";

import { PageHero } from "@/components/pages/page-hero";
import { ContentSections } from "@/components/pages/content-sections";
import { ImpactStats } from "@/components/sections/impact-stats";
import { FocusAreas } from "@/components/sections/focus-areas";
import { CtaBand } from "@/components/sections/cta-band";
import { useSelector } from "react-redux";

const fallbackAboutSections = [
  [
    "World Association for Al-Azhar Graduates",
    "The World Association for Al-Azhar Graduates was established to strengthen the relationship between Al-Azhar and its graduates around the world and to provide a global platform for cooperation and engagement. The idea emerged during the First International Conference of Al-Azhar Graduates held in Cairo in 2006. Today, it operates under the patronage of His Eminence the Grand Imam, Professor Dr. Ahmed Al-Tayeb, Sheikh of Al-Azhar, with branches and networks in different countries.",
  ],
  [
    "India Branch",
    "The India Branch was formally inaugurated in Lucknow on 14 November 2010. In order to expand its national activities and strengthen coordination with Al-Azhar graduates across India, its central office was moved to New Delhi on 14 November 2011. The branch works to connect Al-Azhar graduates throughout India and promote Al-Azhar's message of knowledge, moderation, dialogue and service.",
  ],
  [
    "Our Distinctive Character",
    "The organization is non-political and non-partisan. It does not represent any particular sectarian or political affiliation. We welcome Al-Azhar graduates from diverse backgrounds and seek to build a culture of fraternity, cooperation, academic exchange and mutual respect.",
  ],
];

export default function Page() {
  const { data: siteContent } = useSelector((state) => state.siteContent);

  let image = "/al-azhar-cairo.jpg";
  let stats = ["Global Network", "Islamic Scholarship", "Moderation & Peace"];
  let sections = fallbackAboutSections;

  if (siteContent?.about_main?.content) {
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
        eyebrow="About Us"
        title="World Association for Al-Azhar Graduates"
        description="Connecting Al-Azhar graduates across India and promoting the scholarly, intellectual and humanitarian values of Al-Azhar University."
        image="/al-azhar-cairo.jpg"
      />

      {/* Original About Content */}
      <ContentSections image={image} stats={stats} sections={sections} />

      <ImpactStats />
      <FocusAreas />
      <CtaBand />
    </>
  );
}
