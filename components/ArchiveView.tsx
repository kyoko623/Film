"use client";

import { useState } from "react";
import type { FilmStockGroup, FilmRoll } from "@/types";
import FilmStockSection from "./FilmStockSection";
import FilmTransitionOverlay from "./FilmTransitionOverlay";

function Sprockets({ count = 28 }: { count?: number }) {
  return (
    <div className="sprocket-strip my-8">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="sprocket-hole" />
      ))}
    </div>
  );
}

export default function ArchiveView({ groups }: { groups: FilmStockGroup[] }) {
  const [selectedRoll, setSelectedRoll] = useState<FilmRoll | null>(null);

  return (
    <>
      <div className="max-w-6xl mx-auto px-6 pt-4 pb-28">
        <Sprockets count={32} />
        {groups.length === 0 ? (
          <p style={{ color: "var(--text-dim)", fontSize: "1rem", letterSpacing: "0.15em" }}>
            NO ROLLS YET — OPEN /ADMIN TO BEGIN
          </p>
        ) : (
          groups.map((group, i) => (
            <div key={group.filmStock}>
              <FilmStockSection group={group} onRollClick={setSelectedRoll} />
              {i < groups.length - 1 && <Sprockets count={32} />}
            </div>
          ))
        )}
      </div>

      {selectedRoll && (
        <FilmTransitionOverlay
          roll={selectedRoll}
          onClose={() => setSelectedRoll(null)}
        />
      )}
    </>
  );
}
