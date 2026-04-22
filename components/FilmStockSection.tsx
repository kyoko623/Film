import Link from "next/link";
import type { FilmStockGroup } from "@/types";

interface FilmStockSectionProps {
  group: FilmStockGroup;
}

export default function FilmStockSection({ group }: FilmStockSectionProps) {
  return (
    <section className="mb-12">
      <h2 className="text-xl font-semibold tracking-widest uppercase mb-6 text-stone-400">
        {group.filmStock}
        <span className="ml-3 text-sm font-normal text-stone-500">
          {group.rolls.length} roll{group.rolls.length !== 1 ? "s" : ""}
        </span>
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {group.rolls.map((roll) => (
          <Link key={roll.id} href={`/roll/${roll.id}`}>
            <div className="group cursor-pointer">
              <div className="aspect-square bg-stone-800 mb-2 overflow-hidden relative">
                {roll.photos.length > 0 ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={roll.photos[0].filename}
                    alt={`${roll.filmStock} roll ${roll.rollNumber}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-stone-600 text-sm">
                    No photos
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-white text-xs">{roll.photos.length} frames</span>
                </div>
              </div>
              <div className="text-xs text-stone-400">
                <div className="font-medium text-stone-300">Roll #{roll.rollNumber}</div>
                {roll.location && <div className="truncate">{roll.location}</div>}
                <div className="text-stone-500">{roll.date}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
