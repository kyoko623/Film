"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { FilmRoll, Photo } from "@/types";

// ── Sprocket holes: cream/warm-white on dark-brown (matches pixel art reference) ──
const SPROCKET_SVG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='28'%3E%3Crect x='7' y='4' width='18' height='20' rx='2' fill='%23c8b48a'/%3E%3C/svg%3E")`;

const sprocketTrack: React.CSSProperties = {
  height: "30px",
  flexShrink: 0,
  backgroundColor: "#2d1a0d",
  backgroundImage: SPROCKET_SVG,
  backgroundRepeat: "repeat-x",
  backgroundSize: "32px 30px",
  backgroundPosition: "left center",
};

// Strip body color — dark warm brown matching the pixel art film strip
const STRIP_BG = "#1c0e06";

// ── Canister: pixel-art film-icon.png ────────────────────────────────────────
function Canister() {
  return (
    <div style={{
      flexShrink: 0,
      height: "100%",
      display: "flex",
      alignItems: "center",
      paddingLeft: "8px",
      // Slight negative right margin so the strip "starts" under the film exit
      marginRight: "-24px",
      position: "relative",
      zIndex: 1,
    }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/film-icon.png"
        alt="film canister"
        style={{
          height: "88%",
          width: "auto",
          objectFit: "contain",
          display: "block",
          // Crisp pixel rendering
          imageRendering: "pixelated",
        }}
      />
    </div>
  );
}

// ── Metadata panel (film leader notes) ───────────────────────────────────────
function MetadataPanel({ roll }: { roll: FilmRoll }) {
  const fields = [
    { label: "DATE", value: roll.date },
    { label: "LOCATION", value: roll.location },
    { label: "CAMERA", value: roll.camera },
  ].filter((f) => f.value);

  return (
    <div style={{
      width: "210px",
      flexShrink: 0,
      alignSelf: "stretch",
      borderLeft: "2px solid #2d1a0d",
      borderRight: "2px solid #2d1a0d",
      padding: "0 20px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      gap: "18px",
      background: STRIP_BG,
    }}>
      {/* Film stock label at top of panel */}
      <div style={{
        fontFamily: "var(--font-display)",
        fontSize: "1.4rem",
        color: "var(--amber)",
        letterSpacing: "0.06em",
        textShadow: "0 0 8px var(--amber)",
        lineHeight: 1,
        borderBottom: "1px solid #3a2010",
        paddingBottom: "12px",
      }}>{roll.filmStock.toUpperCase()}</div>

      {fields.map(({ label, value }) => (
        <div key={label}>
          <div style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.62rem",
            color: "#6a4830",
            letterSpacing: "0.22em",
            marginBottom: "4px",
          }}>{label}</div>
          <div style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.85rem",
            color: "#c8a878",
            letterSpacing: "0.06em",
          }}>{value}</div>
        </div>
      ))}

      {roll.description && (
        <p style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.72rem",
          color: "#8a6040",
          lineHeight: 1.75,
          letterSpacing: "0.04em",
          borderLeft: "2px solid #5a3018",
          paddingLeft: "10px",
          margin: 0,
        }}>{roll.description}</p>
      )}

      <div style={{
        fontFamily: "var(--font-mono)",
        fontSize: "0.7rem",
        color: "var(--amber)",
        letterSpacing: "0.15em",
        textShadow: "0 0 6px var(--amber)",
      }}>{String(roll.photos.length).padStart(2, "0")} FRAMES</div>
    </div>
  );
}

