import type { Metadata } from "next";
import { VT323, Space_Mono } from "next/font/google";
import "./globals.css";

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
  title: "[ FILMEE ]",
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
        {/* Pure CSS CRT background */}
        <div className="crt-bg" />
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
