"use client"

import { motion } from "framer-motion"
import { BadgeCheck, HeartHandshake, Leaf, School, Stethoscope } from "lucide-react"
import { Reveal } from "@/components/shared/reveal"

const items = [
  { icon: School, label: "Education access" },
  { icon: Stethoscope, label: "Health camps" },
  { icon: HeartHandshake, label: "Community care" },
  { icon: Leaf, label: "Green drives" },
  { icon: BadgeCheck, label: "80G · 12A certified" },
]

export function TrustStrip() {
  return (
    <section className="relative border-y border-border/60 bg-card">
      <div className="mx-auto max-w-7xl px-4 py-4">
        <Reveal>
          <div className="flex flex-wrap items-center justify-center gap-3 md:justify-between">
            {items.map((item, i) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06, duration: 0.45 }}
                  className="inline-flex items-center gap-2.5 rounded-full border border-border/70 bg-secondary/40 px-4 py-2.5 text-sm font-semibold text-foreground/80"
                >
                  <Icon className="size-4 text-navy" />
                  {item.label}
                </motion.div>
              )
            })}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
