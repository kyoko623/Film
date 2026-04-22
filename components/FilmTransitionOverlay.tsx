"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import type { FilmRoll } from "@/types";

interface Props {
  roll: FilmRoll;
  onClose: () => void;
}

function Canister({ roll }: { roll: FilmRoll }) {
  return (
    <div
      style={{
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "84px",
        position: "relative",
        zIndex: 2,
      }}
    >
      {/* Top oval cap */}
      <div
        style={{
          width: "84px",
          height: "22px",
          background: "linear-gradient(180deg, #2e2218 0%, #1a1410 100%)",
          borderRadius: "50% 50% 0 0 / 100% 100% 0 0",
          border: "1px solid rgba(200,85,26,0.35)",
          borderBottom: "none",
        }}
      />
      {/* Body */}
      <div
        style={{
          width: "76px",
          height: "186px",
          background:
            "linear-gradient(160deg, #221c14 0%, #171209 35%, #0e0b07 65%, #1c1610 100%)",
          border: "1px solid rgba(200,85,26,0.22)",
          borderTop: "none",
          borderBottom: "none",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "12px",
          position: "relative",
        }}
      >
        {/* Spool ring */}
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            border: "1.5px solid rgba(200,85,26,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: "11px",
              height: "11px",
              borderRadius: "50%",
              background: "rgba(200,85,26,0.45)",
              boxShadow: "0 0 6px rgba(200,85,26,0.3)",
            }}
          />
        </div>

        {/* Label block */}
        <div
          style={{
            background: "rgba(200,85,26,0.06)",
            border: "1px solid rgba(200,85,26,0.16)",
            padding: "5px 8px",
            textAlign: "center",
            width: "100%",
          }}
        >
          <div
            className="glow"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.2rem",
              color: "var(--amber)",
              letterSpacing: "0.06em",
              lineHeight: 1,
            }}
          >
            FILMEE
          </div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.45rem",
              color: "var(--text-dim)",
              letterSpacing: "0.1em",
              marginTop: "4px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {roll.filmStock.toUpperCase()}
          </div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.42rem",
              color: "var(--text-dim)",
              letterSpacing: "0.1em",
              marginTop: "2px",
            }}
          >
            ROLL #{String(roll.rollNumber).padStart(2, "0")}
          </div>
        </div>

        {/* Film slit — right edge where strip emerges */}
        <div
          style={{
            position: "absolute",
            right: 0,
            top: "50%",
            transform: "translateY(-50%)",
            width: "4px",
            height: "90px",
            background: "#040302",
            borderLeft: "1px solid rgba(200,85,26,0.1)",
          }}
        />
      </div>

      {/* Bottom oval cap */}
      <div
        style={{
          width: "84px",
          height: "22px",
          background: "linear-gradient(180deg, #1a1410 0%, #2e2218 100%)",
          borderRadius: "0 0 50% 50% / 0 0 100% 100%",
          border: "1px solid rgba(200,85,26,0.35)",
          borderTop: "none",
        }}
      />
    </div>
  );
}

function SprocketRow({ count }: { count: number }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "15px",
        padding: "0 10px",
        minWidth: "max-content",
      }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          style={{
            width: "12px",
            height: "9px",
            borderRadius: "2px",
            border: "1px solid rgba(200,85,26,0.2)",
            background: "#030201",
            flexShrink: 0,
          }}
        />
      ))}
    </div>
  );
}

const FRAME_W = 240;
const FRAME_GAP = 14;
const STRIP_LEAD = 70;
const STRIP_H = 210;
const SPROCKET_H = 22;

