import { NextResponse } from "next/server";

// Increase max duration for large file processing on Vercel
export const maxDuration = 60;

// Helper: get file extension from file name
function getExtension(filename: string): string {
  return filename.split(".").pop()?.toLowerCase() || "";
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const tool = formData.get("tool") as string;

    if (!tool) {
      return NextResponse.json({ error: "Missing tool parameter" }, { status: 400 });
    }

    const secret = process.env.CONVERTAPI_SECRET;
    if (!secret) {
      return NextResponse.json({ 
        error: "CONVERTAPI_SECRET environment variable is not set on this server. Please add it in Vercel Settings > Environment Variables." 
      }, { status: 500 });
    }

    // ── MULTI-FILE TOOLS ────────────────────────────────────────────────────
    if (tool === "merge-pdf") {
      const files = formData.getAll("file") as File[];
      if (!files || files.length < 2) {
        return NextResponse.json({ error: "Please upload at least 2 PDF files to merge." }, { status: 400 });
      }

      const fileValues = await Promise.all(
        files.map(async (f) => {
          const ab = await f.arrayBuffer();
          return {
            Name: "Files",
            FileValue: { Name: f.name, Data: Buffer.from(ab).toString("base64") }
          };
        })
      );

      const response = await fetch(
        `https://v2.convertapi.com/convert/pdf/to/merge?Secret=${secret}&StoreFile=true`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ Parameters: fileValues }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        console.error("ConvertAPI merge error:", data);
        return NextResponse.json({ 
          error: `ConvertAPI Error ${data.Code || response.status}: ${data.Message || JSON.stringify(data)}` 
        }, { status: 500 });
      }
      const resultFile = data.Files?.[0];
      if (!resultFile) return NextResponse.json({ error: "No file returned from merge" }, { status: 500 });
      return NextResponse.json({ success: true, url: resultFile.Url, fileName: resultFile.FileName, fileSize: resultFile.FileSize });
    }

    // ── SINGLE-FILE TOOLS ───────────────────────────────────────────────────
    const file = formData.get("file") as File;
    if (!file) {
      return NextResponse.json({ error: "Missing file. Please select a file to convert." }, { status: 400 });
    }

    // Check file size - Vercel has 4.5MB limit by default
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > 20) {
      return NextResponse.json({ error: `File too large (${fileSizeMB.toFixed(1)}MB). Maximum size is 20MB.` }, { status: 413 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const base64Data = Buffer.from(arrayBuffer).toString("base64");
    const fileExt = getExtension(file.name);

    let from = "";
    let to = "";
    const parameters: any[] = [
      { Name: "File", FileValue: { Name: file.name, Data: base64Data } }
    ];

    switch (tool) {
      case "pdf-to-word":
        from = "pdf"; to = "docx";
        break;
      case "word-to-pdf":
        from = fileExt === "doc" ? "doc" : "docx";
        to = "pdf";
        break;
      case "compress-pdf":
        from = "pdf"; to = "compress";
        parameters.push({ Name: "Preset", Value: formData.get("preset") || "web" });
        break;
      case "split-pdf":
        from = "pdf"; to = "extract";
        const pageRange = formData.get("pageRange");
        if (pageRange) {
          parameters.push({ Name: "PageRange", Value: pageRange });
        }
        break;
      case "protect-pdf":
        from = "pdf"; to = "encrypt";
        parameters.push({ Name: "UserPassword", Value: formData.get("password") || "1234" });
        break;
      case "jpg-to-png":
        from = "jpg"; to = "png";
        break;
      case "png-to-jpg":
        from = "png"; to = "jpg";
        parameters.push({ Name: "BackgroundColor", Value: "white" });
        break;
      case "compress-image":
        from = ["jpg", "jpeg"].includes(fileExt) ? "jpg" : fileExt || "jpg";
        to = "compress";
        const imgPreset = formData.get("preset");
        if (imgPreset) parameters.push({ Name: "Preset", Value: imgPreset });
        break;
      case "mp4-to-mp3":
        from = "mp4"; to = "mp3";
        break;
      case "wav-to-mp3":
        from = "wav"; to = "mp3";
        break;
      case "compress-video":
        from = fileExt || "mp4"; to = "compress";
        const vidPreset = formData.get("preset");
        if (vidPreset) parameters.push({ Name: "Preset", Value: vidPreset });
        break;
      default:
        return NextResponse.json({ error: `Tool "${tool}" is not yet supported.` }, { status: 400 });
    }

    const convertUrl = `https://v2.convertapi.com/convert/${from}/to/${to}?Secret=${secret}&StoreFile=true`;
    console.log(`Converting with tool=${tool}, from=${from}, to=${to}, fileSize=${fileSizeMB.toFixed(2)}MB`);

    const response = await fetch(convertUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ Parameters: parameters }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("ConvertAPI Error:", JSON.stringify(data));
      return NextResponse.json({ 
        error: `ConvertAPI Error ${data.Code || response.status}: ${data.Message || "Unknown error from conversion service"}` 
      }, { status: 500 });
    }

    const resultFile = data.Files?.[0];
    if (!resultFile) {
      return NextResponse.json({ error: "Conversion succeeded but no output file was returned." }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      url: resultFile.Url,
      fileName: resultFile.FileName,
      fileSize: resultFile.FileSize,
    });

  } catch (error: any) {
    console.error("Direct Convert API Error:", error);
    return NextResponse.json({ 
      error: error.message || "Internal server error. Please try again." 
    }, { status: 500 });
  }
}
