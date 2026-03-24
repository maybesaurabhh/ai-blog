import { NextResponse } from "next/server";
import { MOCK_POSTS } from "@/lib/posts";
import { formatDate } from "@/lib/utils";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://synapse.blog";

export async function GET() {
  const posts = MOCK_POSTS.filter((p) => p.published).slice(0, 20);

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
>
  <channel>
    <title>Synapse — AI &amp; Technology Intelligence</title>
    <link>${BASE_URL}</link>
    <description>Deep dives into artificial intelligence, machine learning, and the technologies reshaping the world.</description>
    <language>en-US</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${BASE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${BASE_URL}/og-image.png</url>
      <title>Synapse</title>
      <link>${BASE_URL}</link>
    </image>
    ${posts
      .map(
        (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${BASE_URL}/blog/${post.slug}</link>
      <guid isPermaLink="true">${BASE_URL}/blog/${post.slug}</guid>
      <description><![CDATA[${post.excerpt}]]></description>
      <content:encoded><![CDATA[${post.excerpt}]]></content:encoded>
      <dc:creator>${post.author_name}</dc:creator>
      <pubDate>${new Date(post.published_at || post.created_at).toUTCString()}</pubDate>
      ${post.tags.map((tag) => `<category>${tag}</category>`).join("\n      ")}
    </item>`
      )
      .join("")}
  </channel>
</rss>`;

  return new NextResponse(rss, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
