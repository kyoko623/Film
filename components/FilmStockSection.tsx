import Link from "next/link";
import type { FilmStockGroup } from "@/types";

interface FilmStockSectionProps {
  group: FilmStockGroup;
}

export default function FilmStockSection({ group }: FilmStockSectionProps) {
  return (
    <section>
      <div className="flex items-baseline justify-between mb-6" style={{ borderBottom: "1.5px solid var(--border)", paddingBottom: "1rem" }}>
        <h2
          className="font-display"
          style={{ fontSize: "1.5rem", color: "var(--text)", letterSpacing: "-0.01em", fontWeight: 400 }}
        >
          {group.filmStock}
        </h2>
        <span style={{ color: "var(--text-dim)", fontSize: "0.72rem", letterSpacing: "0.12em", fontFamily: "var(--font-mono)" }}>
          {String(group.rolls.length).padStart(2, "0")} ROLLS
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
        {group.rolls.map((roll, index) => (
          <Link key={roll.id} href={`/roll/${roll.id}`} className="roll-card block">
            {/* Film icon — no background, just the icon with scale-up on hover */}
            <div className="mb-3 flex items-center justify-center overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/film-icon.png"
                alt="film roll"
                className="roll-card-icon w-full object-contain"
              />
            </div>

            {/* Metadata */}
            <div style={{ fontSize: "0.75rem", letterSpacing: "0.06em", lineHeight: 1.8, fontFamily: "var(--font-mono)" }}>
              <div style={{ color: "var(--text-dim)" }}>{String(index + 1).padStart(2, "0")}</div>
              <div style={{ color: "var(--text)" }}>ROLL #{roll.rollNumber}</div>
              {roll.location && (
                <div className="truncate" style={{ color: "var(--text-muted)" }}>{roll.location}</div>
              )}
              <div style={{ color: "var(--text-dim)" }}>{roll.date}</div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
