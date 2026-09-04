"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/shared/section-heading";
import { getGalleryItems } from "@/service/gallery.service";

export function GalleryPreview() {
  const [gallery, setGallery] = useState([]);

  useEffect(() => {
    getGalleryItems({ limit: 6 })
      .then((data) => {
        if (data.success) {
          setGallery(data.galleryItems.slice(0, 6));
        }
      })
      .catch(console.error);
  }, []);

  if (gallery.length === 0) return null;

  return (
    <section className="relative bg-background py-16 md:py-20 z-10">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            align="left"
            eyebrow="Gallery"
            title="Moments from the field"
            description="A visual record of our work, events, and gatherings."
          />
          <Button asChild variant="outline" className="shrink-0 border-navy/20">
            <Link href="/gallery/photos">
              Photo Gallery
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          {gallery.map((item) => (
            <Link
              key={item._id}
              href="/gallery/photos"
              className="group relative aspect-square overflow-hidden rounded-2xl border bg-secondary"
            >
              {item.image?.url ? (
                <Image
                  src={item.image.url}
                  alt={item.title}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="(min-width: 1024px) 16vw, 33vw"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-slate-100 text-xs text-muted-foreground">
                  No image
                </div>
              )}
              <div className="absolute inset-x-0 bottom-0 bg-navy/75 p-2 text-xs font-semibold text-navy-foreground opacity-0 transition group-hover:opacity-100 line-clamp-1">
                {item.title}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
