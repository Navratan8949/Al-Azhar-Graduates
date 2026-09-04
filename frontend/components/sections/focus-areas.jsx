"use client";

import Image from "next/image";
import * as LucideIcons from "lucide-react";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { useSelector } from "react-redux";

const DEFAULT_AREAS = [
  {
    icon: "GraduationCap",
    title: "Education",
    desc: "Free coaching centres, school sponsorships, books and digital learning for children in need.",
    image: "/rural-classroom-children-learning-india.png",
  },
  {
    icon: "HeartPulse",
    title: "Healthcare",
    desc: "Medical camps, mobile health units and awareness drives bringing care to remote villages.",
    image: "/community-health-camp-india.png",
  },
  {
    icon: "Apple",
    title: "Nutrition",
    desc: "Community kitchens serving daily nutritious meals to the hungry and vulnerable.",
    image: "/community-kitchen-serving-food-india.png",
  },
  {
    icon: "Users2",
    title: "Empowerment",
    desc: "Skill development and micro-enterprise training that helps women stand independently.",
    image: "/women-skill-training-workshop-india.png",
  },
  {
    icon: "TreePine",
    title: "Environment",
    desc: "Tree plantation and sustainability drives for a greener, healthier tomorrow.",
    image: "/tree-plantation-volunteers-india.png",
  },
  {
    icon: "Sprout",
    title: "Relief & Welfare",
    desc: "Rapid disaster relief, ration kits and support for families during times of crisis.",
    image: "/al-azhar-cairo.jpg",
  },
];

export function FocusAreas() {
  const { data: siteContent } = useSelector((state) => state.siteContent);

  let areas = DEFAULT_AREAS;
  if (siteContent?.focus_areas?.content) {
    try {
      const parsed = JSON.parse(siteContent.focus_areas.content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        areas = parsed;
      }
    } catch (e) {}
  }

  return (
    <section className="relative bg-slate-50 py-24 md:py-32 overflow-hidden">
      {/* Subtle Background Pattern */}
      <div
        className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cg fill='%23023d28' fill-opacity='0.04'%3E%3Cpath fill-rule='evenodd' d='M0 0h40v40H0V0zm40 40h40v40H40V40zm20-20h20v20H60V20zM0 60h20v20H0V60zm20-20h20v20H20V40zM20 0h20v20H20V0zM0 20h20v20H0V20zm60 40h20v20H60V60z'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: "80px 80px",
        }}
      />

      {/* Decorative Glowing Orbs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] translate-x-1/4 translate-y-1/4 pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-[1440px] px-6 lg:px-12">
        <Reveal>
          <SectionHeading
            eyebrow="What We Do"
            title="Our Areas of Impact"
            description="Six focused programs working together to uplift communities and create lasting, measurable change."
          />
        </Reveal>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {areas.map((a, i) => {
            const Icon = LucideIcons[a.icon] || LucideIcons.Heart;

            return (
              <Reveal key={i} delay={(i % 3) * 0.1}>
                <div className="group relative flex flex-col h-full bg-primary text-white rounded-[2rem] overflow-hidden shadow-lg hover:shadow-2xl shadow-navy/5 hover:shadow-primary/20 hover:-translate-y-2 transition-all duration-500 border border-primary/20 hover:border-accent/50">
                  {/* Image Container */}
                  <div className="relative h-56 w-full overflow-hidden bg-navy">
                    <Image
                      src={a.image}
                      alt={a.title}
                      fill
                      className="object-cover transition-all duration-700 ease-in-out group-hover:scale-110 group-hover:opacity-80"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    {/* Gradient Overlay to blend image with card body smoothly */}
                    <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/20 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-100" />
                  </div>

                  {/* Content Container */}
                  <div className="relative flex-1 p-6 pt-5 flex flex-col bg-primary">
                    {/* Floating Icon */}
                    <div className="absolute -top-10 left-6 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-[#b8952a] text-primary shadow-[0_10px_25px_-5px_rgba(212,175,55,0.4)] transition-all duration-500 group-hover:-translate-y-2 group-hover:scale-110">
                      <Icon className="h-6 w-6" />
                    </div>

                    <h3
                      className="mt-3 mb-2 text-2xl font-bold text-white transition-colors duration-300 group-hover:text-accent tracking-wide"
                      style={{ fontFamily: "var(--font-cinzel), serif" }}
                    >
                      {a.title}
                    </h3>
                    <p className="text-white/70 leading-relaxed flex-1 font-medium text-[15px]">
                      {a.desc}
                    </p>

                    {/* Learn More link */}
                    <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-sm font-bold uppercase tracking-widest text-accent overflow-hidden transition-colors group-hover:text-white">
                      <span>Explore Program</span>
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 transition-colors group-hover:bg-accent group-hover:text-primary">
                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
