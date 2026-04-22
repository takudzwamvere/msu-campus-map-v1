import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "MSU Campus Map | Midlands State University Interactive Map",
  description: "Navigate Midlands State University with ease. Find buildings, lecture halls, dormitories, and get turn-by-turn directions across the Gweru main campus.",
  keywords: ["MSU", "Midlands State University", "campus map", "Gweru", "navigation", "university map"],
  openGraph: {
    title: "MSU Campus Map",
    description: "Interactive campus map for Midlands State University — find buildings, get directions, and explore campus.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script defer src="https://analytics.msucampusmap.online/script.js" data-website-id="65b6ccc5-9567-4372-a2c0-d5414b8d2154"></script>
      </head>
      <body className={`${jetbrainsMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
