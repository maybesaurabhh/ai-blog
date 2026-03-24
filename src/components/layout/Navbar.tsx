"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { Menu, X, Zap, Sun, Moon, Search } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Blog", href: "/blog" },
  { label: "Topics", href: "/blog?view=topics" },
  { label: "About", href: "/about" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          scrolled
            ? "glass-strong py-3 border-b border-[var(--glass-border)]"
            : "py-5 bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center glow-blue transition-all duration-300 group-hover:scale-110">
                  <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
                </div>
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-neon-blue to-neon-purple opacity-0 group-hover:opacity-30 blur-lg transition-opacity duration-300" />
              </div>
              <span className="font-display font-bold text-xl tracking-tight text-[var(--text-primary)]">
                Synapse
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => {
                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href.split("?")[0]);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                      isActive
                        ? "text-neon-blue"
                        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute inset-0 rounded-lg bg-neon-blue/10 border border-neon-blue/20"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                      />
                    )}
                    <span className="relative z-10">{link.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <Link
                href="/blog?search=true"
                className="hidden sm:flex w-9 h-9 items-center justify-center rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--glass-bg)] transition-all duration-200"
              >
                <Search className="w-4 h-4" />
              </Link>

              {/* Theme toggle */}
              {mounted && (
                <button
                  onClick={toggleTheme}
                  className="w-9 h-9 flex items-center justify-center rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--glass-bg)] transition-all duration-200"
                  aria-label="Toggle theme"
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={theme}
                      initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                      animate={{ rotate: 0, opacity: 1, scale: 1 }}
                      exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                      transition={{ duration: 0.2 }}
                    >
                      {theme === "dark" ? (
                        <Sun className="w-4 h-4" />
                      ) : (
                        <Moon className="w-4 h-4" />
                      )}
                    </motion.div>
                  </AnimatePresence>
                </button>
              )}

              {/* Admin link (subtle) */}
              <Link
                href="/admin"
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg glass border border-[var(--glass-border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-neon-blue/30 transition-all duration-200"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-neon-blue animate-pulse" />
                Admin
              </Link>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--glass-bg)] transition-all duration-200"
                aria-label="Toggle menu"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={mobileOpen ? "close" : "open"}
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                  </motion.div>
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 left-4 right-4 z-40 glass-strong rounded-2xl border border-[var(--glass-border)] p-4 md:hidden"
          >
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "block px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                      pathname === link.href
                        ? "bg-neon-blue/10 text-neon-blue border border-neon-blue/20"
                        : "text-[var(--text-secondary)] hover:bg-[var(--glass-bg)] hover:text-[var(--text-primary)]"
                    )}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <div className="pt-2 mt-2 border-t border-[var(--glass-border)]">
                <Link
                  href="/admin"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--glass-bg)] hover:text-[var(--text-primary)] transition-all duration-200"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-neon-blue animate-pulse" />
                  Admin Panel
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
