"use client";

import { useEffect } from "react";

export default function HeroBackground() {
  useEffect(() => {
    const existing = document.getElementById("unicorn-script");
    if (existing) {
      (window as any).UnicornStudio?.init?.();
      return;
    }
    const script = document.createElement("script");
    script.id = "unicorn-script";
    script.src = "https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.1.9/dist/unicornStudio.umd.js";
    script.onload = () => (window as any).UnicornStudio?.init?.();
    document.head.appendChild(script);
  }, []);

  return (
    <div
      data-us-project="01tAR7BDnlrFzHjopQu9"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
    />
  );
}
