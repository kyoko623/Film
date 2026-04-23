import { getGroupedByFilmStock } from "@/lib/data";
import FilmStockSection from "@/components/FilmStockSection";

export const dynamic = "force-dynamic";

function Sprockets({ count = 28 }: { count?: number }) {
  return (
    <div className="sprocket-strip my-8">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="sprocket-hole" />
      ))}
    </div>
  );
}

export default async function HomePage() {
  const groups = await getGroupedByFilmStock();
  const totalRolls = groups.reduce((acc, g) => acc + g.rolls.length, 0);
  const totalPhotos = groups.reduce(
    (acc, g) => acc + g.rolls.reduce((a, r) => a + r.photos.length, 0),
    0
  );

  return (
    <main className="min-h-screen">

      {/* ── Hero title ── */}
      <div className="flex flex-col justify-end px-8 md:px-14" style={{ minHeight: "100svh", paddingBottom: "5rem" }}>
        <h1
          className="font-display glow title-crt leading-none mb-3"
          style={{ fontSize: "clamp(5rem, 16vw, 12rem)", color: "var(--text)", letterSpacing: "0.04em" }}
        >
          FILM<span style={{ color: "var(--amber)" }}>EE</span>
        </h1>
        <p style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.82rem",
          letterSpacing: "0.22em",
          color: "var(--amber)",
          opacity: 0.5,
          marginBottom: "1.2rem",
        }}>
          &gt; PERSONAL ARCHIVE INITIALIZED
        </p>
        <div
          className="flex items-center gap-6"
          style={{ fontFamily: "var(--font-mono)", fontSize: "0.9rem", letterSpacing: "0.18em" }}
        >
          <span className="glow" style={{ color: "var(--amber)" }}>{String(totalRolls).padStart(2, "0")} ROLLS</span>
          <span style={{ color: "var(--text-dim)" }}>·</span>
          <span style={{ color: "var(--text-muted)" }}>{String(totalPhotos).padStart(4, "0")} FRAMES</span>
        </div>

        {/* Scroll indicator */}
        <div
          className="glow-dim absolute bottom-8 right-8 flex flex-col items-center gap-2"
          style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)", fontSize: "0.75rem", letterSpacing: "0.18em" }}
        >
          <span>SCROLL</span>
          <div style={{ width: "1px", height: "28px", background: "var(--amber-dim)", opacity: 0.5 }} />
        </div>
      </div>

      {/* ── Archive ── */}
      <div
        style={{ background: "linear-gradient(to bottom, transparent 0%, rgba(8,6,4,0.92) 6%, rgba(8,6,4,0.96) 100%)" }}
      >
        <div className="max-w-6xl mx-auto px-6 pt-4 pb-28">
          <Sprockets count={32} />
          {groups.length === 0 ? (
            <p style={{ color: "var(--text-dim)", fontSize: "1rem", letterSpacing: "0.15em" }}>
              NO ROLLS YET — OPEN /ADMIN TO BEGIN
            </p>
          ) : (
            groups.map((group, i) => (
              <div key={group.filmStock}>
                <FilmStockSection group={group} />
                {i < groups.length - 1 && <Sprockets count={32} />}
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
