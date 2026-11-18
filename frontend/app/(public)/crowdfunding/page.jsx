"use client";

import { useEffect, useState } from "react";
import { PageHero } from "@/components/pages/page-hero";
import { CardsGrid } from "@/components/pages/cards-grid";
import { Loader2 } from "lucide-react";
import { getCrowdfundings } from "@/service/crowdfunding.service";
import { useLanguage } from "@/context/LanguageContext";

export default function Page() {
  const { t } = useLanguage();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCrowdfundings()
      .then((res) => {
        if (res && res.success && res.campaigns) {
          setCampaigns(res.campaigns);
        }
      })
      .catch((err) => console.error("Failed to fetch campaigns:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <PageHero
        eyebrow={t("crowdfunding_section.badge", "Support Our Cause")}
        title={t(
          "crowdfunding_section.title",
          "Humanitarian & Welfare Campaigns"
        )}
        description={t(
          "crowdfunding_section.description",
          "Join hands with us to make a lasting impact. Your contributions help provide educational opportunities and welfare to those in need."
        )}
        image="/logo.png"
      />
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="size-10 animate-spin text-navy/50" />
        </div>
      ) : (
        <CardsGrid items={campaigns} type="campaign" />
      )}
    </>
  );
}
