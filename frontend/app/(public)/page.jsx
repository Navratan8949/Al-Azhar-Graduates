import { Hero } from "@/components/sections/hero";
import { TrustStrip } from "@/components/sections/trust-strip";
import { ImpactStats } from "@/components/sections/impact-stats";
import { AboutPreview } from "@/components/sections/about-preview";
import { TextMaskBanner } from "@/components/sections/text-mask-banner";
import { FocusAreas } from "@/components/sections/focus-areas";
import { FeaturedProjects } from "@/components/sections/featured-projects";
import { FeaturedCampaign } from "@/components/sections/featured-campaign";
import { UpcomingEvents } from "@/components/sections/upcoming-events";
import { Testimonials } from "@/components/sections/testimonials";
import { CtaBand } from "@/components/sections/cta-band";
import { LatestUpdates } from "@/components/sections/latest-updates";
import { GalleryPreview } from "@/components/sections/gallery-preview";
import { NewsletterBand } from "@/components/sections/newsletter-band";
import { ParallaxBanner } from "@/components/sections/parallax-banner";
import { FaqSection } from "@/components/sections/faq-section";
import { MottoBanner } from "@/components/sections/motto-banner";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <>
      <Hero />
      <AboutPreview />
      {/* <TextMaskBanner /> */}
      <FocusAreas />
      <FeaturedCampaign />
      <FeaturedProjects />
      <ParallaxBanner />
      <UpcomingEvents />
      <LatestUpdates />
      <Testimonials />
      <GalleryPreview />
      <FaqSection />
      <NewsletterBand />
      <CtaBand />
    </>
  );
}
