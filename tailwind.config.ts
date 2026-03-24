import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
      },
      colors: {
        // Dark theme base
        void: "#040408",
        obsidian: "#0a0a0f",
        carbon: "#0f0f17",
        slate: {
          950: "#0d0d14",
        },
        // Neon accents
        neon: {
          blue: "#4f9eff",
          purple: "#a855f7",
          cyan: "#22d3ee",
          violet: "#7c3aed",
        },
        // Glass surfaces
        glass: {
          white: "rgba(255,255,255,0.05)",
          dark: "rgba(0,0,0,0.4)",
          border: "rgba(255,255,255,0.08)",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-mesh":
          "radial-gradient(at 40% 20%, hsla(228,80%,60%,0.15) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(270,80%,60%,0.1) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(210,80%,50%,0.1) 0px, transparent 50%)",
        "neon-glow":
          "radial-gradient(ellipse at center, rgba(79,158,255,0.15) 0%, transparent 70%)",
      },
      boxShadow: {
        "neon-blue": "0 0 20px rgba(79,158,255,0.3), 0 0 60px rgba(79,158,255,0.1)",
        "neon-purple": "0 0 20px rgba(168,85,247,0.3), 0 0 60px rgba(168,85,247,0.1)",
        "glass": "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
        "card-hover": "0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(79,158,255,0.08)",
      },
      animation: {
        "gradient-shift": "gradient-shift 8s ease infinite",
        "float": "float 6s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
        "scan": "scan 3s linear infinite",
      },
      keyframes: {
        "gradient-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
        "shimmer": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        "scan": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "none",
          },
        },
      },
    },
  },
  plugins: [],
};

export default config;
