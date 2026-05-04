import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const BASE_URL = "https://msucampusmap.online";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  title: {
    default: "MSU Campus Map | Midlands State University Interactive Map",
    template: "%s | MSU Campus Map",
  },

  description:
    "The official interactive campus map for Midlands State University, Gweru, Zimbabwe. Find buildings, lecture halls, hostels, and get directions across MSU's main campus — built by a Zimbabwean developer.",

  keywords: [
    // Brand / university
    "MSU campus map",
    "Midlands State University map",
    "MSU Gweru Zimbabwe",
    "MSU interactive map",
    "Midlands State University Gweru",
    "MSU buildings directory",
    "MSU lecture halls",
    "MSU hostels",
    "MSU campus guide",
    "MSU navigation",
    // Broader university/campus searches
    "university campus map Zimbabwe",
    "Zimbabwe university map",
    "campus map Africa",
    "interactive university map",
    "college campus navigation",
    // Dev/project discovery
    "Zimbabwe developer project",
    "Zimbabwean software project",
    "open source campus map",
    "Next.js campus map project",
    "student project Zimbabwe",
  ],

  authors: [{ name: "Takudzwa Mvere", url: "https://takudzwamvere.dev" }],
  creator: "Takudzwa Mvere",
  publisher: "Takudzwa Mvere",

  alternates: {
    canonical: BASE_URL,
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },

  openGraph: {
    type: "website",
    url: BASE_URL,
    siteName: "MSU Campus Map",
    locale: "en_ZW",
    title: "MSU Campus Map | Midlands State University Interactive Map",
    description:
      "The official interactive campus map for Midlands State University, Gweru, Zimbabwe. Find buildings, lecture halls, hostels, and get directions across MSU's main campus.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "MSU Campus Map — Midlands State University Interactive Map, Gweru Zimbabwe",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "MSU Campus Map | Midlands State University Interactive Map",
    description:
      "Interactive campus map for Midlands State University, Gweru, Zimbabwe. Find buildings, get directions, explore campus.",
    images: ["/og-image.png"],
  },

  manifest: "/manifest.ts",

  other: {
    "theme-color": "#000000",

    "application/ld+json": JSON.stringify([
      // Schema 1: The map tool itself
      {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "MSU Campus Map",
        url: BASE_URL,
        description:
          "Interactive campus map for Midlands State University in Gweru, Zimbabwe. Navigate buildings, lecture halls, and hostels with turn-by-turn directions.",
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "Web",
        inLanguage: "en",
        author: {
          "@type": "Person",
          name: "Takudzwa Mvere",
          url: "https://takudzwamvere.dev",
        },
        about: {
          "@type": "EducationalOrganization",
          name: "Midlands State University",
          url: "https://www.msu.ac.zw",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Gweru",
            addressRegion: "Midlands",
            addressCountry: "ZW",
          },
          geo: {
            "@type": "GeoCoordinates",
            latitude: -19.4547,
            longitude: 29.7946,
          },
        },
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
      },
      // Schema 2: Breadcrumb for search result display
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: BASE_URL,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Campus Map",
            item: `${BASE_URL}/map`,
          },
        ],
      },
    ]),
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${jetbrainsMono.variable} antialiased`}>
        {children}
        <Script
          src="https://analytics.takudzwamvere.com/script.js"
          data-website-id="3766f0d7-4b3e-499b-9caa-9af0745efe90"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}