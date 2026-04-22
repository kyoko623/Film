import { NextResponse } from "next/server";
import { list } from "@vercel/blob";

export async function GET() {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  const adminKey = process.env.FILM_ADMIN_KEY;

  let blobWorks = false;
  let blobError = "";
  try {
    await list({ token });
    blobWorks = true;
  } catch (e) {
    blobError = String(e);
  }

  return NextResponse.json({
    hasAdminKey: !!adminKey,
    adminKeyLength: adminKey?.length ?? 0,
    hasBlobToken: !!token,
    blobTokenLength: token?.length ?? 0,
    blobWorks,
    blobError,
  });
}
