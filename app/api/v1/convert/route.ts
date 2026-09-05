import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { addConversionJob } from "@/lib/queue";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    // 1. Authenticate API Key
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Missing or invalid authorization header" }, { status: 401 });
    }

    const apiKeyStr = authHeader.split(" ")[1];
    
    // In a real app, you would hash apiKeyStr and compare it with the DB.
    // For this boilerplate, we'll do a simple lookup.
    const apiKeyRecord = await prisma.apiKey.findFirst({
      where: { key_hash: apiKeyStr, revoked: false },
      include: { user: true }
    });

    if (!apiKeyRecord) {
      return NextResponse.json({ error: "Invalid or revoked API key" }, { status: 401 });
    }

    // 2. Parse request
    const body = await req.json();
    const { sourceUrl, tool, options } = body;

    if (!sourceUrl || !tool) {
      return NextResponse.json({ error: "Missing required fields: sourceUrl, tool" }, { status: 400 });
    }

    // Since this is a public API, they might pass a source URL instead of a file ID,
    // so we create a dummy file record or download it directly in the worker.
    // We'll create a file record pointing to their external URL for tracking.
    const sourceFile = await prisma.file.create({
      data: {
        user_id: apiKeyRecord.user_id,
        original_filename: sourceUrl.split('/').pop() || "api-upload",
        storage_key: sourceUrl, // Treat URL as storage key for API uploads
        file_type: "application/octet-stream",
        size_bytes: BigInt(0), // Unknown until downloaded by worker
        status: "uploaded",
        expires_at: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
      }
    });

    // 3. Create conversion record
    const conversion = await prisma.conversion.create({
      data: {
        user_id: apiKeyRecord.user_id,
        source_file_id: sourceFile.id,
        tool: tool,
        options: options || {},
        status: "queued",
      }
    });

    // 4. Update API Key last used
    await prisma.apiKey.update({
      where: { id: apiKeyRecord.id },
      data: { last_used_at: new Date() }
    });

    // 5. Add to queue (B2B users are implicitly priority)
    await addConversionJob(
      conversion.id,
      tool,
      sourceFile.storage_key,
      true // Priority = true
    );

    // 6. Return standard API response
    return NextResponse.json({
      success: true,
      data: {
        id: conversion.id,
        status: "queued",
        checkUrl: `/api/v1/convert/${conversion.id}` // Polling endpoint
      }
    }, { status: 202 });

  } catch (error: any) {
    console.error("Public API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
