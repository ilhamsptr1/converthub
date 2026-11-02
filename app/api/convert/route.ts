import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60; // Vercel max for hobby plan

// Cloudmersive API endpoint map
const ENDPOINTS: Record<string, { url: string; field: string; ext: string; mimeType: string }> = {
  "pdf-to-word":    { url: "/convert/pdf/to/docx",   field: "inputFile",  ext: "docx", mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" },
  "word-to-pdf":   { url: "/convert/docx/to/pdf",    field: "inputFile",  ext: "pdf",  mimeType: "application/pdf" },
  "compress-pdf":  { url: "/pdf/edit/reduce-size",    field: "inputFile",  ext: "pdf",  mimeType: "application/pdf" },
  "jpg-to-png":    { url: "/image/convert/to/png",    field: "imageFile",  ext: "png",  mimeType: "image/png" },
  "png-to-jpg":    { url: "/image/convert/to/jpg/75", field: "imageFile",  ext: "jpg",  mimeType: "image/jpeg" },
  "compress-image":{ url: "/image/convert/to/jpg/60", field: "imageFile",  ext: "jpg",  mimeType: "image/jpeg" },
  "mp4-to-mp3":    { url: "/video/convert/to/mp3",    field: "inputFile",  ext: "mp3",  mimeType: "audio/mpeg" },
  "wav-to-mp3":    { url: "/video/convert/to/mp3",    field: "inputFile",  ext: "mp3",  mimeType: "audio/mpeg" },
  "protect-pdf":   { url: "/pdf/encrypt/aes256",      field: "inputFile",  ext: "pdf",  mimeType: "application/pdf" },
};

export async function POST(req: NextRequest) {
  const apiKey = process.env.CLOUDMERSIVE_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "CLOUDMERSIVE_API_KEY not configured on server." }, { status: 500 });
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data." }, { status: 400 });
  }

  const toolId   = formData.get("toolId") as string;
  const file     = formData.get("file") as File | null;
  const password = formData.get("password") as string | null;

  if (!toolId || !file) {
    return NextResponse.json({ error: "Missing toolId or file." }, { status: 400 });
  }

  if (toolId === "split-pdf") {
    return NextResponse.json({ error: "Split PDF feature is not available. Please try PDF to Word instead." }, { status: 400 });
  }

  if (toolId === "merge-pdf") {
    return NextResponse.json({ error: "Merge PDF is not available on this server. Please try individual tools." }, { status: 400 });
  }

  const ep = ENDPOINTS[toolId];
  if (!ep) {
    return NextResponse.json({ error: `Tool "${toolId}" is not supported.` }, { status: 400 });
  }

  const outName = file.name.replace(/\.[^.]+$/, "") + "." + ep.ext;

  // Build form for Cloudmersive
  const cmForm = new FormData();
  cmForm.append(ep.field, file, file.name);

  // Extra params
  if (toolId === "protect-pdf" && password) {
    cmForm.append("userPassword", password);
    cmForm.append("ownerPassword", password);
  }

  let cmRes: Response;
  try {
    cmRes = await fetch(`https://api.cloudmersive.com${ep.url}`, {
      method: "POST",
      headers: { Apikey: apiKey },
      body: cmForm,
    });
  } catch (err: any) {
    return NextResponse.json({ error: `Network error reaching conversion server: ${err.message}` }, { status: 502 });
  }

  if (!cmRes.ok) {
    const msg = await cmRes.text().catch(() => cmRes.statusText);
    return NextResponse.json({ error: `Conversion error (${cmRes.status}): ${msg}` }, { status: 502 });
  }

  const resultBytes = await cmRes.arrayBuffer();
  if (!resultBytes || resultBytes.byteLength === 0) {
    return NextResponse.json({ error: "Conversion returned an empty file. The input may be unsupported or corrupted." }, { status: 502 });
  }

  return new NextResponse(resultBytes, {
    status: 200,
    headers: {
      "Content-Type": ep.mimeType,
      "Content-Disposition": `attachment; filename="${outName}"`,
      "Content-Length": String(resultBytes.byteLength),
      "X-Output-Filename": encodeURIComponent(outName),
    },
  });
}
