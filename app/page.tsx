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
    <main className="min-h-screen bg-stone-950 text-stone-100">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <header className="mb-16">
          <h1 className="text-3xl font-light tracking-widest uppercase mb-2">Film Archive</h1>
          <p className="text-stone-500 text-sm tracking-wider">
            {totalRolls} rolls · {totalPhotos} frames
          </p>
        </header>

        {groups.length === 0 ? (
          <p className="text-stone-500">No rolls yet.</p>
        ) : (
          groups.map((group) => (
            <FilmStockSection key={group.filmStock} group={group} />
          ))
        )}
      </div>
    </main>
  );
}
