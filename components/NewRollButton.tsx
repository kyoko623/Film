"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const STORAGE_KEY = "adminToken";

const inputStyle: React.CSSProperties = {
  width: "100%",
  border: "1.5px solid #111",
  background: "#fff",
  padding: "0.65rem 0.9rem",
  fontFamily: "var(--font-mono)",
  fontSize: "0.82rem",
  color: "#111",
  outline: "none",
  borderRadius: 0,
};

const labelStyle: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: "0.58rem",
  letterSpacing: "0.2em",
  color: "var(--text-muted)",
  marginBottom: "5px",
  display: "block",
  textTransform: "uppercase",
};

export default function NewRollButton() {
  const router = useRouter();
  const panelRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [form, setForm] = useState({
    filmStock: "Kodak Gold 200", rollNumber: "", date: "", location: "", camera: "", description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load token from localStorage (persists across sessions)
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setToken(saved);
  }, []);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        close();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  function close() {
    setOpen(false);
    setPassword("");
    setAuthError("");
    setError("");
    setForm({ filmStock: "Kodak Gold 200", rollNumber: "", date: "", location: "", camera: "", description: "" });
  }

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError("");
    const res = await fetch("/api/rolls", { headers: { Authorization: `Bearer ${password}` } });
    if (res.ok) {
      localStorage.setItem(STORAGE_KEY, password);
      setToken(password);
    } else {
      setAuthError("密码错误");
    }
    setAuthLoading(false);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!form.filmStock || !form.rollNumber || !token) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/rolls", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        close();
        router.refresh();
      } else {
        // Token expired or invalid — clear and ask again
        if (res.status === 401) {
          localStorage.removeItem(STORAGE_KEY);
          setToken(null);
        }
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? `错误 ${res.status}`);
      }
    } catch {
      setError("网络错误");
    }
    setLoading(false);
  }

  function set(key: string, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.72rem",
          letterSpacing: "0.14em",
          color: open ? "#fff" : "#111",
          border: "1.5px solid #111",
          background: open ? "#111" : "transparent",
          padding: "0.3rem 0.9rem",
          cursor: "pointer",
          transition: "background 0.15s, color 0.15s",
        }}
      >
        {open ? "✕ CLOSE" : "+ NEW ROLL"}
      </button>

      {/* Top-anchored drop-down panel */}
      {open && (
        <div
          ref={panelRef}
          className="panel-enter"
          style={{
            position: "fixed",
            top: "52px",
            left: 0,
            right: 0,
            zIndex: 99,
            background: "var(--bg)",
            borderBottom: "1.5px solid #111",
            boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
          }}
        >
          <div style={{ maxWidth: "880px", margin: "0 auto", padding: "2rem 2rem" }}>
            {!token ? (
              /* ── Password step ── */
              <form onSubmit={handleAuth} style={{ maxWidth: "320px" }}>
                <p style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 700, marginBottom: "1.2rem" }}>
                  管理员验证
                </p>
                <label style={labelStyle}>密码</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  style={inputStyle}
                  autoFocus
                  placeholder="输入密码"
                />
                {authError && (
                  <p style={{ color: "#c00", fontFamily: "var(--font-mono)", fontSize: "0.72rem", marginTop: "8px" }}>{authError}</p>
                )}
                <button
                  type="submit"
                  disabled={authLoading}
                  style={{
                    marginTop: "1rem", width: "100%",
                    background: "#111", color: "#fff", border: "none",
                    padding: "0.7rem",
                    fontFamily: "var(--font-mono)", fontSize: "0.72rem",
                    letterSpacing: "0.15em", cursor: "pointer",
                    opacity: authLoading ? 0.5 : 1,
                  }}
                >
                  {authLoading ? "验证中…" : "进入"}
                </button>
                <p style={{ marginTop: "0.6rem", fontFamily: "var(--font-mono)", fontSize: "0.62rem", color: "var(--text-dim)" }}>
                  密码已记住，下次无需再输
                </p>
              </form>
            ) : (
              /* ── Create roll form ── */
              <form onSubmit={handleCreate}>
                <div style={{ marginBottom: "1.2rem" }}>
                  <label style={labelStyle}>胶卷型号 *</label>
                  <div style={{ display: "flex", gap: "0.75rem" }}>
                    {([
                      { value: "Kodak Gold 200", icon: "/film-icon.png", label: "KODAK GOLD 200" },
                      { value: "Fuji 200",       icon: "/fuji-icon.png",  label: "FUJI 200" },
                    ] as const).map(opt => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => set("filmStock", opt.value)}
                        style={{
                          border: form.filmStock === opt.value ? "2px solid #111" : "1.5px solid var(--border-soft)",
                          background: form.filmStock === opt.value ? "rgba(0,0,0,0.05)" : "transparent",
                          padding: "0.8rem 1rem",
                          cursor: "pointer",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: "0.5rem",
                          minWidth: "110px",
                          transition: "border-color 0.15s, background 0.15s",
                        }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={opt.icon} alt={opt.label} style={{ width: "56px", height: "56px", objectFit: "contain" }} />
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", letterSpacing: "0.1em", color: "#111" }}>
                          {opt.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                  gap: "1rem",
                  marginBottom: "1.2rem",
                }}>
                  <div>
                    <label style={labelStyle}>卷号 *</label>
                    <input style={inputStyle} type="number" value={form.rollNumber} onChange={e => set("rollNumber", e.target.value)} required placeholder="1" />
                  </div>
                  <div>
                    <label style={labelStyle}>日期</label>
                    <input style={inputStyle} type="date" value={form.date} onChange={e => set("date", e.target.value)} />
                  </div>
                  <div>
                    <label style={labelStyle}>地点</label>
                    <input style={inputStyle} value={form.location} onChange={e => set("location", e.target.value)} placeholder="Tokyo" />
                  </div>
                  <div>
                    <label style={labelStyle}>相机</label>
                    <input style={inputStyle} value={form.camera} onChange={e => set("camera", e.target.value)} placeholder="Contax T2" />
                  </div>
                  <div>
                    <label style={labelStyle}>备注</label>
                    <input style={inputStyle} value={form.description} onChange={e => set("description", e.target.value)} placeholder="…" />
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      background: "#111", color: "#fff", border: "none",
                      padding: "0.65rem 2rem",
                      fontFamily: "var(--font-mono)", fontSize: "0.72rem",
                      letterSpacing: "0.15em", cursor: "pointer",
                      opacity: loading ? 0.5 : 1,
                    }}
                  >
                    {loading ? "创建中…" : "CREATE ROLL"}
                  </button>
                  {error && (
                    <span style={{ color: "#c00", fontFamily: "var(--font-mono)", fontSize: "0.72rem" }}>{error}</span>
                  )}
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
