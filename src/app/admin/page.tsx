"use client";
import { createBrowserClient } from "@/lib/supabase";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  LogOut,
  Eye,
  Clock,
  TrendingUp,
  Zap,
  Edit,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Settings,
  ChevronRight,
} from "lucide-react";
import { MOCK_POSTS } from "@/lib/posts";
import { formatDateShort, formatViews, getTagColor } from "@/lib/utils";
import type { Post } from "@/types";
import { useRouter } from "next/navigation";

const STATS = [
  { label: "Total Posts", icon: FileText, value: "24", change: "+3 this month", color: "#4f9eff" },
  { label: "Total Views", icon: Eye, value: "94.2K", change: "+12% this week", color: "#a855f7" },
  { label: "Avg. Read Time", icon: Clock, value: "7.4m", change: "Across all posts", color: "#22d3ee" },
  { label: "Top Performing", icon: TrendingUp, value: "12.8K", change: "AGI article views", color: "#34d399" },
];

export default function AdminDashboard() {
  const router = useRouter();
  const supabase = createBrowserClient(); // Initialized Supabase client
  
  // Start with empty array instead of MOCK_POSTS
  const [posts, setPosts] = useState<Post[]>([]); 
  const [activeTab, setActiveTab] = useState<"all" | "published" | "drafts">("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Updated useEffect to handle Auth AND fetch real data
  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.replace("/admin/login");
        return;
      }

      // Fetch real data from your Supabase 'posts' table
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('updated_at', { ascending: false });

      if (data) setPosts(data);
      if (error) console.error("Error fetching posts:", error);
    };

    checkAuthAndFetchData();
  }, [router, supabase]);

  const filteredPosts =
    activeTab === "published"
      ? posts.filter((p) => p.published)
      : activeTab === "drafts"
      ? posts.filter((p) => !p.published)
      : posts;

  // Updated handleDelete to remove from Supabase database
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this post? This cannot be undone.")) return;

    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id);

    if (error) {
      alert("Error deleting: " + error.message);
    } else {
      setPosts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  // Updated handleTogglePublish to update Supabase database
  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;

    const { error } = await supabase
      .from('posts')
      .update({ published: newStatus })
      .eq('id', id);

    if (error) {
      alert("Error updating status: " + error.message);
    } else {
      setPosts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, published: newStatus } : p))
      );
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 hidden lg:flex flex-col glass-strong border-r border-[var(--glass-border)] fixed top-0 bottom-0 left-0 z-30">
        {/* Logo */}
        <div className="p-6 border-b border-[var(--glass-border)]">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center glow-blue">
              <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <span className="font-display font-bold text-base tracking-tight block">Synapse</span>
              <span className="text-xs text-[var(--text-secondary)]">Admin Panel</span>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {[
            { icon: LayoutDashboard, label: "Dashboard", href: "/admin", active: true },
            { icon: FileText, label: "All Posts", href: "/admin" },
            { icon: PlusCircle, label: "New Post", href: "/admin/posts/new" },
            { icon: Settings, label: "Settings", href: "/admin/settings" },
          ].map(({ icon: Icon, label, href, active }) => (
            <Link
              key={label}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                active
                  ? "bg-neon-blue/10 text-neon-blue border border-neon-blue/20"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--glass-bg)]"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
        </nav>

        {/* Bottom */}
        <div className="p-4 border-t border-[var(--glass-border)]">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--glass-bg)] transition-all duration-200"
          >
            <Eye className="w-4 h-4" />
            View Site
          </Link>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all duration-200 mt-1">
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 lg:ml-64 p-6 lg:p-8">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display font-bold text-2xl text-[var(--text-primary)] tracking-tight">
              Dashboard
            </h1>
            <p className="text-sm text-[var(--text-secondary)] mt-0.5">
              Welcome back — here's what's happening
            </p>
          </div>
          <Link
            href="/admin/posts/new"
            className="flex items-center gap-2 px-4 py-2.5 bg-neon-blue text-white text-sm font-semibold rounded-xl hover:shadow-neon-blue transition-all duration-300"
          >
            <PlusCircle className="w-4 h-4" />
            New Post
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="glass border border-[var(--glass-border)] rounded-xl p-5 hover:border-[rgba(79,158,255,0.2)] transition-all duration-300"
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
                style={{ background: `${stat.color}15`, border: `1px solid ${stat.color}25` }}
              >
                <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
              </div>
              <div
                className="font-display font-bold text-2xl tracking-tight mb-0.5"
                style={{ color: stat.color }}
              >
                {stat.value}
              </div>
              <div className="text-xs font-medium text-[var(--text-primary)]">{stat.label}</div>
              <div className="text-xs text-[var(--text-secondary)] mt-0.5">{stat.change}</div>
            </motion.div>
          ))}
        </div>

        {/* Posts table */}
        <div className="glass border border-[var(--glass-border)] rounded-2xl overflow-hidden">
          {/* Table header */}
          <div className="flex items-center justify-between p-5 border-b border-[var(--glass-border)]">
            <h2 className="font-display font-semibold text-[var(--text-primary)]">Posts</h2>
            <div className="flex items-center gap-1 glass rounded-lg p-1 border border-[var(--glass-border)]">
              {(["all", "published", "drafts"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-all duration-200 ${
                    activeTab === tab
                      ? "bg-neon-blue/15 text-neon-blue"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--glass-border)]">
                  {["Title", "Tags", "Status", "Views", "Date", "Actions"].map((h) => (
                    <th
                      key={h}
                      className="text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider px-5 py-3"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredPosts.map((post, i) => (
                  <motion.tr
                    key={post.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.04 }}
                    className="border-b border-[var(--glass-border)] last:border-0 hover:bg-[var(--glass-bg)] transition-colors duration-150"
                  >
                    <td className="px-5 py-4 max-w-xs">
                      <p className="text-sm font-medium text-[var(--text-primary)] line-clamp-1">
                        {post.title}
                      </p>
                      <p className="text-xs text-[var(--text-secondary)] mt-0.5 line-clamp-1">
                        {post.excerpt}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-1.5 flex-wrap">
                        {post.tags.slice(0, 2).map((tag) => {
                          const c = getTagColor(tag);
                          return (
                            <span
                              key={tag}
                              className="text-xs px-2 py-0.5 rounded-full border"
                              style={{ background: c.bg, color: c.text, borderColor: c.border }}
                            >
                              {tag}
                            </span>
                          );
                        })}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${
                          post.published
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {post.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-[var(--text-secondary)]">
                      {formatViews(post.views)}
                    </td>
                    <td className="px-5 py-4 text-sm text-[var(--text-secondary)] whitespace-nowrap">
                      {formatDateShort(post.updated_at)}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        <Link
                          href={`/admin/posts/${post.id}`}
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-[var(--text-secondary)] hover:text-neon-blue hover:bg-neon-blue/10 transition-all duration-200"
                          title="Edit"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleTogglePublish(post.id, post.published)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-[var(--text-secondary)] hover:text-emerald-400 hover:bg-emerald-500/10 transition-all duration-200"
                          title={post.published ? "Unpublish" : "Publish"}
                        >
                          {post.published ? (
                            <ToggleRight className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <ToggleLeft className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-[var(--text-secondary)] hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
                   </div>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${
                          post.published
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {post.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-[var(--text-secondary)]">
                      {formatViews(post.views)}
                    </td>
                    <td className="px-5 py-4 text-sm text-[var(--text-secondary)] whitespace-nowrap">
                      {formatDateShort(post.updated_at)}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        <Link
                          href={`/admin/posts/${post.id}`}
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-[var(--text-secondary)] hover:text-neon-blue hover:bg-neon-blue/10 transition-all duration-200"
                          title="Edit"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleTogglePublish(post.id)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-[var(--text-secondary)] hover:text-emerald-400 hover:bg-emerald-500/10 transition-all duration-200"
                          title={post.published ? "Unpublish" : "Publish"}
                        >
                          {post.published ? (
                            <ToggleRight className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <ToggleLeft className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-[var(--text-secondary)] hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
