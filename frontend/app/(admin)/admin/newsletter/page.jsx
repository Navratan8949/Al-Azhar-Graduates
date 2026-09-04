"use client"
import { useState } from "react"
import { AdminCrudPage } from "@/components/admin/crud-page"
import { Button } from "@/components/ui/button"
import { Send, Loader2, X } from "lucide-react"
import { sendMassNewsletter } from "@/service/newsletter.service"

export default function Page() {
  const [modalOpen, setModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)
  
  const [subject, setSubject] = useState("")
  const [html, setHtml] = useState("")

  const columns = [
    { key: "email", label: "Subscriber Email" },
    { key: "createdAt", label: "Subscribed On", render: (r) => new Date(r.createdAt).toLocaleDateString() }
  ]

  const handleSend = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)
    try {
      await sendMassNewsletter({ subject, html })
      setSuccess(true)
      setTimeout(() => {
        setModalOpen(false)
        setSuccess(false)
        setSubject("")
        setHtml("")
      }, 2000)
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send mass email.")
    } finally {
      setLoading(false)
    }
  }

  const headerActions = (
    <>
      <Button 
        size="sm" 
        onClick={() => setModalOpen(true)}
        className="rounded-lg bg-navy font-semibold text-white hover:bg-navy/90"
      >
        <Send className="size-3.5 mr-2" />Send Newsletter
      </Button>

      {/* Mass Email Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4 border-b pb-4">
              <h2 className="text-xl font-bold font-serif">Send Mass Newsletter</h2>
              <button onClick={() => setModalOpen(false)} className="rounded-full p-1 hover:bg-gray-100"><X className="size-5" /></button>
            </div>
            
            <form onSubmit={handleSend} className="space-y-4">
              {success && (
                <div className="rounded-xl bg-emerald-50 p-3 text-emerald-700 text-sm font-semibold border border-emerald-100">
                  Email sent successfully to all subscribers!
                </div>
              )}
              {error && (
                <div className="rounded-xl bg-rose-50 p-3 text-rose-700 text-sm font-semibold border border-rose-100">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-semibold">Subject</label>
                <input 
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  disabled={loading || success}
                  className="w-full rounded-xl border border-border px-4 py-2 focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy disabled:opacity-50"
                  placeholder="e.g. New Campaign is Live!"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Email Content (HTML allowed)</label>
                <textarea 
                  required
                  rows={6}
                  value={html}
                  onChange={(e) => setHtml(e.target.value)}
                  disabled={loading || success}
                  className="w-full rounded-xl border border-border px-4 py-2 focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy disabled:opacity-50"
                  placeholder="Write your email content here. You can use <b>bold</b> or <br> for new lines."
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setModalOpen(false)} disabled={loading || success}>Cancel</Button>
                <Button type="submit" disabled={loading || success} className="bg-navy hover:bg-navy/90">
                  {loading ? <Loader2 className="size-4 animate-spin mr-2" /> : <Send className="size-4 mr-2" />}
                  {loading ? "Sending..." : "Send to All"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )

  return (
    <AdminCrudPage
      title="Newsletter Subscribers"
      description="Manage users who have subscribed to newsletter updates."
      endpoint="/newsletter"
      schema={[]} // No schema needed since we only delete
      columns={columns}
      primaryAction={null} // Cannot create subscribers from admin panel
      headerActions={headerActions}
      hideDelete={false} // Admins can delete subscribers
      hideEdit={true} // Subscribers cannot be edited
    />
  )
}
