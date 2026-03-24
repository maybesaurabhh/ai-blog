import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNow, format } from "date-fns";

// ─── Class merger ─────────────────────────────────────────
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ─── Date formatters ──────────────────────────────────────
export function formatDate(date: string): string {
  return format(new Date(date), "MMMM d, yyyy");
}

export function formatDateShort(date: string): string {
  return format(new Date(date), "MMM d, yyyy");
}

export function timeAgo(date: string): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

// ─── Number formatter ─────────────────────────────────────
export function formatViews(views: number): string {
  if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M`;
  if (views >= 1_000) return `${(views / 1_000).toFixed(1)}K`;
  return views.toString();
}

// ─── Tag color mapper ─────────────────────────────────────
const TAG_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  AI: {
    bg: "rgba(79,158,255,0.1)",
    text: "#4f9eff",
    border: "rgba(79,158,255,0.25)",
  },
  "Machine Learning": {
    bg: "rgba(168,85,247,0.1)",
    text: "#a855f7",
    border: "rgba(168,85,247,0.25)",
  },
  LLMs: {
    bg: "rgba(34,211,238,0.1)",
    text: "#22d3ee",
    border: "rgba(34,211,238,0.25)",
  },
  Research: {
    bg: "rgba(251,191,36,0.1)",
    text: "#fbbf24",
    border: "rgba(251,191,36,0.25)",
  },
  Engineering: {
    bg: "rgba(52,211,153,0.1)",
    text: "#34d399",
    border: "rgba(52,211,153,0.25)",
  },
  Cloud: {
    bg: "rgba(96,165,250,0.1)",
    text: "#60a5fa",
    border: "rgba(96,165,250,0.25)",
  },
  Product: {
    bg: "rgba(251,113,133,0.1)",
    text: "#fb7185",
    border: "rgba(251,113,133,0.25)",
  },
  Design: {
    bg: "rgba(251,146,60,0.1)",
    text: "#fb923c",
    border: "rgba(251,146,60,0.25)",
  },
  Robotics: {
    bg: "rgba(129,140,248,0.1)",
    text: "#818cf8",
    border: "rgba(129,140,248,0.25)",
  },
  Web3: {
    bg: "rgba(45,212,191,0.1)",
    text: "#2dd4bf",
    border: "rgba(45,212,191,0.25)",
  },
};

export function getTagColor(tag: string) {
  return (
    TAG_COLORS[tag] || {
      bg: "rgba(161,161,170,0.1)",
      text: "#a1a1aa",
      border: "rgba(161,161,170,0.25)",
    }
  );
}

// ─── Truncate ─────────────────────────────────────────────
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength).trimEnd() + "…";
}

// ─── Random gradient for placeholder images ───────────────
const GRADIENTS = [
  "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
  "linear-gradient(135deg, #000428, #004e92)",
  "linear-gradient(135deg, #16213e, #0f3460, #533483)",
  "linear-gradient(135deg, #0d0d0d, #1a1a2e, #16213e)",
  "linear-gradient(135deg, #020024, #090979, #00d4ff)",
];

export function getRandomGradient(seed: string): string {
  const index = seed.charCodeAt(0) % GRADIENTS.length;
  return GRADIENTS[index];
}

import slugify from "slugify";
export function generateSlug(title: string): string {
  return slugify(title, { lower: true, strict: true });
}
