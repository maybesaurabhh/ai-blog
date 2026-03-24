import { ImageResponse } from "next/og";

export const runtime = "edge";
export const contentType = "image/png";
export const size = { width: 1200, height: 630 };

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          background: "linear-gradient(135deg, #040408 0%, #0a0a0f 50%, #0f0f1a 100%)",
          padding: "80px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Grid pattern overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(79,158,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(79,158,255,0.04) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Glow orbs */}
        <div
          style={{
            position: "absolute",
            top: "20%",
            right: "15%",
            width: 400,
            height: 400,
            background: "radial-gradient(circle, rgba(79,158,255,0.12) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "10%",
            left: "30%",
            width: 300,
            height: 300,
            background: "radial-gradient(circle, rgba(168,85,247,0.1) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />

        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginBottom: 48,
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              background: "linear-gradient(135deg, #4f9eff, #a855f7)",
              borderRadius: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 30px rgba(79,158,255,0.5)",
            }}
          >
            <div style={{ color: "white", fontSize: 28, fontWeight: "bold" }}>⚡</div>
          </div>
          <span
            style={{
              color: "#ffffff",
              fontSize: 30,
              fontWeight: 700,
              letterSpacing: "-0.03em",
            }}
          >
            Synapse
          </span>
        </div>

        {/* Headline */}
        <div
          style={{
            fontSize: 68,
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: "-0.04em",
            marginBottom: 24,
            maxWidth: 760,
          }}
        >
          <span style={{ color: "#ffffff" }}>Artificial</span>
          <br />
          <span
            style={{
              background: "linear-gradient(135deg, #ffffff 0%, #4f9eff 50%, #a855f7 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Intelligence,
          </span>
          <br />
          <span style={{ color: "#52525b" }}>Decoded.</span>
        </div>

        {/* Description */}
        <p
          style={{
            color: "#71717a",
            fontSize: 22,
            lineHeight: 1.5,
            maxWidth: 620,
            margin: 0,
          }}
        >
          Research-grade writing on LLMs, alignment, compute, and the technologies reshaping civilization.
        </p>

        {/* Bottom bar */}
        <div
          style={{
            position: "absolute",
            bottom: 60,
            left: 80,
            right: 80,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", gap: 24 }}>
            {["AI", "Machine Learning", "LLMs", "Engineering"].map((tag) => (
              <span
                key={tag}
                style={{
                  color: "#4f9eff",
                  fontSize: 13,
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  background: "rgba(79,158,255,0.1)",
                  border: "1px solid rgba(79,158,255,0.2)",
                  padding: "6px 14px",
                  borderRadius: 999,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
          <span style={{ color: "#3f3f46", fontSize: 14 }}>synapse.blog</span>
        </div>

        {/* Top glow line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 2,
            background: "linear-gradient(90deg, transparent, #4f9eff, #a855f7, transparent)",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
