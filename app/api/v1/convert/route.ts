import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({ error: "This endpoint is deprecated. Use /api/direct-convert instead." }, { status: 410 });
}

export async function GET() {
  return NextResponse.json({ error: "This endpoint is deprecated. Use /api/direct-convert instead." }, { status: 410 });
}
