import { NextResponse } from "next/server";

export async function GET() {
  const pw = process.env.ADMIN_PASSWORD;
  return NextResponse.json({
    hasPassword: !!pw,
    length: pw?.length ?? 0,
    hasBlobToken: !!process.env.BLOB_READ_WRITE_TOKEN,
  });
}
