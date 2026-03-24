import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Synapse — AI & Technology Intelligence",
    short_name: "Synapse",
    description: "Deep dives into AI, machine learning, and the technologies reshaping the world.",
    start_url: "/",
    display: "standalone",
    background_color: "#040408",
    theme_color: "#040408",
    orientation: "portrait",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
    categories: ["news", "technology", "education"],
    lang: "en",
    dir: "ltr",
  };
}
