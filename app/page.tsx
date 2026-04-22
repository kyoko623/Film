import { getGroupedByFilmStock } from "@/lib/data";
import FilmStockSection from "@/components/FilmStockSection";
import HeroBackground from "@/components/HeroBackground";

export const dynamic = "force-dynamic";

function Sprockets({ count = 24 }: { count?: number }) {
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
    <main style={{ background: "var(--bg)" }}>

      {/* ── Hero: full-screen video ── */}
      <section className="relative overflow-hidden" style={{ height: "100svh" }}>
        <HeroBackground />

        {/* Overlay gradient */}
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to bottom, rgba(14,11,9,0.15) 0%, rgba(14,11,9,0.5) 70%, rgba(14,11,9,1) 100%)" }}
        />

        {/* Title */}
        <div className="absolute inset-0 flex flex-col justify-end px-8 pb-16 md:px-14 md:pb-20">
          <h1
            className="font-display leading-none mb-6"
            style={{ fontSize: "clamp(4rem, 12vw, 9rem)", fontWeight: 300, color: "var(--text)", letterSpacing: "0.02em" }}
          >
            film<em style={{ color: "var(--amber)", fontStyle: "italic" }}>ee</em>
          </h1>
          <div
            className="flex items-center gap-6"
            style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", letterSpacing: "0.18em", color: "var(--text-muted)" }}
          >
            <span>{String(totalRolls).padStart(2, "0")} ROLLS</span>
            <span style={{ color: "var(--text-dim)" }}>·</span>
            <span>{String(totalPhotos).padStart(4, "0")} FRAMES</span>
          </div>
        </div>

        {/* Scroll hint */}
        <div
          className="absolute bottom-8 right-8 flex flex-col items-center gap-2"
          style={{ color: "var(--text-dim)", fontFamily: "var(--font-mono)", fontSize: "0.5rem", letterSpacing: "0.2em" }}
        >
          <span>SCROLL</span>
          <div style={{ width: "1px", height: "32px", background: "var(--text-dim)", opacity: 0.4 }} />
        </div>
      </section>

      {/* ── Archive ── */}
      <div className="max-w-6xl mx-auto px-6 pt-16 pb-24">
        <Sprockets count={32} />

        {groups.length === 0 ? (
          <p style={{ color: "var(--text-dim)", fontFamily: "var(--font-mono)", fontSize: "0.75rem", letterSpacing: "0.1em" }}>
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
    </main>
  );
}
