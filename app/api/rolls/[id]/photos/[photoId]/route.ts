import { NextResponse } from "next/server";
import { del } from "@vercel/blob";
import { getAllRolls, saveAllRolls } from "@/lib/data";
import { checkAuth } from "@/lib/auth";

interface Params {
  params: Promise<{ id: string; photoId: string }>;
}

export async function DELETE(request: Request, { params }: Params) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, photoId } = await params;
  const rolls = await getAllRolls();
  const rollIndex = rolls.findIndex((r) => r.id === id);

  if (rollIndex === -1) {
    return NextResponse.json({ error: "Roll not found" }, { status: 404 });
  }

  const photoIndex = rolls[rollIndex].photos.findIndex((p) => p.id === photoId);
  if (photoIndex === -1) {
    return NextResponse.json({ error: "Photo not found" }, { status: 404 });
  }

  const photo = rolls[rollIndex].photos[photoIndex];
  try {
    await del(photo.filename, { token: process.env.BLOB_READ_WRITE_TOKEN });
  } catch {
    // Continue even if blob deletion fails
  }

  rolls[rollIndex].photos.splice(photoIndex, 1);
  await saveAllRolls(rolls);

  return NextResponse.json({ success: true });
}

export async function PATCH(request: Request, { params }: Params) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, photoId } = await params;
  const { caption } = await request.json();

  const rolls = await getAllRolls();
  const rollIndex = rolls.findIndex((r) => r.id === id);
  if (rollIndex === -1) {
    return NextResponse.json({ error: "Roll not found" }, { status: 404 });
  }

  const photoIndex = rolls[rollIndex].photos.findIndex((p) => p.id === photoId);
  if (photoIndex === -1) {
    return NextResponse.json({ error: "Photo not found" }, { status: 404 });
  }

  rolls[rollIndex].photos[photoIndex].caption = caption ?? "";
  await saveAllRolls(rolls);

  return NextResponse.json(rolls[rollIndex].photos[photoIndex]);
}
