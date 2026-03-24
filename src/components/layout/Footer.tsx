"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Zap, Github, Twitter, Rss } from "lucide-react";

const FOOTER_LINKS = {
  Content: [
    { label: "Blog", href: "/blog" },
    { label: "AI", href: "/blog?tag=AI" },
    { label: "Machine Learning", href: "/blog?tag=Machine+Learning" },
    { label: "Engineering", href: "/blog?tag=Engineering" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Newsletter", href: "/newsletter" },
    { label: "RSS Feed", href: "/rss.xml" },
    { label: "Admin", href: "/admin" },
  ],
};

const SOCIAL_LINKS = [
  { icon: Github, href: "https://github.com", label: "GitHub" },
  { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
  { icon: Rss, href: "/rss.xml", label: "RSS" },
];

export default function Footer() {
  return (
    <footer className="relative mt-32 border-t border-[var(--glass-border)]">
      {/* Glow line top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-neon-blue/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-16">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4 group w-fit">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center glow-blue">
                <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
              <span className="font-display font-bold text-xl tracking-tight">Synapse</span>
            </Link>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-sm">
              Deep intelligence on artificial intelligence. Research-grade writing on LLMs,
              compute, alignment, and the technologies reshaping civilization.
            </p>
            <div className="flex items-center gap-3 mt-6">
              {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 flex items-center justify-center rounded-lg glass border border-[var(--glass-border)] text-[var(--text-secondary)] hover:text-neon-blue hover:border-neon-blue/30 transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section}>
              <h3 className="text-xs font-semibold tracking-widest uppercase text-[var(--text-secondary)] mb-4">
                {section}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-[var(--glass-border)] gap-4">
          <p className="text-xs text-[var(--text-secondary)]">
            © {new Date().getFullYear()} Synapse. All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-xs text-[var(--text-secondary)]">
            <span>Built with</span>
            <span className="text-neon-blue mx-1">Next.js</span>
            <span>&</span>
            <span className="text-neon-purple ml-1">Supabase</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
