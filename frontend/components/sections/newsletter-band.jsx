"use client"
import { useState } from "react"
import { Mail, Send, Loader2, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createNewsletter } from "@/service/newsletter.service"

export function NewsletterBand() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) return
    
    setLoading(true)
    setError(null)
    setMessage(null)
    
    try {
      await createNewsletter({ email })
      setMessage("Thanks for subscribing!")
      setEmail("")
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="bg-background py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="relative overflow-hidden rounded-3xl bg-navy px-6 py-14 shadow-2xl md:px-16 md:py-20 lg:grid lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-16">
          
          {/* Decorative subtle gradient blob */}
          <div className="pointer-events-none absolute -right-40 -top-40 size-96 rounded-full bg-accent/20 blur-[100px]" />
          
          <div className="relative z-10">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-accent backdrop-blur-md">
              <Mail className="size-4" />
              Newsletter
            </span>
            <h2 className="mt-6 font-serif text-3xl font-bold leading-tight text-white md:text-4xl lg:text-5xl">
              Stay connected with <span className="text-accent">trust updates</span>
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-white/80">
              Receive event notices, campaign updates and public reports from Al-Azhar Graduates directly in your inbox.
            </p>
          </div>
          
          <div className="relative z-10 mt-10 lg:mt-0">
            <form onSubmit={handleSubmit} className="flex w-full flex-col gap-3 sm:flex-row p-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-inner">
              <Input 
                placeholder="Enter your email address..." 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="h-14 w-full border-none bg-transparent px-5 text-base text-white placeholder:text-white/40 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <Button type="submit" disabled={loading} className="h-14 rounded-xl bg-accent px-8 text-base font-bold text-accent-foreground shadow-lg transition-transform hover:-translate-y-0.5 hover:bg-accent/90 sm:w-auto">
                {loading ? <Loader2 className="size-5 animate-spin" /> : "Subscribe"}
                {!loading && <Send className="ml-3 size-5" />}
              </Button>
            </form>
            
            {message && <p className="mt-4 text-sm font-semibold text-emerald-400 flex items-center justify-center lg:justify-start gap-1"><CheckCircle2 className="size-4" /> {message}</p>}
            {error && <p className="mt-4 text-sm font-semibold text-rose-400 text-center lg:text-left">{error}</p>}
            {!message && !error && (
              <p className="mt-4 text-center text-sm text-white/50 lg:text-left">
                We care about your data. No spam, ever.
              </p>
            )}
          </div>
          
        </div>
      </div>
    </section>
  )
}
