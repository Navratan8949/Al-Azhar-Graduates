export function StatsCard({ label, value, hint, icon: Icon, tone = "bg-primary text-white" }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-primary/10 bg-gradient-to-br from-white to-emerald-50/10 p-6 shadow-sm transition-all duration-300 hover:border-primary/30 hover:shadow-md hover:-translate-y-1">
      <div className="absolute top-0 right-0 -mr-8 -mt-8 h-32 w-32 rounded-full bg-gradient-to-br from-primary/10 to-emerald-500/5 blur-2xl transition-all duration-500 group-hover:scale-150 group-hover:opacity-80"></div>
      
      <div className="relative z-10 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-extrabold uppercase tracking-widest text-slate-500">{label}</p>
          <p className="mt-2.5 font-serif text-3xl font-extrabold tracking-tight text-navy md:text-4xl">{value}</p>
          {hint && <p className="mt-1.5 text-xs font-semibold text-primary/80">{hint}</p>}
        </div>
        
        {Icon && (
          <span className={`flex size-12 shrink-0 items-center justify-center rounded-xl shadow-inner ${tone}`}>
            <Icon className="size-5" />
          </span>
        )}
      </div>
    </div>
  )
}
