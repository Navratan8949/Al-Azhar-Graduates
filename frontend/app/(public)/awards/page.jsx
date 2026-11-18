"use client";

import { useState, useEffect } from "react";
import { Award, Medal, Star } from "lucide-react";
import Image from "next/image";
import { PageHero } from "@/components/pages/page-hero";
import { Reveal } from "@/components/shared/reveal";
import { getAwards } from "@/service/award.service";
import { useLanguage } from "@/context/LanguageContext";
import { getLocalizedField } from "@/lib/localized-field";

export default function Page() {
  const { t, language } = useLanguage();
  const [awards, setAwards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAwards()
      .then((data) => {
        if (data.success) {
          setAwards(data.awards || data.data || []);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="bg-background">
      <PageHero
        eyebrow={t("awards.badge", "Honours & Accolades")}
        title={t("awards.hero_title", "Awards & Honours")}
        description={t(
          "awards.hero_desc",
          "Recognition and accolades received for our persistent service to education, community empowerment, and social development."
        )}
        image="/hero-community-education-india.png"
      />

      <section className="mx-auto max-w-7xl px-4 py-16 md:py-24 min-h-[50vh]">
        <div className="mb-16 max-w-3xl text-center md:text-left">
          <h2 className="font-serif text-3xl font-bold text-navy md:text-4xl">
            {t("awards.section_title", "Our Achievements")}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {t(
              "awards.section_desc",
              "Every award we receive is a testament to the hard work of our scholars, volunteers, and the unwavering support of our well-wishers."
            )}
          </p>
        </div>

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="size-10 animate-spin rounded-full border-4 border-[#050a30] border-t-transparent"></div>
          </div>
        ) : awards.length > 0 ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {awards.map((award, idx) => {
              const title = getLocalizedField(award, "title", language);
              const description = getLocalizedField(award, "description", language);
              const awardedBy = getLocalizedField(award, "awardedBy", language) || award.awardedBy;
              return (
                <Reveal key={award._id} delay={idx * 0.1}>
                  <article className="group relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-border/60 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] hover:border-accent/30">
                    <div className="absolute -right-20 -top-20 size-40 rounded-full bg-accent/10 blur-3xl transition-opacity duration-300 group-hover:opacity-100 opacity-0" />

                    {/* Icon or Image */}
                    <div className="mb-8 flex size-14 items-center justify-center overflow-hidden rounded-2xl bg-navy/5 text-navy transition-colors duration-300 group-hover:bg-accent group-hover:text-accent-foreground relative">
                      {award.image?.url ? (
                        <Image
                          src={award.image.url}
                          alt={title || "Award"}
                          fill
                          className="object-cover"
                        />
                      ) : idx % 3 === 0 ? (
                        <Award className="size-7" />
                      ) : idx % 3 === 1 ? (
                        <Medal className="size-7" />
                      ) : (
                        <Star className="size-7" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex flex-1 flex-col">
                      <h3 className="font-serif text-xl font-bold text-foreground leading-snug">
                        {title}
                      </h3>

                      <div className="mt-3 flex items-center gap-2">
                        {award.year && (
                          <span className="inline-flex rounded-full bg-accent/15 px-2.5 py-0.5 text-xs font-bold text-navy">
                            {award.year}
                          </span>
                        )}
                        {awardedBy && (
                          <span className="text-sm font-semibold text-muted-foreground">
                            {awardedBy}
                          </span>
                        )}
                      </div>

                      <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                        {description}
                      </p>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-border/70 bg-white py-24 text-center">
            <Award className="mx-auto size-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-bold text-navy">
              {t("awards.no_awards", "No awards found")}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("awards.no_awards_desc", "Awards will appear here once added.")}
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
