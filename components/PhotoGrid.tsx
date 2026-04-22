"use client";

import { useState, useCallback, useEffect } from "react";
import type { Photo } from "@/types";

interface PhotoGridProps {
  photos: Photo[];
  rollId: string;
}

export default function PhotoGrid({ photos }: PhotoGridProps) {
  const [lightbox, setLightbox] = useState<number | null>(null);

  const prev  = useCallback(() => setLightbox((i) => (i !== null && i > 0 ? i - 1 : i)), []);
  const next  = useCallback(() => setLightbox((i) => (i !== null && i < photos.length - 1 ? i + 1 : i)), [photos.length]);
  const close = useCallback(() => setLightbox(null), []);

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, prev, next, close]);

  if (photos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/film-icon.png" alt="empty" style={{ width: "72px", opacity: 0.2, filter: "sepia(0.5) hue-rotate(-15deg)" }} />
        <p style={{ color: "var(--text-dim)", fontFamily: "var(--font-mono)", fontSize: "0.58rem", letterSpacing: "0.22em" }}>
          NO FRAMES EXPOSED YET
        </p>
      </div>
    );
  }

  return (
    <>
      <p style={{ color: "var(--text-dim)", fontFamily: "var(--font-mono)", fontSize: "0.52rem", letterSpacing: "0.22em", marginBottom: "1.5rem" }}>
        {String(photos.length).padStart(2, "0")} FRAMES
      </p>

      <div className="grid gap-1" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}>
        {photos.map((photo, index) => (
          <div
            key={photo.id}
            className="photo-frame overflow-hidden cursor-pointer group relative"
            style={{ aspectRatio: "3/2", background: "var(--bg-card)" }}
            onClick={() => setLightbox(index)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo.filename}
              alt={photo.caption || `Frame ${index + 1}`}
              className="w-full h-full object-cover transition-all duration-700"
              style={{ filter: "brightness(0.88) sepia(0.05)" }}
            />
            {/* Hover: darkroom red tint */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
              style={{ background: "rgba(140, 30, 5, 0.12)", mixBlendMode: "multiply" }}
            />
            {/* Frame number */}
            <div
              className="absolute bottom-0 left-0 opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ padding: "0.3rem 0.5rem", fontSize: "0.48rem", letterSpacing: "0.18em", fontFamily: "var(--font-mono)", color: "var(--amber)", background: "rgba(8,6,4,0.8)", textShadow: "0 0 6px var(--amber)" }}
            >
              {String(index + 1).padStart(2, "0")}
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="lightbox-enter fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(6,4,2,0.97)" }}
          onClick={close}
        >
          {/* Top bar */}
          <div
            className="absolute top-0 left-0 right-0 flex items-center justify-between px-8 py-5"
            style={{ borderBottom: "1px solid var(--border)" }}
          >
            <span className="glow" style={{ color: "var(--amber)", fontFamily: "var(--font-mono)", fontSize: "0.58rem", letterSpacing: "0.22em" }}>
              {String(lightbox + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}
            </span>
            <button
              onClick={close}
              className="hover:opacity-60 transition-opacity"
              style={{ color: "var(--text-dim)", fontFamily: "var(--font-mono)", fontSize: "0.58rem", letterSpacing: "0.22em" }}
            >
              ESC
            </button>
          </div>

          {/* Image */}
          <div
            className="flex flex-col items-center"
            style={{ maxWidth: "88vw", maxHeight: "88vh" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photos[lightbox].filename}
              alt={photos[lightbox].caption || `Frame ${lightbox + 1}`}
              style={{ maxHeight: "80vh", maxWidth: "100%", objectFit: "contain", filter: "brightness(0.92)" }}
            />
            {photos[lightbox].caption && (
              <p className="font-display mt-5" style={{ color: "var(--text-muted)", fontSize: "1rem", fontStyle: "italic" }}>
                {photos[lightbox].caption}
              </p>
            )}
          </div>

          {lightbox > 0 && (
            <button
              className="absolute left-0 top-0 bottom-0 px-6 flex items-center hover:opacity-50 transition-opacity"
              onClick={(e) => { e.stopPropagation(); prev(); }}
              style={{ color: "var(--text-dim)", fontSize: "2rem" }}
            >‹</button>
          )}
          {lightbox < photos.length - 1 && (
            <button
              className="absolute right-0 top-0 bottom-0 px-6 flex items-center hover:opacity-50 transition-opacity"
              onClick={(e) => { e.stopPropagation(); next(); }}
              style={{ color: "var(--text-dim)", fontSize: "2rem" }}
            >›</button>
          )}
        </div>
      )}
    </>
  );
}
