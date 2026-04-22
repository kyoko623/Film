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
    <main className="min-h-screen" style={{ background: "var(--bg)" }}>

      {/* Top bar */}
      <div
        className="sticky top-0 z-40 flex items-center justify-between px-6 py-4"
        style={{ background: "rgba(14,11,9,0.92)", backdropFilter: "blur(12px)", borderBottom: "1px solid var(--border)" }}
      >
        <Link
          href="/"
          style={{ color: "var(--text-dim)", fontSize: "0.6rem", letterSpacing: "0.2em", fontFamily: "var(--font-mono)" }}
          className="hover:opacity-70 transition-opacity"
        >
          ← FILMEE
        </Link>

        <div className="flex items-center gap-6" style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", letterSpacing: "0.12em" }}>
          <span style={{ color: "var(--text-dim)" }}>{roll.filmStock}</span>
          <span style={{ color: "var(--amber)" }}>ROLL #{roll.rollNumber}</span>
          <span style={{ color: "var(--text-dim)" }}>{roll.photos.length} FRAMES</span>
        </div>
      </div>

      {/* Hero header */}
      <div className="px-6 pt-16 pb-10 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-14">

          {/* Left: title */}
          <div>
            <p style={{ color: "var(--amber)", fontSize: "0.55rem", letterSpacing: "0.3em", fontFamily: "var(--font-mono)", marginBottom: "1rem" }}>
              {roll.filmStock.toUpperCase()}
            </p>
            <h1
              className="font-display leading-none"
              style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", fontWeight: 300, color: "var(--text)" }}
            >
              Roll&nbsp;
              <em style={{ color: "var(--amber)", fontStyle: "italic" }}>#{roll.rollNumber}</em>
            </h1>
          </div>

          {/* Right: metadata grid */}
          <div
            className="grid grid-cols-2 gap-x-10 gap-y-4"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {[
              { label: "DATE", value: roll.date || "—" },
              { label: "LOCATION", value: roll.location || "—" },
              { label: "CAMERA", value: roll.camera || "—" },
              { label: "FRAMES", value: String(roll.photos.length).padStart(2, "0") },
            ].map(({ label, value }) => (
              <div key={label}>
                <div style={{ color: "var(--text-dim)", fontSize: "0.5rem", letterSpacing: "0.2em", marginBottom: "0.25rem" }}>
                  {label}
                </div>
                <div style={{ color: "var(--text)", fontSize: "0.7rem", letterSpacing: "0.08em" }}>
                  {value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Description */}
        {roll.description && (
          <p
            className="font-display mb-12"
            style={{ color: "var(--text-muted)", fontSize: "1.25rem", fontStyle: "italic", maxWidth: "38rem", lineHeight: 1.8, borderLeft: "1px solid var(--amber-dim)", paddingLeft: "1.5rem" }}
          >
            {roll.description}
          </p>
        )}

        {/* Divider */}
        <div style={{ borderTop: "1px solid var(--border)", marginBottom: "2.5rem" }} />
      </div>

      {/* Photos */}
      <div className="px-6 pb-24 max-w-6xl mx-auto">
        <PhotoGrid photos={roll.photos} rollId={roll.id} />
      </div>
    </main>
  );
}
