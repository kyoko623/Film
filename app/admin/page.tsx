"use client";

import { useState, useEffect, useRef } from "react";
import type { FilmRoll } from "@/types";

const STORAGE_KEY = "adminToken";

function api(path: string, token: string, options: RequestInit = {}) {
  return fetch(path, {
    ...options,
    headers: {
      ...("body" in options && !(options.body instanceof FormData)
        ? { "Content-Type": "application/json" }
        : {}),
      Authorization: `Bearer ${token}`,
      ...(options.headers ?? {}),
    },
  });
}

// ── Login ──────────────────────────────────────────────────────────────────

function LoginForm({ onLogin }: { onLogin: (token: string) => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await api("/api/rolls", password);
    if (res.ok) {
      sessionStorage.setItem(STORAGE_KEY, password);
      onLogin(password);
    } else {
      setError("密码错误");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <form onSubmit={handleSubmit} className="w-72">
        <h1 className="text-gray-400 text-xl font-light tracking-widest uppercase mb-8 text-center">
          Admin
        </h1>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="密码"
          className="w-full bg-gray-50 text-gray-900 border border-gray-200 px-4 py-3 text-sm outline-none mb-3 placeholder:text-gray-400"
          autoFocus
        />
        {error && <p className="text-red-500 text-xs mb-3">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gray-900 hover:bg-gray-700 text-white py-3 text-sm tracking-widest uppercase transition-colors disabled:opacity-50"
        >
          {loading ? "验证中…" : "进入"}
        </button>
      </form>
    </div>
  );
}

// ── Create Roll Form ────────────────────────────────────────────────────────

function CreateRollForm({ token, onCreated }: { token: string; onCreated: (roll: FilmRoll) => void }) {
  const [form, setForm] = useState({
    filmStock: "",
    rollNumber: "",
    date: "",
    location: "",
    camera: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function set(key: string, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.filmStock || !form.rollNumber) return;
    setLoading(true);
    setError("");
    try {
      const res = await api("/api/rolls", token, {
        method: "POST",
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const roll = await res.json();
        onCreated(roll);
        setForm({ filmStock: "", rollNumber: "", date: "", location: "", camera: "", description: "" });
      } else {
        const data = await res.json().catch(() => ({}));
        setError(`错误 ${res.status}：${data.error ?? "请求失败"}`);
      }
    } catch (e) {
      setError(`网络错误：${String(e)}`);
    }
    setLoading(false);
  }

  const inputClass =
    "bg-white text-gray-900 border border-gray-200 px-3 py-2 text-sm outline-none w-full placeholder:text-gray-400";

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 border border-gray-200 p-6 mb-10">
      <h2 className="text-gray-400 text-xs tracking-widest uppercase mb-4">新建胶卷</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3">
        <input className={inputClass} placeholder="胶卷型号 *" value={form.filmStock} onChange={(e) => set("filmStock", e.target.value)} required />
        <input className={inputClass} placeholder="卷号 *" type="number" value={form.rollNumber} onChange={(e) => set("rollNumber", e.target.value)} required />
        <input className={inputClass} placeholder="日期" type="date" value={form.date} onChange={(e) => set("date", e.target.value)} />
        <input className={inputClass} placeholder="地点" value={form.location} onChange={(e) => set("location", e.target.value)} />
        <input className={inputClass} placeholder="相机" value={form.camera} onChange={(e) => set("camera", e.target.value)} />
        <input className={inputClass} placeholder="备注" value={form.description} onChange={(e) => set("description", e.target.value)} />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="bg-gray-900 hover:bg-gray-700 text-white px-6 py-2 text-sm tracking-wider uppercase transition-colors disabled:opacity-50"
      >
        {loading ? "创建中…" : "创建"}
      </button>
      {error && <p className="text-red-500 text-xs mt-3">{error}</p>}
    </form>
  );
}

// ── Roll Card ───────────────────────────────────────────────────────────────

function RollCard({ roll, token, onDeleted, onUpdated }: {
  roll: FilmRoll;
  token: string;
  onDeleted: (id: string) => void;
  onUpdated: (roll: FilmRoll) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleUpload() {
    const files = fileRef.current?.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    const formData = new FormData();
    for (const file of files) formData.append("files", file);
    const res = await api(`/api/rolls/${roll.id}/photos`, token, {
      method: "POST",
      body: formData,
    });
    if (res.ok) {
      const newPhotos = await res.json();
      onUpdated({ ...roll, photos: [...roll.photos, ...newPhotos] });
      if (fileRef.current) fileRef.current.value = "";
    }
    setUploading(false);
  }

  async function handleDeletePhoto(photoId: string) {
    const res = await api(`/api/rolls/${roll.id}/photos/${photoId}`, token, { method: "DELETE" });
    if (res.ok) {
      onUpdated({ ...roll, photos: roll.photos.filter((p) => p.id !== photoId) });
    }
  }

  async function handleDeleteRoll() {
    if (!confirm(`确定删除 Roll #${roll.rollNumber}（${roll.filmStock}）及其所有照片？`)) return;
    setDeleting(true);
    const res = await api(`/api/rolls/${roll.id}`, token, { method: "DELETE" });
    if (res.ok) onDeleted(roll.id);
    setDeleting(false);
  }

  return (
    <div className="border border-gray-200 p-5 mb-4 bg-white">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-gray-400 text-xs tracking-widest uppercase">{roll.filmStock}</p>
          <p className="text-gray-900 font-medium">Roll #{roll.rollNumber}</p>
          <p className="text-gray-400 text-xs mt-0.5">
            {[roll.date, roll.location, roll.camera].filter(Boolean).join(" · ")}
          </p>
        </div>
        <button
          onClick={handleDeleteRoll}
          disabled={deleting}
          className="text-gray-400 hover:text-red-500 text-xs tracking-wider transition-colors disabled:opacity-50"
        >
          {deleting ? "删除中…" : "删除整卷"}
        </button>
      </div>

      {/* Photo thumbnails */}
      {roll.photos.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {roll.photos.map((photo) => (
            <div key={photo.id} className="relative group w-16 h-16">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo.filename} alt="" className="w-full h-full object-cover" />
              <button
                onClick={() => handleDeletePhoto(photo.id)}
                className="absolute inset-0 bg-black/50 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload */}
      <div className="flex items-center gap-3">
        <input
          ref={fileRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          className="text-gray-500 text-xs file:mr-3 file:bg-gray-900 file:text-white file:border-0 file:px-3 file:py-1.5 file:text-xs file:cursor-pointer"
        />
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="bg-gray-900 hover:bg-gray-700 text-white px-4 py-1.5 text-xs tracking-wider uppercase transition-colors disabled:opacity-50 whitespace-nowrap"
        >
          {uploading ? "上传中…" : "上传照片"}
        </button>
      </div>
    </div>
  );
}

// ── Main Admin ──────────────────────────────────────────────────────────────

export default function AdminPage() {
  const [token, setToken] = useState<string | null>(null);
  const [rolls, setRolls] = useState<FilmRoll[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) setToken(saved);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!token) return;
    api("/api/rolls", token).then((r) => r.json()).then(setRolls).catch(() => {});
  }, [token]);

  if (loading) return null;

  if (!token) {
    return <LoginForm onLogin={(t) => setToken(t)} />;
  }

  function handleLogout() {
    sessionStorage.removeItem(STORAGE_KEY);
    setToken(null);
  }

  const sortedRolls = [...rolls].sort(
    (a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime()
  );

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-12">
          <h1 className="text-2xl font-light tracking-widest uppercase text-gray-900">Admin</h1>
          <div className="flex gap-4">
            <a href="/" className="text-gray-400 hover:text-gray-700 text-xs tracking-wider uppercase transition-colors">
              ← 主页
            </a>
            <button
              onClick={handleLogout}
              className="text-gray-400 hover:text-gray-700 text-xs tracking-wider uppercase transition-colors"
            >
              退出
            </button>
          </div>
        </div>

        <CreateRollForm token={token} onCreated={(roll) => setRolls((prev) => [...prev, roll])} />

        <div>
          <h2 className="text-gray-400 text-xs tracking-widest uppercase mb-4">
            所有胶卷 ({rolls.length})
          </h2>
          {sortedRolls.length === 0 ? (
            <p className="text-gray-400 text-sm">还没有胶卷，先创建一卷吧。</p>
          ) : (
            sortedRolls.map((roll) => (
              <RollCard
                key={roll.id}
                roll={roll}
                token={token}
                onDeleted={(id) => setRolls((prev) => prev.filter((r) => r.id !== id))}
                onUpdated={(updated) =>
                  setRolls((prev) => prev.map((r) => (r.id === updated.id ? updated : r)))
                }
              />
            ))
          )}
        </div>
      </div>
    </main>
  );
}
