"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Save,
  Eye,
  Send,
  Image as ImageIcon,
  X,
  Plus,
  Loader2,
  Zap,
} from "lucide-react";
import { TAGS } from "@/types";
import { getTagColor } from "@/lib/utils";

export default function PostEditorPage({ params }: { params: { id: string } }) {
  const isNew = params.id === "new";

  const [title, setTitle] = useState(isNew ? "" : "The Dawn of AGI: What Happens After We Cross the Threshold");
  const [excerpt, setExcerpt] = useState(isNew ? "" : "We are approaching a moment that will redefine civilization itself.");
  const [content, setContent] = useState(isNew ? "" : "# The Dawn of AGI\n\nStart writing here...");
  const [selectedTags, setSelectedTags] = useState<string[]>(isNew ? [] : ["AI", "Research"]);
  const [coverImage, setCoverImage] = useState<string | null>(isNew ? null : "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1200&q=80");
  const [published, setPublished] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeView, setActiveView] = useState<"write" | "preview">("write");

  const handleSave = async (publish = false) => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    if (publish) setPublished(true);
    setSaved(true);
    setSaving(false);
    setTimeout(() => setSaved(false), 3000);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleImageUrl = () => {
    const url = prompt("Enter image URL:");
    if (url) setCoverImage(url);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Top bar */}
      <div className="sticky top-0 z-40 glass-strong border-b border-[var(--glass-border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Dashboard
            </Link>
            <span className="text-[var(--glass-border)]">/</span>
            <span className="text-sm text-[var(--text-primary)] font-medium">
              {isNew ? "New Post" : "Edit Post"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* View toggle */}
            <div className="hidden sm:flex items-center gap-1 glass rounded-lg p-1 border border-[var(--glass-border)]">
              {(["write", "preview"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setActiveView(v)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-all duration-200 ${
                    activeView === v
                      ? "bg-neon-blue/15 text-neon-blue"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  {v === "write" ? "✍️ Write" : "👁 Preview"}
                </button>
              ))}
            </div>

            <button
              onClick={() => handleSave(false)}
              disabled={saving}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg glass border border-[var(--glass-border)] text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all duration-200 disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              {saved ? "Saved!" : "Save Draft"}
            </button>

            <button
              onClick={() => handleSave(true)}
              disabled={saving}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-neon-blue text-white text-sm font-semibold hover:shadow-neon-blue transition-all duration-300 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              {published ? "Update" : "Publish"}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Editor */}
          <div className="lg:col-span-2 space-y-5">
            {/* Cover image */}
            {coverImage ? (
              <div className="relative rounded-xl overflow-hidden group">
                <img src={coverImage} alt="Cover" className="w-full aspect-[21/9] object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button
                    onClick={handleImageUrl}
                    className="px-3 py-1.5 rounded-lg bg-white/20 text-white text-sm backdrop-blur-sm border border-white/20 hover:bg-white/30 transition-all"
                  >
                    Change
                  </button>
                  <button
                    onClick={() => setCoverImage(null)}
                    className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-300 text-sm backdrop-blur-sm border border-red-500/20 hover:bg-red-500/30 transition-all"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={handleImageUrl}
                className="w-full aspect-[21/9] rounded-xl glass border border-dashed border-[var(--glass-border)] hover:border-neon-blue/30 flex flex-col items-center justify-center gap-3 text-[var(--text-secondary)] hover:text-neon-blue transition-all duration-200 group"
              >
                <div className="w-12 h-12 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)] group-hover:border-neon-blue/30 flex items-center justify-center transition-all duration-200">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium">Add cover image URL</span>
              </button>
            )}

            {/* Title */}
            <textarea
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Post title..."
              rows={2}
              className="w-full bg-transparent border-0 border-b border-[var(--glass-border)] pb-4 font-display font-bold text-2xl sm:text-3xl text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/30 focus:outline-none resize-none focus:border-neon-blue/30 transition-colors duration-200"
            />

            {/* Excerpt */}
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Brief excerpt (shown in cards and SEO)..."
              rows={2}
              className="w-full bg-transparent border-b border-[var(--glass-border)] pb-4 text-base text-[var(--text-secondary)] placeholder:text-[var(--text-secondary)]/30 focus:outline-none resize-none focus:border-neon-blue/30 transition-colors duration-200 italic"
            />

            {/* Content editor */}
            {activeView === "write" ? (
              <div className="glass border border-[var(--glass-border)] rounded-xl overflow-hidden">
                {/* Toolbar hint */}
                <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[var(--glass-border)] overflow-x-auto">
                  {["# H1", "## H2", "**Bold**", "_Italic_", "`Code`", "```Block```", "> Quote", "- List"].map((t) => (
                    <span key={t} className="text-xs text-[var(--text-secondary)] font-mono whitespace-nowrap px-2 py-1 rounded bg-[var(--glass-bg)] hover:text-neon-blue cursor-pointer transition-colors">
                      {t}
                    </span>
                  ))}
                </div>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your post in Markdown...

# Heading
**Bold text**, _italic_, `inline code`

```javascript
// Code block
const ai = new AGI();
```

> Blockquote

- Bullet list
- Another item"
                  className="w-full min-h-[500px] p-5 bg-transparent text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/30 font-mono text-sm focus:outline-none resize-none leading-relaxed"
                />
              </div>
            ) : (
              <div className="glass border border-[var(--glass-border)] rounded-xl p-8 min-h-[500px]">
                <div className="prose prose-sm max-w-none text-[var(--text-secondary)]">
                  <h1 className="font-display font-bold text-2xl text-[var(--text-primary)]">{title || "Untitled"}</h1>
                  <p className="italic text-[var(--text-secondary)]">{excerpt}</p>
                  <hr className="border-[var(--glass-border)]" />
                  <pre className="text-[var(--text-secondary)] whitespace-pre-wrap font-sans text-sm leading-relaxed">{content || "No content yet..."}</pre>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Status */}
            <div className="glass border border-[var(--glass-border)] rounded-xl p-5">
              <h3 className="text-xs font-semibold tracking-widest uppercase text-[var(--text-secondary)] mb-4">Status</h3>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--text-primary)]">Visibility</span>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${
                  published
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                }`}>
                  {published ? "Published" : "Draft"}
                </span>
              </div>
            </div>

            {/* Tags */}
            <div className="glass border border-[var(--glass-border)] rounded-xl p-5">
              <h3 className="text-xs font-semibold tracking-widest uppercase text-[var(--text-secondary)] mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {TAGS.map((tag) => {
                  const c = getTagColor(tag);
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className="text-xs px-2.5 py-1 rounded-full border transition-all duration-200"
                      style={
                        isSelected
                          ? { background: c.bg, color: c.text, borderColor: c.border }
                          : {
                              background: "transparent",
                              color: "var(--text-secondary)",
                              borderColor: "var(--glass-border)",
                            }
                      }
                    >
                      {isSelected && <span className="mr-1">✓</span>}
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* SEO preview */}
            <div className="glass border border-[var(--glass-border)] rounded-xl p-5">
              <h3 className="text-xs font-semibold tracking-widest uppercase text-[var(--text-secondary)] mb-4">SEO Preview</h3>
              <div className="rounded-lg bg-[var(--bg-secondary)] border border-[var(--glass-border)] p-3">
                <p className="text-xs text-green-400 mb-1 truncate">
                  synapse.blog/blog/{title ? title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") : "post-slug"}
                </p>
                <p className="text-sm font-medium text-neon-blue mb-1 line-clamp-1">
                  {title || "Post Title"}
                </p>
                <p className="text-xs text-[var(--text-secondary)] line-clamp-2">
                  {excerpt || "Post excerpt will appear here..."}
                </p>
              </div>
            </div>

            {/* Writing stats */}
            <div className="glass border border-[var(--glass-border)] rounded-xl p-5">
              <h3 className="text-xs font-semibold tracking-widest uppercase text-[var(--text-secondary)] mb-4">Stats</h3>
              <div className="space-y-2">
                {[
                  { label: "Words", value: content.split(/\s+/).filter(Boolean).length },
                  { label: "Characters", value: content.length },
                  { label: "Reading Time", value: `${Math.max(1, Math.ceil(content.split(/\s+/).filter(Boolean).length / 200))} min` },
                  { label: "Paragraphs", value: content.split(/\n\n+/).filter(Boolean).length },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between">
                    <span className="text-xs text-[var(--text-secondary)]">{label}</span>
                    <span className="text-xs font-semibold text-[var(--text-primary)]">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
