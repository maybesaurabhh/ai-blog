"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Clock, Eye, ArrowUpRight } from "lucide-react";
import { formatDateShort, formatViews, getTagColor, getRandomGradient, cn } from "@/lib/utils";
import type { Post } from "@/types";

interface PostCardProps {
  post: Post;
  index?: number;
  featured?: boolean;
}

export default function PostCard({ post, index = 0, featured = false }: PostCardProps) {
  const gradient = getRandomGradient(post.id);

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "group relative glass border border-[var(--glass-border)] rounded-2xl overflow-hidden card-hover",
        "hover:border-neon-blue/25 hover:shadow-card-hover",
        featured && "lg:col-span-2"
      )}
    >
      {/* Glow on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-blue/40 to-transparent" />
      </div>

      {/* Cover image */}
      <div
        className={cn(
          "relative overflow-hidden",
          featured ? "aspect-[16/7]" : "aspect-[16/9]"
        )}
      >
        {post.cover_image ? (
          <Image
            src={post.cover_image}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes={featured ? "(max-width: 768px) 100vw, 66vw" : "(max-width: 768px) 100vw, 33vw"}
          />
        ) : (
          <div className="w-full h-full" style={{ background: gradient }} />
        )}
        {/* Image overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-secondary)] via-transparent to-transparent opacity-60" />

        {/* Featured badge */}
        {post.featured && (
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold glass border border-neon-blue/30 text-neon-blue backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-neon-blue animate-pulse" />
              Featured
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 sm:p-6">
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-3">
          {post.tags.slice(0, 2).map((tag) => {
            const colors = getTagColor(tag);
            return (
              <span
                key={tag}
                className="text-xs font-medium px-2.5 py-0.5 rounded-full border"
                style={{
                  background: colors.bg,
                  color: colors.text,
                  borderColor: colors.border,
                }}
              >
                {tag}
              </span>
            );
          })}
        </div>

        {/* Title */}
        <h2
          className={cn(
            "font-display font-bold text-[var(--text-primary)] leading-tight mb-3 group-hover:text-neon-blue transition-colors duration-300",
            featured ? "text-xl sm:text-2xl" : "text-lg"
          )}
        >
          <Link href={`/blog/${post.slug}`} className="stretched-link">
            {post.title}
          </Link>
        </h2>

        {/* Excerpt */}
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-5 line-clamp-2">
          {post.excerpt}
        </p>

        {/* Meta */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-[var(--text-secondary)]">
            <span className="font-medium text-[var(--text-primary)]">{post.author_name}</span>
            <span className="w-1 h-1 rounded-full bg-[var(--text-secondary)]" />
            <span>{formatDateShort(post.published_at || post.created_at)}</span>
          </div>

          <div className="flex items-center gap-3 text-xs text-[var(--text-secondary)]">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {post.reading_time}m
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {formatViews(post.views)}
            </span>
          </div>
        </div>
      </div>

      {/* Read more arrow */}
      <div className="absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
        <div className="w-8 h-8 rounded-full bg-neon-blue/15 border border-neon-blue/30 flex items-center justify-center">
          <ArrowUpRight className="w-4 h-4 text-neon-blue" />
        </div>
      </div>
    </motion.article>
  );
}
