import { getGroupedByFilmStock } from "@/lib/data";
import FilmStockSection from "@/components/FilmStockSection";
import NewRollButton from "@/components/NewRollButton";

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
      {/* ── Top nav ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        height: "52px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 2rem",
        background: "var(--bg)",
        borderBottom: "1.5px solid var(--border)",
      }}>
        <span style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 300, letterSpacing: "-0.01em", color: "var(--text)" }}>
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
