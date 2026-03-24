import { MetadataRoute } from "next";
import { MOCK_POSTS } from "@/lib/posts";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://synapse.blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = MOCK_POSTS;

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  const postRoutes: MetadataRoute.Sitemap = posts
    .filter((p) => p.published)
    .map((post) => ({
      url: `${BASE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.updated_at),
      changeFrequency: "weekly" as const,
      priority: post.featured ? 0.9 : 0.75,
    }));

  const tagsArray = posts.flatMap((p) => p.tags);
  const uniqueTags = tagsArray.filter((tag, index) => tagsArray.indexOf(tag) === index);

  const tagRoutes: MetadataRoute.Sitemap = uniqueTags.map((tag) => ({
    url: `${BASE_URL}/blog?tag=${encodeURIComponent(tag)}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...postRoutes, ...tagRoutes];
}
