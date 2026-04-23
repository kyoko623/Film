"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const STORAGE_KEY = "adminToken";

const inputStyle: React.CSSProperties = {
  width: "100%",
  border: "1px solid #e8e8e8",
  background: "#fff",
  padding: "0.6rem 0.8rem",
  fontFamily: "var(--font-mono)",
  fontSize: "0.82rem",
  color: "#111",
  outline: "none",
};

const labelStyle: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: "0.6rem",
  letterSpacing: "0.18em",
  color: "#aaa",
  marginBottom: "4px",
  display: "block",
};

export default function NewRollButton() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [form, setForm] = useState({
    filmStock: "", rollNumber: "", date: "", location: "", camera: "", description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) setToken(saved);
  }, []);

  function close() {
    setOpen(false);
    setPassword("");
    setAuthError("");
    setError("");
    setForm({ filmStock: "", rollNumber: "", date: "", location: "", camera: "", description: "" });
  }

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError("");
    const res = await fetch("/api/rolls", { headers: { Authorization: `Bearer ${password}` } });
    if (res.ok) {
      sessionStorage.setItem(STORAGE_KEY, password);
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
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? `错误 ${res.status}`);
      }
    } catch {
      setError("网络错误");
    }
    setLoading(false);
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.75rem",
          letterSpacing: "0.14em",
          color: "#111",
          border: "1px solid #e8e8e8",
          background: "#fff",
          padding: "0.35rem 0.85rem",
          cursor: "pointer",
          transition: "border-color 0.15s, background 0.15s",
        }}
        onMouseEnter={e => { (e.target as HTMLElement).style.background = "#f7f7f7"; }}
        onMouseLeave={e => { (e.target as HTMLElement).style.background = "#fff"; }}
      >
        + NEW ROLL
      </button>

      {open && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 9999,
            background: "rgba(255,255,255,0.88)",
            backdropFilter: "blur(6px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "1.5rem",
          }}
          onClick={close}
        >
          <div
            style={{
              background: "#fff",
              border: "1px solid #e8e8e8",
              padding: "2.2rem",
              width: "100%",
              maxWidth: "440px",
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.8rem" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", letterSpacing: "0.2em", color: "#aaa" }}>
                NEW ROLL
              </span>
              <button onClick={close} style={{ background: "none", border: "none", cursor: "pointer", color: "#aaa", fontSize: "1rem" }}>✕</button>
            </div>

            {/* Auth step */}
            {!token ? (
              <form onSubmit={handleAuth}>
                <label style={labelStyle}>ADMIN PASSWORD</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  style={inputStyle}
                  autoFocus
                  placeholder="请输入密码"
                />
                {authError && <p style={{ color: "#e00", fontFamily: "var(--font-mono)", fontSize: "0.72rem", marginTop: "8px" }}>{authError}</p>}
                <button
                  type="submit"
                  disabled={authLoading}
                  style={{
                    marginTop: "1rem", width: "100%",
                    background: "#111", color: "#fff",
                    border: "none", padding: "0.7rem",
                    fontFamily: "var(--font-mono)", fontSize: "0.75rem",
                    letterSpacing: "0.15em", cursor: "pointer",
                    opacity: authLoading ? 0.5 : 1,
                  }}
                >
                  {authLoading ? "验证中…" : "进入"}
                </button>
              </form>
            ) : (
              /* Create roll form */
              <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                  <div>
                    <label style={labelStyle}>胶卷型号 *</label>
                    <input style={inputStyle} value={form.filmStock} onChange={e => setForm(f => ({ ...f, filmStock: e.target.value }))} required placeholder="Kodak Gold 200" />
                  </div>
                  <div>
                    <label style={labelStyle}>卷号 *</label>
                    <input style={inputStyle} type="number" value={form.rollNumber} onChange={e => setForm(f => ({ ...f, rollNumber: e.target.value }))} required placeholder="1" />
                  </div>
                  <div>
                    <label style={labelStyle}>日期</label>
                    <input style={inputStyle} type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
                  </div>
                  <div>
                    <label style={labelStyle}>地点</label>
                    <input style={inputStyle} value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="Tokyo" />
                  </div>
                  <div>
                    <label style={labelStyle}>相机</label>
                    <input style={inputStyle} value={form.camera} onChange={e => setForm(f => ({ ...f, camera: e.target.value }))} placeholder="Contax T2" />
                  </div>
                  <div>
                    <label style={labelStyle}>备注</label>
                    <input style={inputStyle} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="…" />
                  </div>
                </div>
                {error && <p style={{ color: "#e00", fontFamily: "var(--font-mono)", fontSize: "0.72rem" }}>{error}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    background: "#111", color: "#fff", border: "none",
                    padding: "0.7rem", fontFamily: "var(--font-mono)",
                    fontSize: "0.75rem", letterSpacing: "0.15em",
                    cursor: "pointer", opacity: loading ? 0.5 : 1,
                  }}
                >
                  {loading ? "创建中…" : "CREATE ROLL"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
