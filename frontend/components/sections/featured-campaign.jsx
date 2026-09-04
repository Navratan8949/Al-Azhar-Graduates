import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Calendar, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Reveal } from "@/components/shared/reveal"

export async function FeaturedCampaign() {
  const event = {
    title: "International Peace Conference – 2017",
    subtitle: "“The Need and Importance of Peace and Peaceful Coexistence in the Contemporary World”",
    description: "In 2017, the India Branch organized an international peace conference bringing together distinguished scholars, academics, religious leaders and social figures from India and abroad. Professor Dr. Yousuf Amer, then Vice President of Al-Azhar University, participated from Egypt. The conference highlighted the values of peace, moderation, tolerance, dialogue and peaceful coexistence, serving as an important platform for presenting Al-Azhar's balanced message in India.",
    image: "/logo.png",
    date: "2017",
    location: "India Islamic Cultural Centre, New Delhi",
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:py-20">
      <Reveal>
        <div className="grid overflow-hidden rounded-[2rem] bg-primary border border-primary/20 shadow-xl lg:grid-cols-2 transition-all hover:shadow-2xl">
          <div className="relative min-h-64 lg:min-h-full bg-primary flex items-center justify-center p-8 relative">
            <Image
              src={event.image}
              alt={event.title}
              width={400}
              height={400}
              className="object-contain"
            />
          </div>
          <div className="flex flex-col justify-center p-8 text-navy-foreground md:p-12">
            <span className="inline-flex w-fit items-center gap-2 rounded-md bg-accent px-3 py-1 text-xs font-bold uppercase text-primary">
              Featured Event
            </span>
            <h2 className="mt-4 text-balance font-serif text-3xl font-bold leading-tight md:text-4xl">
              {event.title}
            </h2>
            <p className="mt-2 text-sm font-semibold italic text-accent">{event.subtitle}</p>
            <p className="mt-4 text-pretty leading-relaxed text-navy-foreground/80">{event.description}</p>

            <div className="mt-6 flex flex-col gap-2 text-sm text-navy-foreground/80">
              <div className="flex items-center gap-2">
                <Calendar className="size-4 text-accent" />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="size-4 text-accent" />
                <span>{event.location}</span>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Link href="/events">
                  View All Events
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
