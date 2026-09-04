import Image from "next/image";
import { Quote, Star } from "lucide-react";
import { PageHero } from "@/components/pages/page-hero";
import { TestimonialCard } from "@/components/shared/testimonial-card";
import { getTestimonials } from "@/service/testimonial.service";

export const metadata = {
  title: "Testimonials",
};

export default async function Page() {
  let testimonials = [];
  try {
    const res = await getTestimonials();
    testimonials = res?.testimonials?.filter(t => t.status !== 'inactive') || [];
  } catch (error) {
    console.error("Failed to fetch testimonials:", error);
  }

  return (
    <>
      <PageHero
        eyebrow="Testimonials"
        title="Voices from Our Community"
        description="Stories of hope, impact, and transformation shared by our beneficiaries, volunteers, and supporters."
        image="/women-skill-training-workshop-india.png"
      />

      <section className="bg-gradient-to-b from-background to-muted/20 py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-14 text-center">
            <h2 
              className="text-3xl font-bold md:text-5xl tracking-wide text-foreground"
              style={{ fontFamily: "var(--font-cinzel), serif" }}
            >
              What People Say About Us
            </h2>
            <p className="mx-auto mt-6 max-w-3xl text-muted-foreground text-lg leading-relaxed font-medium">
              Every contribution creates a real impact. These stories reflect
              the lives touched through education, healthcare, women
              empowerment, and community development initiatives.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {testimonials.length > 0 ? (
              testimonials.map((item) => (
                <TestimonialCard key={item._id} item={item} />
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-muted-foreground">
                No testimonials available at the moment.
              </div>
            )}
          </div>

        </div>
      </section>
    </>
  );
}