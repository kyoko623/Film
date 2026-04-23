"use client";

import { useEffect, useState } from "react";

export default function DarkroomEntry() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("darkroom-transition")) {
      sessionStorage.removeItem("darkroom-transition");
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  return (
    <div
      className="darkroom-overlay"
      onAnimationEnd={() => setVisible(false)}
    />
  );
}
