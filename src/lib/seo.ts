import type { Post } from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://synapse.blog";

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Synapse",
    url: BASE_URL,
  };
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Synapse",
    url: BASE_URL,
  };
}

export function articleSchema(post: Post) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    url: `${BASE_URL}/blog/${post.slug}`,
    datePublished: post.published_at || post.created_at,
    dateModified: post.updated_at,
    author: { "@type": "Person", name: post.author_name },
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function blogSchema(posts: Post[]) {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Synapse Blog",
    url: `${BASE_URL}/blog`,
  };
}
