import { NextResponse } from "next/server";
import { getAllRolls, saveAllRolls } from "@/lib/data";
import { checkAuth } from "@/lib/auth";
import type { FilmRoll } from "@/types";

export async function GET() {
  const rolls = await getAllRolls();
  return NextResponse.json(rolls);
}

export async function POST(request: Request) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { filmStock, rollNumber, date, location, camera, description } = body;

  if (!filmStock || !rollNumber) {
    return NextResponse.json({ error: "filmStock and rollNumber are required" }, { status: 400 });
  }

  const rolls = await getAllRolls();
  const newRoll: FilmRoll = {
    id: `roll-${Date.now()}`,
    filmStock,
    rollNumber: Number(rollNumber),
    date: date || "",
    location: location || "",
    camera: camera || "",
    description: description || "",
    photos: [],
  };

  rolls.push(newRoll);
  await saveAllRolls(rolls);

  return NextResponse.json(newRoll, { status: 201 });
}
