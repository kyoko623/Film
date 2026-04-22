import { getGroupedByFilmStock } from "@/lib/data";
import FilmStockSection from "@/components/FilmStockSection";

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
    <main className="min-h-screen" style={{ background: "var(--bg)" }}>
      <div className="max-w-6xl mx-auto px-6 pt-20 pb-24">

        {/* Header */}
        <header className="mb-4">
          <div className="flex items-end justify-between">
            <h1
              className="font-display leading-none"
              style={{ fontSize: "clamp(3rem, 8vw, 6rem)", color: "var(--text)", fontWeight: 300, letterSpacing: "0.05em" }}
            >
              film<em style={{ color: "var(--amber)", fontStyle: "italic" }}>ee</em>
            </h1>
            <div className="text-right pb-2" style={{ color: "var(--text-muted)", fontSize: "0.65rem", letterSpacing: "0.15em" }}>
              <div>{String(totalRolls).padStart(2, "0")} ROLLS</div>
              <div style={{ color: "var(--text-dim)" }}>──────</div>
              <div>{String(totalPhotos).padStart(4, "0")} FRAMES</div>
            </div>
          </div>
        </header>

        <Sprockets count={32} />

        {/* Content */}
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
