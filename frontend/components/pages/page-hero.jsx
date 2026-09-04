import Image from "next/image"

export function PageHero({ eyebrow, title, description, image }) {
  return (
    <section className="relative overflow-hidden bg-navy pt-24 pb-20 md:pt-32 md:pb-28">
      {/* Background Image with elegant overlay (if provided) */}
      {image ? (
        <>
          <div className="absolute inset-0">
            <Image
              src={image}
              alt=""
              fill
              priority
              className="object-cover object-center opacity-20 mix-blend-luminosity"
              sizes="100vw"
            />
          </div>
          {/* Smooth gradient over the image */}
          <div className="absolute inset-0 bg-gradient-to-b from-navy/95 via-navy/80 to-navy" />
        </>
      ) : (
        /* Subtle glow for pages without an image */
        <>
          <div className="absolute top-0 right-0 h-[600px] w-[600px] -translate-y-1/2 translate-x-1/3 rounded-full bg-accent/5 blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 h-[400px] w-[400px] translate-y-1/2 -translate-x-1/3 rounded-full bg-accent/5 blur-[100px] pointer-events-none" />
        </>
      )}

      {/* Center Glow */}
      <div className="absolute top-1/2 left-1/2 h-[400px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 blur-[100px] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
        {eyebrow && (
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-accent backdrop-blur-md">
            <span className="size-1.5 rounded-full bg-accent shadow-[0_0_10px_rgba(255,209,102,0.8)]" />
            {eyebrow}
          </span>
        )}
        
        <h1 className="font-serif text-4xl font-bold leading-[1.15] tracking-tight text-white md:text-5xl lg:text-6xl text-balance drop-shadow-sm">
          {title}
        </h1>
        
        {description && (
          <p className="mt-6 mx-auto max-w-2xl text-lg leading-relaxed text-white/70 font-medium text-pretty">
            {description}
          </p>
        )}
      </div>
      
      {/* Premium subtle bottom border */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
    </section>
  )
}
