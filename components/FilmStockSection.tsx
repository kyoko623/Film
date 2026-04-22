import Link from "next/link";
import type { FilmStockGroup } from "@/types";

interface FilmStockSectionProps {
  group: FilmStockGroup;
}

export default function FilmStockSection({ group }: FilmStockSectionProps) {
  return (
    <section>
      {/* Film stock label */}
      <div className="flex items-baseline justify-between mb-5">
        <h2
          className="font-display uppercase tracking-widest"
          style={{ fontSize: "1.6rem", fontWeight: 400, color: "var(--text)", letterSpacing: "0.2em" }}
        >
          {group.filmStock}
        </h2>
        <span style={{ color: "var(--text-dim)", fontSize: "0.6rem", letterSpacing: "0.15em" }}>
          {String(group.rolls.length).padStart(2, "0")} ROLLS
        </span>
      </div>

      {/* Roll grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {group.rolls.map((roll, index) => (
          <Link key={roll.id} href={`/roll/${roll.id}`}>
            <div className="group cursor-pointer">

              {/* Thumbnail */}
              {roll.photos.length > 0 ? (
                <div
                  className="photo-frame overflow-hidden mb-2"
                  style={{ aspectRatio: "1", background: "var(--bg-card)", border: "1px solid var(--border)" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={roll.photos[0].filename}
                    alt={`Roll ${roll.rollNumber}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    style={{ filter: "sepia(0.08) brightness(0.95)" }}
                  />
                </div>
              ) : (
                <div className="mb-2 flex items-center justify-center py-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/film-icon.png"
                    alt="film roll"
                    className="w-full object-contain transition-transform duration-500 group-hover:scale-105"
                    style={{ opacity: 0.85 }}
                  />
                </div>
              )}

              {/* Metadata */}
              <div style={{ fontSize: "0.6rem", letterSpacing: "0.1em", lineHeight: 1.7 }}>
                <div style={{ color: "var(--amber)", fontFamily: "var(--font-mono)" }}>
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
