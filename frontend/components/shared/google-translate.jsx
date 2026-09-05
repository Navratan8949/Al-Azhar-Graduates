"use client"

import { useEffect, useState } from "react"
import Script from "next/script"
import { Globe, ChevronDown, Check } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिंदी (Hindi)" },
  { code: "ar", label: "العربية (Arabic)" },
  { code: "ur", label: "اردو (Urdu)" },
]

export function GoogleTranslate({ variant = "dark" }) {
  const [currentLang, setCurrentLang] = useState("en")

  useEffect(() => {
    // Read from localStorage first for immediate UI consistency
    const savedLang = localStorage.getItem('selected_lang')
    if (savedLang && LANGUAGES.some(l => l.code === savedLang)) {
      setCurrentLang(savedLang)
    }

    // Read current language from Google translate cookie
    const getCookie = (name) => {
      const value = `; ${document.cookie}`
      const parts = value.split(`; ${name}=`)
      if (parts.length === 2) return decodeURIComponent(parts.pop().split(';').shift())
      return null
    }
    
    const googCookie = getCookie("googtrans")
    if (googCookie) {
      const code = googCookie.split("/").pop()
      if (code && LANGUAGES.some(l => l.code === code)) {
        setCurrentLang(code)
        localStorage.setItem('selected_lang', code)
      }
    }
  }, [])

  const setLanguage = (langCode) => {
    setCurrentLang(langCode)
    localStorage.setItem('selected_lang', langCode)
    
    const hostname = window.location.hostname
    const cookieDomain = hostname === 'localhost' ? '' : `domain=${hostname};`
    
    // Clear existing cookies
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
    if (cookieDomain) {
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; ${cookieDomain}`
    }
    
    // If English, we just clear the cookie so it returns to the original language
    if (langCode === 'en') {
      window.location.reload()
      return
    }
    
    // Set new cookie
    document.cookie = `googtrans=/en/${langCode}; path=/;`
    if (cookieDomain) {
      document.cookie = `googtrans=/en/${langCode}; path=/; ${cookieDomain}`
    }
    
    // Force reload to apply language since React hydration clashes with DOM manipulation
    window.location.reload()
  }

  const activeObj = LANGUAGES.find(l => l.code === currentLang) || LANGUAGES[0]

  const triggerClassName = variant === "light" 
    ? "notranslate group flex items-center gap-1.5 rounded-full border border-border bg-white px-2.5 py-1 text-[11px] font-semibold text-foreground transition-all hover:bg-secondary focus:outline-none"
    : "notranslate group flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-white transition-all hover:bg-white/20 focus:outline-none"

  return (
    <>
      {/* Hidden Google Translate Mount Container */}
      <div id="google_translate_element" className="hidden" />

      <DropdownMenu modal={false}>
        <DropdownMenuTrigger className={triggerClassName}>
          <Globe className={`size-3.5 opacity-90 ${variant === 'light' ? 'text-navy' : 'text-accent'}`} />
          <span>{activeObj.label}</span>
          <ChevronDown className="size-3 opacity-60 transition-transform group-data-[state=open]:rotate-180" />
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="notranslate min-w-[150px] rounded-xl border border-border/60 bg-white p-1.5 shadow-xl">
          {LANGUAGES.map((item) => (
            <DropdownMenuItem
              key={item.code}
              onClick={() => setLanguage(item.code)}
              className="flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-semibold text-foreground/80 hover:bg-navy/5 hover:text-navy cursor-pointer"
            >
              <span>{item.label}</span>
              {currentLang === item.code && <Check className="size-3.5 text-navy font-bold" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Script id="google-translate-init" strategy="afterInteractive">
        {`
          window.googleTranslateElementInit = function() {
            new window.google.translate.TranslateElement({
              pageLanguage: 'en',
              includedLanguages: 'en,hi,ar,ur',
              autoDisplay: false
            }, 'google_translate_element');
          }
        `}
      </Script>
      <Script
        src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="afterInteractive"
      />

      <style jsx global>{`
        body { top: 0 !important; }
        .skiptranslate { display: none !important; }
        #goog-gt-tt { display: none !important; }
        .goog-te-banner-frame { display: none !important; }
        .goog-te-balloon-frame { display: none !important; }
      `}</style>
    </>
  )
}