// ── Single film frame ─────────────────────────────────────────────────────────
function FilmFrame({
  photo,
  index,
  revealed,
  onOpen,
  didMoveRef,
}: {
  photo: Photo;
  index: number;
  revealed: boolean;
  onOpen: () => void;
  didMoveRef: React.RefObject<boolean>;
}) {
  return (
    <div
      data-frame={index}
      className="film-frame"
      onClick={() => { if (!didMoveRef.current) onOpen(); }}
      style={{
        height: "100%",
        aspectRatio: "2 / 3",
        flexShrink: 0,
        position: "relative",
        overflow: "hidden",
        // Film frame border uses the strip dark brown
        borderLeft: "3px solid #2d1a0d",
        borderRight: "3px solid #2d1a0d",
        clipPath: revealed ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)",
        opacity: revealed ? 1 : 0,
        transition: `clip-path 0.65s cubic-bezier(0.22,1,0.36,1) ${index * 0.03}s, opacity 0.4s ease ${index * 0.03}s`,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={photo.filename}
        alt={photo.caption || `Frame ${index + 1}`}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: "brightness(0.87) sepia(0.05)",
          transition: "filter 0.3s ease",
          display: "block",
        }}
      />

      {/* Frame number badge */}
      <div
        className="frame-num"
        style={{
          position: "absolute",
          bottom: "8px",
          left: "8px",
          fontFamily: "var(--font-mono)",
          fontSize: "0.75rem",
          color: "#c8b48a",
          letterSpacing: "0.12em",
          background: "rgba(12,5,2,0.75)",
          padding: "2px 7px",
          opacity: 0.55,
          transition: "opacity 0.2s",
        }}
      >
        {String(index + 1).padStart(2, "0")}
      </div>
    </div>
  );
}

// ── Lightbox ─────────────────────────────────────────────────────────────────
function Lightbox({
  photos,
  index,
  onClose,
  onPrev,
  onNext,
}: {
  photos: Photo[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") onPrev();
      else if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, onPrev, onNext]);

  return (
    <div
      className="lightbox-enter"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9990,
        background: "rgba(4,2,1,0.97)",
        display: "flex",
        flexDirection: "column",
      }}
      onClick={onClose}
    >
      {/* Top bar */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "1.2rem 2rem",
        borderBottom: "1px solid var(--border)",
        flexShrink: 0,
      }}>
        <span className="glow" style={{ color: "var(--amber)", fontFamily: "var(--font-mono)", fontSize: "0.88rem", letterSpacing: "0.2em" }}>
          {String(index + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}
        </span>
        <button
          onClick={onClose}
          style={{
            color: "var(--text)",
            border: "1px solid var(--border-visible)",
            background: "none",
            padding: "0.2rem 0.7rem",
            fontFamily: "var(--font-mono)",
            fontSize: "0.82rem",
            letterSpacing: "0.18em",
            cursor: "pointer",
          }}
        >ESC</button>
      </div>

      {/* Image */}
      <div
        style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photos[index].filename}
          alt={photos[index].caption || `Frame ${index + 1}`}
          style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain", filter: "brightness(0.92)" }}
        />
      </div>

      {photos[index].caption && (
        <div style={{ textAlign: "center", padding: "0 2rem 1.5rem", fontFamily: "var(--font-mono)", fontSize: "0.82rem", color: "var(--text-muted)", letterSpacing: "0.08em" }}>
          {photos[index].caption}
        </div>
      )}

      {index > 0 && (
        <button
          className="glow"
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          style={{
            position: "absolute", left: 0, top: "56px", bottom: 0,
            padding: "0 1.5rem", fontSize: "2.2rem",
            color: "var(--amber)", background: "none", border: "none", cursor: "pointer",
            display: "flex", alignItems: "center",
          }}
        >‹</button>
      )}
      {index < photos.length - 1 && (
        <button
          className="glow"
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          style={{
            position: "absolute", right: 0, top: "56px", bottom: 0,
            padding: "0 1.5rem", fontSize: "2.2rem",
            color: "var(--amber)", background: "none", border: "none", cursor: "pointer",
            display: "flex", alignItems: "center",
          }}
        >›</button>
      )}
    </div>
  );
}

