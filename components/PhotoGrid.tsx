"use client";

import { useState, useCallback, useEffect } from "react";
import type { Photo } from "@/types";

interface PhotoGridProps {
  photos: Photo[];
  rollId: string;
}

export default function PhotoGrid({ photos }: PhotoGridProps) {
  const [lightbox, setLightbox] = useState<number | null>(null);

  const prev = useCallback(() =>
    setLightbox((i) => (i !== null && i > 0 ? i - 1 : i)), []);
  const next = useCallback(() =>
    setLightbox((i) => (i !== null && i < photos.length - 1 ? i + 1 : i)), [photos.length]);
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
        <img src="/film-icon.png" alt="empty" style={{ width: "80px", opacity: 0.3 }} />
        <p style={{ color: "var(--text-dim)", fontFamily: "var(--font-mono)", fontSize: "0.6rem", letterSpacing: "0.2em" }}>
          NO FRAMES EXPOSED YET
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Photo count label */}
      <p style={{ color: "var(--text-dim)", fontFamily: "var(--font-mono)", fontSize: "0.55rem", letterSpacing: "0.2em", marginBottom: "1.5rem" }}>
        {String(photos.length).padStart(2, "0")} FRAMES
      </p>

      {/* Grid */}
      <div
        className="grid gap-1"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}
      >
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
              className="w-full h-full object-cover transition-all duration-700 group-hover:scale-103"
              style={{ filter: "brightness(0.92)" }}
            />

            {/* Hover overlay */}
            <div
              className="absolute inset-0 flex items-end opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: "linear-gradient(to top, rgba(14,11,9,0.7) 0%, transparent 50%)", padding: "0.75rem" }}
            >
              <span style={{ color: "var(--amber)", fontFamily: "var(--font-mono)", fontSize: "0.5rem", letterSpacing: "0.2em" }}>
                {String(index + 1).padStart(2, "0")}
                {photo.caption && <span style={{ color: "var(--text-muted)", marginLeft: "0.75rem" }}>{photo.caption}</span>}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="lightbox-enter fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(10,8,6,0.97)" }}
          onClick={close}
        >
          {/* Top bar */}
          <div
            className="absolute top-0 left-0 right-0 flex items-center justify-between px-8 py-5"
            style={{ borderBottom: "1px solid var(--border)" }}
          >
            <span style={{ color: "var(--amber)", fontFamily: "var(--font-mono)", fontSize: "0.6rem", letterSpacing: "0.2em" }}>
              {String(lightbox + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}
            </span>
            <button
              onClick={close}
              style={{ color: "var(--text-dim)", fontFamily: "var(--font-mono)", fontSize: "0.6rem", letterSpacing: "0.2em" }}
              className="hover:opacity-60 transition-opacity"
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
              style={{ maxHeight: "80vh", maxWidth: "100%", objectFit: "contain" }}
            />
            {photos[lightbox].caption && (
              <p
                className="font-display mt-5"
                style={{ color: "var(--text-muted)", fontSize: "1.05rem", fontStyle: "italic", letterSpacing: "0.02em" }}
              >
                {photos[lightbox].caption}
              </p>
            )}
          </div>

          {/* Prev */}
          {lightbox > 0 && (
            <button
              className="absolute left-0 top-0 bottom-0 px-6 flex items-center hover:opacity-60 transition-opacity"
              onClick={(e) => { e.stopPropagation(); prev(); }}
              style={{ color: "var(--text-dim)", fontSize: "2rem", fontFamily: "var(--font-mono)" }}
            >
              ‹
            </button>
          )}

          {/* Next */}
          {lightbox < photos.length - 1 && (
            <button
              className="absolute right-0 top-0 bottom-0 px-6 flex items-center hover:opacity-60 transition-opacity"
              onClick={(e) => { e.stopPropagation(); next(); }}
              style={{ color: "var(--text-dim)", fontSize: "2rem", fontFamily: "var(--font-mono)" }}
            >
              ›
            </button>
          )}
        </div>
      )}
    </>
  );
}
