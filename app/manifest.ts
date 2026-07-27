import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "MSU Campus Map",
    short_name: "MSU Map",
    description:
      "Interactive campus map for Midlands State University, Gweru, Zimbabwe.",
    start_url: "/",
    display: "standalone",
    background_color: "#0d1117",
    theme_color: "#1a1a2e",
    orientation: "portrait-primary",
    categories: ["education", "navigation", "utilities"],
    lang: "en-ZW",
    icons: [
      { src: "/icons/icon-72.png",  sizes: "72x72",  type: "image/png" },
      { src: "/icons/icon-96.png",  sizes: "96x96",  type: "image/png" },
      { src: "/icons/icon-128.png", sizes: "128x128", type: "image/png" },
      { src: "/icons/icon-144.png", sizes: "144x144", type: "image/png" },
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-maskable-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      {
        name: "Search Buildings",
        url: "/?action=search",
        description: "Search for a campus building",
      },
      {
        name: "Get Directions",
        url: "/?action=directions",
        description: "Navigate to a campus building",
      },
    ],
    prefer_related_applications: false,
  };
}