"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import {
  ArrowRight,
  Heart,
  Users,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const defaultSlides = [
  {
    image: "/hero-community-education-india.png",
    title: "Moderation is our",
    highlight: "Method.",
    desc: "The World Association for Al-Azhar Graduates promotes awareness of Al-Azhar's global scholarly and civilizational contribution.",
  },
  {
    image: "/community-health-camp-india.png",
    title: "Unity is our",
    highlight: "Strength.",
    desc: "Connecting Al-Azhar graduates across India through a strong national network to encourage academic cooperation and intellectual exchange.",
  },
  {
    image: "/women-skill-training-workshop-india.png",
    title: "Knowledge is our",
    highlight: "Identity.",
    desc: "Supporting Arabic language, Islamic studies, and organizing educational, intellectual and training programs.",
  },
  {
    image: "/al-azhar-cairo.jpg",
    title: "Service is our",
    highlight: "Mission.",
    desc: "Presenting the authentic and humane teachings of Islam to wider society and engaging youth through constructive initiatives.",
  },
];

export function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { data: siteContent } = useSelector((state) => state.siteContent);

  let slides = defaultSlides;
  if (siteContent?.home_hero?.content) {
    try {
      const parsed = JSON.parse(siteContent.home_hero.content);
      if (Array.isArray(parsed) && parsed.length > 0) slides = parsed;
    } catch (e) {
      slides = defaultSlides;
    }
  }

  let stats = [
    { value: "25+", label: "Arabic Courses", icon: Users },
    { value: "100+", label: "Academic Gatherings", icon: ShieldCheck },
    { value: "10+", label: "Welfare Support", icon: Heart },
  ];
  if (siteContent?.impact_stats?.content) {
    try {
      const parsedStats = JSON.parse(siteContent.impact_stats.content);
      if (Array.isArray(parsedStats) && parsedStats.length > 0) {
        stats = parsedStats.map((s) => ({
          value: s.value,
          label: s.label,
          icon:
            s.icon === "Users"
              ? Users
              : s.icon === "ShieldCheck"
                ? ShieldCheck
                : Heart,
        }));
      }
    } catch (e) {}
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

  return (
    <section className="relative flex min-h-[90vh] items-center overflow-hidden bg-[#01140e]">
      {/* Full Bleed Background Slider */}
      <AnimatePresence initial={false}>
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.8, ease: "easeInOut" }}
          className="absolute inset-0 z-0"
        >
          <Image
            src={slides[currentSlide]?.image || defaultSlides[0].image}
            alt={slides[currentSlide]?.title}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          {/* Premium Gradient Overlay: Very dark on left for text, fading to right */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#011c13] via-[#011c13]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#011c13] via-transparent to-[#011c13]/40" />
        </motion.div>
      </AnimatePresence>

      {/* Decorative Islamic Pattern Overlay (very subtle) */}
      <div
        className="absolute inset-0 z-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4af37' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-6 lg:px-12 grid lg:grid-cols-12 gap-8 pt-20 pb-40">
        {/* Left Aligned Content */}
        <div className="lg:col-span-7 xl:col-span-6 flex flex-col items-start text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-accent backdrop-blur-md mb-8">
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex size-2 rounded-full bg-accent"></span>
              </span>
              Est. 2010 · New Delhi
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={`text-${currentSlide}`}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex flex-col items-start w-full"
            >
              <h1
                className="font-serif font-bold leading-[1.05] tracking-tight text-5xl sm:text-6xl lg:text-7xl xl:text-[5.5rem] text-white drop-shadow-2xl"
                style={{ fontFamily: "var(--font-cinzel), serif" }}
              >
                {slides[currentSlide]?.title} <br />
                <span className="text-accent italic font-normal tracking-normal pr-4">
                  {slides[currentSlide]?.highlight}
                </span>
              </h1>

              <p className="mt-8 text-lg sm:text-xl leading-relaxed text-white/80 max-w-lg font-medium drop-shadow-md">
                {slides[currentSlide]?.desc}
              </p>
            </motion.div>
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-12 flex flex-wrap gap-5"
          >
            <Button
              asChild
              size="lg"
              className="h-14 rounded-full bg-accent px-8 text-base font-bold text-[#011c13] shadow-[0_0_25px_rgba(212,175,55,0.3)] transition-all hover:-translate-y-1 hover:bg-[#ebd074] hover:shadow-[0_0_35px_rgba(212,175,55,0.5)] border-0"
            >
              <Link href="/membership">
                <Users className="mr-2 size-5" />
                Become a Member
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-14 rounded-full border-white/20 bg-white/5 backdrop-blur-md px-8 text-base font-semibold text-white transition-all hover:-translate-y-1 hover:bg-white/10 hover:border-white/40"
            >
              <Link href="/programs">
                Explore Programs
                <ArrowRight className="ml-2 size-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Floating Glassmorphism Stats Bar at the bottom */}
      <div className="absolute bottom-0 left-0 w-full z-20 border-t border-white/10 bg-[#011c13]/60 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1440px] flex-col md:flex-row items-center justify-between gap-6 px-6 lg:px-12 py-6">
          <div className="flex flex-wrap justify-center md:justify-start gap-8 lg:gap-16">
            {stats.map((stat, idx) => (
              <div key={idx} className="flex items-center gap-4 group">
                <div className="flex size-12 items-center justify-center rounded-full bg-white/5 border border-white/10 transition-transform group-hover:scale-110 group-hover:border-accent/50 group-hover:bg-accent/10">
                  <stat.icon className="size-5 text-accent" />
                </div>
                <div className="text-left">
                  <p
                    className="font-bold text-2xl text-white font-serif tracking-wide"
                    style={{ fontFamily: "var(--font-cinzel), serif" }}
                  >
                    {stat.value}
                  </p>
                  <p className="text-[11px] text-white/60 uppercase tracking-widest font-bold">
                    {stat.label}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Slider Navigation Controls */}
          <div className="flex items-center gap-4">
            <button
              onClick={prevSlide}
              className="flex size-12 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white transition-all hover:bg-accent hover:text-[#011c13] hover:border-accent"
              aria-label="Previous slide"
            >
              <ChevronLeft className="size-5" />
            </button>
            <div className="flex gap-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    currentSlide === index
                      ? "w-8 bg-accent"
                      : "w-2 bg-white/30 hover:bg-white/60"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
            <button
              onClick={nextSlide}
              className="flex size-12 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white transition-all hover:bg-accent hover:text-[#011c13] hover:border-accent"
              aria-label="Next slide"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
