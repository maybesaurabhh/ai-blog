"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Zap, Send, CheckCircle } from "lucide-react";

export default function NewsletterCTA() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setSubmitted(true);
    setLoading(false);
  };

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-neon-blue/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-neon-purple/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative glass border border-[var(--glass-border)] rounded-3xl p-8 sm:p-12 lg:p-16 overflow-hidden neon-border"
        >
          {/* Scan line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-blue/40 to-transparent" />

          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-neon-blue/10 border border-neon-blue/20 mb-6 mx-auto">
              <Zap className="w-6 h-6 text-neon-blue" />
            </div>

            <h2 className="font-display font-bold text-3xl sm:text-4xl text-[var(--text-primary)] tracking-tight mb-4">
              Stay ahead of the{" "}
              <span className="gradient-text">AI frontier</span>
            </h2>

            <p className="text-[var(--text-secondary)] text-lg mb-8 leading-relaxed">
              Get the most important AI research, startup news, and engineering insights delivered
              to your inbox. No noise — only signal.
            </p>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-center gap-3 text-neon-blue font-medium"
              >
                <CheckCircle className="w-5 h-5" />
                <span>You&apos;re on the list! Welcome to Synapse.</span>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="flex-1 px-4 py-3 rounded-xl glass border border-[var(--glass-border)] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] text-sm focus:outline-none focus:border-neon-blue/40 focus:shadow-neon-blue transition-all duration-200"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="group flex items-center justify-center gap-2 px-6 py-3 bg-neon-blue text-white font-semibold text-sm rounded-xl hover:shadow-neon-blue transition-all duration-300 disabled:opacity-60"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Subscribe
                      <Send className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                    </>
                  )}
                </button>
              </form>
            )}

            <p className="mt-4 text-xs text-[var(--text-secondary)]">
              Join 40,000+ AI researchers, engineers & founders. Unsubscribe anytime.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
