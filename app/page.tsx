import Link from "next/link";
import { getGroupedByFilmStock } from "@/lib/data";
import NewRollButton from "@/components/NewRollButton";
import UploadToRoll from "@/components/UploadToRoll";
import type { FilmRoll } from "@/types";

export const dynamic = "force-dynamic";

function filmIcon(filmStock: string): string {
  return filmStock.toLowerCase().includes("fuji") ? "/fuji-icon.png" : "/film-icon.png";
}

function RollCard({ roll }: { roll: FilmRoll }) {
  const validStock = roll.filmStock && isNaN(Number(roll.filmStock));
  const isFuji = roll.filmStock.toLowerCase().includes("fuji");
  // Kodak is visually heavier than Fuji; scale it down slightly to match
  const iconHeight = isFuji ? 150 : 132;
  return (
    <div className="roll-card" style={{ cursor: "pointer" }}>
      <Link href={`/roll/${roll.id}`} style={{ display: "block", textDecoration: "none" }}>
        {/* Icon: per-brand height so both canisters look the same visual size */}
        <div style={{
          height: "170px",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          marginBottom: "0.9rem",
        }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={filmIcon(roll.filmStock)}
            alt=""
            className="roll-card-icon"
            style={{ height: `${iconHeight}px`, width: "auto" }}
          />
        </div>

        {/* Metadata */}
        <div style={{ fontFamily: "var(--font-mono)", lineHeight: 1.7 }}>
          <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--text)", letterSpacing: "0.05em" }}>
            ROLL #{roll.rollNumber}
          </div>
          {validStock && (
            <div style={{ fontSize: "0.65rem", color: "var(--text-dim)", letterSpacing: "0.1em" }}>
              {roll.filmStock.toUpperCase()}
            </div>
          )}
          {roll.location && (
            <div className="truncate" style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{roll.location}</div>
          )}
          {roll.date && isNaN(Number(roll.date)) && (
            <div style={{ fontSize: "0.68rem", color: "var(--text-dim)" }}>{roll.date}</div>
          )}
        </div>
      </Link>

      {/* Upload — only visible on hover */}
      <div className="upload-action" style={{ marginTop: "0.4rem" }}>
        <UploadToRoll rollId={roll.id} />
      </div>
    </div>
  );
}

export default async function HomePage() {
  const groups = await getGroupedByFilmStock();

  // Flatten all rolls, newest first
  const allRolls = groups
    .flatMap((g) => g.rolls)
    .sort((a, b) => {
      const da = a.date ? new Date(a.date).getTime() : 0;
      const db = b.date ? new Date(b.date).getTime() : 0;
      return db - da || b.rollNumber - a.rollNumber;
    });

  const totalPhotos = allRolls.reduce((acc, r) => acc + r.photos.length, 0);

  return (
    <main>
      {/* ── Top nav ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        height: "52px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 2rem",
        background: "var(--bg)",
        borderBottom: "1.5px solid var(--border)",
      }}>
        <span style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 700, letterSpacing: "-0.01em", color: "var(--text)" }}>
          FILMEE
        </span>
        <NewRollButton />
      </nav>

      {/* ── Hero ── */}
      <div
        className="relative flex flex-col justify-end px-8 md:px-14"
        style={{ minHeight: "100svh", paddingBottom: "5rem", borderBottom: "1.5px solid var(--border)" }}
      >
        <h1
          className="font-display leading-none mb-5"
          style={{ fontSize: "clamp(5rem, 16vw, 13rem)", color: "var(--text)", letterSpacing: "-0.03em", fontWeight: 800 }}
        >
          FILMEE
        </h1>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.82rem", letterSpacing: "0.12em", color: "var(--text-muted)" }}>
          {String(allRolls.length).padStart(2, "0")} ROLLS
          <span style={{ margin: "0 0.75rem", color: "var(--border-soft)" }}>·</span>
          {String(totalPhotos).padStart(4, "0")} FRAMES
        </div>
        <div
          className="absolute bottom-8 right-8"
          style={{ color: "var(--text-dim)", fontFamily: "var(--font-mono)", fontSize: "0.72rem", letterSpacing: "0.15em" }}
        >
          SCROLL ↓
        </div>
      </div>

      {/* ── All rolls flat grid ── */}
      <div className="max-w-6xl mx-auto px-6 pt-16 pb-28">
        {allRolls.length === 0 ? (
          <p style={{ color: "var(--text-dim)", fontSize: "0.82rem", letterSpacing: "0.15em", fontFamily: "var(--font-mono)" }}>
            NO ROLLS YET — CLICK + NEW ROLL TO BEGIN
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {allRolls.map((roll) => (
              <RollCard key={roll.id} roll={roll} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