// ── Main FilmStrip ────────────────────────────────────────────────────────────
export default function FilmStrip({ roll }: { roll: FilmRoll }) {
  const stripRef = useRef<HTMLDivElement>(null);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const didMoveRef = useRef(false);
  const dragRef = useRef({ active: false, startX: 0, startScroll: 0 });

  // Vertical → horizontal scroll conversion
  useEffect(() => {
    const el = stripRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) >= Math.abs(e.deltaX)) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  // Drag-to-scroll
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    didMoveRef.current = false;
    dragRef.current = { active: true, startX: e.clientX, startScroll: stripRef.current!.scrollLeft };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.active) return;
    const dx = e.clientX - dragRef.current.startX;
    if (Math.abs(dx) > 5) {
      didMoveRef.current = true;
      stripRef.current!.scrollLeft = dragRef.current.startScroll - dx;
    }
  };
  const onPointerUp = () => { dragRef.current.active = false; };

  // Frame reveal via IntersectionObserver
  useEffect(() => {
    const el = stripRef.current;
    if (!el || roll.photos.length === 0) return;
    const frames = el.querySelectorAll("[data-frame]");
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number((entry.target as HTMLElement).dataset.frame);
            setRevealed((s) => new Set([...s, idx]));
            obs.unobserve(entry.target);
          }
        });
      },
      { root: el, rootMargin: "0px 150px 0px 0px", threshold: 0.05 }
    );
    frames.forEach((f) => obs.observe(f));
    return () => obs.disconnect();
  }, [roll.photos.length]);

  const openLightbox = useCallback((i: number) => setLightbox(i), []);
  const closeLightbox = useCallback(() => setLightbox(null), []);
  const prevPhoto = useCallback(() => setLightbox((i) => (i !== null && i > 0 ? i - 1 : i)), []);
  const nextPhoto = useCallback(() => setLightbox((i) => (i !== null && i < roll.photos.length - 1 ? i + 1 : i)), [roll.photos.length]);

  return (
    <>
      <div
        ref={stripRef}
        className="film-strip-scroll"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        style={{
          width: "100%",
          height: "calc(100vh - 56px)",
          overflowX: "auto",
          overflowY: "hidden",
          cursor: "grab",
          userSelect: "none",
          touchAction: "pan-x",
        }}
      >
        {/* Film strip inner (column flex, width: max-content so it extends as far as needed) */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          width: "max-content",
          minWidth: "100%",
          height: "100%",
        }}>
          {/* Top sprocket track */}
          <div style={sprocketTrack} />

          {/* Film body */}
          <div style={{
            flex: 1,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            background: STRIP_BG,
          }}>
            {/* Pixel-art canister */}
            <Canister />

            {/* Leader strip — blank dark film before first content */}
            <div style={{
              width: "60px",
              flexShrink: 0,
              alignSelf: "stretch",
              background: STRIP_BG,
              borderRight: "2px solid #2d1a0d",
            }} />

            {/* Metadata panel */}
            <MetadataPanel roll={roll} />

            {/* Thin gap before frames */}
            <div style={{ width: "8px", flexShrink: 0, alignSelf: "stretch", background: STRIP_BG, borderLeft: "2px solid #2d1a0d" }} />

            {/* Frames */}
            {roll.photos.length === 0 ? (
              <div style={{ display: "flex", alignItems: "center", padding: "0 60px", gap: "16px" }}>
                <span style={{ color: "#6a4830", fontFamily: "var(--font-mono)", fontSize: "0.85rem", letterSpacing: "0.18em" }}>
                  NO FRAMES EXPOSED
                </span>
              </div>
            ) : (
              roll.photos.map((photo, i) => (
                <FilmFrame
                  key={photo.id}
                  photo={photo}
                  index={i}
                  revealed={revealed.has(i)}
                  onOpen={() => openLightbox(i)}
                  didMoveRef={didMoveRef}
                />
              ))
            )}

            {/* Trailing blank strip */}
            <div style={{ width: "50vw", flexShrink: 0, alignSelf: "stretch", background: STRIP_BG }} />
          </div>

          {/* Bottom sprocket track */}
          <div style={sprocketTrack} />
        </div>
      </div>

      {lightbox !== null && (
        <Lightbox
          photos={roll.photos}
          index={lightbox}
          onClose={closeLightbox}
          onPrev={prevPhoto}
          onNext={nextPhoto}
        />
      )}
    </>
  );
}
