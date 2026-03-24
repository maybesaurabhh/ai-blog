"use client";

import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { cn } from "@/lib/utils";

interface PostContentProps {
  content: string;
}

export default function PostContent({ content }: PostContentProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="prose prose-lg max-w-none
        prose-headings:font-display prose-headings:font-bold prose-headings:text-[var(--text-primary)] prose-headings:tracking-tight
        prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
        prose-h2:mt-12 prose-h2:mb-6 prose-h2:pb-3 prose-h2:border-b prose-h2:border-[var(--glass-border)]
        prose-p:text-[var(--text-secondary)] prose-p:leading-relaxed prose-p:text-base
        prose-a:text-neon-blue prose-a:no-underline prose-a:border-b prose-a:border-neon-blue/30 hover:prose-a:border-neon-blue
        prose-strong:text-[var(--text-primary)] prose-strong:font-semibold
        prose-blockquote:border-l-2 prose-blockquote:border-neon-blue/40 prose-blockquote:pl-4 prose-blockquote:text-[var(--text-secondary)] prose-blockquote:not-italic
        prose-ul:text-[var(--text-secondary)] prose-ol:text-[var(--text-secondary)]
        prose-li:my-1
        prose-hr:border-[var(--glass-border)]
        prose-img:rounded-xl
        dark:prose-invert
      "
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          h2: ({ children, ...props }) => (
            <h2 {...props} className="group flex items-center gap-2">
              {children}
            </h2>
          ),
          pre: ({ children, ...props }) => (
            <pre
              {...props}
              className="relative rounded-xl overflow-x-auto bg-[#0a0a0f] border border-[var(--glass-border)] p-5 text-sm"
            >
              {children}
            </pre>
          ),
          blockquote: ({ children, ...props }) => (
            <blockquote
              {...props}
              className="border-l-2 border-neon-blue/40 pl-5 py-1 text-[var(--text-secondary)] italic my-6 bg-neon-blue/3 rounded-r-lg"
            >
              {children}
            </blockquote>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </motion.div>
  );
}
