import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ReadingProgress from "@/components/blog/ReadingProgress";
import PostContent from "@/components/blog/PostContent";
import { MOCK_POSTS } from "@/lib/posts";
import { formatDate, getTagColor, getRandomGradient, formatViews } from "@/lib/utils";
import { JsonLd, articleSchema, breadcrumbSchema } from "@/lib/seo";
import { ArrowLeft, Clock, Eye, Calendar } from "lucide-react";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

interface PageProps {
  params: { slug: string };
}

// Static params for SSG at build time
export async function generateStaticParams() {
  return MOCK_POSTS.filter((p) => p.published).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = MOCK_POSTS.find((p) => p.slug === params.slug);
  if (!post) return { title: "Post Not Found" };

  const url = `${BASE_URL}/blog/${post.slug}`;
  const publishedDate = post.published_at || post.created_at;

  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.tags,
    authors: [{ name: post.author_name }],
    // Canonical URL
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: post.title,
      description: post.excerpt,
      siteName: "Synapse",
      locale: "en_US",
      publishedTime: publishedDate,
      modifiedTime: post.updated_at,
      authors: [post.author_name],
      tags: post.tags,
      ...(post.cover_image && {
        images: [{ url: post.cover_image, width: 1200, height: 630, alt: post.title }],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      site: "@synapseblog",
      creator: "@synapseblog",
    },
    other: {
      "article:published_time": publishedDate,
      "article:modified_time": post.updated_at,
      "article:author": post.author_name,
      "article:section": post.tags[0] || "Technology",
      "article:tag": post.tags.join(", "),
    },
  };
}

export default function BlogPostPage({ params }: PageProps) {
  const post = MOCK_POSTS.find((p) => p.slug === params.slug);
  if (!post) notFound();

  const related = MOCK_POSTS.filter(
    (p) => p.id !== post.id && p.tags.some((t) => post.tags.includes(t))
  ).slice(0, 3);

  const gradient = getRandomGradient(post.id);

  const breadcrumbs = [
    { name: "Home", url: BASE_URL },
    { name: "Blog", url: `${BASE_URL}/blog` },
    { name: post.title, url: `${BASE_URL}/blog/${post.slug}` },
  ];

  return (
    <main className="min-h-screen bg-[var(--bg-primary)]">
      <JsonLd data={[articleSchema(post), breadcrumbSchema(breadcrumbs)]} />
      <ReadingProgress />
      <Navbar />

      {/* Cover Hero */}
      <section className="relative pt-20">
        <div className="relative h-[50vh] min-h-[320px] max-h-[520px] overflow-hidden">
          {post.cover_image ? (
            <Image
              src={post.cover_image}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full" style={{ background: gradient }} />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-[var(--bg-primary)]/40 to-transparent" />
        </div>

        {/* Back link */}
        <div className="absolute top-28 left-4 sm:left-8 z-10">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg glass border border-[var(--glass-border)] text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all duration-200 backdrop-blur-md"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
        </div>
      </section>

      {/* Article */}
      <article className="relative max-w-3xl mx-auto px-4 sm:px-6 -mt-16 pb-24">
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {post.tags.map((tag) => {
            const colors = getTagColor(tag);
            return (
              <Link
                key={tag}
                href={`/blog?tag=${encodeURIComponent(tag)}`}
                className="text-xs font-medium px-3 py-1 rounded-full border transition-all duration-200 hover:scale-105"
                style={{
                  background: colors.bg,
                  color: colors.text,
                  borderColor: colors.border,
                }}
              >
                {tag}
              </Link>
            );
          })}
        </div>

        {/* Title */}
        <h1 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-[var(--text-primary)] tracking-tight leading-tight mb-6">
          {post.title}
        </h1>

        {/* Excerpt */}
        <p className="text-lg sm:text-xl text-[var(--text-secondary)] leading-relaxed mb-8 border-l-2 border-neon-blue/40 pl-4">
          {post.excerpt}
        </p>

        {/* Meta bar */}
        <div className="flex flex-wrap items-center gap-4 pb-8 mb-8 border-b border-[var(--glass-border)]">
          {/* Author */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center text-white text-sm font-bold">
              {post.author_name[0]}
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--text-primary)]">{post.author_name}</p>
              <p className="text-xs text-[var(--text-secondary)]">Author</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-[var(--text-secondary)] ml-auto">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(post.published_at || post.created_at)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {post.reading_time} min read
            </span>
            <span className="flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5" />
              {formatViews(post.views)}
            </span>
          </div>
        </div>

        {/* Content */}
        <PostContent content={post.content} />
      </article>

      {/* Related Posts */}
      {related.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
          <div className="border-t border-[var(--glass-border)] pt-16">
            <h2 className="font-display font-bold text-2xl text-[var(--text-primary)] mb-8">
              Related Articles
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {related.map((rpost) => {
                const rGradient = getRandomGradient(rpost.id);
                return (
                  <Link
                    key={rpost.id}
                    href={`/blog/${rpost.slug}`}
                    className="group glass border border-[var(--glass-border)] rounded-xl overflow-hidden hover:border-neon-blue/25 card-hover"
                  >
                    <div className="relative aspect-[16/9] overflow-hidden">
                      {rpost.cover_image ? (
                        <Image src={rpost.cover_image} alt={rpost.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full" style={{ background: rGradient }} />
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-display font-semibold text-sm text-[var(--text-primary)] group-hover:text-neon-blue transition-colors duration-200 line-clamp-2">
                        {rpost.title}
                      </h3>
                      <p className="text-xs text-[var(--text-secondary)] mt-1">{rpost.reading_time} min read</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}
