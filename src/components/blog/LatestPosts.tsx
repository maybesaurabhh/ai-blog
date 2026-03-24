"use client";

import { motion } from "framer-motion";
import PostCard from "./PostCard";
import type { Post } from "@/types";
import { TAGS } from "@/types";
import { useState } from "react";
import { getTagColor } from "@/lib/utils";

interface LatestPostsProps {
  posts: Post[];
}

export default function LatestPosts({ posts }: LatestPostsProps) {
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const filtered = activeTag ? posts.filter((p) => p.tags.includes(activeTag)) : posts;

  return (
    <section className="py-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-2 mb-3"
          >
            <div className="w-8 h-px bg-neon-purple" />
            <span className="text-xs font-semibold tracking-widest uppercase text-neon-purple">
              Latest
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display font-bold text-3xl sm:text-4xl text-[var(--text-primary)] tracking-tight mb-6"
          >
            Recent Articles
          </motion.h2>

          {/* Tag filter pills */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap gap-2"
          >
            <button
              onClick={() => setActiveTag(null)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 ${
                !activeTag
                  ? "bg-neon-blue/15 text-neon-blue border-neon-blue/30"
                  : "border-[var(--glass-border)] text-[var(--text-secondary)] hover:border-neon-blue/20 hover:text-[var(--text-primary)]"
              }`}
            >
              All
            </button>
            {TAGS.slice(0, 8).map((tag) => {
              const colors = getTagColor(tag);
              const isActive = activeTag === tag;
              return (
                <button
                  key={tag}
                  onClick={() => setActiveTag(isActive ? null : tag)}
                  className="px-4 py-1.5 rounded-full text-xs font-medium border transition-all duration-200"
                  style={
                    isActive
                      ? {
                          background: colors.bg,
                          color: colors.text,
                          borderColor: colors.border,
                        }
                      : {
                          background: "transparent",
                          color: "var(--text-secondary)",
                          borderColor: "var(--glass-border)",
                        }
                  }
                >
                  {tag}
                </button>
              );
            })}
          </motion.div>
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((post, i) => (
              <PostCard key={post.id} post={post} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-[var(--text-secondary)]">
            No posts found for this topic yet.
          </div>
        )}
      </div>
    </section>
  );
}
