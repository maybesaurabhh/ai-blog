import { supabaseServer } from "./supabase";
import type { Post } from "@/types";
import readingTime from "reading-time";
import slugify from "slugify";

// ─── Fetch all published posts ────────────────────────────
export async function getPosts(limit?: number): Promise<Post[]> {
  let query = supabaseServer
    .from("posts")
    .select("*")
    .eq("published", true)
    .order("published_at", { ascending: false });

  if (limit) query = query.limit(limit);

  const { data, error } = await query;
  if (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
  return data as Post[];
}

// ─── Fetch featured posts ─────────────────────────────────
export async function getFeaturedPosts(): Promise<Post[]> {
  const { data, error } = await supabaseServer
    .from("posts")
    .select("*")
    .eq("published", true)
    .eq("featured", true)
    .order("published_at", { ascending: false })
    .limit(3);

  if (error) return [];
  return data as Post[];
}

// ─── Fetch single post by slug ────────────────────────────
export async function getPostBySlug(slug: string): Promise<Post | null> {
  const { data, error } = await supabaseServer
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (error) return null;
  return data as Post;
}

// ─── Fetch posts by tag ───────────────────────────────────
export async function getPostsByTag(tag: string): Promise<Post[]> {
  const { data, error } = await supabaseServer
    .from("posts")
    .select("*")
    .eq("published", true)
    .contains("tags", [tag])
    .order("published_at", { ascending: false });

  if (error) return [];
  return data as Post[];
}

// ─── Search posts ─────────────────────────────────────────
export async function searchPosts(query: string): Promise<Post[]> {
  const { data, error } = await supabaseServer
    .from("posts")
    .select("*")
    .eq("published", true)
    .or(`title.ilike.%${query}%,excerpt.ilike.%${query}%`)
    .order("published_at", { ascending: false })
    .limit(10);

  if (error) return [];
  return data as Post[];
}

// ─── Increment view count ─────────────────────────────────
export async function incrementViews(postId: string): Promise<void> {
  await supabaseServer.rpc("increment_post_views", { post_id: postId });
}

// ─── Generate unique slug ─────────────────────────────────
export function generateSlug(title: string): string {
  return slugify(title, { lower: true, strict: true });
}

// ─── Calculate reading time ───────────────────────────────
export function calcReadingTime(content: string): number {
  const stats = readingTime(content);
  return Math.ceil(stats.minutes);
}

// ─── Admin: Get all posts (including drafts) ──────────────
export async function getAllPostsAdmin(client: ReturnType<typeof import("./supabase").createBrowserClient>): Promise<Post[]> {
  const { data, error } = await client
    .from("posts")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) return [];
  return data as Post[];
}

