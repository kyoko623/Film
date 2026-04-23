"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

const STORAGE_KEY = "adminToken";

export default function UploadToRoll({ rollId }: { rollId: string }) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleChange() {
    const files = fileRef.current?.files;
    if (!files || files.length === 0) return;
    const token = localStorage.getItem(STORAGE_KEY);
    if (!token) return;
    setUploading(true);
    const fd = new FormData();
    for (const f of files) fd.append("files", f);
    await fetch(`/api/rolls/${rollId}/photos`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: fd,
    });
    if (fileRef.current) fileRef.current.value = "";
    setUploading(false);
    router.refresh();
  }

  return (
    <label
      title="上传照片"
      style={{
        display: "inline-block",
        marginTop: "0.5rem",
        cursor: uploading ? "default" : "pointer",
        fontFamily: "var(--font-mono)",
        fontSize: "0.65rem",
        letterSpacing: "0.12em",
        color: uploading ? "var(--text-dim)" : "var(--text-muted)",
        borderBottom: "1px solid var(--border-soft)",
        paddingBottom: "1px",
        transition: "color 0.15s",
      }}
    >
      <input
        ref={fileRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp"
        style={{ display: "none" }}
        onChange={handleChange}
        disabled={uploading}
      />
      {uploading ? "上传中…" : "+ 上传照片"}
    </label>
  );
}
