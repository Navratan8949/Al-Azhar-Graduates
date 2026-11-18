import en from "./en.json";
import ar from "./ar.json";
import ur from "./ur.json";
import hi from "./hi.json";

export const LOCALES = {
  en,
  ar,
  ur,
  hi,
};

export const SUPPORTED_LANGUAGES = [
  { code: "en", name: "English", nativeName: "English", dir: "ltr", flag: "🇬🇧" },
  { code: "ar", name: "Arabic", nativeName: "العربية", dir: "rtl", flag: "🇸🇦" },
  { code: "ur", name: "Urdu", nativeName: "اردو", dir: "rtl", flag: "🇮🇳" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", dir: "ltr", flag: "🇮🇳" },
];

export const DEFAULT_LANGUAGE = "en";

export function getNestedTranslation(obj, path) {
  if (!obj || !path) return undefined;
  const keys = path.split(".");
  let current = obj;
  for (const key of keys) {
    if (current && typeof current === "object" && key in current) {
      current = current[key];
    } else {
      return undefined;
    }
  }
  return current;
}

export function translate(lang, path, fallback = "") {
  const selectedLocale = LOCALES[lang] || LOCALES[DEFAULT_LANGUAGE];
  const translated = getNestedTranslation(selectedLocale, path);
  if (translated !== undefined) return translated;

  // Fallback to English
  const fallbackVal = getNestedTranslation(LOCALES[DEFAULT_LANGUAGE], path);
  if (fallbackVal !== undefined) return fallbackVal;

  return fallback || path;
}

