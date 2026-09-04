"use client"
import { useEffect, useState } from "react"
import api from "@/service/api"
import { Loader2, MessageSquare, Plus, CheckCircle2, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Page() {
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({ subject: "", message: "" })
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const fetchComplaints = async () => {
    try {
      const res = await api.get("/complaints/me")
      setComplaints(res.data?.complaints || [])
    } catch (err) {
      // Normal if 404
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchComplaints()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)
    
    try {
      await api.post("/complaints", formData)
      setSuccess(true)
      setFormData({ subject: "", message: "" })
      setShowForm(false)
      fetchComplaints()
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err.response?.data?.message || "Failed to raise complaint.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) return <div className="py-10 text-center"><Loader2 className="mx-auto size-6 animate-spin text-navy" /></div>

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold">Complaints & Requests</h1>
          <p className="mt-1 text-sm text-muted-foreground">Raise complaints, requests, or queries directly with the administration.</p>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)} className="rounded-xl bg-navy text-white hover:bg-navy/90">
            <Plus className="size-4 mr-2" /> Raise New Complaint
          </Button>
        )}
      </div>

      {success && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-emerald-800 text-sm font-semibold flex items-center gap-2">
          <CheckCircle2 className="size-4" /> Complaint submitted successfully!
        </div>
      )}

      {showForm && (
        <div className="rounded-2xl border border-border/60 bg-white p-6 shadow-soft">
          <div className="flex items-center justify-between mb-4 border-b border-border/50 pb-4">
            <h2 className="font-serif text-lg font-bold">Raise a Complaint / Request</h2>
            <button type="button" onClick={() => setShowForm(false)} className="text-sm font-semibold text-muted-foreground hover:text-navy">Cancel</button>
          </div>
          
          {error && <div className="mb-4 text-sm text-rose-600 bg-rose-50 p-3 rounded-lg border border-rose-100">{error}</div>}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Subject</label>
              <input 
                type="text" 
                required 
                value={formData.subject}
                onChange={e => setFormData(f => ({ ...f, subject: e.target.value }))}
                className="mt-1.5 w-full rounded-xl border border-border bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-navy focus:ring-1 focus:ring-navy" 
                placeholder="E.g. Issue with ID card generation" 
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Message</label>
              <textarea 
                required 
                rows={4}
                value={formData.message}
                onChange={e => setFormData(f => ({ ...f, message: e.target.value }))}
                className="mt-1.5 w-full resize-none rounded-xl border border-border bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-navy focus:ring-1 focus:ring-navy" 
                placeholder="Describe your issue in detail..." 
              />
            </div>
            <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto rounded-xl bg-accent text-accent-foreground font-bold hover:bg-accent/90">
              {isSubmitting ? <Loader2 className="mr-2 size-4 animate-spin" /> : "Submit Complaint"}
            </Button>
          </form>
        </div>
      )}

      {complaints.length === 0 ? (
        !showForm && (
          <div className="rounded-2xl border border-border/60 bg-white p-10 text-center shadow-soft">
            <MessageSquare className="mx-auto size-12 text-muted-foreground/40" />
            <h2 className="mt-4 font-serif text-lg font-bold">No Complaints</h2>
            <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">You have not raised any complaints or requests yet.</p>
          </div>
        )
      ) : (
        <div className="space-y-4">
          {complaints.map((c) => (
            <div key={c._id} className="rounded-2xl border border-border/60 bg-white p-5 shadow-soft">
              <div className="flex flex-col sm:flex-row justify-between gap-3 sm:items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-serif text-lg font-bold text-navy">{c.subject}</h3>
                    <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                      c.status === 'resolved' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                      c.status === 'closed' ? 'bg-slate-100 text-slate-600 border border-slate-200' :
                      'bg-amber-50 text-amber-600 border border-amber-100'
                    }`}>
                      {c.status === 'resolved' ? <CheckCircle2 className="size-3" /> : <Clock className="size-3" />}
                      {c.status.replace("_", " ")}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-600 whitespace-pre-wrap">{c.message}</p>
                </div>
                <div className="text-right text-xs text-muted-foreground shrink-0">
                  <p>{new Date(c.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              
              {c.reply && (
                <div className="mt-4 rounded-xl bg-slate-50 border border-slate-200 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Admin Reply</p>
                  <p className="text-sm text-slate-700 whitespace-pre-wrap">{c.reply}</p>
                  {c.resolvedAt && <p className="text-xs text-slate-400 mt-2">Resolved on: {new Date(c.resolvedAt).toLocaleDateString()}</p>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
