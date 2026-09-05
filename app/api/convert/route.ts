import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import { addConversionJob } from "@/lib/queue";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const { sourceFileId, tool, options } = body;

    if (!sourceFileId || !tool) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const sourceFile = await prisma.file.findUnique({
      where: { id: sourceFileId }
    });

    if (!sourceFile) {
      return NextResponse.json({ error: "Source file not found" }, { status: 404 });
    }

    // Determine priority based on role
    // @ts-ignore
    const isPriority = session?.user?.role === "pro" || session?.user?.role === "business";

    // Create conversion record
    const conversion = await prisma.conversion.create({
      data: {
        // @ts-ignore
        user_id: session?.user?.id || null,
        source_file_id: sourceFileId,
        tool: tool,
        options: options || {},
        status: "queued",
      }
    });

    // Add job to Redis queue via BullMQ
    await addConversionJob(
      conversion.id,
      tool,
      sourceFile.storage_key,
      isPriority
    );

    return NextResponse.json({
      message: "Conversion job queued successfully",
      conversionId: conversion.id,
      status: "queued"
    });

  } catch (error) {
    console.error("Conversion Queue Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
