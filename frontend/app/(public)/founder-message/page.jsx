"use client";

import { PageHero } from "@/components/pages/page-hero";
import { FounderMessageSection } from "@/components/sections/founder-message";
import { useLanguage } from "@/context/LanguageContext";

export default function Page() {
  const { t } = useLanguage();

  return (
    <>
      <PageHero
        eyebrow={t("nav.about", "About Us")}
        title={t("president_message.title", "President's Message")}
        description={t("home.motto", "Moderation is our methodology, unity is our strength, knowledge is our identity, and service to humanity is our mission.")}
        image="/al-azhar-cairo.jpg"
      />

      <FounderMessageSection />
    </>
  );
}
