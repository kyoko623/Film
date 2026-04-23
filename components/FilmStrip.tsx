"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { FilmRoll, Photo } from "@/types";

// ── Metadata panel ────────────────────────────────────────────────────────────
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
      borderRight: "1px solid var(--border)",
      padding: "2.5rem 1.8rem",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      gap: "1.5rem",
      background: "var(--bg)",
    }}>
      <div style={{
        fontFamily: "var(--font-display)",
        fontSize: "1.1rem",
        color: "var(--text)",
        fontWeight: 400,
        letterSpacing: "-0.01em",
        borderBottom: "1px solid var(--border)",
        paddingBottom: "1rem",
      }}>{roll.filmStock}</div>

      {fields.map(({ label, value }) => (
        <div key={label}>
          <div style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.6rem",
            color: "var(--text-dim)",
            letterSpacing: "0.18em",
            marginBottom: "4px",
          }}>{label}</div>
          <div style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.82rem",
            color: "var(--text)",
            letterSpacing: "0.04em",
          }}>{value}</div>
        </div>
      ))}

      {roll.description && (
        <p style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.72rem",
          color: "var(--text-muted)",
          lineHeight: 1.7,
          borderLeft: "2px solid var(--border)",
          paddingLeft: "10px",
          margin: 0,
        }}>{roll.description}</p>
      )}

      <div style={{
        fontFamily: "var(--font-mono)",
        fontSize: "0.68rem",
        color: "var(--text-dim)",
        letterSpacing: "0.12em",
        marginTop: "auto",
      }}>{String(roll.photos.length).padStart(2, "0")} FRAMES</div>
    </div>
  );
}

// ── Film frame ────────────────────────────────────────────────────────────────
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
        borderRight: "1px solid var(--border)",
        clipPath: revealed ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)",
        opacity: revealed ? 1 : 0,
        transition: `clip-path 0.55s cubic-bezier(0.22,1,0.36,1) ${index * 0.025}s, opacity 0.35s ease ${index * 0.025}s`,
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
          display: "block",
          transition: "opacity 0.25s ease",
        }}
      />

      {/* Frame number */}
      <div
        className="frame-num"
        style={{
          position: "absolute",
          bottom: "10px",
          left: "10px",
          fontFamily: "var(--font-mono)",
          fontSize: "0.72rem",
          color: "#ffffff",
          letterSpacing: "0.1em",
          background: "rgba(0,0,0,0.4)",
          padding: "2px 7px",
          opacity: 0.5,
          transition: "opacity 0.2s",
        }}
      >
        {String(index + 1).padStart(2, "0")}
      </div>
    </div>
  );
}

// ── Lightbox ──────────────────────────────────────────────────────────────────
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
        background: "rgba(240,232,216,0.97)",
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
        padding: "1rem 1.5rem",
        borderBottom: "1px solid var(--border)",
        flexShrink: 0,
      }}>
        <span style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)", fontSize: "0.82rem", letterSpacing: "0.15em" }}>
          {String(index + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}
        </span>
        <button
          onClick={onClose}
          style={{
            color: "var(--text)",
            border: "1px solid var(--border)",
            background: "none",
            padding: "0.2rem 0.7rem",
            fontFamily: "var(--font-mono)",
            fontSize: "0.75rem",
            letterSpacing: "0.15em",
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
          style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }}
        />
      </div>

      {photos[index].caption && (
        <div style={{ textAlign: "center", padding: "0 2rem 1.5rem", fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--text-muted)", letterSpacing: "0.06em" }}>
          {photos[index].caption}
        </div>
      )}

      {index > 0 && (
        <button
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          style={{
            position: "absolute", left: 0, top: "57px", bottom: 0,
            padding: "0 1.5rem", fontSize: "1.8rem",
            color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer",
            display: "flex", alignItems: "center",
            transition: "color 0.15s",
          }}
        >‹</button>
      )}
      {index < photos.length - 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          style={{
            position: "absolute", right: 0, top: "57px", bottom: 0,
            padding: "0 1.5rem", fontSize: "1.8rem",
            color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer",
            display: "flex", alignItems: "center",
            transition: "color 0.15s",
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

  // Vertical → horizontal scroll
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

  // Frame reveal
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
          display: "flex",
          flexDirection: "row",
          background: "var(--bg)",
        }}
      >
        {/* Metadata panel — left anchor */}
        <MetadataPanel roll={roll} />

        {/* Frames */}
        {roll.photos.length === 0 ? (
          <div style={{ display: "flex", alignItems: "center", padding: "0 4rem" }}>
            <span style={{ color: "var(--text-dim)", fontFamily: "var(--font-mono)", fontSize: "0.82rem", letterSpacing: "0.15em" }}>
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

        {/* Trailing space */}
        <div style={{ width: "30vw", flexShrink: 0 }} />
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
