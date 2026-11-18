/**
 * Universal helper to extract localized field value from an item.
 * Supports fallback cascade:
 * 1. item.translations[lang][field]
 * 2. item.translations['en'][field]
 * 3. item[field] (original top-level value)
 * 4. fallback value or empty string
 */
export function getLocalizedField(item, fieldName, currentLang = "en", fallback = "") {
  if (!item || typeof item !== "object") return fallback;

  let lang = "en";
  if (typeof currentLang === "string") {
    lang = currentLang.toLowerCase();
  } else if (currentLang && typeof currentLang === "object") {
    lang = currentLang.language || currentLang.code || currentLang.lang || "en";
  }

  // 1. Direct translation for current language
  if (
    item.translations &&
    item.translations[lang] &&
    typeof item.translations[lang] === "object" &&
    item.translations[lang][fieldName] &&
    typeof item.translations[lang][fieldName] === "string" &&
    item.translations[lang][fieldName].trim() !== ""
  ) {
    return item.translations[lang][fieldName];
  }

  // 2. English translation fallback
  if (
    lang !== "en" &&
    item.translations &&
    item.translations.en &&
    typeof item.translations.en === "object" &&
    item.translations.en[fieldName] &&
    typeof item.translations.en[fieldName] === "string" &&
    item.translations.en[fieldName].trim() !== ""
  ) {
    return item.translations.en[fieldName];
  }

  // 3. Root property on item
  if (
    item[fieldName] !== undefined &&
    item[fieldName] !== null &&
    typeof item[fieldName] === "string" &&
    item[fieldName].trim() !== ""
  ) {
    return item[fieldName];
  }

  return fallback;
}

export function isTranslatableField(fieldName) {
  const translatableKeys = [
    "title",
    "description",
    "name",
    "designation",
    "message",
    "location",
    "about",
    "content",
    "summary",
    "role",
    "heading",
    "awardedby"
  ];
  return translatableKeys.includes(fieldName?.toLowerCase());
}

