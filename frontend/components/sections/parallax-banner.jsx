"use client"

import { useSelector } from "react-redux"
import { Reveal } from "@/components/shared/reveal"
import { Quote } from "lucide-react"
import { useLanguage } from "@/context/LanguageContext"

export function ParallaxBanner() {
  const { t, isRTL, language } = useLanguage()
  const { data: siteContent } = useSelector((state) => state.siteContent)

  const mottoByLang = {
    ar: {
      lines: [
        "الوسطية منهجنا",
        "الوحدة قوتنا",
        "العلم هويتنا",
        "خدمة الإنسانية رسالتنا",
      ],
      author: "— شعارنا",
    },
    ur: {
      lines: [
        "اعتدال ہمارا منہج",
        "اتحاد ہماری قوت",
        "علم ہماری شناخت",
        "خدمتِ انسانیت ہمارا مشن",
      ],
      author: "— ہمارا شعار",
    },
    hi: {
      lines: [
        "ज्ञान और संयम",
        "संवाद और सद्भाव",
        "मानवता की सेवा",
        "सकारात्मक मूल्यों का निर्माण",
      ],
      author: "— हमारा आदर्श वाक्य",
    },
    en: {
      lines: [
        "Moderation is our Method.",
        "Unity is our Strength.",
        "Knowledge is our Identity.",
        "Service to Humanity is our Mission.",
      ],
      author: "— OUR MOTTO",
    },
  }

  const currentMotto = mottoByLang[language] || mottoByLang.en

  return (
    <section className="relative h-[60vh] min-h-[400px] w-full overflow-hidden flex items-center justify-center">
      {/* Background Image with Fixed Attachment for Parallax */}
      <div 
        className="absolute inset-0 bg-[url('/al-azhar-cairo.jpg')] bg-cover bg-center bg-no-repeat bg-fixed"
        style={{ transform: "translateZ(0)" }} // Hardware acceleration hint
      />
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-navy/80" />

      {/* Content */}
      <Reveal className="relative z-10 px-4 text-center max-w-4xl mx-auto">
        <Quote className="mx-auto mb-6 size-12 text-accent/60" />
        <h2
          className="text-balance font-serif text-3xl md:text-5xl lg:text-5xl font-bold leading-tight text-white mb-8 space-y-3 italic"
          style={{ fontFamily: isRTL ? "inherit" : "var(--font-cinzel), serif" }}
        >
          {currentMotto.lines.map((line, idx) => (
            <p key={idx} className={idx === currentMotto.lines.length - 1 ? "text-accent" : ""}>
              “{line}”
            </p>
          ))}
        </h2>
        <p className="text-sm md:text-base font-bold tracking-[0.2em] text-accent uppercase">
          {currentMotto.author}
        </p>
      </Reveal>
    </section>
  )
}
