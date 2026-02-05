import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google"; // Turbo: Switch font
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono", // Turbo: Update variable name
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "MSU Campus Map",
  description: "Open source project for Midlands State University Campus Map. Uses NextJS and LeafletJS.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${jetbrainsMono.variable} antialiased`} // Turbo: Apply new font variable
      >
        <style dangerouslySetInnerHTML={{ __html: `
          @media (max-width: 768px) {
            .leaflet-control-attribution { display: none !important; }
          }
        `}} />
        {children}
      </body>
    </html>
  );
}
