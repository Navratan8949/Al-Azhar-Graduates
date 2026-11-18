"use client";

import { useState, useEffect } from "react";
import { PageHero } from "@/components/pages/page-hero";
import { CardsGrid } from "@/components/pages/cards-grid";
import { Loader2 } from "lucide-react";
import api from "@/service/api";
import { useLanguage } from "@/context/LanguageContext";

export default function Page() {
  const { t } = useLanguage();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await api.get("/events");
        setEvents(data.events || []);
      } catch (err) {
        console.error("Failed to fetch events", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <>
      <PageHero
        eyebrow={t("nav.events", "Events")}
        title={t("conferences.title", "Conferences, Seminars & Forums")}
        description={t("conferences.desc", "Organizing national and international academic conferences, seminars, and intellectual gatherings.")}
        image="/community-health-camp-india.png"
      />
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="size-10 animate-spin text-navy/50" />
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground font-medium">
          {t("common.no_data", "No events found.")}
        </div>
      ) : (
        <CardsGrid items={events} type="event" />
      )}
    </>
  );
}
