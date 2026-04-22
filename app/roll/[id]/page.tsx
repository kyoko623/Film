import { notFound } from "next/navigation";
import Link from "next/link";
import { getRollById } from "@/lib/data";
import PhotoGrid from "@/components/PhotoGrid";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function RollPage({ params }: PageProps) {
  const { id } = await params;
  const roll = await getRollById(id);

  if (!roll) notFound();

  return (
    <main className="min-h-screen bg-stone-950 text-stone-100">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <Link
          href="/"
          className="inline-block text-stone-500 hover:text-stone-300 text-sm tracking-wider uppercase mb-12 transition-colors"
        >
          ← Archive
        </Link>

        <header className="mb-12">
          <p className="text-stone-500 text-xs tracking-widest uppercase mb-2">{roll.filmStock}</p>
          <h1 className="text-2xl font-light tracking-widest uppercase mb-4">
            Roll #{roll.rollNumber}
          </h1>
          <div className="flex flex-wrap gap-6 text-sm text-stone-400">
            {roll.date && <span>{roll.date}</span>}
            {roll.location && <span>{roll.location}</span>}
            {roll.camera && <span>{roll.camera}</span>}
            <span>{roll.photos.length} frames</span>
          </div>
          {roll.description && (
            <p className="mt-4 text-stone-400 text-sm max-w-xl">{roll.description}</p>
          )}
        </header>

        <PhotoGrid photos={roll.photos} rollId={roll.id} />
      </div>
    </main>
  );
}
