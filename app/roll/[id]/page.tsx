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
    <main className="min-h-screen">

      {/* Sticky top bar */}
      <div
        className="sticky top-0 z-40 flex items-center justify-between px-6 py-4"
        style={{
          background: "rgba(6,4,2,0.85)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <Link
          href="/"
          style={{ fontSize: "1rem", letterSpacing: "0.18em" }}
          className="hover:opacity-60 transition-opacity"
        >
          <span style={{ color: "var(--text-muted)" }}>← FILM</span><span className="glow" style={{ color: "var(--amber)" }}>EE</span>
        </Link>
        <div className="flex items-center gap-5" style={{ fontSize: "0.88rem", letterSpacing: "0.12em" }}>
          <span style={{ color: "var(--text-muted)" }}>{roll.filmStock}</span>
          <span className="glow" style={{ color: "var(--amber)" }}>ROLL #{roll.rollNumber}</span>
          <span style={{ color: "var(--text-muted)" }}>{roll.photos.length} FRAMES</span>
        </div>
      </div>

      {/* Hero */}
      <div className="px-6 pt-20 pb-10 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-10 mb-14">
          <div>
            <p style={{ color: "var(--amber)", fontSize: "0.85rem", letterSpacing: "0.22em", marginBottom: "1.2rem" }}>
              {roll.filmStock.toUpperCase()}
            </p>
            <h1
              className="font-display glow leading-none"
              style={{ fontSize: "clamp(3.5rem, 8vw, 7rem)", color: "var(--text)" }}
            >
              ROLL <span style={{ color: "var(--amber)" }}>#{roll.rollNumber}</span>
            </h1>
          </div>

          <div className="grid grid-cols-2 gap-x-10 gap-y-5">
            {[
              { label: "DATE",     value: roll.date     || "—" },
              { label: "LOCATION", value: roll.location || "—" },
              { label: "CAMERA",   value: roll.camera   || "—" },
              { label: "FRAMES",   value: String(roll.photos.length).padStart(2, "0") },
            ].map(({ label, value }) => (
              <div key={label}>
                <div style={{ color: "var(--text-muted)", fontSize: "0.78rem", letterSpacing: "0.2em", marginBottom: "0.25rem" }}>{label}</div>
                <div style={{ color: "var(--text)", fontSize: "1rem", letterSpacing: "0.08em" }}>{value}</div>
              </div>
            ))}
          </div>
        </div>

        {roll.description && (
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "1.05rem",
              letterSpacing: "0.06em",
              lineHeight: 1.9,
              maxWidth: "38rem",
              marginBottom: "3rem",
              borderLeft: "1px solid var(--amber-dim)",
              paddingLeft: "1.5rem",
            }}
          >
            {roll.description}
          </p>
        )}

        <div style={{ borderTop: "1px solid var(--border)", marginBottom: "2.5rem" }} />
      </div>

      {/* Photos */}
      <div
        style={{ background: "rgba(6,4,2,0.75)" }}
      >
        <div className="px-6 pb-24 max-w-6xl mx-auto">
          <PhotoGrid photos={roll.photos} rollId={roll.id} />
        </div>
      </div>
    </main>
  );
}
