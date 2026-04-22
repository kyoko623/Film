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

  const meta = [
    { label: "FILM", value: roll.filmStock },
    { label: "ROLL", value: `#${roll.rollNumber}` },
    { label: "DATE", value: roll.date || "—" },
    { label: "LOCATION", value: roll.location || "—" },
    { label: "CAMERA", value: roll.camera || "—" },
    { label: "FRAMES", value: String(roll.photos.length).padStart(2, "0") },
  ];

  return (
    <main className="min-h-screen" style={{ background: "var(--bg)" }}>
      <div className="max-w-6xl mx-auto px-6 pt-16 pb-24">

        {/* Back */}
        <Link
          href="/"
          style={{ color: "var(--amber-dim)", fontSize: "0.6rem", letterSpacing: "0.2em", fontFamily: "var(--font-mono)" }}
          className="inline-block mb-14 hover:opacity-100 transition-opacity"
        >
          ← ARCHIVE
        </Link>

        {/* Header */}
        <header className="mb-12">
          <p style={{ color: "var(--amber)", fontSize: "0.6rem", letterSpacing: "0.25em", fontFamily: "var(--font-mono)", marginBottom: "0.75rem" }}>
            {roll.filmStock.toUpperCase()}
          </p>
          <h1
            className="font-display leading-none mb-8"
            style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", fontWeight: 300, letterSpacing: "0.15em", color: "var(--text)" }}
          >
            Roll <em style={{ color: "var(--amber)", fontStyle: "italic" }}>#{roll.rollNumber}</em>
          </h1>

          {/* Metadata table */}
          <div
            className="grid gap-x-8 gap-y-1"
            style={{ gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", borderTop: "1px solid var(--border)", paddingTop: "1.25rem" }}
          >
            {meta.map(({ label, value }) => (
              <div key={label}>
                <div style={{ color: "var(--text-dim)", fontSize: "0.55rem", letterSpacing: "0.2em", fontFamily: "var(--font-mono)", marginBottom: "0.15rem" }}>
                  {label}
                </div>
                <div style={{ color: "var(--text)", fontSize: "0.7rem", letterSpacing: "0.1em", fontFamily: "var(--font-mono)" }}>
                  {value}
                </div>
              </div>
            ))}
          </div>

          {roll.description && (
            <p
              className="font-display mt-6"
              style={{ color: "var(--text-muted)", fontSize: "1.1rem", fontStyle: "italic", maxWidth: "36rem", lineHeight: 1.7 }}
            >
              {roll.description}
            </p>
          )}
        </header>

        {/* Photos */}
        <PhotoGrid photos={roll.photos} rollId={roll.id} />
      </div>
    </main>
  );
}
