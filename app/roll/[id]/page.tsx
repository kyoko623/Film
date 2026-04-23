import { notFound } from "next/navigation";
import Link from "next/link";
import { getRollById } from "@/lib/data";
import FilmStrip from "@/components/FilmStrip";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function RollPage({ params }: PageProps) {
  const { id } = await params;
  const roll = await getRollById(id);
  if (!roll) notFound();

  return (
    <main style={{ height: "100vh", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      {/* Top bar */}
      <div
        style={{
          flexShrink: 0,
          height: "56px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 1.5rem",
          background: "#ffffff",
          borderBottom: "1px solid var(--border)",
          zIndex: 10,
        }}
      >
        <Link
          href="/"
          style={{ fontFamily: "var(--font-mono)", fontSize: "0.88rem", letterSpacing: "0.1em", color: "var(--text-muted)" }}
          className="hover:opacity-50 transition-opacity"
        >
          ← FILMEE
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", fontFamily: "var(--font-mono)", fontSize: "0.82rem", letterSpacing: "0.08em" }}>
          <span style={{ color: "var(--text-muted)" }}>{roll.filmStock}</span>
          <span style={{ color: "var(--text)" }}>ROLL #{roll.rollNumber}</span>
          <span style={{ color: "var(--text-muted)" }}>{roll.photos.length} FRAMES</span>
        </div>
      </div>

      <FilmStrip roll={roll} />
    </main>
  );
}
