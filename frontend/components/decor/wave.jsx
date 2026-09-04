export function WaveDivider({ flip = false, className = "", fill = "var(--background)" }) {
  return (
    <div className={`pointer-events-none relative z-[1] leading-[0] ${flip ? "rotate-180" : ""} ${className}`} aria-hidden>
      <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="block h-12 w-full md:h-16">
        <path
          fill={fill}
          d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z"
        />
      </svg>
    </div>
  )
}

export function BlobBackground({ className = "" }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      <svg className="absolute -left-24 -top-24 size-[420px] opacity-[0.12]" viewBox="0 0 200 200">
        <defs>
          <linearGradient id="blob1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f0a04b" />
            <stop offset="100%" stopColor="#16307a" />
          </linearGradient>
        </defs>
        <path fill="url(#blob1)" d="M44.7,-67.2C57.1,-59.1,65.7,-45.2,72.1,-30.2C78.5,-15.2,82.7,0.9,78.9,15.3C75.1,29.7,63.3,42.4,49.8,53.2C36.3,64,21.1,72.9,4.2,76.4C-12.7,79.9,-31.3,78,-45.2,68.7C-59.1,59.4,-68.3,42.7,-73.2,25.2C-78.1,7.7,-78.7,-10.6,-72.4,-25.7C-66.1,-40.8,-52.9,-52.7,-38.4,-60.3C-23.9,-67.9,-8.1,-71.2,5.9,-79.4C19.9,-87.6,32.3,-75.3,44.7,-67.2Z" transform="translate(100 100)" />
      </svg>
      <svg className="absolute -bottom-20 -right-16 size-[380px] opacity-[0.1]" viewBox="0 0 200 200">
        <path fill="#2d8a5e" d="M39.5,-62.3C51.2,-55.4,60.5,-43.9,68.1,-30.5C75.7,-17.1,81.6,-1.8,78.6,11.9C75.6,25.6,63.7,37.7,51.1,48.4C38.5,59.1,25.2,68.4,9.7,73.1C-5.8,77.8,-23.5,77.9,-38.2,70.9C-52.9,63.9,-64.6,49.8,-71.1,33.8C-77.6,17.8,-78.9,-0.1,-73.5,-15.3C-68.1,-30.5,-56,-43,-42.5,-50.3C-29,-57.6,-14.5,-59.7,0.5,-60.5C15.5,-61.3,27.8,-69.2,39.5,-62.3Z" transform="translate(100 100)" />
      </svg>
    </div>
  )
}

export function FloatingShapes() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="absolute left-[8%] top-[22%] size-3 animate-float rounded-full bg-accent/70" />
      <div className="absolute right-[12%] top-[30%] size-2 animate-float-delayed rounded-full bg-lime/80" />
      <div className="absolute bottom-[28%] left-[18%] size-2.5 animate-float rounded-full bg-white/40" />
      <div className="absolute bottom-[20%] right-[22%] size-3.5 animate-float-delayed rounded-full bg-accent/50" />
      <svg className="absolute right-[6%] top-[18%] size-16 animate-spin-slow opacity-30" viewBox="0 0 64 64" fill="none">
        <circle cx="32" cy="32" r="28" stroke="white" strokeWidth="1.5" strokeDasharray="6 8" />
      </svg>
      <svg className="absolute left-[5%] bottom-[24%] size-12 animate-spin-slow opacity-25" viewBox="0 0 48 48" fill="none">
        <path d="M24 4 L28 20 L44 24 L28 28 L24 44 L20 28 L4 24 L20 20 Z" stroke="#f0a04b" strokeWidth="1.5" fill="none" />
      </svg>
    </div>
  )
}
