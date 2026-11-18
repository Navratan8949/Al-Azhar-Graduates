"use client";

import { useEffect, useState } from "react";
import { Download, FileText, Loader2 } from "lucide-react";
import { PageHero } from "@/components/pages/page-hero";
import { Button } from "@/components/ui/button";
import { getDownloads } from "@/service/download.service";
import { useLanguage } from "@/context/LanguageContext";
import { getLocalizedField } from "@/lib/localized-field";

export default function Page() {
  const { t, locale, isRTL } = useLanguage();
  const [downloads, setDownloads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDownloads({ status: "active" })
      .then((data) => {
        if (data?.success) {
          const active = (data.data || data.downloads || []).filter(
            (d) => d.status === "active"
          );
          setDownloads(active);
        }
      })
      .catch((err) => console.error("Failed to fetch downloads:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <PageHero
        eyebrow={t("certificates.eyebrow", "Public Records & Credentials")}
        title={t("certificates.title", "Certificates & Documents")}
        description={t(
          "certificates.description",
          "View, preview, and download our official NGO certificates, legal documents, accreditation, and publications."
        )}
        image="/al-azhar-cairo.jpg"
      />
      <div className="mx-auto max-w-3xl px-4 py-12 md:py-16">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="size-10 animate-spin text-navy/50" />
          </div>
        ) : downloads.length > 0 ? (
          <div className="divide-y divide-border/60 overflow-hidden rounded-2xl border border-border/70 bg-card shadow-soft">
            {downloads.map((row) => {
              const title = getLocalizedField(row, "title", locale);
              const description = getLocalizedField(row, "description", locale);
              return (
                <div
                  key={row._id}
                  className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-navy/10 text-navy">
                      <FileText className="size-5" />
                    </span>
                    <div>
                      <span className="font-medium text-navy">{title}</span>
                      {description && (
                        <p className="text-sm text-muted-foreground">
                          {description}
                        </p>
                      )}
                    </div>
                  </div>
                  {row.file?.url && (
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="shrink-0 rounded-lg"
                    >
                      <a href={row.file.url} target="_blank" rel="noreferrer">
                        <Download
                          className={`size-4 ${isRTL ? "ml-2" : "mr-2"}`}
                        />
                        {t("common.download", "Download")}
                      </a>
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/70 p-12 text-center bg-secondary/30">
            <FileText className="size-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold text-foreground">
              {t("certificates.no_results", "No documents found")}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {t("common.check_back", "We haven't uploaded any public documents yet.")}
            </p>
          </div>
        )}
      </div>
    </>
  );
}
