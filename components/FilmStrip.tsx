"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { FilmRoll, Photo } from "@/types";

// Sprocket hole SVG tile (32×28px per hole unit)
const SPROCKET_SVG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='28'%3E%3Crect x='8' y='4' width='16' height='20' rx='3' fill='%23040201' stroke='%234a2006' stroke-width='0.75'/%3E%3C/svg%3E")`;

const sprocketTrack: React.CSSProperties = {
  height: "28px",
  flexShrink: 0,
  backgroundColor: "#060402",
  backgroundImage: SPROCKET_SVG,
  backgroundRepeat: "repeat-x",
  backgroundSize: "32px 28px",
  backgroundPosition: "left center",
};

// ── Canister ─────────────────────────────────────────────────────────────────
function Canister({ filmStock, rollNumber }: { filmStock: string; rollNumber: number }) {
  const parts = filmStock.toUpperCase().split(" ");
  const brand = parts[0];
  const iso = parts.find((p) => /^\d+$/.test(p)) ?? parts[parts.length - 1];

  return (
    <div style={{
      width: "130px",
      flexShrink: 0,
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      paddingLeft: "24px",
      paddingRight: "4px",
    }}>
      <div style={{
        width: "82px",
        height: "clamp(160px, 44vh, 230px)",
        borderRadius: "41px",
        background: "linear-gradient(105deg, #311a0c 0%, #190a04 48%, #311a0c 100%)",
        border: "1.5px solid #8a4824",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "7px",
        position: "relative",
        boxShadow: [
          "inset 6px 0 14px rgba(255,170,70,0.07)",
          "inset -6px 0 14px rgba(0,0,0,0.55)",
          "0 0 32px rgba(200,85,26,0.12)",
        ].join(", "),
      }}>
        {/* Metallic sheen stripe */}
        <div style={{
          position: "absolute",
          left: "11px",
          top: "28px",
          bottom: "28px",
          width: "7px",
          borderRadius: "4px",
          background: "linear-gradient(to bottom, rgba(255,200,100,0.2), transparent 40%, rgba(255,200,100,0.09) 80%, transparent)",
          pointerEvents: "none",
        }} />

        {/* Brand */}
        <span style={{
          fontFamily: "var(--font-display)",
          fontSize: "1.6rem",
          color: "var(--amber)",
          letterSpacing: "0.04em",
          lineHeight: 1,
          textShadow: "0 0 10px var(--amber)",
        }}>{brand}</span>

        {/* ISO */}
        <span style={{
          fontFamily: "var(--font-display)",
          fontSize: "1.1rem",
          color: "var(--text-muted)",
          letterSpacing: "0.1em",
        }}>{iso}</span>

        {/* Divider */}
        <div style={{ width: "38px", height: "1px", background: "var(--amber-dim)", opacity: 0.5 }} />

        {/* Roll number */}
        <span style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.65rem",
          color: "var(--text-dim)",
          letterSpacing: "0.2em",
        }}>ROLL {String(rollNumber).padStart(2, "0")}</span>

        {/* Film exit slot */}
        <div style={{
          position: "absolute",
          right: "-11px",
          top: "50%",
          transform: "translateY(-50%)",
          width: "11px",
          height: "54px",
          background: "#020100",
          borderTop: "1px solid #4a2006",
          borderBottom: "1px solid #4a2006",
          borderRight: "1px solid #4a2006",
          borderRadius: "0 2px 2px 0",
        }} />
      </div>
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
      width: "220px",
      flexShrink: 0,
      alignSelf: "stretch",
      borderLeft: "1px solid #180a04",
      borderRight: "1px solid #180a04",
      padding: "0 22px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      gap: "20px",
      background: "#070402",
    }}>
      {fields.map(({ label, value }) => (
        <div key={label}>
          <div style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.62rem",
            color: "var(--text-dim)",
            letterSpacing: "0.22em",
            marginBottom: "4px",
          }}>{label}</div>
          <div style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.85rem",
            color: "var(--text)",
            letterSpacing: "0.06em",
          }}>{value}</div>
        </div>
      ))}
      {roll.description && (
        <p style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.75rem",
          color: "var(--text-muted)",
          lineHeight: 1.75,
          letterSpacing: "0.04em",
          borderLeft: "1px solid var(--amber-dim)",
          paddingLeft: "10px",
          margin: 0,
        }}>{roll.description}</p>
      )}
      <div style={{
        fontFamily: "var(--font-mono)",
        fontSize: "0.68rem",
        color: "var(--amber)",
        letterSpacing: "0.15em",
        textShadow: "0 0 6px var(--amber)",
      }}>{String(roll.photos.length).padStart(2, "0")} FRAMES</div>
    </div>
  );
}

