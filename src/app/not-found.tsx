import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 — Page Not Found",
  description: "This page could not be found.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[var(--bg-primary)] flex flex-col items-center justify-center px-4 text-center">
      {/* Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-neon-blue/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        <p className="text-8xl font-display font-black gradient-text mb-2">404</p>
        <h1 className="text-2xl font-display font-bold text-[var(--text-primary)] mb-4 tracking-tight">
          Page Not Found
        </h1>
        <p className="text-[var(--text-secondary)] mb-8 max-w-sm">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            href="/"
            className="px-5 py-2.5 rounded-xl bg-neon-blue text-white text-sm font-semibold hover:shadow-neon-blue transition-all duration-300"
          >
            Go Home
          </Link>
          <Link
            href="/blog"
            className="px-5 py-2.5 rounded-xl glass border border-[var(--glass-border)] text-sm font-medium text-[var(--text-primary)] hover:border-neon-blue/30 transition-all duration-300"
          >
            Read the Blog
          </Link>
        </div>
      </div>
    </main>
  );
}
