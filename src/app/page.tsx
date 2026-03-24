import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/blog/Hero";
import FeaturedPosts from "@/components/blog/FeaturedPosts";
import LatestPosts from "@/components/blog/LatestPosts";
import NewsletterCTA from "@/components/blog/NewsletterCTA";
import { MOCK_POSTS } from "@/lib/posts";

export default async function HomePage() {
  // In production, replace with: const allPosts = await getPosts();
  const allPosts = MOCK_POSTS;
  const featuredPosts = allPosts.filter((p) => p.featured);
  const latestPosts = allPosts.filter((p) => !p.featured);

  return (
    <main className="relative min-h-screen bg-[var(--bg-primary)]">
      <Navbar />
      <Hero />
      <FeaturedPosts posts={featuredPosts} />
      <LatestPosts posts={latestPosts} />
      <NewsletterCTA />
      <Footer />
    </main>
  );
}
