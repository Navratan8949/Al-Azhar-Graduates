"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { EventCard } from "@/components/shared/event-card";
import { useLanguage } from "@/context/LanguageContext";
import api from "@/service/api";

export function UpcomingEvents() {
  const { t } = useLanguage();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await api.get("/events");
        const upcoming = (data.events || []).filter(
          (e) => e.status === "upcoming"
        ).slice(0, 3);
        setEvents(upcoming.length > 0 ? upcoming : (data.events || []).slice(0, 3));
      } catch (err) {
        console.error("Failed to load events", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <section className="w-full overflow-hidden bg-secondary/40 py-16 md:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            align="left"
            eyebrow={t("nav.events", "Events & Forums")}
            title={t("conferences.title", "Conferences & Events")}
            description={t(
              "conferences.desc",
              "Discover our latest conferences, academic sessions, and intellectual forums."
            )}
          />
          <Button
            asChild
            variant="outline"
            className="shrink-0 border-navy/20"
          >
            <Link href="/events">
              {t("conferences.all_events", "All Events")}
              <ArrowRight className="ml-2 size-4 rtl-flip" />
            </Link>
          </Button>
        </div>

        {loading ? (
          <div className="mt-12 flex justify-center py-12">
            <Loader2 className="size-8 animate-spin text-navy/40" />
          </div>
        ) : events.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-dashed border-border/80 bg-white py-12 text-center">
            <p className="font-medium text-muted-foreground">
              {t(
                "conferences.no_events",
                "No events scheduled at the moment."
              )}
            </p>
          </div>
        ) : (
          <div
            className={`mt-12 grid gap-6 ${
              events.length === 1
                ? "grid-cols-1 max-w-lg"
                : events.length === 2
                ? "grid-cols-1 md:grid-cols-2 max-w-4xl"
                : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            }`}
          >
            {events.map((e, i) => (
              <Reveal key={e._id} delay={i * 0.1}>
                <EventCard event={e} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
