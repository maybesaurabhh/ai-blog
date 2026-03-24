"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { motion } from "framer-motion";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      aria-label="Breadcrumb"
      className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)] mb-6 flex-wrap"
    >
      <Link
        href="/"
        className="flex items-center gap-1 hover:text-neon-blue transition-colors duration-200"
      >
        <Home className="w-3 h-3" />
        Home
      </Link>

      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <ChevronRight className="w-3 h-3 opacity-40" />
          {item.href && i < items.length - 1 ? (
            <Link
              href={item.href}
              className="hover:text-neon-blue transition-colors duration-200"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-[var(--text-primary)] font-medium line-clamp-1 max-w-[280px]">
              {item.label}
            </span>
          )}
        </span>
      ))}
    </motion.nav>
  );
}
