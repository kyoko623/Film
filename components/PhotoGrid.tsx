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
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightbox, prev, next, close]);

  if (photos.length === 0) {
    return (
      <div style={{ color: "var(--text-dim)", fontFamily: "var(--font-mono)", fontSize: "0.65rem", letterSpacing: "0.15em", padding: "4rem 0" }}>
        NO FRAMES EXPOSED
      </div>
    );
  }

  return (
    <>
      {/* Contact sheet grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1">
        {photos.map((photo, index) => (
          <div
            key={photo.id}
            className="photo-frame overflow-hidden cursor-pointer group"
            style={{ aspectRatio: "1", background: "var(--bg-card)", position: "relative" }}
            onClick={() => setLightbox(index)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo.filename}
              alt={photo.caption || `Frame ${index + 1}`}
              className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
              style={{ filter: "sepia(0.06) brightness(0.93)" }}
            />
            {/* Frame number */}
            <div
              className="absolute bottom-0 left-0 opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ padding: "0.35rem 0.5rem", fontSize: "0.5rem", letterSpacing: "0.15em", fontFamily: "var(--font-mono)", color: "var(--amber)", background: "rgba(14,11,9,0.75)" }}
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
          style={{ background: "rgba(14,11,9,0.96)" }}
          onClick={close}
        >
          {/* Close */}
          <button
            onClick={close}
            className="absolute top-6 right-6"
            style={{ color: "var(--text-dim)", fontSize: "0.6rem", letterSpacing: "0.2em", fontFamily: "var(--font-mono)" }}
          >
            ESC
          </button>

          {/* Counter */}
          <div
            className="absolute top-6 left-6"
            style={{ color: "var(--amber)", fontSize: "0.6rem", letterSpacing: "0.2em", fontFamily: "var(--font-mono)" }}
          >
            {String(lightbox + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}
          </div>

          {/* Image */}
          <div
            className="flex flex-col items-center"
            style={{ maxWidth: "90vw", maxHeight: "90vh" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photos[lightbox].filename}
              alt={photos[lightbox].caption || `Frame ${lightbox + 1}`}
              style={{ maxHeight: "82vh", maxWidth: "100%", objectFit: "contain", filter: "sepia(0.04)" }}
            />
            {photos[lightbox].caption && (
              <p
                className="font-display mt-4"
                style={{ color: "var(--text-muted)", fontSize: "1rem", fontStyle: "italic" }}
              >
                {photos[lightbox].caption}
              </p>
            )}
          </div>

          {/* Prev */}
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-6"
            style={{ color: "var(--text-dim)", fontSize: "1.5rem", padding: "1rem", fontFamily: "var(--font-mono)" }}
          >
            ‹
          </button>

          {/* Next */}
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-6"
            style={{ color: "var(--text-dim)", fontSize: "1.5rem", padding: "1rem", fontFamily: "var(--font-mono)" }}
          >
            ›
          </button>
        </div>
      )}
    </>
  );
}
