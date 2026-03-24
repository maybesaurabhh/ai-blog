"use client";

import { motion } from "framer-motion";
import PostCard from "./PostCard";
import type { Post } from "@/types";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface FeaturedPostsProps {
  posts: Post[];
}

export default function FeaturedPosts({ posts }: FeaturedPostsProps) {
  if (!posts.length) return null;

  return (
    <section className="py-24 relative">
      {/* Section separator */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-16 bg-gradient-to-b from-transparent to-neon-blue/30" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-2 mb-3"
            >
              <div className="w-8 h-px bg-neon-blue" />
              <span className="text-xs font-semibold tracking-widest uppercase text-neon-blue">
                Featured
              </span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display font-bold text-3xl sm:text-4xl text-[var(--text-primary)] tracking-tight"
            >
              Editor&apos;s Picks
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <Link
              href="/blog"
              className="group hidden sm:flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] hover:text-neon-blue transition-colors duration-200"
            >
              View all posts
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </motion.div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {posts.slice(0, 3).map((post, i) => (
            <PostCard key={post.id} post={post} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
