"use client";

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Calendar, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Reveal } from "@/components/shared/reveal"
import { useLanguage } from "@/context/LanguageContext"

export function FeaturedCampaign() {
  const { t, isRTL, language } = useLanguage()

  const event = {
    title: t("conferences.peace_conf_title", "International Peace Conference – 2017"),
    subtitle: `“${t("conferences.peace_conf_subtitle", "The Need and Importance of Peace and Peaceful Coexistence in the Contemporary World")}”`,
    description: `${t("conferences.peace_conf_desc", "In 2017, the India Branch hosted the landmark International Peace Conference...")} ${t("conferences.peace_conf_guest", "")} ${t("conferences.peace_conf_focus", "")}`,
    image: "/logo.png",
    date: isRTL ? (language === "ar" ? "٢٠١٧ م" : "۲۰۱۷ء") : "2017",
    location: isRTL
      ? (language === "ar" ? "المركز الثقافي الإسلامي الهندي، نيودلهي" : "انڈیا اسلامک کلچرل سینٹر، نئی دہلی")
      : "India Islamic Cultural Centre, New Delhi",
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:py-20">
      <Reveal>
        <div className="grid overflow-hidden rounded-[2rem] bg-primary border border-primary/20 shadow-xl lg:grid-cols-2 transition-all hover:shadow-2xl">
          <div className="relative min-h-64 lg:min-h-full bg-primary flex items-center justify-center p-8">
            <Image
              src={event.image}
              alt={event.title}
              width={400}
              height={400}
              className="object-contain"
            />
          </div>
          <div className="flex flex-col justify-center p-8 text-navy-foreground md:p-12">
            <span className="inline-flex w-fit items-center gap-2 rounded-md bg-accent px-3 py-1 text-xs font-bold uppercase text-primary">
              {t("nav.events", "Featured Event")}
            </span>
            <h2
              className="mt-4 text-balance font-serif text-3xl font-bold leading-tight md:text-4xl"
              style={{ fontFamily: isRTL ? "inherit" : "var(--font-cinzel), serif" }}
            >
              {event.title}
            </h2>
            <p className="mt-2 text-sm font-semibold italic text-accent">{event.subtitle}</p>
            <p className="mt-4 text-pretty leading-relaxed text-navy-foreground/80">{event.description}</p>

            <div className="mt-6 flex flex-col gap-2 text-sm text-navy-foreground/80">
              <div className="flex items-center gap-2">
                <Calendar className="size-4 text-accent" />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="size-4 text-accent" />
                <span>{event.location}</span>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Link href="/events">
                  {t("conferences.all_events", "View All Events")}
                  <ArrowRight className="ml-2 size-4 rtl-flip" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
