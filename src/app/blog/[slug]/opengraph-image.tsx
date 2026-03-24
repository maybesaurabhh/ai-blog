import { ImageResponse } from "next/og";
import { MOCK_POSTS } from "@/lib/posts";
import { getTagColor } from "@/lib/utils";
import { formatDate } from "@/lib/utils";

export const runtime = "edge";
export const contentType = "image/png";
export const size = { width: 1200, height: 630 };

export default async function Image({ params }: { params: { slug: string } }) {
  const post = MOCK_POSTS.find((p) => p.slug === params.slug);

  if (!post) {
    // Fallback OG image
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#040408",
            color: "#ffffff",
            fontSize: 48,
            fontWeight: 700,
          }}
        >
          Synapse
        </div>
      ),
      { ...size }
    );
  }

  const tagColor = "#4f9eff";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(135deg, #040408 0%, #0a0a0f 60%, #0d0d18 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Cover image as blurred background */}
        {post.cover_image && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${post.cover_image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "blur(3px) brightness(0.15) saturate(1.2)",
            }}
          />
        )}

        {/* Gradient overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(135deg, rgba(4,4,8,0.97) 0%, rgba(4,4,8,0.85) 60%, rgba(4,4,8,0.92) 100%)",
          }}
        />

        {/* Grid pattern */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(79,158,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(79,158,255,0.03) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />

        {/* Glow accent */}
        <div
          style={{
            position: "absolute",
            top: -100,
            right: -100,
            width: 500,
            height: 500,
            background: "radial-gradient(circle, rgba(79,158,255,0.1) 0%, transparent 65%)",
          }}
        />

        {/* Top line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 2,
            background: "linear-gradient(90deg, transparent, #4f9eff 30%, #a855f7 70%, transparent)",
          }}
        />

        {/* Content */}
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            height: "100%",
            padding: "56px 72px",
          }}
        >
          {/* Logo top-left */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "auto" }}>
            <div
              style={{
                width: 38,
                height: 38,
                background: "linear-gradient(135deg, #4f9eff, #a855f7)",
                borderRadius: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 20px rgba(79,158,255,0.4)",
                fontSize: 20,
              }}
            >
              ⚡
            </div>
            <span style={{ color: "#a1a1aa", fontSize: 18, fontWeight: 600 }}>Synapse</span>
          </div>

          {/* Tags */}
          <div style={{ display: "flex", gap: 10, marginBottom: 28 }}>
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                style={{
                  color: "#4f9eff",
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  background: "rgba(79,158,255,0.1)",
                  border: "1px solid rgba(79,158,255,0.25)",
                  padding: "5px 14px",
                  borderRadius: 999,
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h1
            style={{
              color: "#f4f4f5",
              fontSize: post.title.length > 60 ? 44 : post.title.length > 45 ? 52 : 60,
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              margin: 0,
              marginBottom: 24,
              maxWidth: 860,
            }}
          >
            {post.title}
          </h1>

          {/* Excerpt */}
          <p
            style={{
              color: "#71717a",
              fontSize: 20,
              lineHeight: 1.5,
              margin: 0,
              marginBottom: 44,
              maxWidth: 760,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              overflow: "hidden",
            }}
          >
            {post.excerpt}
          </p>

          {/* Author + meta row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 24,
              paddingTop: 28,
              borderTop: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            {/* Avatar */}
            <div
              style={{
                width: 46,
                height: 46,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #4f9eff, #a855f7)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: 18,
                fontWeight: 700,
              }}
            >
              {post.author_name[0]}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <span style={{ color: "#e4e4e7", fontSize: 16, fontWeight: 600 }}>
                {post.author_name}
              </span>
              <span style={{ color: "#52525b", fontSize: 14 }}>
                {formatDate(post.published_at || post.created_at)} · {post.reading_time} min read
              </span>
            </div>

            {/* Right side */}
            <div
              style={{
                marginLeft: "auto",
                display: "flex",
                alignItems: "center",
                gap: 8,
                color: "#3f3f46",
                fontSize: 14,
              }}
            >
              synapse.blog/blog/{post.slug.slice(0, 32)}{post.slug.length > 32 ? "…" : ""}
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
