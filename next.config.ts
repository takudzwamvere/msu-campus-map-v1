import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === "development",
  workboxOptions: {
    disableDevLogs: true,
    runtimeCaching: [
      // ── OSM tile caching — cache-first, 30-day TTL ────────────────────
      {
        urlPattern: /^https:\/\/[abc]\.tile\.openstreetmap\.org\/.*/i,
        handler: "CacheFirst",
        options: {
          cacheName: "osm-tiles",
          expiration: { maxEntries: 2000, maxAgeSeconds: 60 * 60 * 24 * 30 },
          cacheableResponse: { statuses: [0, 200] },
        },
      },
      // ── Other tile providers (satellite, etc.) ────────────────────────
      {
        urlPattern: /^https:\/\/server\.arcgisonline\.com\/.*/i,
        handler: "CacheFirst",
        options: {
          cacheName: "esri-tiles",
          expiration: { maxEntries: 1000, maxAgeSeconds: 60 * 60 * 24 * 14 },
          cacheableResponse: { statuses: [0, 200] },
        },
      },
      {
        urlPattern: /^https:\/\/mt[0-3]\.google\.com\/.*/i,
        handler: "CacheFirst",
        options: {
          cacheName: "google-tiles",
          expiration: { maxEntries: 1000, maxAgeSeconds: 60 * 60 * 24 * 14 },
          cacheableResponse: { statuses: [0, 200] },
        },
      },
      // ── Buildings API — network-first, fall back to cache ─────────────
      {
        urlPattern: /\/api\/buildings/,
        handler: "NetworkFirst",
        options: {
          cacheName: "campus-buildings-api",
          expiration: { maxEntries: 1, maxAgeSeconds: 60 * 60 * 24 * 7 },
          networkTimeoutSeconds: 5,
        },
      },
      // ── Campus Events & Safety Reports — network-first fallback ────────
      {
        urlPattern: /\/api\/(events|report)/,
        handler: "NetworkFirst",
        options: {
          cacheName: "campus-dynamics-api",
          expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 3 },
          networkTimeoutSeconds: 4,
        },
      },
      // ── Next.js static assets — stale-while-revalidate ────────────────
      {
        urlPattern: /\/_next\/static\/.*/i,
        handler: "StaleWhileRevalidate",
        options: { cacheName: "next-static" },
      },
    ],
  },
  fallbacks: {
    document: "/offline.html",
  },
});

const nextConfig: NextConfig = {
  turbopack: {},
};

export default withPWA(nextConfig);
