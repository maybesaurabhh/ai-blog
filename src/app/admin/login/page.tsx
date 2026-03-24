"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Zap, Eye, EyeOff, Lock, Mail, AlertCircle } from "lucide-react";
import { createBrowserClient } from "@/lib/supabase";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const supabase = createBrowserClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message);
      } else {
        router.push("/admin");
        router.refresh();
      }
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-mesh opacity-20 pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-neon-blue/5 rounded-full blur-3xl" />

      {/* Back to site */}
      <Link
        href="/"
        className="absolute top-6 left-6 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors flex items-center gap-1"
      >
        ← Synapse
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-neon-blue to-neon-purple glow-blue mb-4">
            <Zap className="w-7 h-7 text-white" strokeWidth={2.5} />
          </div>
          <h1 className="font-display font-bold text-2xl text-[var(--text-primary)] tracking-tight">
            Admin Portal
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Sign in to manage Synapse content
          </p>
        </div>

        {/* Card */}
        <div className="glass border border-[var(--glass-border)] rounded-2xl p-8 shadow-glass">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-blue/30 to-transparent rounded-t-2xl" />

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2.5 p-3 mb-5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div>
              <label className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider mb-2 block">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/50 text-sm focus:outline-none focus:border-neon-blue/40 transition-all duration-200"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider mb-2 block">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-12 py-3 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/50 text-sm focus:outline-none focus:border-neon-blue/40 transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-neon-blue text-white font-semibold text-sm hover:shadow-neon-blue transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-[var(--text-secondary)] mt-6">
          This area is restricted to authorized administrators only.
        </p>
      </motion.div>
    </div>
  );
}
