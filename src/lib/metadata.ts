// Central SEO metadata builder — use in generateMetadata() for any page
import type { Metadata } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://synapse.blog";

interface SeoOptions {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  tags?: string[];
  noindex?: boolean;
}

export function buildMetadata({
  title,
  description,
  path,
  image,
  type = "website",
  publishedTime,
  modifiedTime,
  author,
  tags,
  noindex = false,
}: SeoOptions): Metadata {
  const url = `${BASE_URL}${path}`;
  const ogImage = image || `${BASE_URL}/opengraph-image`;
  const fullTitle = `${title} | Synapse`;

  return {
    title,
    description,
    keywords: tags,
    authors: author ? [{ name: author }] : undefined,
    alternates: {
      canonical: url,
      types: {
        "application/rss+xml": [{ url: `${BASE_URL}/rss.xml`, title: "Synapse RSS Feed" }],
      },
    },
    openGraph: {
      type,
      url,
      title: fullTitle,
      description,
      siteName: "Synapse",
      locale: "en_US",
      ...(ogImage && { images: [{ url: ogImage, width: 1200, height: 630, alt: title }] }),
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
      ...(author && { authors: [author] }),
      ...(tags && { tags }),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      site: "@synapseblog",
      ...(ogImage && { images: [ogImage] }),
    },
    robots: noindex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
  };
}
