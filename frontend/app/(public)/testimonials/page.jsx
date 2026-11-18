"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Quote, Star, Loader2 } from "lucide-react";
import { PageHero } from "@/components/pages/page-hero";
import { TestimonialCard } from "@/components/shared/testimonial-card";
import { getTestimonials } from "@/service/testimonial.service";
import { useLanguage } from "@/context/LanguageContext";

export default function TestimonialsPage() {
  const { t, isRTL } = useLanguage();
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTestimonials()
      .then((res) => {
        if (res?.success && res.testimonials) {
          setTestimonials(res.testimonials.filter((t) => t.status !== "inactive"));
        }
      })
      .catch((error) => console.error("Failed to fetch testimonials:", error))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <PageHero
        eyebrow={t("testimonials_section.eyebrow", "Voices of Impact")}
        title={t("testimonials_section.title", "Words From Our Community")}
        description={t(
          "testimonials_section.description",
          "Reflections and feedback from scholars, students, and community members participating in our programs."
        )}
        image="/women-skill-training-workshop-india.png"
      />

      <section className="bg-gradient-to-b from-background to-muted/20 py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-14 text-center">
            <h2
              className="text-3xl font-bold md:text-5xl tracking-wide text-foreground"
              style={{ fontFamily: isRTL ? "inherit" : "var(--font-cinzel), serif" }}
            >
              {t("testimonials_section.title", "Words From Our Community")}
            </h2>
            <p className="mx-auto mt-6 max-w-3xl text-muted-foreground text-lg leading-relaxed font-medium">
              {t(
                "testimonials_section.description",
                "Reflections and feedback from scholars, students, and community members participating in our programs."
              )}
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="size-10 animate-spin text-navy/50" />
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
              {testimonials.length > 0 ? (
                testimonials.map((item) => (
                  <TestimonialCard key={item._id} item={item} />
                ))
              ) : (
                <div className="col-span-full py-12 text-center text-muted-foreground">
                  {t(
                    "testimonials_section.no_testimonials",
                    "No testimonials available at the moment."
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
