import { notFound } from "next/navigation";
import Link from "next/link";
import { getRollById } from "@/lib/data";
import FilmStrip from "@/components/FilmStrip";
import DarkroomEntry from "@/components/DarkroomEntry";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function RollPage({ params }: PageProps) {
  const { id } = await params;
  const roll = await getRollById(id);
  if (!roll) notFound();

  return (
    <main style={{ height: "100vh", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      {/* Darkroom entry overlay */}
      <DarkroomEntry />

      {/* Sticky top bar */}
      <div
        style={{
          flexShrink: 0,
          height: "56px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 1.5rem",
          background: "rgba(6,4,2,0.9)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid var(--border)",
          zIndex: 10,
        }}
      >
        <Link
          href="/"
          style={{ fontFamily: "var(--font-mono)", fontSize: "1rem", letterSpacing: "0.18em" }}
          className="hover:opacity-60 transition-opacity"
        >
          <span style={{ color: "var(--text-muted)" }}>← FILM</span>
          <span className="glow" style={{ color: "var(--amber)" }}>EE</span>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", fontFamily: "var(--font-mono)", fontSize: "0.88rem", letterSpacing: "0.12em" }}>
          <span style={{ color: "var(--text-muted)" }}>{roll.filmStock}</span>
          <span className="glow" style={{ color: "var(--amber)" }}>ROLL #{roll.rollNumber}</span>
          <span style={{ color: "var(--text-muted)" }}>{roll.photos.length} FRAMES</span>
        </div>
      </div>

      {/* Film strip */}
      <FilmStrip roll={roll} />
    </main>
  );
}
