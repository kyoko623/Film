import { put, list } from "@vercel/blob";
import type { FilmRoll, FilmStockGroup } from "@/types";

async function getMetadataUrl(): Promise<string | null> {
  if (process.env.BLOB_ROLLS_URL) {
    return process.env.BLOB_ROLLS_URL;
  }
  const { blobs } = await list({ prefix: "rolls-data.json" });
  return blobs[0]?.url ?? null;
}

export async function getAllRolls(): Promise<FilmRoll[]> {
  try {
    const url = await getMetadataUrl();
    if (!url) return [];
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return [];
    return (await res.json()) as FilmRoll[];
  } catch {
    return [];
  }
}

export async function getRollById(id: string): Promise<FilmRoll | undefined> {
  const rolls = await getAllRolls();
  return rolls.find((roll) => roll.id === id);
}

export async function saveAllRolls(rolls: FilmRoll[]): Promise<void> {
  await put("rolls-data.json", JSON.stringify(rolls), {
    access: "public",
    allowOverwrite: true,
  });
}

export async function getGroupedByFilmStock(): Promise<FilmStockGroup[]> {
  const rolls = await getAllRolls();
  const groups: Record<string, FilmRoll[]> = {};

  for (const roll of rolls) {
    if (!groups[roll.filmStock]) {
      groups[roll.filmStock] = [];
    }
    groups[roll.filmStock].push(roll);
  }

  return Object.entries(groups).map(([filmStock, rolls]) => ({
    filmStock,
    rolls: rolls.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
  }));
}
