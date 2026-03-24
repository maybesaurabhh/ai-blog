import { ImageResponse } from "next/og";
import { MOCK_POSTS } from "@/lib/posts";

export const runtime = "edge";
export const contentType = "image/png";
// Twitter summary_large_image: 1200x600
export const size = { width: 1200, height: 600 };

export default async function Image({ params }: { params: { slug: string } }) {
  const post = MOCK_POSTS.find((p) => p.slug === params.slug);
  if (!post) return new ImageResponse(<div style={{ background: "#040408" }} />, { ...size });

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "linear-gradient(135deg, #040408 0%, #0d0d18 100%)",
          padding: "64px 80px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {post.cover_image && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${post.cover_image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "blur(4px) brightness(0.12)",
            }}
          />
        )}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(4,4,8,0.93)",
          }}
        />
        <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", gap: 10 }}>
            {post.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                style={{
                  color: "#4f9eff",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  background: "rgba(79,158,255,0.1)",
                  border: "1px solid rgba(79,158,255,0.2)",
                  padding: "4px 12px",
                  borderRadius: 999,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
          <h1
            style={{
              color: "#f4f4f5",
              fontSize: 46,
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: "-0.03em",
              margin: 0,
            }}
          >
            {post.title}
          </h1>
          <p style={{ color: "#71717a", fontSize: 18, margin: 0, lineHeight: 1.5 }}>
            {post.excerpt.slice(0, 120)}{post.excerpt.length > 120 ? "…" : ""}
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 8 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "linear-gradient(135deg,#4f9eff,#a855f7)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: 15,
                fontWeight: 700,
              }}
            >
              {post.author_name[0]}
            </div>
            <span style={{ color: "#a1a1aa", fontSize: 15 }}>
              {post.author_name} · {post.reading_time} min read
            </span>
            <span style={{ marginLeft: "auto", color: "#3f3f46", fontSize: 13 }}>⚡ Synapse</span>
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 2,
            background: "linear-gradient(90deg,transparent,#4f9eff 40%,#a855f7 60%,transparent)",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
