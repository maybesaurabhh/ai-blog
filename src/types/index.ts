// ─── Post ─────────────────────────────────────────────────
export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string | null;
  author_id: string;
  author_name: string;
  author_avatar: string | null;
  tags: string[];
  published: boolean;
  featured: boolean;
  views: number;
  reading_time: number;
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

// ─── Draft ───────────────────────────────────────────────
export interface Draft extends Omit<Post, "published" | "published_at" | "views"> {
  published: false;
  published_at: null;
}

// ─── User ────────────────────────────────────────────────
export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url: string | null;
  role: "admin" | "author" | "reader";
  created_at: string;
}

// ─── Category/Tag ────────────────────────────────────────
export const TAGS = [
  "AI",
  "Machine Learning",
  "LLMs",
  "Robotics",
  "Web3",
  "Cloud",
  "Engineering",
  "Research",
  "Product",
  "Design",
] as const;

export type Tag = (typeof TAGS)[number];

// ─── UI Types ────────────────────────────────────────────
export interface NavLink {
  label: string;
  href: string;
}

export interface SocialLink {
  name: string;
  href: string;
  icon: string;
}
