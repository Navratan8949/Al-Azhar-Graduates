"use client"

import { Reveal } from "@/components/shared/reveal"
import { Quote } from "lucide-react"
import { useLanguage } from "@/context/LanguageContext"

export function MottoBanner() {
  const { t, isRTL, language } = useLanguage()

  const mottoByLang = {
    ar: {
      title: "شعارنا",
      lines: [
        "الوسطية منهجنا",
        "الوحدة قوتنا",
        "العلم هويتنا",
        "خدمة الإنسانية رسالتنا",
      ],
    },
    ur: {
      title: "ہمارا شعار",
      lines: [
        "اعتدال ہمارا منہج",
        "اتحاد ہماری قوت",
        "علم ہماری شناخت",
        "خدمتِ انسانیت ہمارا مشن",
      ],
    },
    hi: {
      title: "हमारा आदर्श वाक्य",
      lines: [
        "ज्ञान और संयम",
        "संवाद और सद्भाव",
        "मानवता की सेवा",
        "सकारात्मक मूल्यों का निर्माण",
      ],
    },
    en: {
      title: "OUR MOTTO",
      lines: [
        "Moderation is our Method.",
        "Unity is our Strength.",
        "Knowledge is our Identity.",
        "Service to Humanity is our Mission.",
      ],
    },
  }

  const current = mottoByLang[language] || mottoByLang.en

  return (
    <section className="bg-navy py-16 sm:py-24">
      <div className="mx-auto max-w-4xl px-4 text-center">
        <Reveal>
          <Quote className="mx-auto mb-8 size-12 text-accent/50" />
          <h2
            className="font-serif text-3xl font-bold leading-tight tracking-tight text-white md:text-5xl lg:text-6xl"
            style={{ fontFamily: isRTL ? "inherit" : "var(--font-cinzel), serif" }}
          >
            {current.title}
          </h2>
          <div
            className="mx-auto mt-12 max-w-3xl space-y-4 font-serif text-2xl italic leading-relaxed text-white/90 md:text-3xl lg:text-4xl"
            style={{ fontFamily: isRTL ? "inherit" : "var(--font-cinzel), serif" }}
          >
            {current.lines.map((line, idx) => (
              <p key={idx} className={idx === current.lines.length - 1 ? "text-accent" : ""}>
                “{line}”
              </p>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
