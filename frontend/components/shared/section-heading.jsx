export function SectionHeading({ eyebrow, title, description, align = "center", className = "", inverted = false }) {
  const alignCls = align === "left" ? "text-left items-start" : "text-center items-center mx-auto"
  return (
    <div className={`flex max-w-2xl flex-col ${alignCls} ${className}`}>
      {eyebrow && (
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-accent shadow-sm mb-4">
          <span className="relative flex size-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75"></span>
            <span className="relative inline-flex size-1.5 rounded-full bg-accent"></span>
          </span>
          {eyebrow}
        </span>
      )}
      <h2 className={`font-bold tracking-tight ${inverted ? "text-white" : "text-primary"} text-3xl md:text-[2.75rem] leading-[1.15]`} style={{ fontFamily: "var(--font-cinzel), serif" }}>
        {title}
      </h2>
      {description && (
        <p className={`mt-5 text-base leading-relaxed ${inverted ? "text-white/80" : "text-muted-foreground"} md:text-lg font-medium`}>
          {description}
        </p>
      )}
    </div>
  )
}
