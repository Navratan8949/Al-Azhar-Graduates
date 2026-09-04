"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSiteContent } from "@/redux/features/siteContentSlice";
import { Mail, MapPin, Phone, ArrowRight } from "lucide-react";
import { ContactForm } from "@/components/forms/contact-form";
import { SITE as DEFAULT_SITE } from "@/constants/site";
import { Reveal } from "@/components/shared/reveal";
import { FaqSection } from "@/components/sections/faq-section";

export default function Page() {
  const dispatch = useDispatch();
  const { data: siteContent } = useSelector((state) => state.siteContent);

  useEffect(() => {
    dispatch(fetchSiteContent());
  }, [dispatch]);

  let SITE = { ...DEFAULT_SITE };
  if (siteContent?.contact_info?.content) {
    try {
      const parsed = JSON.parse(siteContent.contact_info.content);
      if (parsed.address) SITE.address = parsed.address;
      if (parsed.email) SITE.email = parsed.email;
      if (parsed.phones && Array.isArray(parsed.phones)) {
        const contactPhones = parsed.phones
          .filter((p) => p.showInContact)
          .map((p) => p.number)
          .filter(Boolean);
        if (contactPhones.length > 0) SITE.phones = contactPhones;
      } else if (parsed.phone) {
        SITE.phones = [parsed.phone];
      }
      if (parsed.facebook) SITE.socials.facebook = parsed.facebook;
      if (parsed.instagram) SITE.socials.instagram = parsed.instagram;
      if (parsed.twitter) SITE.socials.twitter = parsed.twitter;
      if (parsed.youtube) SITE.socials.youtube = parsed.youtube;
    } catch (e) {}
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Premium Hero Section */}
      <section className="relative pt-32 pb-48 overflow-hidden bg-navy">
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-navy/40 to-navy pointer-events-none"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-lime/20 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 text-center">
          <Reveal>
            <span className="inline-block rounded-full border border-lime/30 bg-lime/10 px-5 py-2 text-xs font-bold uppercase tracking-[0.2em] text-lime mb-6 backdrop-blur-sm">
              Get In Touch
            </span>
            <h1 className="font-serif text-5xl font-bold tracking-tight text-white md:text-6xl lg:text-7xl">
              Contact <span className="text-lime text-gradient">Us</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-white/70 font-medium">
              We're here to assist you with membership, events, academic
              programs, collaborations, or any general inquiries.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Overlapping Content Section */}
      <section className="relative z-20 mx-auto max-w-7xl px-4 -mt-32 pb-24">
        <div className="grid gap-8 lg:grid-cols-3 lg:gap-10">
          {/* Left Column: Contact Cards */}
          <div className="space-y-6 lg:col-span-1">
            <Reveal delay={0.1}>
              <div className="group rounded-3xl bg-white p-8 shadow-soft border border-border/50 transition-all hover:shadow-lift hover:-translate-y-1 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                  <MapPin className="size-24 text-navy" />
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-navy text-lime shadow-lg mb-6">
                  <MapPin className="size-6" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-navy">
                  Head Office
                </h3>
                <p className="mt-3 text-muted-foreground leading-relaxed">
                  World Association for Al-Azhar Graduates – India Branch
                  <br />
                  New Delhi, India
                </p>
                <a
                  href={SITE.maps}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 inline-flex items-center text-sm font-bold text-lime hover:text-navy uppercase tracking-wider transition-colors"
                >
                  Get Directions <ArrowRight className="ml-2 size-4" />
                </a>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="group rounded-3xl bg-white p-8 shadow-soft border border-border/50 transition-all hover:shadow-lift hover:-translate-y-1 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Phone className="size-24 text-navy" />
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-navy text-lime shadow-lg mb-6">
                  <Phone className="size-6" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-navy">
                  Phone & Email
                </h3>
                <div className="mt-4 space-y-3">
                  {SITE.phones.map((phone) => (
                    <a
                      key={phone}
                      href={`tel:${phone.replace(/\s/g, "")}`}
                      className="block text-base font-medium text-muted-foreground hover:text-navy transition-colors"
                    >
                      {phone}
                    </a>
                  ))}
                  <div className="h-px w-full bg-border/60 my-4" />
                  <a
                    href={`mailto:${SITE.email}`}
                    className="block text-base font-medium text-muted-foreground hover:text-navy transition-colors break-all"
                  >
                    {SITE.email}
                  </a>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.3}>
              <div className="rounded-3xl bg-navy p-8 shadow-soft relative overflow-hidden">
                <div
                  className="absolute inset-0 opacity-10 pointer-events-none"
                  style={{
                    backgroundImage:
                      "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
                  }}
                ></div>
                <h3 className="font-serif text-2xl font-bold text-white relative z-10">
                  Follow Us
                </h3>
                <p className="mt-2 text-white/70 relative z-10">
                  Stay updated with our latest activities.
                </p>
                <div className="mt-6 flex flex-wrap gap-3 relative z-10">
                  <a
                    href={SITE.socials?.facebook || "#"}
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-10 items-center justify-center rounded-xl bg-white/10 px-4 text-sm font-semibold text-white transition hover:bg-lime hover:text-navy"
                  >
                    Facebook
                  </a>
                  <a
                    href={SITE.socials?.youtube || "#"}
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-10 items-center justify-center rounded-xl bg-white/10 px-4 text-sm font-semibold text-white transition hover:bg-lime hover:text-navy"
                  >
                    YouTube
                  </a>
                  <a
                    href={SITE.socials?.instagram || "#"}
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-10 items-center justify-center rounded-xl bg-white/10 px-4 text-sm font-semibold text-white transition hover:bg-lime hover:text-navy"
                  >
                    Instagram
                  </a>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-2">
            <Reveal delay={0.2} className="h-full">
              <div className="h-full rounded-[2.5rem] bg-white p-8 sm:p-12 shadow-lift border border-border/40 flex flex-col justify-center relative overflow-hidden">
                {/* Decorative corner element */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-lime/10 rounded-bl-[100px] -z-0"></div>

                <div className="relative z-10 mb-10">
                  <h2 className="font-serif text-3xl sm:text-4xl font-bold text-navy">
                    Send us a Message
                  </h2>
                  <p className="mt-3 text-muted-foreground text-lg">
                    Fill out the form below and we will get back to you shortly.
                  </p>
                </div>

                <div className="relative z-10">
                  <ContactForm />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <FaqSection />
    </div>
  );
}
