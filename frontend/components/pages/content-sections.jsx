import Image from "next/image";
import { Reveal } from "@/components/shared/reveal";
export function ContentSections({ image, stats = [], sections = [] }) {
  return (
    <section className="relative bg-background py-16 md:py-20 z-10">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr] items-start">
          {image && (
            <Reveal className="lg:sticky lg:top-24">
              <div className="relative aspect-square sm:aspect-[4/5] lg:aspect-auto lg:h-[600px] overflow-hidden rounded-[2rem] rounded-tl-[5rem] shadow-2xl ring-1 ring-border/50">
                <Image
                  src={image}
                  alt=""
                  fill
                  priority
                  className="object-cover"
                  sizes="(min-width:1024px) 50vw, 100vw"
                />
                {stats.length > 0 && (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy/90 via-navy/60 to-transparent p-6 text-white backdrop-blur-sm">
                    <div className="flex flex-wrap gap-3">
                      {stats.map((s) => (
                        <span
                          key={s}
                          className="rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold tracking-wider uppercase"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Reveal>
          )}
          <div className="grid gap-8 lg:pl-8">
            {sections.map(([heading, body], idx) => (
              <Reveal key={heading} delay={idx * 0.1}>
                <article className="group relative py-8 border-b border-border/40 last:border-0 transition-colors hover:border-accent/50">
                  {/* Decorative Accent */}
                  <div className="absolute -left-8 top-10 h-0 w-1 rounded-full bg-accent transition-all duration-300 group-hover:h-12 hidden lg:block" />

                  <h2 className="font-serif text-3xl md:text-4xl font-bold text-navy">
                    {heading}
                  </h2>
                  <p className="mt-6 text-lg leading-relaxed text-muted-foreground whitespace-pre-wrap">
                    {body}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
