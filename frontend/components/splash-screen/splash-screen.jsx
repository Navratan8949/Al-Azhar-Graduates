"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion, animate } from "framer-motion"

const NAVY = "#070f1f"
const ACCENT = "#facc15" // yellow/amber accent

const LOADING_DURATION = 1500 // ms
const MESSAGE_HOLD = 2000 // ms
const EXIT_DURATION = 1000 // ms

const SHOW_ONCE_PER_SESSION = false

export function SplashScreen({ children }) {
    const [stage, setStage] = useState("loading") // loading | message | exiting | done
    const [progress, setProgress] = useState(0)
    const [skip, setSkip] = useState(SHOW_ONCE_PER_SESSION ? null : false)

    useEffect(() => {
        if (!SHOW_ONCE_PER_SESSION) return
        const seen = sessionStorage.getItem("rht_splash_seen")
        setSkip(Boolean(seen))
    }, [])

    // Phase 1: fill the ring 0 -> 100%
    useEffect(() => {
        if (skip !== false) return
        const controls = animate(0, 100, {
            duration: LOADING_DURATION / 1000,
            ease: "easeInOut",
            onUpdate: (v) => setProgress(Math.round(v)),
            onComplete: () => setStage("message"),
        })
        return () => controls.stop()
    }, [skip])

    // Phase 2: hold the trust message
    useEffect(() => {
        if (stage !== "message") return
        const t = setTimeout(() => setStage("exiting"), MESSAGE_HOLD)
        return () => clearTimeout(t)
    }, [stage])

    // Phase 3: curtain lifts, then fully unmount
    useEffect(() => {
        if (stage !== "exiting") return
        const t = setTimeout(() => {
            setStage("done")
            if (SHOW_ONCE_PER_SESSION) sessionStorage.setItem("rht_splash_seen", "1")
        }, EXIT_DURATION)
        return () => clearTimeout(t)
    }, [stage])

    // Lock page scroll while splash is visible
    useEffect(() => {
        document.body.style.overflow = stage === "done" ? "" : "hidden"
        return () => {
            document.body.style.overflow = ""
        }
    }, [stage])

    if (skip === null) return null
    if (skip === true) return <>{children}</>

    const bannerText = "WORLD ASSOCIATION FOR AL-AZHAR GRADUATES".split("")

    return (
        <>
            {children}

            <AnimatePresence>
                {stage !== "done" && (
                    <motion.div
                        className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden"
                        style={{ backgroundColor: NAVY }}
                        exit={{ y: "-100%" }}
                        transition={{ duration: EXIT_DURATION / 1000, ease: [0.76, 0, 0.24, 1] }}
                    >
                        {/* Background subtle noise/grid */}
                        <div
                            className="pointer-events-none absolute inset-0 opacity-[0.03]"
                            style={{
                                backgroundImage:
                                    "repeating-linear-gradient(45deg, #fff, #fff 1px, transparent 1px, transparent 14px)",
                            }}
                            aria-hidden
                        />

                        <AnimatePresence mode="wait">
                            {stage === "loading" && (
                                <motion.div
                                    key="loading"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                                    transition={{ duration: 0.4 }}
                                    className="flex flex-col items-center"
                                >
                                    <div className="relative flex size-32 items-center justify-center">
                                        <svg width="128" height="128" viewBox="0 0 128 128" className="-rotate-90">
                                            <circle
                                                cx="64"
                                                cy="64"
                                                r="58"
                                                fill="none"
                                                stroke="rgba(255,255,255,0.05)"
                                                strokeWidth="2"
                                            />
                                            <motion.circle
                                                cx="64"
                                                cy="64"
                                                r="58"
                                                fill="none"
                                                stroke={ACCENT}
                                                strokeWidth="3"
                                                strokeLinecap="round"
                                                strokeDasharray={2 * Math.PI * 58}
                                                strokeDashoffset={2 * Math.PI * 58 * (1 - progress / 100)}
                                            />
                                        </svg>
                                        <span className="absolute font-mono text-xl font-medium tracking-widest text-white/80">
                                            {progress}%
                                        </span>
                                    </div>
                                    <p className="mt-8 font-sans text-xs uppercase tracking-[0.3em] text-white/40">
                                        Loading Experience
                                    </p>
                                </motion.div>
                            )}

                            {stage === "message" && (
                                <motion.div
                                    key="message"
                                    className="max-w-[90vw] px-4 text-center"
                                >
                                    <h1 className="flex flex-wrap justify-center font-serif text-5xl font-bold leading-none tracking-tighter text-white sm:text-6xl md:text-[6rem] lg:text-[8rem]">
                                        {bannerText.map((char, index) => (
                                            <motion.span
                                                key={index}
                                                initial={{ opacity: 0, y: 100, rotateX: -90 }}
                                                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                                                exit={{ opacity: 0, y: -50 }}
                                                transition={{
                                                    duration: 0.8,
                                                    delay: index * 0.05,
                                                    ease: [0.22, 1, 0.36, 1],
                                                }}
                                                className={char === " " ? "w-4 sm:w-6 md:w-12" : "inline-block origin-bottom"}
                                                style={{ textShadow: "0 10px 30px rgba(0,0,0,0.5)" }}
                                            >
                                                {char}
                                            </motion.span>
                                        ))}
                                    </h1>

                                    <motion.div
                                        initial={{ scaleX: 0, opacity: 0 }}
                                        animate={{ scaleX: 1, opacity: 1 }}
                                        transition={{ delay: 0.8, duration: 1, ease: "circOut" }}
                                        className="mx-auto mt-8 h-[2px] w-full max-w-lg bg-gradient-to-r from-transparent via-accent/50 to-transparent"
                                    />

                                    <motion.p
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 1, duration: 0.6 }}
                                        className="mt-6 font-sans text-xs uppercase tracking-[0.4em] text-white/50 sm:text-sm"
                                    >
                                        Empowering Lives • Shaping Futures
                                    </motion.p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}