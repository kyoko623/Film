import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { getAllRolls, saveAllRolls } from "@/lib/data";
import { checkAuth } from "@/lib/auth";
import type { Photo } from "@/types";

export const maxDuration = 60;

interface Params {
  params: Promise<{ id: string }>;
}

export async function POST(request: Request, { params }: Params) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const rolls = await getAllRolls();
  const rollIndex = rolls.findIndex((r) => r.id === id);

  if (rollIndex === -1) {
    return NextResponse.json({ error: "Roll not found" }, { status: 404 });
  }

  const formData = await request.formData();
  const files = formData.getAll("files") as File[];

  if (files.length === 0) {
    return NextResponse.json({ error: "No files provided" }, { status: 400 });
  }

  const MAX_SIZE = 20 * 1024 * 1024; // 20MB
  const newPhotos: Photo[] = [];

  for (const file of files) {
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: `File ${file.name} exceeds 20MB limit` },
        { status: 413 }
      );
    }

    const ext = file.name.split(".").pop() ?? "jpg";
    const photoId = `${id}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const blob = await put(`photos/${id}/${photoId}.${ext}`, file, {
      access: "public",
    });

    newPhotos.push({
      id: photoId,
      filename: blob.url,
      caption: "",
    });
  }

  rolls[rollIndex].photos.push(...newPhotos);
  await saveAllRolls(rolls);

  return NextResponse.json(newPhotos, { status: 201 });
}
