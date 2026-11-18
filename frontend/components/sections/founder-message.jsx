"use client"
import Image from "next/image"
import { useSelector } from "react-redux"
import { Quote } from "lucide-react"
import { Reveal } from "@/components/shared/reveal"
import { useLanguage } from "@/context/LanguageContext"

export function FounderMessageSection() {
  const { t, isRTL, language, locale } = useLanguage()
  const { data: siteContent } = useSelector((state) => state.siteContent)

  const pm = locale?.president_message || {}

  let title = t("president_message.title", "President's Message")
  let name = t("president_message.signatory_name", "Prof. Dr. Mohammad Mubeen Saleem Al-Azhari")
  let designation = t("president_message.signatory_title", "President, World Association for Al-Azhar Graduates – India Branch")

  const paragraphs = [
    pm.bismillah,
    pm.salutation,
    pm.p1,
    pm.p2,
    pm.p3,
    pm.p4,
    pm.p5,
    pm.closing,
  ].filter(Boolean)

  let message = paragraphs.join("\n\n")
  let image = "/founder-message.jpg"

  if (siteContent?.founder_message?.content && language === "en") {
    try {
      const parsed = JSON.parse(siteContent.founder_message.content)
      if (parsed.name) name = parsed.name
      if (parsed.designation) designation = parsed.designation
      if (parsed.message) message = parsed.message
      if (parsed.image) image = parsed.image
    } catch (e) {
      message = siteContent.founder_message.content
    }
  } else if (siteContent?.founder_message?.translations?.[language]?.content) {
    message = siteContent.founder_message.translations[language].content
  }

  if (siteContent?.founder_message?.title && language === "en") {
    title = siteContent.founder_message.title
  } else if (siteContent?.founder_message?.translations?.[language]?.title) {
    title = siteContent.founder_message.translations[language].title
  }

  if (siteContent?.founder_message?.image?.url) {
    image = siteContent.founder_message.image.url
  }

  const initial = name ? name.charAt(0).toUpperCase() : "P"

  return (
    <section className="relative overflow-hidden bg-muted/30 py-16 md:py-20">
      {/* Decorative background elements */}
      <div className="absolute -left-32 -top-32 size-[500px] rounded-full bg-accent/5 blur-3xl" />
      <div className="absolute -bottom-32 -right-32 size-[500px] rounded-full bg-lime/5 blur-3xl" />
      
      <div className="mx-auto max-w-7xl px-4 relative z-10">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          
          {/* Image Side */}
          <Reveal className="relative mx-auto w-full max-w-md lg:mx-0">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-2xl ring-1 ring-border">
              <Image
                src={image}
                alt={name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/60 to-transparent" />
            </div>
            {/* Accent decoration */}
            <div className="absolute -bottom-6 -right-6 -z-10 h-full w-full rounded-3xl border-4 border-accent hidden md:block" />
          </Reveal>

          {/* Text Side */}
          <div className="relative">
            <Reveal>
              <div className="mb-6 flex size-14 items-center justify-center rounded-2xl bg-accent/10 text-accent ring-1 ring-accent/20">
                <Quote className="size-6 fill-current rtl-flip" />
              </div>
              <h2
                className="font-serif text-3xl font-bold tracking-tight text-navy md:text-4xl lg:text-5xl mb-6"
                style={{ fontFamily: isRTL ? "inherit" : "var(--font-cinzel), serif" }}
              >
                {title}
              </h2>
            </Reveal>
            
            <Reveal delay={0.1}>
              <div className="prose prose-lg prose-p:leading-relaxed prose-p:text-muted-foreground max-w-none">
                {paragraphs.map((p, idx) => (
                  <p key={idx} className="mb-4 text-base sm:text-lg leading-relaxed text-foreground/80">
                    {p}
                  </p>
                ))}
              </div>
            </Reveal>
            
            <Reveal delay={0.2}>
              <div className="mt-8 flex items-center gap-4 border-t border-border pt-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-navy text-white">
                  <span className="font-serif text-xl font-bold">{initial}</span>
                </div>
                <div>
                  <p className="font-bold text-navy text-lg">{name}</p>
                  <p className="text-sm text-muted-foreground max-w-[400px]">{designation}</p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
