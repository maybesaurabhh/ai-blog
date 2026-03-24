import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PostCard from "@/components/blog/PostCard";
import { JsonLd, blogSchema, breadcrumbSchema } from "@/lib/seo";
import { MOCK_POSTS } from "@/lib/posts";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "All articles on artificial intelligence, machine learning, LLMs, and the future of technology. Written by researchers, engineers, and founders.",
  alternates: {
    canonical: `${BASE_URL}/blog`,
    types: { "application/rss+xml": [{ url: `${BASE_URL}/rss.xml`, title: "Synapse RSS" }] },
  },
  openGraph: {
    title: "Synapse Blog — AI & Technology",
    description: "All articles on AI, machine learning, and the future of technology.",
    url: `${BASE_URL}/blog`,
    type: "website",
  },
};

export default function BlogPage() {
  const posts = MOCK_POSTS;
  const breadcrumbs = [
    { name: "Home", url: BASE_URL },
    { name: "Blog", url: `${BASE_URL}/blog` },
  ];

  return (
    <main className="min-h-screen bg-[var(--bg-primary)]">
      <JsonLd data={[blogSchema(posts), breadcrumbSchema(breadcrumbs)]} />
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-mesh opacity-30 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-neon-blue/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-px bg-neon-blue" />
              <span className="text-xs font-semibold tracking-widest uppercase text-neon-blue">
                The Blog
              </span>
            </div>
            <h1 className="font-display font-bold text-4xl sm:text-5xl text-[var(--text-primary)] tracking-tight mb-4">
              All Articles
            </h1>
            <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
              Deep explorations of artificial intelligence, distributed systems, and the technologies
              shaping our future.
            </p>
          </div>
        </div>
      </section>

      {/* Posts grid */}
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {posts.map((post, i) => (
              <PostCard key={post.id} post={post} index={i} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
