"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Mail, MapPin, Phone } from "lucide-react"
import { Logo } from "@/components/shared/logo"
import { FOOTER_QUICK_LINKS, FOOTER_RESOURCE_LINKS } from "@/constants/nav"
import { SITE } from "@/constants/site"

function FacebookIcon({ className }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22 12a10 10 0 1 0-11.563 9.872v-6.988H7.898V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988A10 10 0 0 0 22 12z" />
    </svg>
  )
}
function InstagramIcon({ className }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.975.975 1.246 2.242 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.975.975-2.242 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.975-.975-1.246-2.242-1.308-3.608C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608.975-.975 2.242-1.246 3.608-1.308C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.333.014 7.053.072 5.775.131 4.602.44 3.635 1.408 2.667 2.375 2.358 3.548 2.3 4.826 2.241 6.106 2.228 6.514 2.228 12s.013 5.894.072 7.174c.058 1.278.367 2.451 1.335 3.418.967.968 2.14 1.277 3.418 1.335C8.333 23.986 8.741 24 12 24s3.667-.014 4.947-.073c1.278-.058 2.451-.367 3.418-1.335.968-.967 1.277-2.14 1.335-3.418.059-1.28.072-1.688.072-7.174s-.013-5.894-.072-7.174c-.058-1.278-.367-2.451-1.335-3.418C19.398.44 18.225.131 16.947.072 15.667.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
    </svg>
  )
}
function YoutubeIcon({ className }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  )
}


import { useSelector } from "react-redux"

export function Footer() {
  const pathname = usePathname()
  const { data: siteContent } = useSelector((state) => state.siteContent) || {}
  if (pathname?.startsWith("/admin") || pathname?.startsWith("/member")) return null

  let site = { ...SITE }
  if (siteContent?.site_logo?.content) {
    try {
      const parsed = JSON.parse(siteContent.site_logo.content)
      if (parsed.siteName) site.name = parsed.siteName
    } catch(e) {}
  }
  if (siteContent?.site_seo?.content) {
    try {
      const parsed = JSON.parse(siteContent.site_seo.content)
      if (parsed.description) site.description = parsed.description
    } catch(e) {}
  }
  if (siteContent?.contact_info?.content) {
    try {
      const parsed = JSON.parse(siteContent.contact_info.content)
      if (parsed.address) site.address = parsed.address
      if (parsed.email) site.email = parsed.email
      if (parsed.phones && Array.isArray(parsed.phones)) {
        const footerPhones = parsed.phones.filter(p => p.showInFooter).map(p => p.number).filter(Boolean)
        if (footerPhones.length > 0) site.phones = footerPhones
      } else if (parsed.phone) {
        site.phones = [parsed.phone]
      }
      if (parsed.facebook) site.socials.facebook = parsed.facebook
      if (parsed.instagram) site.socials.instagram = parsed.instagram
      if (parsed.twitter) site.socials.twitter = parsed.twitter
      if (parsed.youtube) site.socials.youtube = parsed.youtube
    } catch(e) {}
  }

  return (
    <footer className="relative overflow-hidden bg-navy text-navy-foreground">
      <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-accent/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-16 size-64 rounded-full bg-lime/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <div className="inline-flex rounded-xl bg-white p-2.5 shadow-sm">
              <Logo />
            </div>
            <p className="mt-5 text-sm leading-relaxed text-white/65">{site.description}</p>
            <div className="mt-6 flex items-center gap-2.5">
              <a href={site.socials.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="inline-flex size-6 items-center justify-center rounded-xl bg-white/10 text-white transition hover:bg-accent hover:text-accent-foreground">
                <FacebookIcon className="size-5" />
              </a>
              <a href={site.socials.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="inline-flex size-6 items-center justify-center rounded-xl bg-white/10 text-white transition hover:bg-accent hover:text-accent-foreground">
                <InstagramIcon className="size-5" />
              </a>
              <a href={site.socials.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="inline-flex size-6 items-center justify-center rounded-xl bg-white/10 text-white transition hover:bg-accent hover:text-accent-foreground">
                <YoutubeIcon className="size-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-accent">Quick Links</h3>
            <ul className="mt-4 space-y-2.5">
              {FOOTER_QUICK_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-white/65 transition hover:text-accent">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-accent">Resources</h3>
            <ul className="mt-4 space-y-2.5">
              {FOOTER_RESOURCE_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-white/65 transition hover:text-accent">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-accent">Reach Us</h3>
            <ul className="mt-4 space-y-4 text-sm text-white/65">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-accent" />
                <span className="leading-relaxed">{site.address}</span>
              </li>
              <li className="flex gap-3">
                <Phone className="mt-0.5 size-4 shrink-0 text-accent" />
                <span className="flex flex-col gap-0.5">
                  {site.phones.map((p) => (
                    <a key={p} href={`tel:${p.replace(/\s/g, "")}`} className="hover:text-accent">
                      {p}
                    </a>
                  ))}
                </span>
              </li>
              <li className="flex gap-3">
                <Mail className="mt-0.5 size-4 shrink-0 text-accent" />
                <a href={`mailto:${site.email}`} className="hover:text-accent">
                  {site.email}
                </a>
              </li>
            </ul>
            <Link
              href="/membership"
              className="mt-6 inline-flex h-10 items-center rounded-xl bg-accent px-5 text-sm font-bold text-accent-foreground transition hover:bg-accent/90"
            >
              Become a Member
            </Link>
          </div>
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 pt-5 pb-3 text-xs text-white/45 md:flex-row">
          <p>© {new Date().getFullYear()} {site.name}. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy-policy" className="hover:text-white transition">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition">Terms & Conditions</Link>
          </div>
          <p>Registered Charitable Trust · 80G &amp; 12A Certified</p>
        </div>
        <div className="flex justify-center items-center pb-6 pt-2">
          <p className="text-sm font-medium text-white/60 tracking-wide">
            Designed by <span className="font-black text-white tracking-wider drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/70">ZDC Techglobal Pvt Ltd</span>
          </p>
        </div>
      </div>
    </footer>
  )
}

function SocialIcon({ href, label, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="inline-flex size-6 items-center justify-center rounded-xl bg-white/10 text-white transition hover:bg-accent hover:text-accent-foreground"
    >
      {children}
    </a>
  )
}
