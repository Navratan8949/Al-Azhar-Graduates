"use client"
import { useState, useEffect } from "react"
import Image from "next/image"
import { PageHero } from "@/components/pages/page-hero"
import { Reveal } from "@/components/shared/reveal"
import { Globe, Phone, Mail } from "lucide-react"
import { getTeams } from "@/service/team.service"

export default function Page() {
  const [team, setTeam] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getTeams()
      .then(data => {
        if (data.success) {
          setTeam(data.team)
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <PageHero
        eyebrow="Our Leadership"
        title="Management Team"
        description="Meet the dedicated individuals who steer World Association for Al-Azhar Graduates towards its vision with unwavering commitment."
        image="/al-azhar-cairo.jpg"
      />

      <section className="bg-muted/10 py-16 md:py-20 min-h-[50vh]">
        <div className="mx-auto max-w-7xl px-4">

          <div className="mb-16 max-w-2xl text-center mx-auto">
            <h2 className="font-serif text-3xl font-bold md:text-4xl text-foreground">The People Behind the Mission</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Our leadership brings together decades of experience in social work, education, healthcare, and community empowerment.
            </p>
          </div>

          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="size-10 animate-spin rounded-full border-4 border-[#050a30] border-t-transparent"></div>
            </div>
          ) : team.length === 0 ? (
            <div className="flex h-48 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-muted-foreground/20 bg-muted/5 text-center">
              <h3 className="font-serif text-2xl font-bold text-foreground">No members found</h3>
              <p className="mt-2 text-muted-foreground">Team members will appear here once added.</p>
            </div>
          ) : (
            <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {team.map((m, i) => (
                <Reveal key={m._id} delay={i * 0.1}>
                  <div className="group relative flex flex-col items-center">

                    {/* Image Container with Hover Effect */}
                    <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl bg-secondary shadow-lg transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-2xl">
                      <Image
                        src={m.photo?.url || '/placeholder-user.jpg'}
                        alt={m.name}
                        fill
                        className="object-cover"
                      />

                      {/* Dark Gradient Overlay for Social Links */}
                      <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-navy/90 via-navy/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 pb-8">
                        <div className="flex gap-4 transform translate-y-4 transition-transform duration-300 group-hover:translate-y-0">
                          {m.website && (
                            <a href={m.website.startsWith('http') ? m.website : `https://${m.website}`} target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md hover:bg-accent hover:text-navy transition-colors">
                              <Globe className="h-4 w-4" />
                            </a>
                          )}
                          {m.phone && (
                            <a href={`tel:${m.phone}`} className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md hover:bg-accent hover:text-navy transition-colors">
                              <Phone className="h-4 w-4" />
                            </a>
                          )}
                          {m.email && (
                            <a href={`mailto:${m.email}`} className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md hover:bg-accent hover:text-navy transition-colors">
                              <Mail className="h-4 w-4" />
                            </a>
                          )}
                          {!m.website && !m.phone && !m.email && (
                            <div className="flex gap-4">
                              <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md hover:bg-accent hover:text-navy transition-colors">
                                <Globe className="h-4 w-4" />
                              </button>
                              <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md hover:bg-accent hover:text-navy transition-colors">
                                <Phone className="h-4 w-4" />
                              </button>
                              <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md hover:bg-accent hover:text-navy transition-colors">
                                <Mail className="h-4 w-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Text Information Below Card */}
                    <div className="mt-6 text-center">
                      <h3 className="font-serif text-xl font-bold text-navy transition-colors group-hover:text-accent">
                        {m.name}
                      </h3>
                      <p className="mt-1 font-medium text-muted-foreground">
                        {m.designation}
                      </p>
                    </div>

                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
