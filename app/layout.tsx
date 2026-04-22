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

        {/* Live grain — SVG feTurbulence, seed animated by inline script */}
        <svg
          aria-hidden="true"
          style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 9997 }}
        >
          <filter id="crt-noise" x="0%" y="0%" width="100%" height="100%" colorInterpolationFilters="linearRGB">
            <feTurbulence id="crt-turbulence" type="fractalNoise" baseFrequency="0.72" numOctaves="4" seed="0" stitchTiles="stitch" result="noise" />
            <feColorMatrix type="saturate" values="0" in="noise" result="grey" />
            <feBlend in="SourceGraphic" in2="grey" mode="overlay" result="blend" />
            <feComponentTransfer in="blend">
              <feFuncA type="linear" slope="0.045" />
            </feComponentTransfer>
          </filter>
          <rect width="100%" height="100%" filter="url(#crt-noise)" />
        </svg>

        {/* Global overlays */}
        <div className="vignette" />

        {/* Content */}
        <div className="relative z-10 min-h-full flex flex-col">
          {children}
        </div>

        {/* Animate grain seed every frame — pure vanilla JS, no deps */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function(){
  var t = document.getElementById('crt-turbulence');
  var s = 0;
  function step(){
    if(t) t.setAttribute('seed', (s = (s + 1) % 1000));
    requestAnimationFrame(step);
  }
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', step);
  } else {
    step();
  }
})();
`,
          }}
        />
      </body>
    </html>
  );
}
