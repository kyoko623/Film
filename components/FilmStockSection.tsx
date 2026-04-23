"use client";

import Link from "next/link";
import { useState } from "react";
import type { FilmStockGroup } from "@/types";

interface FilmStockSectionProps {
  group: FilmStockGroup;
}

export default function FilmStockSection({ group }: FilmStockSectionProps) {
  const [activating, setActivating] = useState<string | null>(null);

  return (
    <section>
      <div className="flex items-baseline justify-between mb-5">
        <h2
          className="font-display"
          style={{ fontSize: "1.8rem", color: "var(--text)", letterSpacing: "0.18em" }}
        >
          {group.filmStock}
        </h2>
        <span style={{ color: "var(--text-muted)", fontSize: "0.82rem", letterSpacing: "0.12em" }}>
          {String(group.rolls.length).padStart(2, "0")} ROLLS
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {group.rolls.map((roll, index) => (
          <Link
            key={roll.id}
            href={`/roll/${roll.id}`}
            onClick={() => {
              setActivating(roll.id);
              sessionStorage.setItem("darkroom-transition", "1");
            }}
          >
            <div
              className="group cursor-pointer"
              style={{
                transition: "background 0.2s ease",
                background: activating === roll.id ? "rgba(100,10,3,0.35)" : "transparent",
                borderRadius: "4px",
              }}
            >
              {/* Film icon */}
              <div className="mb-2 flex items-center justify-center py-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/film-icon.png"
                  alt="film roll"
                  className="w-full object-contain transition-all duration-500 group-hover:scale-105"
                  style={{
                    opacity: activating === roll.id ? 0.95 : 0.8,
                    filter: activating === roll.id
                      ? "sepia(0.8) hue-rotate(-15deg) brightness(0.7) saturate(1.5)"
                      : "sepia(0.4) hue-rotate(-15deg) brightness(0.9)",
                    transition: "filter 0.2s ease, opacity 0.2s ease",
                  }}
                />
              </div>

              {/* Metadata */}
              <div style={{ fontSize: "0.85rem", letterSpacing: "0.08em", lineHeight: 1.7 }}>
                <div className="glow" style={{ color: "var(--amber)", fontFamily: "var(--font-mono)" }}>
                  {String(index + 1).padStart(2, "0")}
                </div>
                <div style={{ color: "var(--text)", fontFamily: "var(--font-mono)" }}>
                  ROLL #{roll.rollNumber}
                </div>
                {roll.location && (
                  <div className="truncate" style={{ color: "var(--text-muted)" }}>{roll.location}</div>
                )}
                <div style={{ color: "var(--text-dim)" }}>{roll.date}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
