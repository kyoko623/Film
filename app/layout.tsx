import type { Metadata } from "next";
import { VT323, Space_Mono } from "next/font/google";
import "./globals.css";
import HeroBackground from "@/components/HeroBackground";

const vt323 = VT323({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400"],
});

const spaceMono = Space_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "filmee",
  description: "feel me",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh" className={`${vt323.variable} ${spaceMono.variable} h-full`}>
      <body className="min-h-full flex flex-col">
        {/* Full-page animation background */}
        <div className="fixed inset-0 z-0">
          <HeroBackground />
        </div>
        {/* Global overlays */}
        <div className="vignette" />
        {/* Content */}
        <div className="relative z-10 min-h-full flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
