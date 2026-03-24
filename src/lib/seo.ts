import type { Post } from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://synapse.blog";

// ─── Website Schema ────────────────────────────────────────
export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${BASE_URL}/#website`,
    name: "Synapse",
    description:
      "Deep dives into artificial intelligence, machine learning, and the technologies reshaping the world.",
    url: BASE_URL,
    inLanguage: "en-US",
    publisher: {
      "@id": `${BASE_URL}/#organization`,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${BASE_URL}/blog?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

// ─── Organization Schema ───────────────────────────────────
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${BASE_URL}/#organization`,
    name: "Synapse",
    url: BASE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${BASE_URL}/icons/icon-512.png`,
      width: 512,
      height: 512,
    },
    sameAs: [
      "https://twitter.com/synapseblog",
      "https://github.com/synapseblog",
    ],
  };
}

// ─── Blog Article Schema ───────────────────────────────────
export function articleSchema(post: Post) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${BASE_URL}/blog/${post.slug}#article`,
    headline: post.title,
    description: post.excerpt,
    url: `${BASE_URL}/blog/${post.slug}`,
    datePublished: post.published_at || post.created_at,
    dateModified: post.updated_at,
    wordCount: post.content.split(/\s+/).filter(Boolean).length,
    timeRequired: `PT${post.reading_time}M`,
    inLanguage: "en-US",
    author: {
      "@type": "Person",
      name: post.author_name,
      url: `${BASE_URL}/authors/${post.author_name.toLowerCase().replace(/\s+/g, "-")}`,
    },
    publisher: {
      "@id": `${BASE_URL}/#organization`,
    },
    isPartOf: {
      "@id": `${BASE_URL}/#website`,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${BASE_URL}/blog/${post.slug}`,
    },
    ...(post.cover_image && {
      image: {
        "@type": "ImageObject",
        url: post.cover_image,
        width: 1200,
        height: 630,
      },
    }),
    keywords: post.tags.join(", "),
    articleSection: post.tags[0] || "Technology",
    about: post.tags.map((tag) => ({
      "@type": "Thing",
      name: tag,
    })),
  };
}

// ─── Breadcrumb Schema ─────────────────────────────────────
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

// ─── Blog Listing Schema ───────────────────────────────────
export function blogSchema(posts: Post[]) {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${BASE_URL}/blog#blog`,
    name: "Synapse Blog",
    description: "Articles on AI, machine learning, and emerging technology.",
    url: `${BASE_URL}/blog`,
    publisher: {
      "@id": `${BASE_URL}/#organization`,
    },
    blogPost: posts.slice(0, 10).map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      url: `${BASE_URL}/blog/${post.slug}`,
      datePublished: post.published_at || post.created_at,
      author: { "@type": "Person", name: post.author_name },
    })),
  };
}

// ─── Serialised JSON-LD component ─────────────────────────
export function JsonLd({ data }: { data: object | object[] }) {
  const schemas = Array.isArray(data) ? data : [data];
  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
