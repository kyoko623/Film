import { getGroupedByFilmStock } from "@/lib/data";
import FilmStockSection from "@/components/FilmStockSection";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const groups = await getGroupedByFilmStock();
  const totalRolls = groups.reduce((acc, g) => acc + g.rolls.length, 0);
  const totalPhotos = groups.reduce(
    (acc, g) => acc + g.rolls.reduce((a, r) => a + r.photos.length, 0),
    0
  );

  return (
    <main>
      {/* ── Hero ── */}
      <div
        className="relative flex flex-col justify-end px-8 md:px-14"
        style={{ minHeight: "100svh", paddingBottom: "5rem", borderBottom: "1px solid var(--border)" }}
      >
        <h1
          className="font-display leading-none mb-5"
          style={{ fontSize: "clamp(5rem, 16vw, 13rem)", color: "var(--text)", letterSpacing: "-0.02em", fontWeight: 300 }}
        >
          FILMEE
        </h1>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.82rem", letterSpacing: "0.12em", color: "var(--text-muted)" }}>
          {String(totalRolls).padStart(2, "0")} ROLLS
          <span style={{ margin: "0 0.75rem", color: "var(--border)" }}>·</span>
          {String(totalPhotos).padStart(4, "0")} FRAMES
        </div>

        {/* Scroll hint */}
        <div
          className="absolute bottom-8 right-8"
          style={{ color: "var(--text-dim)", fontFamily: "var(--font-mono)", fontSize: "0.72rem", letterSpacing: "0.15em" }}
        >
          SCROLL ↓
        </div>
      </div>

      {/* ── Archive ── */}
      <div className="max-w-6xl mx-auto px-6 pt-16 pb-28">
        {groups.length === 0 ? (
          <p style={{ color: "var(--text-dim)", fontSize: "0.82rem", letterSpacing: "0.15em", fontFamily: "var(--font-mono)" }}>
            NO ROLLS YET — OPEN /ADMIN TO BEGIN
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "4.5rem" }}>
            {groups.map((group) => (
              <FilmStockSection key={group.filmStock} group={group} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
