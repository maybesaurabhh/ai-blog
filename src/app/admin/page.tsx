"use client";
import { createBrowserClient } from "@/lib/supabase";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();
  const supabase = createBrowserClient();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. LOAD REAL DATA
  const fetchPosts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      alert("DB Error: " + error.message);
    } else {
      console.log("Data received:", data);
      setPosts(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // 2. TOGGLE PUBLISH
  const handleToggle = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('posts')
      .update({ published: !currentStatus })
      .eq('id', id);

    if (error) {
      alert("Update Failed: " + error.message);
    } else {
      alert("✅ Updated in Database!");
      fetchPosts(); // Reload fresh data
    }
  };

  return (
    <div style={{ padding: '20px', background: '#111', color: '#fff', minHeight: '100vh' }}>
      <h1>Admin Debug Mode</h1>
      <button onClick={fetchPosts} style={{ padding: '10px', background: 'blue', color: 'white' }}>
        🔄 Force Refresh Data
      </button>

      {loading ? (
        <p>Loading from Supabase...</p>
      ) : (
        <table style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #444' }}>
              <th>Title</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 ? (
              <tr><td colSpan={3}>No posts found in database.</td></tr>
            ) : (
              posts.map((post) => (
                <tr key={post.id} style={{ borderBottom: '1px solid #222' }}>
                  <td>{post.title}</td>
                  <td>{post.published ? "🟢 Published" : "⚪ Draft"}</td>
                  <td>
                    <button onClick={() => handleToggle(post.id, post.published)}>
                      Toggle Status
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
  const [activeTab, setActiveTab] = useState<"all" | "published" | "drafts">("all");

  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.replace("/admin/login");
        return;
      }

      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('updated_at', { ascending: false });

      if (data) setPosts(data);
      if (error) alert("Error loading posts: " + error.message);
    };

    checkAuthAndFetchData();
  }, [router, supabase]);

  const filteredPosts =
    activeTab === "published"
      ? posts.filter((p) => p.published)
      : activeTab === "drafts"
      ? posts.filter((p) => !p.published)
      : posts;

  const handleDelete = async (id: string) => {
    const handleDelete = async (id: string) => {
    if (!confirm("Delete this post?")) return;
    alert("Attempting to delete ID: " + id);

    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id);

    if (error) {
      alert("❌ DELETE ERROR: " + error.message);
    } else {
      alert("✅ DELETED from database!");
      setPosts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    alert("Updating ID: " + id + " to " + (newStatus ? "Published" : "Draft"));

    const { data, error } = await supabase
      .from('posts')
      .update({ published: newStatus })
      .eq('id', id)
      .select();

    if (error) {
      alert("❌ UPDATE ERROR: " + error.message);
    } else if (data && data.length === 0) {
      alert("❓ SUCCESS status, but 0 rows changed. Check if ID exists in Supabase.");
    } else {
      alert("✅ DATABASE UPDATED!");
      setPosts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, published: newStatus } : p))
      );
    }
  };


  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex">
      <aside className="w-64 shrink-0 hidden lg:flex flex-col glass-strong border-r border-[var(--glass-border)] fixed top-0 bottom-0 left-0 z-30">
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
        <nav className="flex-1 p-4 space-y-1">
          {[
            { icon: LayoutDashboard, label: "Dashboard", href: "/admin", active: true },
            { icon: FileText, label: "All Posts", href: "/admin" },
            { icon: PlusCircle, label: "New Post", href: "/admin/posts/new" },
            { icon: Settings, label: "Settings", href: "/admin/settings" },
          ].map(({ icon: Icon, label, href, active }) => (
            <Link key={label} href={href} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${active ? "bg-neon-blue/10 text-neon-blue border border-neon-blue/20" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--glass-bg)]"}`}>
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
        </nav>
      </aside>

      <main className="flex-1 lg:ml-64 p-6 lg:p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display font-bold text-2xl text-[var(--text-primary)] tracking-tight">Dashboard</h1>
            <p className="text-sm text-[var(--text-secondary)] mt-0.5">Welcome back</p>
          </div>
          <Link href="/admin/posts/new" className="flex items-center gap-2 px-4 py-2.5 bg-neon-blue text-white text-sm font-semibold rounded-xl hover:shadow-neon-blue transition-all duration-300">
            <PlusCircle className="w-4 h-4" /> New Post
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {STATS.map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} className="glass border border-[var(--glass-border)] rounded-xl p-5">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3" style={{ background: `${stat.color}15`, border: `1px solid ${stat.color}25` }}>
                <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
              </div>
              <div className="font-display font-bold text-2xl tracking-tight mb-0.5" style={{ color: stat.color }}>{stat.value}</div>
              <div className="text-xs font-medium text-[var(--text-primary)]">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="glass border border-[var(--glass-border)] rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-[var(--glass-border)]">
            <h2 className="font-display font-semibold text-[var(--text-primary)]">Posts</h2>
            <div className="flex items-center gap-1 glass rounded-lg p-1 border border-[var(--glass-border)]">
              {(["all", "published", "drafts"] as const).map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-all duration-200 ${activeTab === tab ? "bg-neon-blue/15 text-neon-blue" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"}`}>
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--glass-border)]">
                  {["Title", "Tags", "Status", "Views", "Date", "Actions"].map((h) => (
                    <th key={h} className="text-left text-xs font-semibold text-[var(--text-secondary)] uppercase px-5 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredPosts.map((post, i) => (
                  <motion.tr key={post.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }} className="border-b border-[var(--glass-border)] last:border-0 hover:bg-[var(--glass-bg)]">
                    <td className="px-5 py-4 max-w-xs">
                      <p className="text-sm font-medium text-[var(--text-primary)] line-clamp-1">{post.title}</p>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-1.5 flex-wrap">
                        {post.tags?.slice(0, 2).map((tag) => (
                          <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full border border-[var(--glass-border)] text-[var(--text-secondary)]">{tag}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-[10px] px-2 py-1 rounded-full border ${post.published ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border-amber-500/20"}`}>
                        {post.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs text-[var(--text-secondary)]">{formatViews(post.views)}</td>
                    <td className="px-5 py-4 text-xs text-[var(--text-secondary)]">{formatDateShort(post.updated_at)}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        <Link href={`/admin/posts/${post.id}`} className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-neon-blue hover:bg-neon-blue/10">
                          <Edit className="w-3.5 h-3.5" />
                        </Link>
                        <button onClick={() => handleTogglePublish(post.id, post.published)} className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-emerald-400">
                          {post.published ? <ToggleRight className="w-3.5 h-3.5 text-emerald-400" /> : <ToggleLeft className="w-3.5 h-3.5" />}
                        </button>
                        <button onClick={() => handleDelete(post.id)} className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-red-400">
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
