"use client";

import { useEffect, useState } from "react";
import { PageHero } from "@/components/pages/page-hero";
import { CardsGrid } from "@/components/pages/cards-grid";
import { Loader2 } from "lucide-react";
import { getProjects } from "@/service/project.service";
import { useLanguage } from "@/context/LanguageContext";

export default function Page() {
  const { t } = useLanguage();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProjects()
      .then((data) => {
        if (data?.success) {
          setProjects(data.data || data.projects || []);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <PageHero
        eyebrow={t("nav.activities", "Programs & Activities")}
        title={t("activities.title", "Educational & Community Activities")}
        description={t("activities.desc", "Our core activities focus on the following fields: Academic, Research, Intellectual, Language, and Community.")}
        image="/rural-classroom-children-learning-india.png"
      />
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="size-10 animate-spin text-navy/50" />
        </div>
      ) : (
        <CardsGrid items={projects} type="project" />
      )}
    </>
  );
}
