"use client"

import Image from "next/image"
import Link from "next/link"
import { Logo } from "@/components/shared/logo"
import { useSiteBranding } from "@/hooks/useSiteBranding"

export function AuthShell({ title, subtitle, children, footer, image = "/hero-community-education-india.png" }) {
  const { siteName } = useSiteBranding()
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-navy lg:block">
        <Image src={image} alt="" fill priority className="object-cover opacity-60" sizes="50vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/70 to-navy/40" />
        <div className="relative z-10 flex h-full flex-col justify-between p-10 text-white">
          <Logo variant="light" />
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-300">{siteName}</p>
            <h2 className="mt-3 max-w-md font-serif text-4xl font-bold leading-tight">Connected by Al-Azhar. United for Service.</h2>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/70">Empowering graduates through knowledge, moderation, and community service.</p>
          </div>
          <p className="text-xs text-white/45">New Delhi · India</p>
        </div>
      </div>
      <div className="flex flex-col justify-center px-4 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8 lg:hidden"><Logo /></div>
          <h1 className="font-serif text-3xl font-bold tracking-tight">{title}</h1>
          {subtitle && <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{subtitle}</p>}
          <div className="mt-8">{children}</div>
          {footer && <div className="mt-6 text-sm text-muted-foreground">{footer}</div>}
          <p className="mt-8 text-center text-xs text-muted-foreground"><Link href="/" className="font-medium text-navy hover:underline">← Back to website</Link></p>
        </div>
      </div>
    </div>
  )
}
