"use client"
import { useState, useEffect } from "react"
import { X, Loader2 } from "lucide-react"

export function CrudModal({ isOpen, onClose, onSubmit, title, schema, initialData }) {
  const [formData, setFormData] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (isOpen) {
      const dataToSet = initialData ? { ...initialData } : {}
      if (dataToSet.password) {
        dataToSet.password = ""
      }
      setFormData(dataToSet)
      setError(null)
      setLoading(false)
    }
  }, [isOpen, initialData])

  if (!isOpen) return null

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const payload = { ...formData }
      if (initialData && payload.password === "") {
        delete payload.password
      }
      await onSubmit(payload)
      onClose()
    } catch (err) {
      setError(err.message || "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-navy/60 backdrop-blur-md" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative w-full max-w-lg rounded-2xl border border-white/20 bg-white shadow-2xl overflow-hidden flex flex-col max-h-[90vh] ring-1 ring-black/5">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-navy/5 bg-gradient-to-r from-navy to-[#022c1d] px-6 py-5">
          <h2 className="font-serif text-xl font-extrabold text-white tracking-wide">{title}</h2>
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
            {(schema || []).map((field) => (
              <div key={field.name}>
                <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-slate-500">
                  {field.label} {field.required ? <span className="text-rose-500 text-sm">*</span> : <span className="text-muted-foreground font-normal text-[10px] ml-1">(Optional)</span>}
                </label>
                
                {field.type === "textarea" ? (
                  <textarea
                    required={field.required}
                    value={formData[field.name] || ""}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-navy shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 min-h-[100px] transition-all"
                    placeholder={field.placeholder}
                  />
                ) : field.type === "select" ? (
                  <select
                    required={field.required}
                    value={
                      formData[field.name] && typeof formData[field.name] === 'object' && formData[field.name]._id
                        ? formData[field.name]._id
                        : formData[field.name] || ""
                    }
                    onChange={(e) => handleChange(field.name, e.target.value)}
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
                      onChange={(e) => handleChange(field.name, e.target.checked)}
                      className="size-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500/20"
                    />
                    <span className="text-sm font-semibold text-navy">{field.placeholder || "Yes"}</span>
                  </label>
                ) : field.type === "file" ? (
                  <div className="rounded-xl border border-dashed border-slate-300 bg-white p-4 text-center transition-all hover:border-emerald-500 hover:bg-emerald-50/50">
                    <input
                      type="file"
                      required={field.required && !initialData?.[field.name]}
                      onChange={(e) => handleChange(field.name, e.target.files[0])}
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
                    required={field.required}
                    value={formData[field.name] ? new Date(formData[field.name]).toISOString().split('T')[0] : ""}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-navy shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all"
                  />
                ) : (
                  <input
                    type={field.type || "text"}
                    required={field.name === "password" && initialData ? false : field.required}
                    value={formData[field.name] || ""}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    disabled={field.name === "email" && !!initialData}
                    className={`w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-navy shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all ${field.name === "email" && !!initialData ? "bg-slate-100 text-slate-400 cursor-not-allowed" : "bg-white"}`}
                    placeholder={field.placeholder}
                  />
                )}
              </div>
            ))}
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-5">
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
  )
}
