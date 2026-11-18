"use client"
import { useState, useEffect } from "react"
import { X, Loader2, Globe } from "lucide-react"
import { isTranslatableField } from "@/lib/localized-field"

const LANGUAGES = [
  { code: "en", label: "English", flag: "🇬🇧", dir: "ltr" },
  { code: "ar", label: "العربية", flag: "🇸🇦", dir: "rtl" },
  { code: "ur", label: "اردو", flag: "🇵🇰", dir: "rtl" },
  { code: "hi", label: "हिंदी", flag: "🇮🇳", dir: "ltr" },
]

export function CrudModal({ isOpen, onClose, onSubmit, title, schema, initialData }) {
  const [formData, setFormData] = useState({})
  const [activeLang, setActiveLang] = useState("en")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (isOpen) {
      const dataToSet = initialData ? { ...initialData } : {}
      if (dataToSet.password) {
        dataToSet.password = ""
      }

      // Initialize translations structure
      const tr = dataToSet.translations && typeof dataToSet.translations === "object"
        ? { ...dataToSet.translations }
        : {}
      tr.en = tr.en || {}
      tr.ar = tr.ar || {}
      tr.ur = tr.ur || {}
      tr.hi = tr.hi || {}

      // Seed tr.en with top-level translatable fields if not already present
      (schema || []).forEach(f => {
        if (isTranslatableField(f.name) && dataToSet[f.name] && !tr.en[f.name]) {
          tr.en[f.name] = dataToSet[f.name]
        }
      })
      dataToSet.translations = tr

      setFormData(dataToSet)
      setActiveLang("en")
      setError(null)
      setLoading(false)
    }
  }, [isOpen, initialData, schema])

  if (!isOpen) return null

  const hasTranslatable = (schema || []).some(f => isTranslatableField(f.name))
  const currentLangObj = LANGUAGES.find(l => l.code === activeLang) || LANGUAGES[0]
  const isRTL = currentLangObj.dir === "rtl"

  const handleFieldChange = (name, value) => {
    if (isTranslatableField(name)) {
      setFormData(prev => {
        const nextTr = {
          en: { ...(prev.translations?.en || {}) },
          ar: { ...(prev.translations?.ar || {}) },
          ur: { ...(prev.translations?.ur || {}) },
          hi: { ...(prev.translations?.hi || {}) },
          ...(prev.translations || {})
        }
        nextTr[activeLang] = { ...(nextTr[activeLang] || {}), [name]: value }

        const next = { ...prev, translations: nextTr }
        if (activeLang === "en") {
          next[name] = value
          nextTr.en[name] = value
        }
        return next
      })
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const getFieldValue = (field) => {
    if (isTranslatableField(field.name)) {
      if (activeLang === "en") {
        return formData[field.name] || formData.translations?.en?.[field.name] || ""
      }
      return formData.translations?.[activeLang]?.[field.name] || ""
    }
    return formData[field.name]
  }

  const fieldsToRender = activeLang === "en"
    ? (schema || [])
    : (schema || []).filter(f => isTranslatableField(f.name))

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-navy/60 backdrop-blur-md" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative w-full max-w-lg rounded-2xl border border-white/20 bg-white shadow-2xl overflow-hidden flex flex-col max-h-[90vh] ring-1 ring-black/5">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-navy/5 bg-gradient-to-r from-navy to-[#022c1d] px-6 py-5">
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-xl font-extrabold text-white tracking-wide">{title}</h2>
          </div>
          <button onClick={onClose} className="rounded-full bg-white/10 p-2 text-white/80 transition-all hover:bg-rose-500 hover:text-white">
            <X className="size-4" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-6 bg-slate-50/50">
          {error && (
            <div className="mb-5 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-700 shadow-sm">
              {error}
            </div>
          )}

          {/* 4-Language Tabs */}
          {hasTranslatable && (
            <div className="mb-5 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <Globe className="size-3.5 text-primary" />
                <span>Multi-Language Content</span>
              </div>
              <div className="grid grid-cols-4 gap-1 rounded-xl bg-slate-200/70 p-1">
                {LANGUAGES.map((lang) => {
                  const isActive = activeLang === lang.code
                  const hasData = lang.code === "en" 
                    ? true 
                    : Object.keys(formData.translations?.[lang.code] || {}).some(k => formData.translations[lang.code][k]?.trim())
                  return (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => setActiveLang(lang.code)}
                      className={`relative flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-bold transition-all ${
                        isActive
                          ? "bg-white text-navy shadow-sm ring-1 ring-black/5"
                          : "text-slate-600 hover:text-navy hover:bg-white/50"
                      }`}
                    >
                      <span className="text-sm">{lang.flag}</span>
                      <span>{lang.label}</span>
                      {hasData && !isActive && (
                        <span className="size-1.5 rounded-full bg-emerald-500" title="Translations available" />
                      )}
                    </button>
                  )
                })}
              </div>

              {activeLang !== "en" && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-3 text-xs text-emerald-900 flex items-center justify-between">
                  <div>
                    <span className="font-bold">{currentLangObj.label} Translation:</span> Fill in the translated text below ({currentLangObj.dir.toUpperCase()}). Media and settings are inherited from English.
                  </div>
                </div>
              )}
            </div>
          )}

          <form id="crud-form" onSubmit={async (e) => {
            e.preventDefault();
            setLoading(true);
            setError(null);
            
            try {
              const hasFile = schema.some(f => f.type === 'file');
              
              // Clean payload: extract _id from populated objects
              let cleanPayload = { ...formData };
              Object.keys(cleanPayload).forEach(key => {
                if (cleanPayload[key] && typeof cleanPayload[key] === 'object' && cleanPayload[key]._id && !(cleanPayload[key] instanceof File) && !(cleanPayload[key] instanceof Blob)) {
                  cleanPayload[key] = cleanPayload[key]._id;
                }
              });

              let payload = cleanPayload;
              
              if (hasFile) {
                payload = new FormData();
                Object.keys(cleanPayload).forEach(key => {
                  if (cleanPayload[key] !== undefined && cleanPayload[key] !== null && cleanPayload[key] !== '') {
                    // Do not append existing image objects to FormData as they become "[object Object]"
                    // Backend will keep existing image if no new file is provided.
                    if (typeof cleanPayload[key] === 'object' && cleanPayload[key].url && !(cleanPayload[key] instanceof File) && !(cleanPayload[key] instanceof Blob)) {
                      return; // Skip existing image object
                    }
                    if (key === 'translations') {
                      payload.append(key, JSON.stringify(cleanPayload[key]));
                      return;
                    }
                    payload.append(key, cleanPayload[key]);
                  }
                });
              }
              
              await onSubmit(payload);
              onClose();
            } catch (err) {
              setError(err.message || "An error occurred");
            } finally {
              setLoading(false);
            }
          }} className="space-y-4">
            {fieldsToRender.map((field) => {
              const isTrans = isTranslatableField(field.name)
              const fieldValue = getFieldValue(field)
              const isFieldRTL = isTrans && isRTL
              const isRequired = activeLang === "en" ? field.required : false

              return (
                <div key={field.name}>
                  <label className="mb-1.5 flex items-center justify-between text-[11px] font-bold uppercase tracking-widest text-slate-500">
                    <span>
                      {field.label} {activeLang !== "en" && <span className="text-emerald-700 font-semibold normal-case">({currentLangObj.label})</span>}
                    </span>
                    {isRequired ? (
                      <span className="text-rose-500 text-sm">*</span>
                    ) : (
                      <span className="text-muted-foreground font-normal text-[10px]">
                        {activeLang === "en" ? "(Optional)" : "(Optional Translation)"}
                      </span>
                    )}
                  </label>
                  
                  {field.type === "textarea" ? (
                    <textarea
                      required={isRequired}
                      dir={isFieldRTL ? "rtl" : "ltr"}
                      value={fieldValue || ""}
                      onChange={(e) => handleFieldChange(field.name, e.target.value)}
                      className={`w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-navy shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 min-h-[100px] transition-all ${
                        isFieldRTL ? "text-right font-sans" : "text-left"
                      }`}
                      placeholder={field.placeholder || `Enter ${field.label} in ${currentLangObj.label}...`}
                    />
                  ) : field.type === "select" ? (
                    <select
                      required={isRequired}
                      value={
                        formData[field.name] && typeof formData[field.name] === 'object' && formData[field.name]._id
                          ? formData[field.name]._id
                          : formData[field.name] || ""
                      }
                      onChange={(e) => handleFieldChange(field.name, e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-navy shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all cursor-pointer"
                    >
                      <option value="" disabled>Select {field.label}</option>
                      {field.options?.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  ) : field.type === "boolean" ? (
                    <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors shadow-sm">
                      <input
                        type="checkbox"
                        checked={!!formData[field.name]}
                        onChange={(e) => handleFieldChange(field.name, e.target.checked)}
                        className="size-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500/20"
                      />
                      <span className="text-sm font-semibold text-navy">{field.placeholder || "Yes"}</span>
                    </label>
                  ) : field.type === "file" ? (
                    <div className="rounded-xl border border-dashed border-slate-300 bg-white p-4 text-center transition-all hover:border-emerald-500 hover:bg-emerald-50/50">
                      <input
                        type="file"
                        required={field.required && !initialData?.[field.name]}
                        onChange={(e) => handleFieldChange(field.name, e.target.files[0])}
                        className="w-full text-sm text-slate-500 file:mr-4 file:cursor-pointer file:rounded-full file:border-0 file:bg-emerald-50 file:px-4 file:py-2 file:text-xs file:font-bold file:text-emerald-700 hover:file:bg-emerald-100 transition-all"
                      />
                      {initialData?.[field.name]?.url && (
                        <div className="mt-4 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-left shadow-sm">
                          {initialData[field.name].url.match(/\.(jpeg|jpg|gif|png|webp)$/i) ? (
                            <div className="h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-black/5 border border-black/10">
                              <img src={initialData[field.name].url} alt="Current" className="h-full w-full object-cover" />
                            </div>
                          ) : (
                            <div className="flex h-12 w-16 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-[10px] font-bold tracking-widest text-emerald-700 border border-emerald-100">
                              DOC
                            </div>
                          )}
                          <div>
                            <p className="text-xs font-bold text-navy">Current File</p>
                            <p className="text-[10px] text-slate-500">Select a new one to replace it.</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : field.type === "date" ? (
                    <input
                      type="date"
                      required={isRequired}
                      value={formData[field.name] ? new Date(formData[field.name]).toISOString().split('T')[0] : ""}
                      onChange={(e) => handleFieldChange(field.name, e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-navy shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all"
                    />
                  ) : (
                    <input
                      type={field.type || "text"}
                      required={field.name === "password" && initialData ? false : isRequired}
                      dir={isFieldRTL ? "rtl" : "ltr"}
                      value={fieldValue || ""}
                      onChange={(e) => handleFieldChange(field.name, e.target.value)}
                      disabled={field.name === "email" && !!initialData}
                      className={`w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-navy shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all ${
                        field.name === "email" && !!initialData ? "bg-slate-100 text-slate-400 cursor-not-allowed" : "bg-white"
                      } ${isFieldRTL ? "text-right font-sans" : "text-left"}`}
                      placeholder={field.placeholder || `Enter ${field.label} in ${currentLangObj.label}...`}
                    />
                  )}
                </div>
              )
            })}
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-5">
          <div className="text-xs font-medium text-slate-500">
            Active: <span className="font-bold text-navy">{currentLangObj.flag} {currentLangObj.label}</span>
          </div>
          <div className="flex items-center gap-3">
            <button type="button" onClick={onClose} className="rounded-xl px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-slate-500 transition hover:bg-slate-200 hover:text-navy">
              Cancel
            </button>
            <button 
              type="submit" 
              form="crud-form" 
              disabled={loading}
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b45309] px-6 py-2.5 text-xs font-bold uppercase tracking-wide text-white shadow-md transition-all hover:scale-[1.02] hover:shadow-lg disabled:pointer-events-none disabled:opacity-50"
            >
              {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
              {initialData ? "Save Changes" : "Create"}
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