export default function FilmTransitionOverlay({ roll, onClose }: Props) {
  const [phase, setPhase] = useState<"entering" | "ready" | "closing">("entering");
  const [pullOffset, setPullOffset] = useState(0);
  const [exposed, setExposed] = useState<Set<number>>(new Set());

  const pullOffsetRef = useRef(0);
  const rafRef = useRef<number | undefined>(undefined);

  const photos = roll.photos;
  const totalStripW = STRIP_LEAD + photos.length * (FRAME_W + FRAME_GAP) + 60;
  const sprocketCount = Math.ceil(totalStripW / 27) + 2;

  useEffect(() => {
    const t = setTimeout(() => setPhase("ready"), 60);
    return () => clearTimeout(t);
  }, []);

  const handleClose = useCallback(() => {
    setPhase("closing");
    setTimeout(onClose, 480);
  }, [onClose]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") handleClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [handleClose]);

  const applyDelta = useCallback((delta: number) => {
    pullOffsetRef.current = Math.max(0, Math.min(1, pullOffsetRef.current + delta));
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      setPullOffset(pullOffsetRef.current);
    });
  }, []);

  // Wheel
  useEffect(() => {
    if (phase !== "ready") return;
    const h = (e: WheelEvent) => {
      e.preventDefault();
      applyDelta(e.deltaY / 500);
    };
    window.addEventListener("wheel", h, { passive: false });
    return () => window.removeEventListener("wheel", h);
  }, [phase, applyDelta]);

  // Touch swipe
  useEffect(() => {
    if (phase !== "ready") return;
    let sy = 0, sx = 0;
    const onStart = (e: TouchEvent) => { sy = e.touches[0].clientY; sx = e.touches[0].clientX; };
    const onMove = (e: TouchEvent) => {
      e.preventDefault();
      const dy = sy - e.touches[0].clientY;
      const dx = sx - e.touches[0].clientX;
      applyDelta((Math.abs(dy) > Math.abs(dx) ? dy : dx) / 280);
      sy = e.touches[0].clientY;
      sx = e.touches[0].clientX;
    };
    window.addEventListener("touchstart", onStart, { passive: false });
    window.addEventListener("touchmove", onMove, { passive: false });
    return () => {
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchmove", onMove);
    };
  }, [phase, applyDelta]);

  const revealedW = pullOffset * totalStripW;

  // Mark photos as exposed once they enter the revealed area
  useEffect(() => {
    setExposed((prev) => {
      const next = new Set(prev);
      photos.forEach((_, i) => {
        if (STRIP_LEAD + i * (FRAME_W + FRAME_GAP) < revealedW) next.add(i);
      });
      return next.size === prev.size ? prev : next;
    });
  }, [revealedW, photos]);

  const isEntering = phase === "entering";
  const isClosing = phase === "closing";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 60,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: isEntering || isClosing ? "rgba(6,2,1,0)" : "rgba(6,2,1,0.92)",
        transition: "background 0.55s ease",
      }}
      onClick={handleClose}
    >
      {/* Darkroom red ambient glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            isEntering || isClosing
              ? "transparent"
              : "radial-gradient(ellipse 80% 70% at 50% 50%, rgba(160,10,3,0.2) 0%, rgba(100,6,2,0.08) 50%, transparent 80%)",
          transition: "background 0.8s ease",
          pointerEvents: "none",
        }}
      />

      {/* Canister + strip */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          transform: isEntering ? "scale(0.82)" : isClosing ? "scale(0.92)" : "scale(1)",
          opacity: isEntering ? 0 : isClosing ? 0 : 1,
          transition: "opacity 0.5s ease, transform 0.5s ease",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <Canister roll={roll} />

        {/* Film strip — overflow hidden clips the reveal */}
        <div
          style={{
            overflow: "hidden",
            height: `${STRIP_H}px`,
            boxShadow: "inset 4px 0 12px rgba(0,0,0,0.7)",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: `${Math.max(revealedW, 6)}px`,
              height: "100%",
              background: "#0a0806",
              borderTop: "1px solid rgba(200,85,26,0.12)",
              borderBottom: "1px solid rgba(200,85,26,0.12)",
              transition: "width 0.05s linear",
              overflow: "hidden",
            }}
          >
            {/* Top sprocket row */}
            <div
              style={{
                height: `${SPROCKET_H}px`,
                display: "flex",
                alignItems: "center",
                overflow: "hidden",
              }}
            >
              <SprocketRow count={sprocketCount} />
            </div>

            {/* Photo frames */}
            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                gap: `${FRAME_GAP}px`,
                padding: `0 ${FRAME_GAP}px 0 ${STRIP_LEAD}px`,
                overflow: "visible",
              }}
            >
              {photos.length === 0 ? (
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.75rem",
                    color: "var(--text-dim)",
                    letterSpacing: "0.18em",
                    whiteSpace: "nowrap",
                  }}
                >
                  NO FRAMES EXPOSED
                </div>
              ) : (
                photos.map((photo, i) => {
                  const isDeveloped = exposed.has(i);
                  return (
                    <div
                      key={photo.id}
                      style={{
                        width: `${FRAME_W}px`,
                        height: "100%",
                        flexShrink: 0,
                        position: "relative",
                        overflow: "hidden",
                        border: isDeveloped
                          ? "1px solid rgba(200,85,26,0.14)"
                          : "1px solid rgba(200,85,26,0.04)",
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={photo.filename}
                        alt={photo.caption || `Frame ${i + 1}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          filter: isDeveloped
                            ? "brightness(0.85) sepia(0.08)"
                            : "brightness(0.05) sepia(1) hue-rotate(-10deg)",
                          transition: "filter 1.6s ease",
                        }}
                      />
                      {isDeveloped && (
                        <div
                          style={{
                            position: "absolute",
                            bottom: 4,
                            left: 6,
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.6rem",
                            color: "var(--amber)",
                            opacity: 0.65,
                          }}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Bottom sprocket row */}
            <div
              style={{
                height: `${SPROCKET_H}px`,
                display: "flex",
                alignItems: "center",
                overflow: "hidden",
              }}
            >
              <SprocketRow count={sprocketCount} />
            </div>
          </div>
        </div>
      </div>

      {/* UI chrome — only when ready */}
      {phase === "ready" && (
        <>
          <button
            onClick={handleClose}
            style={{
              position: "absolute",
              top: "24px",
              right: "24px",
              fontFamily: "var(--font-mono)",
              fontSize: "0.78rem",
              letterSpacing: "0.15em",
              color: "var(--text-muted)",
              border: "1px solid var(--border-visible)",
              padding: "0.22rem 0.65rem",
              background: "transparent",
              cursor: "pointer",
            }}
          >
            ESC
          </button>

          {pullOffset < 0.02 && (
            <div
              style={{
                position: "absolute",
                bottom: "38px",
                left: "50%",
                transform: "translateX(-50%)",
                fontFamily: "var(--font-mono)",
                fontSize: "0.78rem",
                letterSpacing: "0.22em",
                color: "var(--amber)",
                opacity: 0.55,
                whiteSpace: "nowrap",
                animation: "pulse 2.2s ease-in-out infinite",
              }}
            >
              ↓  SCROLL TO DEVELOP
            </div>
          )}

          <div
            style={{
              position: "absolute",
              bottom: "38px",
              left: "36px",
              fontFamily: "var(--font-mono)",
              fontSize: "0.75rem",
              letterSpacing: "0.13em",
            }}
          >
            <div style={{ color: "var(--amber)", marginBottom: "4px" }}>
              ROLL #{String(roll.rollNumber).padStart(2, "0")}
            </div>
            {roll.location && (
              <div style={{ color: "var(--text-muted)" }}>{roll.location}</div>
            )}
          </div>

          {exposed.size > 0 && (
            <Link
              href={`/roll/${roll.id}`}
              style={{
                position: "absolute",
                bottom: "38px",
                right: "36px",
                fontFamily: "var(--font-mono)",
                fontSize: "0.75rem",
                letterSpacing: "0.18em",
                color: "var(--amber)",
                border: "1px solid rgba(200,85,26,0.45)",
                padding: "0.28rem 0.85rem",
                textDecoration: "none",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              VIEW FULL ROLL →
            </Link>
          )}
        </>
      )}
    </div>
  );
}
