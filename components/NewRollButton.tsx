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

const btnPrimary: React.CSSProperties = {
  background: "#111", color: "#fff", border: "none",
  padding: "0.65rem 2rem",
  fontFamily: "var(--font-mono)", fontSize: "0.72rem",
  letterSpacing: "0.15em", cursor: "pointer",
};

const btnSecondary: React.CSSProperties = {
  background: "transparent", color: "#111",
  border: "1.5px solid var(--border-soft)",
  padding: "0.65rem 1.5rem",
  fontFamily: "var(--font-mono)", fontSize: "0.72rem",
  letterSpacing: "0.15em", cursor: "pointer",
};

type CreatedRoll = { id: string; rollNumber: number; filmStock: string };

export default function NewRollButton() {
  const router = useRouter();
  const panelRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [open, setOpen] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  // Step 1: auth
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  // Step 2: create
  const [form, setForm] = useState({
    filmStock: "Kodak Gold 200", rollNumber: "", date: "", location: "", camera: "", description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Step 3: upload
  const [createdRoll, setCreatedRoll] = useState<CreatedRoll | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [fileCount, setFileCount] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setToken(saved);
  }, []);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) close();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  function close() {
    setOpen(false);
    setPassword(""); setAuthError("");
    setError("");
    setCreatedRoll(null); setUploadError(""); setFileCount(0);
    setForm({ filmStock: "Kodak Gold 200", rollNumber: "", date: "", location: "", camera: "", description: "" });
    if (fileRef.current) fileRef.current.value = "";
  }

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    setAuthLoading(true); setAuthError("");
    const res = await fetch("/api/rolls", { headers: { Authorization: `Bearer ${password}` } });
    if (res.ok) { localStorage.setItem(STORAGE_KEY, password); setToken(password); }
    else setAuthError("密码错误");
    setAuthLoading(false);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!form.filmStock || !form.rollNumber || !token) return;
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/rolls", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const roll = await res.json();
        setCreatedRoll(roll); // → upload step
        router.refresh();
      } else {
        if (res.status === 401) { localStorage.removeItem(STORAGE_KEY); setToken(null); }
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? `错误 ${res.status}`);
      }
    } catch { setError("网络错误"); }
    setLoading(false);
  }

  async function handleUpload() {
    const files = fileRef.current?.files;
    if (!files || files.length === 0 || !createdRoll || !token) return;
    setUploading(true); setUploadError("");
    const fd = new FormData();
    for (const f of files) fd.append("files", f);
    const res = await fetch(`/api/rolls/${createdRoll.id}/photos`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: fd,
    });
    if (res.ok) { close(); router.refresh(); }
    else setUploadError("上传失败，请重试");
    setUploading(false);
  }

  function setField(key: string, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          fontFamily: "var(--font-mono)", fontSize: "0.72rem", letterSpacing: "0.14em",
          color: open ? "#fff" : "#111",
          border: "1.5px solid #111",
          background: open ? "#111" : "transparent",
          padding: "0.3rem 0.9rem", cursor: "pointer",
          transition: "background 0.15s, color 0.15s",
        }}
      >
        {open ? "✕ CLOSE" : "+ NEW ROLL"}
      </button>

      {open && (
        <div ref={panelRef} className="panel-enter" style={{
          position: "fixed", top: "52px", left: 0, right: 0, zIndex: 99,
          background: "var(--bg)", borderBottom: "1.5px solid #111",
          boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
        }}>
          <div style={{ maxWidth: "880px", margin: "0 auto", padding: "2rem" }}>

            {/* ── Step 1: auth ── */}
            {!token && (
              <form onSubmit={handleAuth} style={{ maxWidth: "320px" }}>
                <p style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 700, marginBottom: "1.2rem" }}>管理员验证</p>
                <label style={labelStyle}>密码</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                  style={inputStyle} autoFocus placeholder="输入密码" />
                {authError && <p style={{ color: "#c00", fontFamily: "var(--font-mono)", fontSize: "0.72rem", marginTop: "8px" }}>{authError}</p>}
                <button type="submit" disabled={authLoading} style={{ ...btnPrimary, marginTop: "1rem", width: "100%", opacity: authLoading ? 0.5 : 1 }}>
                  {authLoading ? "验证中…" : "进入"}
                </button>
                <p style={{ marginTop: "0.6rem", fontFamily: "var(--font-mono)", fontSize: "0.62rem", color: "var(--text-dim)" }}>密码已记住，下次无需再输</p>
              </form>
            )}

            {/* ── Step 2: create roll ── */}
            {token && !createdRoll && (
              <form onSubmit={handleCreate}>
                <div style={{ marginBottom: "1.2rem" }}>
                  <label style={labelStyle}>胶卷型号 *</label>
                  <div style={{ display: "flex", gap: "0.75rem" }}>
                    {([
                      { value: "Kodak Gold 200", icon: "/film-icon.png", label: "KODAK GOLD 200" },
                      { value: "Fuji 200",       icon: "/fuji-icon.png",  label: "FUJI 200" },
                    ] as const).map(opt => (
                      <button key={opt.value} type="button" onClick={() => setField("filmStock", opt.value)} style={{
                        border: form.filmStock === opt.value ? "2px solid #111" : "1.5px solid var(--border-soft)",
                        background: form.filmStock === opt.value ? "rgba(0,0,0,0.05)" : "transparent",
                        padding: "0.8rem 1rem", cursor: "pointer",
                        display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem", minWidth: "110px",
                        transition: "border-color 0.15s, background 0.15s",
                      }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={opt.icon} alt={opt.label} style={{ width: "56px", height: "56px", objectFit: "contain" }} />
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", letterSpacing: "0.1em", color: "#111" }}>{opt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "1rem", marginBottom: "1.2rem" }}>
                  <div>
                    <label style={labelStyle}>卷号 *</label>
                    <input style={inputStyle} type="number" value={form.rollNumber} onChange={e => setField("rollNumber", e.target.value)} required placeholder="1" />
                  </div>
                  <div>
                    <label style={labelStyle}>日期</label>
                    <input style={inputStyle} type="date" value={form.date} onChange={e => setField("date", e.target.value)} />
                  </div>
                  <div>
                    <label style={labelStyle}>地点</label>
                    <input style={inputStyle} value={form.location} onChange={e => setField("location", e.target.value)} placeholder="Tokyo" />
                  </div>
                  <div>
                    <label style={labelStyle}>相机</label>
                    <input style={inputStyle} value={form.camera} onChange={e => setField("camera", e.target.value)} placeholder="Contax T2" />
                  </div>
                  <div>
                    <label style={labelStyle}>备注</label>
                    <input style={inputStyle} value={form.description} onChange={e => setField("description", e.target.value)} placeholder="…" />
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <button type="submit" disabled={loading} style={{ ...btnPrimary, opacity: loading ? 0.5 : 1 }}>
                    {loading ? "创建中…" : "CREATE ROLL"}
                  </button>
                  {error && <span style={{ color: "#c00", fontFamily: "var(--font-mono)", fontSize: "0.72rem" }}>{error}</span>}
                </div>
              </form>
            )}

            {/* ── Step 3: upload photos ── */}
            {token && createdRoll && (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", letterSpacing: "0.18em", color: "var(--text-dim)" }}>✓ CREATED</span>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 700 }}>
                    {createdRoll.filmStock} — ROLL #{createdRoll.rollNumber}
                  </span>
                </div>

                <label style={labelStyle}>上传照片</label>
                <div style={{
                  border: "1.5px dashed var(--border-soft)",
                  padding: "1.5rem",
                  textAlign: "center",
                  cursor: "pointer",
                  marginBottom: "1rem",
                  background: fileCount > 0 ? "rgba(0,0,0,0.03)" : "transparent",
                  transition: "background 0.15s",
                }}
                  onClick={() => fileRef.current?.click()}
                >
                  <input
                    ref={fileRef}
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,image/webp"
                    style={{ display: "none" }}
                    onChange={e => setFileCount(e.target.files?.length ?? 0)}
                  />
                  <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: fileCount > 0 ? "#111" : "var(--text-dim)", letterSpacing: "0.1em", margin: 0 }}>
                    {fileCount > 0 ? `${fileCount} 张照片已选择` : "点击选择照片（可多选）"}
                  </p>
                  <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.62rem", color: "var(--text-dim)", letterSpacing: "0.08em", margin: "0.4rem 0 0" }}>
                    JPG · PNG · WEBP
                  </p>
                </div>

                {uploadError && <p style={{ color: "#c00", fontFamily: "var(--font-mono)", fontSize: "0.72rem", marginBottom: "0.75rem" }}>{uploadError}</p>}

                <div style={{ display: "flex", gap: "0.75rem" }}>
                  <button
                    onClick={handleUpload}
                    disabled={uploading || fileCount === 0}
                    style={{ ...btnPrimary, opacity: uploading || fileCount === 0 ? 0.4 : 1 }}
                  >
                    {uploading ? "上传中…" : "UPLOAD PHOTOS"}
                  </button>
                  <button onClick={() => { close(); router.refresh(); }} style={btnSecondary}>
                    稍后再传
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </>
  );
}
