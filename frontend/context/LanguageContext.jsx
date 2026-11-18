"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { LOCALES, SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE, translate } from "@/locales";

const LanguageContext = createContext({
  language: DEFAULT_LANGUAGE,
  setLanguage: () => {},
  t: (path, fallback) => fallback || path,
  dir: "ltr",
  isRTL: false,
  locale: LOCALES[DEFAULT_LANGUAGE],
  supportedLanguages: SUPPORTED_LANGUAGES,
});

export function LanguageProvider({ children, initialLanguage }) {
  const [language, setLanguageState] = useState(() => {
    return initialLanguage || DEFAULT_LANGUAGE;
  });

  const [mounted, setMounted] = useState(false);

  // Initialize from localStorage or cookie on client
  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem("app_language");
      if (stored && ["en", "ar", "ur", "hi"].includes(stored)) {
        setLanguageState(stored);
        applyLanguageAttributes(stored);
        return;
      }

      // Check cookie
      const match = document.cookie.match(/app_locale=([^;]+)/);
      if (match && ["en", "ar", "ur", "hi"].includes(match[1])) {
        setLanguageState(match[1]);
        applyLanguageAttributes(match[1]);
        return;
      }
    } catch (e) {
      console.warn("Could not read stored language preference", e);
    }
  }, []);

  const applyLanguageAttributes = (lang) => {
    const isRtlLang = lang === "ar" || lang === "ur";
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
      document.documentElement.dir = isRtlLang ? "rtl" : "ltr";
      if (isRtlLang) {
        document.documentElement.classList.add("rtl");
        document.documentElement.classList.remove("ltr");
      } else {
        document.documentElement.classList.add("ltr");
        document.documentElement.classList.remove("rtl");
      }
    }
  };

  const setLanguage = useCallback((newLang) => {
    if (!["en", "ar", "ur", "hi"].includes(newLang)) return;
    setLanguageState(newLang);
    applyLanguageAttributes(newLang);

    try {
      localStorage.setItem("app_language", newLang);
      document.cookie = `app_locale=${newLang}; path=/; max-age=31536000; SameSite=Lax`;
      // Clean up legacy googtrans cookies
      document.cookie = "googtrans=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      document.cookie = `googtrans=; domain=.${window.location.hostname}; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    } catch (e) {
      console.warn("Could not persist language", e);
    }
  }, []);

  const t = useCallback(
    (path, fallback = "") => {
      return translate(language, path, fallback);
    },
    [language]
  );

  const dir = language === "ar" || language === "ur" ? "rtl" : "ltr";
  const isRTL = dir === "rtl";
  const currentLocale = LOCALES[language] || LOCALES[DEFAULT_LANGUAGE];

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        dir,
        isRTL,
        locale: currentLocale,
        supportedLanguages: SUPPORTED_LANGUAGES,
        mounted,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

