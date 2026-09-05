import { NextResponse } from "next/server";

// Endpoint to safely provide the ConvertAPI secret to the client
// so browser can upload files directly to ConvertAPI (bypasses Vercel 4.5MB limit)
export async function GET() {
  const secret = process.env.CONVERTAPI_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "CONVERTAPI_SECRET not configured" }, { status: 500 });
  }
  return NextResponse.json({ secret });
}
