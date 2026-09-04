"use client";

import { HelpCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchSiteContent } from "@/redux/features/siteContentSlice";

const DEFAULT_FAQS = [
  {
    q: "How can I become a member of Al-Azhar Graduates?",
    a: "You can join us by opting for one of our Membership plans (Basic, Premium, or Lifetime) through our Membership page.",
  },
  {
    q: "What is the primary mission of the organization?",
    a: "Our mission is to connect Al-Azhar graduates across India, promote moderate Islamic teachings, and engage in social welfare and interfaith dialogue.",
  },
  {
    q: "Where is the India branch located?",
    a: "The India Branch is headquartered in New Delhi, India.",
  },
  {
    q: "Does the organization offer Arabic courses?",
    a: "Yes, we organize various Arabic language courses, Islamic studies workshops, and intellectual training programs.",
  },
  {
    q: "How is the organization funded?",
    a: "We rely on the generous support of our members, alumni, and well-wishers to fund our educational and welfare initiatives.",
  },
];

export function FaqSection() {
  const dispatch = useDispatch();
  const { data: siteContent } = useSelector((state) => state.siteContent);

  useEffect(() => {
    dispatch(fetchSiteContent());
  }, [dispatch]);

  let faqs = DEFAULT_FAQS;
  if (siteContent?.faqs?.content) {
    try {
      faqs = JSON.parse(siteContent.faqs.content);
    } catch (e) {}
  }

  return (
    <section className="relative bg-background py-16 md:py-20 z-10">
      <div className="mx-auto max-w-7xl px-4">
        {/* Decorative background elements */}
        <div className="absolute left-0 top-0 -z-10 h-full w-full bg-[radial-gradient(ellipse_at_top_left,rgba(147,224,24,0.05),transparent_50%)]"></div>
        <div className="absolute right-0 bottom-0 -z-10 h-full w-full bg-[radial-gradient(ellipse_at_bottom_right,rgba(25,76,143,0.05),transparent_50%)]"></div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.5fr] lg:gap-16">
            {/* Left Column - Sticky Heading */}
            <div className="lg:sticky lg:top-16 lg:h-max">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-navy/10 bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-navy shadow-sm">
                <HelpCircle className="size-4 text-accent" />
                Have Questions?
              </div>
              <h2 className="font-serif text-3xl font-bold text-navy sm:text-4xl lg:text-5xl lg:leading-tight">
                Frequently Asked{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-navy to-accent">
                  Questions
                </span>
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                Find answers to common questions about our organization,
                donations, tax exemptions, and how you can get involved.
              </p>
              {/* <div className="mt-8 rounded-2xl border border-border/60 bg-white p-6 shadow-sm">
              <p className="font-semibold text-foreground">Still have questions?</p>
              <p className="mt-1 text-sm text-muted-foreground">We're here to help you understand our mission better.</p>
              <Button asChild className="mt-4 w-full rounded-xl bg-navy font-bold hover:bg-navy/90 text-white">
                <Link href="/contact">Contact Support</Link>
              </Button>
            </div> */}
            </div>

            {/* Right Column - Accordion */}
            <div className="rounded-3xl border border-border/50 bg-white p-6 shadow-xl shadow-navy/5 sm:p-8">
              <Accordion type="single" className="w-full" defaultValue="item-0">
                {faqs.map((faq, index) => (
                  <AccordionItem
                    key={index}
                    value={`item-${index}`}
                    className="border-b-border/40 py-2 last:border-0"
                  >
                    <AccordionTrigger className="text-left text-[15px] font-bold text-navy hover:text-accent transition-colors py-4">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-[15px] leading-relaxed text-muted-foreground pb-4">
                      <div
                        className="prose prose-sm max-w-none text-muted-foreground"
                        dangerouslySetInnerHTML={{ __html: faq.a }}
                      />
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
