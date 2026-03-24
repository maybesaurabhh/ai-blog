import { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://synapse.blog";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/", "/api/", "/_next/"],
      },
      {
        // Block AI training crawlers
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "CCBot",
          "anthropic-ai",
          "Claude-Web",
          "Omgilibot",
          "FacebookBot",
        ],
        disallow: ["/"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