// ─── Admin: Create post ───────────────────────────────────
export async function createPost(
  post: Partial<Post>,
  client: ReturnType<typeof import("./supabase").createBrowserClient>
): Promise<Post | null> {
  const slug = generateSlug(post.title || "untitled");
  const readTime = calcReadingTime(post.content || "");

  const { data, error } = await client
    .from("posts")
    .insert([
      {
        ...post,
        slug,
        reading_time: readTime,
        published_at: post.published ? new Date().toISOString() : null,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Create post error:", error);
    return null;
  }
  return data as Post;
}

// ─── Admin: Update post ───────────────────────────────────
export async function updatePost(
  id: string,
  updates: Partial<Post>,
  client: ReturnType<typeof import("./supabase").createBrowserClient>
): Promise<Post | null> {
  const readTime = updates.content ? calcReadingTime(updates.content) : undefined;

  const { data, error } = await client
    .from("posts")
    .update({
      ...updates,
      ...(readTime && { reading_time: readTime }),
      updated_at: new Date().toISOString(),
      ...(updates.published && { published_at: new Date().toISOString() }),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Update post error:", error);
    return null;
  }
  return data as Post;
}

// ─── Admin: Delete post ───────────────────────────────────
export async function deletePost(
  id: string,
  client: ReturnType<typeof import("./supabase").createBrowserClient>
): Promise<boolean> {
  const { error } = await client.from("posts").delete().eq("id", id);
  return !error;
}

// ─── Mock posts for development (when Supabase not set up) ─
export const MOCK_POSTS: Post[] = [
  {
    id: "1",
    title: "The Dawn of AGI: What Happens After We Cross the Threshold",
    slug: "dawn-of-agi-threshold",
    excerpt:
      "We are approaching a moment that will redefine civilization itself. As large language models evolve into reasoning systems, the question is no longer if — but when.",
    content: `# The Dawn of AGI\n\nArtificial General Intelligence represents...\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.\n\n## The Path Forward\n\nResearchers at leading labs are making unprecedented progress...\n\n\`\`\`python\n# Neural network architecture example\nimport torch\nimport torch.nn as nn\n\nclass TransformerBlock(nn.Module):\n    def __init__(self, d_model, n_heads):\n        super().__init__()\n        self.attention = nn.MultiheadAttention(d_model, n_heads)\n        self.norm = nn.LayerNorm(d_model)\n\`\`\`\n\nThe implications are profound and far-reaching.`,
    cover_image: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1200&q=80",
    author_id: "1",
    author_name: "Alex Chen",
    author_avatar: null,
    tags: ["AI", "Research", "Machine Learning"],
    published: true,
    featured: true,
    views: 12847,
    reading_time: 8,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    published_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
  {
    id: "2",
    title: "Inside Anthropic's Interpretability Research: Making AI Understandable",
    slug: "anthropic-interpretability-research",
    excerpt:
      "Mechanistic interpretability is unlocking what's happening inside the black box. Here's what researchers have found — and why it matters for alignment.",
    content: `# Interpretability Research\n\nUnderstanding what happens inside neural networks...`,
    cover_image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&q=80",
    author_id: "1",
    author_name: "Sarah Mitchell",
    author_avatar: null,
    tags: ["AI", "Research", "LLMs"],
    published: true,
    featured: true,
    views: 9423,
    reading_time: 6,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    published_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
  },
  {
    id: "3",
    title: "Building Realtime AI Systems at Scale: Architecture Patterns",
    slug: "realtime-ai-systems-architecture",
    excerpt:
      "From streaming inference to sub-100ms response latency — the engineering patterns powering production AI applications in 2025.",
    content: `# Realtime AI Architecture\n\nBuilding systems that respond in milliseconds...`,
    cover_image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&q=80",
    author_id: "1",
    author_name: "James Park",
    author_avatar: null,
    tags: ["Engineering", "Cloud", "AI"],
    published: true,
    featured: true,
    views: 7651,
    reading_time: 10,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    published_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
  },
  {
    id: "4",
    title: "The Economics of Compute: Why GPU Clusters Are the New Oil Fields",
    slug: "economics-of-compute-gpu-clusters",
    excerpt:
      "Nations and corporations are racing to secure compute. Understanding this geopolitical shift is key to predicting where AI goes next.",
    content: `# The Compute Economy\n\nThe race for GPU clusters mirrors historical resource wars...`,
    cover_image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80",
    author_id: "1",
    author_name: "Maya Rodriguez",
    author_avatar: null,
    tags: ["Cloud", "Engineering", "Product"],
    published: true,
    featured: false,
    views: 5230,
    reading_time: 7,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    published_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
  },
  {
    id: "5",
    title: "Designing Human-AI Interfaces: Principles for the Next Decade",
    slug: "human-ai-interface-design",
    excerpt:
      "As AI becomes conversational, ambient, and autonomous — the rules of interface design must evolve. Here's a framework for thinking about it.",
    content: `# Human-AI Interface Design\n\nThe principles guiding next-gen AI UX...`,
    cover_image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&q=80",
    author_id: "1",
    author_name: "Olivia Kim",
    author_avatar: null,
    tags: ["Design", "AI", "Product"],
    published: true,
    featured: false,
    views: 4118,
    reading_time: 5,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
    published_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
  },
  {
    id: "6",
    title: "Multimodal Models Are Eating the World",
    slug: "multimodal-models-are-eating-the-world",
    excerpt:
      "Text, image, audio, video — modern AI now reasons across all modalities simultaneously. The implications for software are staggering.",
    content: `# Multimodal AI\n\nThe convergence of modalities is reshaping software...`,
    cover_image: "https://images.unsplash.com/photo-1676299081847-824916de030a?w=1200&q=80",
    author_id: "1",
    author_name: "David Nakamura",
    author_avatar: null,
    tags: ["AI", "LLMs", "Machine Learning"],
    published: true,
    featured: false,
    views: 6780,
    reading_time: 9,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 18).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 18).toISOString(),
    published_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 18).toISOString(),
  },
];
