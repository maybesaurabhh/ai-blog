"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Save, Send, Image as ImageIcon, Loader2 } from "lucide-react";
import { TAGS } from "@/types";
import { getTagColor, generateSlug } from "@/lib/utils";
import { createBrowserClient } from "@/lib/supabase";

export default function PostEditorPage({ params }: { params: { id: string } }) {
  const isNew = params.id === "new";
  const router = useRouter();
  const supabase = useMemo(() => createBrowserClient(), []);

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [published, setPublished] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeView, setActiveView] = useState<"write" | "preview">("write");
  const [authorName, setAuthorName] = useState("Admin");

  useEffect(() => {
    const checkAuthAndLoad = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/admin/login");
        return;
      }
      setAuthorName(session.user.email?.split("@")[0] || "Admin");

      if (!isNew) {
        const { data } = await supabase
          .from("posts")
          .select("*")
          .eq("id", params.id)
          .single();
        if (data) {
          setTitle(data.title || "");
          setExcerpt(data.excerpt || "");
          setContent(data.content || "");
          setSelectedTags(data.tags || []);
          setCoverImage(data.cover_image || null);
          setPublished(data.published || false);
        }
      }
    };
    checkAuthAndLoad();
  }, [isNew, params.id, router, supabase]);

  const handleSave = async (publish = false) => {
    if (!title.trim()) return alert("Please add a title");
    setSaving(true);

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      alert("Session expired. Please log in again.");
      setSaving(false);
      return;
    }

    const wordCount = content.split(/\s+/).filter(Boolean).length;
    const readingTime = Math.max(1, Math.ceil(wordCount / 200));
    const shouldPublish = publish || published;

    const postData = {
      title,
      slug: generateSlug(title),
      excerpt,
      content,
      cover_image: coverImage,
      tags: selectedTags,
      published: shouldPublish,
      reading_time: readingTime,
      author_id: session.user.id,
      author_name: authorName,
      updated_at: new Date().toISOString(),
      ...(shouldPublish && !published && { published_at: new Date().toISOString() }),
    };

    let error;
    if (isNew) {
      const { error: e, data } = await supabase
        .from("posts")
        .insert([postData])
        .select()
        .single();
      error = e;
      if (data) router.push(`/admin/posts/${data.id}`);
    } else {
      const { error: e } = await supabase
        .from("posts")
        .update(postData)
        .eq("id", params.id);
      error = e;
    }

    if (error) {
      alert("Error saving: " + error.message);
    } else {
      if (publish) setPublished(true);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
    setSaving(false);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <div className="sticky top-0 z-40 glass-strong border-b border-[var(--glass-border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-sm text-[var(--text-secondary)]">
              <ArrowLeft className="inline w-4 h-4 mr-1" /> Dashboard
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => handleSave(false)} disabled={saving} className="px-3.5 py-2 rounded-lg glass border border-[var(--glass-border)] text-sm">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            </button>
            <button onClick={() => handleSave(true)} disabled={saving} className="px-3.5 py-2 rounded-lg bg-neon-blue text-white text-sm font-semibold">
              <Send className="w-4 h-4 inline mr-1" /> {published ? "Update" : "Publish"}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            <textarea 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="Post title..." 
              className="w-full bg-transparent border-b border-[var(--glass-border)] text-2xl font-bold focus:outline-none" 
            />
            <textarea 
              value={content} 
              onChange={(e) => setContent(e.target.value)} 
              placeholder="Write content here..." 
              className="w-full min-h-[400px] bg-transparent focus:outline-none resize-none" 
            />
          </div>
          <div className="space-y-5">
            <div className="glass p-5 rounded-xl border border-[var(--glass-border)]">
              <h3 className="text-xs font-bold uppercase mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {TAGS.map((tag) => (
                  <button 
                    key={tag} 
                    onClick={() => toggleTag(tag)}
                    className={`text-xs px-2 py-1 rounded-full border ${selectedTags.includes(tag) ? 'bg-neon-blue text-white' : 'border-[var(--glass-border)]'}`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
      }
