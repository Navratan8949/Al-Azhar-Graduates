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

  // 1. Direct translation for current language
  if (
    item.translations &&
    item.translations[currentLang] &&
    typeof item.translations[currentLang] === "object" &&
    item.translations[currentLang][fieldName] &&
    typeof item.translations[currentLang][fieldName] === "string" &&
    item.translations[currentLang][fieldName].trim() !== ""
  ) {
    return item.translations[currentLang][fieldName];
  }

  // 2. English translation fallback
  if (
    currentLang !== "en" &&
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
    "heading"
  ];
  return translatableKeys.includes(fieldName?.toLowerCase());
}

