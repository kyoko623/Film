import { NextResponse } from "next/server";
import { del } from "@vercel/blob";
import { getAllRolls, saveAllRolls } from "@/lib/data";
import { checkAuth } from "@/lib/auth";

interface Params {
  params: Promise<{ id: string }>;
}

export async function DELETE(request: Request, { params }: Params) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const rolls = await getAllRolls();
  const roll = rolls.find((r) => r.id === id);

  if (!roll) {
    return NextResponse.json({ error: "Roll not found" }, { status: 404 });
  }

  // Delete all photo blobs
  for (const photo of roll.photos) {
    try {
      await del(photo.filename, { token: process.env.BLOB_READ_WRITE_TOKEN });
    } catch {
      // Continue even if individual blob deletion fails
    }
  }

  const updated = rolls.filter((r) => r.id !== id);
  await saveAllRolls(updated);

  return NextResponse.json({ success: true });
}
