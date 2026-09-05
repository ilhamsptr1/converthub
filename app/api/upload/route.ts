import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "@/lib/s3";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { v4 as uuidv4 } from "uuid";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const { filename, fileType, fileSize, tool } = body;

    if (!filename || !fileType || !fileSize || !tool) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Optional: Add logic to check subscription tier limits based on session.user.role
    const isAnonymous = !session?.user;
    
    // Limits based on PRD
    const maxFileSize = isAnonymous ? 100 * 1024 * 1024 : 2 * 1024 * 1024 * 1024; // 100MB for Free/Anon, 2GB for Pro
    if (fileSize > maxFileSize) {
      return NextResponse.json({ error: `File size exceeds the limit of ${maxFileSize / (1024 * 1024)}MB` }, { status: 413 });
    }

    const uniqueId = uuidv4();
    const storageKey = `uploads/${uniqueId}-${filename.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME || "converthub-uploads",
      Key: storageKey,
      ContentType: fileType,
    });

    const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

    // Store file metadata in database
    const fileRecord = await prisma.file.create({
      data: {
        // @ts-ignore
        user_id: session?.user?.id || null,
        original_filename: filename,
        storage_key: storageKey,
        file_type: fileType,
        size_bytes: BigInt(fileSize),
        status: "uploaded",
        expires_at: new Date(Date.now() + 60 * 60 * 1000), // Expires in 1 hour
      }
    });

    return NextResponse.json({
      uploadUrl: presignedUrl,
      fileId: fileRecord.id,
      storageKey
    });

  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
