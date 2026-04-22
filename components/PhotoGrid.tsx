"use client";

import { useState } from "react";
import type { Photo } from "@/types";

interface PhotoGridProps {
  photos: Photo[];
  rollId: string;
}

export default function PhotoGrid({ photos }: PhotoGridProps) {
  const [lightbox, setLightbox] = useState<number | null>(null);

  if (photos.length === 0) {
    return (
      <div className="text-center py-20 text-stone-500">
        No photos in this roll yet.
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1">
        {photos.map((photo, index) => (
          <div
            key={photo.id}
            className="aspect-square bg-stone-800 overflow-hidden cursor-pointer group"
            onClick={() => setLightbox(index)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo.filename}
              alt={photo.caption || `Frame ${index + 1}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        ))}
      </div>

      {lightbox !== null && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-4 right-4 text-white text-2xl w-10 h-10"
            onClick={() => setLightbox(null)}
          >
            ✕
          </button>
          <button
            className="absolute left-4 text-white text-3xl px-4 py-8"
            onClick={(e) => {
              e.stopPropagation();
              setLightbox((prev) => (prev !== null && prev > 0 ? prev - 1 : prev));
            }}
          >
            ‹
          </button>
          <div
            className="max-w-4xl max-h-[90vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photos[lightbox].filename}
              alt={photos[lightbox].caption || `Frame ${lightbox + 1}`}
              className="max-h-[80vh] max-w-full object-contain"
            />
            {photos[lightbox].caption && (
              <p className="text-stone-400 text-sm mt-3">{photos[lightbox].caption}</p>
            )}
            <p className="text-stone-600 text-xs mt-1">
              {lightbox + 1} / {photos.length}
            </p>
          </div>
          <button
            className="absolute right-4 text-white text-3xl px-4 py-8"
            onClick={(e) => {
              e.stopPropagation();
              setLightbox((prev) =>
                prev !== null && prev < photos.length - 1 ? prev + 1 : prev
              );
            }}
          >
            ›
          </button>
        </div>
      )}
    </>
  );
}
