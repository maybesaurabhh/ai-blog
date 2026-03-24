"use client";

import { createBrowserClient } from "@/lib/supabase";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
} from "lucide-react";

// Ensure these utilities exist in your project
import { formatDateShort, formatViews, getTagColor } from "@/lib/utils";
import type { Post } from "@/types";

const STATS = [
  { label: "Total Posts", icon: FileText, value: "24", change: "+3 this month", color: "#4f9eff" },
  { label: "Total Views", icon: Eye, value: "94.2K", change: "+12% this week", color: "#a855f7" },
  { label: "Avg. Read Time", icon: Clock, value: "7.4m", change: "Across all posts", color: "#22d3ee" },
  { label: "Top Performing", icon: TrendingUp, value: "12.8K", change: "AGI article views", color: "#34d399" },
];

export default function AdminDashboard() {
  const router = useRouter();
  
  // Define supabase at the top level of the component
  const supabase = useMemo(() => createBrowserClient(), []);

  const [posts, setPosts] = useState<Post[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | "published" | "drafts">("all");
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('updated_at', { ascending: false });

    if (data) setPosts(data);
    if (error) console.error("Fetch error:", error.message);
    setLoading(false);
  };

  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.replace("/admin/login");
        return;
      }
      await fetchPosts();
    };

    checkAuth();
  }, [router, supabase]);

  const filteredPosts =
    activeTab === "published"
      ? posts.filter((p) => p.published)
      : activeTab === "drafts"
      ? posts.filter((p) => !p.published)
      : posts;

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this post?")) return;
    const { error } = await supabase.from('posts').delete().eq('id', id);
    if (error) alert(error.message);
    else setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('posts')
      .update({ published: !currentStatus })
      .eq('id', id);

    if (error) alert(error.message);
    else {
      setPosts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, published: !currentStatus } : p))
      );
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex">
      <aside className="w-64 shrink-0 hidden lg:flex flex-col glass-strong border-r border-[var(--glass-border)] fixed top-0 bottom-0 left-0">
        <div className="p-6 border-b border-[var(--glass-border)]">
          <div className="flex items-center gap-2.5">
            <Zap className="w-4 h-4 text-neon-blue" />
            <span className="font-bold text-[var(--text-primary)]">Admin Panel</span>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <Link href="/admin" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm bg-neon-blue/10 text-neon-blue border border-neon-blue/20">
            <LayoutDashboard className="w-4 h-4" /> Dashboard
          </Link>
          <Link href="/admin/posts/new" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
            <PlusCircle className="w-4 h-4" /> New Post
          </Link>
        </nav>
      </aside>

      <main className="flex-1 lg:ml-64 p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-bold text-2xl text-[var(--text-primary)]">Dashboard</h1>
          <Link href="/admin/posts/new" className="px-4 py-2 bg-neon-blue text-white text-sm font-semibold rounded-xl">
            + New Post
          </Link>
        </div>

        <div className="glass border border-[var(--glass-border)] rounded-2xl overflow-hidden bg-[var(--glass-bg)]">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[var(--glass-border)] text-xs text-[var(--text-secondary)] uppercase">
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={3} className="p-10 text-center">Loading posts...</td></tr>
              ) : filteredPosts.map((post) => (
                <tr key={post.id} className="border-b border-[var(--glass-border)] text-sm">
                  <td className="px-6 py-4 text-[var(--text-primary)] font-medium">{post.title}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] ${post.published ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                      {post.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <Link href={`/admin/posts/${post.id}`} className="p-1.5 hover:text-neon-blue"><Edit className="w-4 h-4" /></Link>
                    <button onClick={() => handleTogglePublish(post.id, post.published)} className="p-1.5 hover:text-green-400">
                      {post.published ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                    </button>
                    <button onClick={() => handleDelete(post.id)} className="p-1.5 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
