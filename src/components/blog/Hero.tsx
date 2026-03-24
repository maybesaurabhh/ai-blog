"use client";

import { useRef, Suspense, lazy } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Sparkles, ChevronDown } from "lucide-react";
import NeuralBackground from "@/components/three/NeuralBackground";

const OrbScene = lazy(() => import("@/components/three/OrbScene"));

const HEADLINE_WORDS = ["Artificial", "Intelligence,", "Decoded."];

const STATS = [
  { label: "Articles Published", value: "120+" },
  { label: "Monthly Readers", value: "40K+" },
  { label: "Expert Authors", value: "12" },
];

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Neural background canvas */}
      <NeuralBackground />

      {/* 3D Orb (right side, desktop) */}
      <div className="absolute right-0 top-0 bottom-0 w-1/2 hidden lg:block">
        <Suspense fallback={null}>
          <OrbScene />
        </Suspense>
      </div>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-primary)] via-transparent to-[var(--bg-primary)] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg-primary)] via-[var(--bg-primary)]/80 to-transparent pointer-events-none lg:block hidden" />

      {/* Ambient glow blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-blue/5 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-neon-purple/5 rounded-full blur-3xl pointer-events-none animate-pulse delay-1000" />

      {/* Content */}
      <motion.div
        style={{ y, opacity }}
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16"
      >
        <div className="max-w-2xl lg:max-w-3xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 glass border border-neon-blue/20 px-4 py-2 rounded-full mb-8"
          >
            <Sparkles className="w-3.5 h-3.5 text-neon-blue" />
            <span className="text-xs font-medium text-neon-blue tracking-widest uppercase">
              AI Intelligence Platform
            </span>
          </motion.div>

          {/* Headline */}
          <div className="overflow-hidden mb-6">
            {HEADLINE_WORDS.map((word, i) => (
              <motion.span
                key={word}
                initial={{ y: "110%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  duration: 0.8,
                  delay: 0.2 + i * 0.12,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={`font-display font-bold text-5xl sm:text-6xl lg:text-7xl tracking-tight block leading-none mb-1 ${
                  i === 0
                    ? "text-[var(--text-primary)]"
                    : i === 1
                    ? "gradient-text"
                    : "text-[var(--text-secondary)]"
                }`}
              >
                {word}
              </motion.span>
            ))}
          </div>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="text-lg sm:text-xl text-[var(--text-secondary)] leading-relaxed mb-10 max-w-xl"
          >
            Research-grade writing on large language models, alignment, compute geopolitics, and the
            systems reshaping what it means to be human.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.75 }}
            className="flex flex-wrap items-center gap-4 mb-16"
          >
            <Link
              href="/blog"
              className="group relative inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-neon-blue text-white font-semibold text-sm btn-glow overflow-hidden hover:shadow-neon-blue transition-all duration-300"
            >
              <span className="relative z-10">Read the Blog</span>
              <ArrowRight className="relative z-10 w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              {/* Hover shine */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 -translate-x-full group-hover:translate-x-full transition-all duration-700" />
            </Link>

            <Link
              href="/blog?tag=AI"
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl glass border border-[var(--glass-border)] text-[var(--text-primary)] font-medium text-sm hover:border-neon-blue/30 hover:text-neon-blue transition-all duration-300"
            >
              Explore AI
              <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="flex items-center gap-8 sm:gap-12"
          >
            {STATS.map((stat, i) => (
              <div key={stat.label} className="flex flex-col">
                <span className="font-display font-bold text-2xl sm:text-3xl gradient-text-blue">
                  {stat.value}
                </span>
                <span className="text-xs text-[var(--text-secondary)] mt-0.5">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[var(--text-secondary)]"
      >
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </motion.div>
    </section>
  );
}