// ── Single film frame ─────────────────────────────────────────────────────────
interface FrameProps {
  photo: Photo;
  index: number;
  revealed: boolean;
  onOpen: () => void;
  didMoveRef: React.RefObject<boolean>;
}

function FilmFrame({ photo, index, revealed, onOpen, didMoveRef }: FrameProps) {
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
        borderLeft: "2px solid #0d0603",
        borderRight: "2px solid #0d0603",
        clipPath: revealed ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)",
        opacity: revealed ? 1 : 0,
        transition: `clip-path 0.7s ease-out ${index * 0.04}s, opacity 0.5s ease-out ${index * 0.04}s`,
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
          filter: "brightness(0.87) sepia(0.06)",
          transition: "filter 0.3s ease",
          display: "block",
        }}
      />

      {/* Frame number — always visible, bolder on hover via CSS class */}
      <div
        className="frame-num"
        style={{
          position: "absolute",
          bottom: "8px",
          left: "10px",
          fontFamily: "var(--font-mono)",
          fontSize: "0.75rem",
          color: "var(--amber)",
          letterSpacing: "0.12em",
          textShadow: "0 0 6px var(--amber)",
          background: "rgba(4,2,1,0.7)",
          padding: "2px 6px",
          opacity: 0.6,
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

      {/* Caption */}
      {photos[index].caption && (
        <div style={{ textAlign: "center", padding: "0 2rem 1.5rem", fontFamily: "var(--font-mono)", fontSize: "0.82rem", color: "var(--text-muted)", letterSpacing: "0.08em" }}>
          {photos[index].caption}
        </div>
      )}

      {/* Prev / Next */}
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

  // Drag-to-scroll (mouse)
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
      { root: el, rootMargin: "0px 120px 0px 0px", threshold: 0.05 }
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
      {/* ── Horizontal scroll strip ── */}
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
        {/* Film strip: column flex inside the scroll container */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          width: "max-content",
          minWidth: "100%",
          height: "100%",
          background: "#060402",
        }}>
          {/* Top sprocket track */}
          <div style={sprocketTrack} />

          {/* Main film content */}
          <div style={{
            flex: 1,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            background: "#080503",
            gap: 0,
            padding: "0",
          }}>
            {/* Canister */}
            <Canister filmStock={roll.filmStock} rollNumber={roll.rollNumber} />

            {/* Leader strip (blank film before first frame) */}
            <div style={{
              width: "80px",
              flexShrink: 0,
              alignSelf: "stretch",
              background: "#060301",
              borderLeft: "1px solid #140803",
            }} />

            {/* Metadata panel */}
            <MetadataPanel roll={roll} />

            {/* Gap between metadata and first frame */}
            <div style={{ width: "6px", flexShrink: 0, alignSelf: "stretch", background: "#070402", borderLeft: "1px solid #140803" }} />

            {/* Frames */}
            {roll.photos.length === 0 ? (
              <div style={{ display: "flex", alignItems: "center", padding: "0 60px", gap: "16px" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/film-icon.png" alt="" style={{ width: "48px", opacity: 0.15, filter: "sepia(0.5)" }} />
                <span style={{ color: "var(--text-dim)", fontFamily: "var(--font-mono)", fontSize: "0.85rem", letterSpacing: "0.18em" }}>
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
            <div style={{ width: "50vw", flexShrink: 0, alignSelf: "stretch", background: "#060301" }} />
          </div>

          {/* Bottom sprocket track */}
          <div style={sprocketTrack} />
        </div>
      </div>

      {/* Lightbox */}
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
