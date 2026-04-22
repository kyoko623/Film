import { NextResponse } from "next/server";

export async function GET() {
  const key = process.env.FILM_ADMIN_KEY;
  return NextResponse.json({
    hasAdminKey: !!key,
    length: key?.length ?? 0,
    hasBlobToken: !!process.env.BLOB_READ_WRITE_TOKEN,
  });
}
