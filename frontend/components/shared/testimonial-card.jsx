"use client";

import Image from "next/image"
import { Quote, Star } from "lucide-react"
import { useLanguage } from "@/context/LanguageContext"
import { getLocalizedField } from "@/lib/localized-field"

export function TestimonialCard({ item }) {
  const { t, language, isRTL } = useLanguage()
  const name = getLocalizedField(item, "name", language)
  const designation = getLocalizedField(item, "designation", language) || item.role || "Supporter"
  const message = getLocalizedField(item, "message", language)

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-primary text-white p-7 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:border-accent/40 hover:shadow-2xl">
      <div className="absolute right-5 top-5 text-white/5">
        <Quote className="size-16" />
      </div>

      <div className="mb-5 flex items-center gap-3 relative z-10">
        <Image
          src={item.image?.url || item.image || "/placeholder-user.jpg"}
          alt={name}
          width={60}
          height={60}
          className="size-14 rounded-full border object-cover"
        />
        <div>
          <h3 className="text-lg font-semibold">{name}</h3>
          <span className="mt-1 inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-accent">
            {designation}
          </span>
        </div>
      </div>

      <p className="flex-1 leading-8 text-white/80">
        "{message}"
      </p>

      <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
        <div className="flex gap-1">
          {[...Array(item.rating || 5)].map((_, i) => (
            <Star key={i} className="size-5 fill-yellow-400 text-yellow-400" />
          ))}
        </div>
        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white">
          {t("common.verified", "Verified")}
        </span>
      </div>
    </div>
  )
}
