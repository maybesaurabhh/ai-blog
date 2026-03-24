import type { Metadata } from "next";
import { DM_Sans, Syne, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { JsonLd } from "@/components/ui/JsonLd";
import { websiteSchema, organizationSchema } from "@/lib/seo";
import "@/styles/globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Synapse — AI & Technology Intelligence",
    template: "%s | Synapse",
  },
  description:
    "Deep dives into artificial intelligence, machine learning, and the technologies reshaping the world. Written by researchers, engineers, and founders.",
  keywords: [
    "artificial intelligence",
    "machine learning",
    "large language models",
    "LLM",
    "deep learning",
    "AI research",
    "neural networks",
    "AI blog",
    "tech blog",
    "AI news",
  ],
  authors: [{ name: "Synapse", url: BASE_URL }],
  creator: "Synapse",
  publisher: "Synapse",
  category: "Technology",
  // Canonical
  alternates: {
    canonical: BASE_URL,
    types: {
      "application/rss+xml": [{ url: `${BASE_URL}/rss.xml`, title: "Synapse RSS Feed" }],
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: "Synapse",
    title: "Synapse — AI & Technology Intelligence",
    description: "Deep dives into AI, machine learning, and the technologies reshaping the world.",
  },
  twitter: {
    card: "summary_large_image",
    site: "@synapseblog",
    creator: "@synapseblog",
    title: "Synapse — AI & Technology Intelligence",
    description: "Deep dives into AI and the technologies reshaping the world.",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add these after verifying in respective webmaster tools
    // google: "your-google-verification-token",
    // yandex: "your-yandex-token",
    // bing: "your-bing-token",
  },
  other: {
    "theme-color": "#040408",
    "color-scheme": "dark light",
    "format-detection": "telephone=no",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${dmSans.variable} ${syne.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange={false}
        >
          <JsonLd data={[websiteSchema(), organizationSchema()]} />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
