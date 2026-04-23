"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

const STORAGE_KEY = "adminToken";

export default function UploadToRoll({ rollId }: { rollId: string }) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  // Inline auth if token missing
  const [needAuth, setNeedAuth] = useState(false);
  const [pw, setPw] = useState("");
  const [pwError, setPwError] = useState("");
  const [pending, setPending] = useState<FileList | null>(null);

  async function doUpload(files: FileList, token: string) {
    setUploading(true); setError("");
    try {
      const fd = new FormData();
      for (const f of files) fd.append("files", f);
      const res = await fetch(`/api/rolls/${rollId}/photos`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      if (res.ok) {
        setDone(true);
        if (fileRef.current) fileRef.current.value = "";
        setTimeout(() => { setDone(false); router.refresh(); }, 800);
      } else if (res.status === 401) {
        localStorage.removeItem(STORAGE_KEY);
        setError("认证失败，请重试");
      } else {
        const d = await res.json().catch(() => ({}));
        setError(d.error ?? `上传失败 (${res.status})`);
      }
    } catch {
      setError("网络错误");
    }
    setUploading(false);
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const token = localStorage.getItem(STORAGE_KEY);
    if (!token) {
      // No token — save files and ask for password
      setPending(files);
      setNeedAuth(true);
      return;
    }
    await doUpload(files, token);
  }

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    setPwError("");
    const res = await fetch("/api/rolls", { headers: { Authorization: `Bearer ${pw}` } });
    if (res.ok) {
      localStorage.setItem(STORAGE_KEY, pw);
      setNeedAuth(false);
      if (pending) await doUpload(pending, pw);
      setPending(null); setPw("");
    } else {
      setPwError("密码错误");
    }
  }

  const monoSm: React.CSSProperties = {
    fontFamily: "var(--font-mono)",
    fontSize: "0.65rem",
    letterSpacing: "0.1em",
  };

  // Inline password prompt
  if (needAuth) {
    return (
      <form onSubmit={handleAuth} style={{ marginTop: "0.5rem", display: "flex", gap: "0.4rem", alignItems: "center", flexWrap: "wrap" }}>
        <input
          type="password"
          value={pw}
          onChange={e => setPw(e.target.value)}
          placeholder="密码"
          autoFocus
          style={{
            ...monoSm,
            border: "1.5px solid #111",
            padding: "0.3rem 0.5rem",
            outline: "none",
            width: "110px",
            background: "#fff",
          }}
        />
        <button type="submit" style={{ ...monoSm, background: "#111", color: "#fff", border: "none", padding: "0.3rem 0.7rem", cursor: "pointer" }}>
          确认
        </button>
        <button type="button" onClick={() => { setNeedAuth(false); setPending(null); }} style={{ ...monoSm, background: "none", border: "none", color: "var(--text-dim)", cursor: "pointer" }}>
          取消
        </button>
        {pwError && <span style={{ ...monoSm, color: "#c00" }}>{pwError}</span>}
      </form>
    );
  }

  return (
    <div style={{ marginTop: "0.5rem" }}>
      <label style={{ cursor: uploading ? "default" : "pointer", display: "inline-block" }}>
        <input
          ref={fileRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          style={{ display: "none" }}
          onChange={handleFileChange}
          disabled={uploading}
        />
        <span style={{
          ...monoSm,
          color: done ? "#080" : uploading ? "var(--text-dim)" : "var(--text-muted)",
          borderBottom: "1px solid var(--border-soft)",
          paddingBottom: "1px",
          transition: "color 0.15s",
        }}>
          {done ? "✓ 已上传" : uploading ? "上传中…" : "+ 上传照片"}
        </span>
      </label>
      {error && (
        <p style={{ ...monoSm, color: "#c00", marginTop: "4px" }}>{error}</p>
      )}
    </div>
  );
}
