import { NextResponse } from "next/server";

// Helper: get file extension from file name
function getExtension(filename: string): string {
  return filename.split(".").pop()?.toLowerCase() || "";
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const tool = formData.get("tool") as string;

    if (!tool) {
      return NextResponse.json({ error: "Missing tool" }, { status: 400 });
    }

    const secret = process.env.CONVERTAPI_SECRET;
    if (!secret) {
      return NextResponse.json({ error: "ConvertAPI Secret not configured" }, { status: 500 });
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
        return NextResponse.json({ error: `ConvertAPI Error: ${JSON.stringify(data)}` }, { status: response.status });
      }
      const resultFile = data.Files?.[0];
      if (!resultFile) return NextResponse.json({ error: "No file returned" }, { status: 500 });
      return NextResponse.json({ success: true, url: resultFile.Url, fileName: resultFile.FileName, fileSize: resultFile.FileSize });
    }

    // ── SINGLE-FILE TOOLS ───────────────────────────────────────────────────
    const file = formData.get("file") as File;
    if (!file) {
      return NextResponse.json({ error: "Missing file" }, { status: 400 });
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
        // User provided preset or default to web
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
        // Get password from user input
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

    const response = await fetch(convertUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ Parameters: parameters }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("ConvertAPI Error:", JSON.stringify(data));
      return NextResponse.json({ error: `ConvertAPI Error: ${JSON.stringify(data)}` }, { status: response.status });
    }

    const resultFile = data.Files?.[0];
    if (!resultFile) {
      return NextResponse.json({ error: "No file returned from API" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      url: resultFile.Url,
      fileName: resultFile.FileName,
      fileSize: resultFile.FileSize,
    });

  } catch (error: any) {
    console.error("Direct Convert API Error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
