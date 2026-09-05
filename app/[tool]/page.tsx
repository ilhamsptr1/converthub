import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ToolDropzone } from "@/components/ToolDropzone";
import { Metadata } from "next";
import { Zap, ShieldCheck, Zap as ZapIcon, Star, Lock } from "@/components/icons";

const validTools = [
  "pdf-to-word", "word-to-pdf", "compress-pdf", "merge-pdf", "split-pdf",
  "jpg-to-png", "png-to-jpg", "compress-image",
  "mp4-to-mp3", "wav-to-mp3", "compress-video",
  "ai-summarize", "protect-pdf"
];

const toolTitles: Record<string, string> = {
  "pdf-to-word": "PDF to Word",
  "word-to-pdf": "Word to PDF",
  "compress-pdf": "Compress PDF",
  "merge-pdf": "Merge PDF Files",
  "split-pdf": "Split PDF Pages",
  "jpg-to-png": "JPG to PNG",
  "png-to-jpg": "PNG to JPG",
  "compress-image": "Compress Image",
  "mp4-to-mp3": "MP4 to MP3",
  "wav-to-mp3": "WAV to MP3",
  "compress-video": "Compress Video",
  "ai-summarize": "AI Document Summarizer",
  "protect-pdf": "Protect PDF"
};

const toolDescriptions: Record<string, string> = {
  "pdf-to-word": "Convert your PDF into a fully editable Word document in seconds.",
  "word-to-pdf": "Transform Word documents into professional, pixel-perfect PDFs.",
  "compress-pdf": "Drastically reduce PDF file size without sacrificing readability.",
  "merge-pdf": "Combine multiple PDF files into a single, organized document.",
  "split-pdf": "Extract pages or split a PDF into multiple smaller files.",
  "jpg-to-png": "Convert JPG images to PNG with lossless quality.",
  "png-to-jpg": "Convert PNG images to JPG format with a clean white background.",
  "compress-image": "Shrink image file sizes while maintaining visual quality.",
  "mp4-to-mp3": "Extract audio from MP4 video and save it as MP3.",
  "wav-to-mp3": "Convert WAV audio files to the widely-compatible MP3 format.",
  "compress-video": "Reduce video file size for easier sharing and storage.",
  "ai-summarize": "Use AI to generate concise summaries from any document.",
  "protect-pdf": "Add a password to your PDF to prevent unauthorized access."
};

const toolColors: Record<string, string> = {
  "pdf-to-word": "#2563eb", // blue
  "word-to-pdf": "#7c3aed", // purple
  "compress-pdf": "#dc2626", // red
  "merge-pdf": "#ea580c", // orange
  "split-pdf": "#059669", // emerald
  "jpg-to-png": "#0891b2", // cyan
  "png-to-jpg": "#0284c7", // lightblue
  "compress-image": "#65a30d", // lime
  "mp4-to-mp3": "#d97706", // amber
  "wav-to-mp3": "#ca8a04", // yellow
  "compress-video": "#9333ea", // purple
  "ai-summarize": "#db2777", // pink
  "protect-pdf": "#e11d48", // rose
};

export async function generateMetadata({ params }: { params: Promise<{ tool: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  if (!validTools.includes(resolvedParams.tool)) {
    return { title: "Tool Not Found" };
  }
  const title = toolTitles[resolvedParams.tool] || "Tool";
  return {
    title: `${title} | Iconvert`,
    description: toolDescriptions[resolvedParams.tool] || `Free online ${title} converter.`,
    alternates: { canonical: `/${resolvedParams.tool}` }
  };
}

export function generateStaticParams() {
  return validTools.map((tool) => ({ tool }));
}

export const dynamicParams = false;

export default async function ConverterPage({ params }: { params: Promise<{ tool: string }> }) {
  const resolvedParams = await params;
  if (!validTools.includes(resolvedParams.tool)) {
    notFound();
  }

  const title = toolTitles[resolvedParams.tool] || "Tool";
  const desc = toolDescriptions[resolvedParams.tool] || "";
  const color = toolColors[resolvedParams.tool] || "#000000";

  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa] text-[#09090b]">
      
      {/* HEADER */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-lg border-b border-black/5">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded bg-black flex items-center justify-center text-white font-bold text-lg group-hover:bg-gray-800 transition-colors">
              I
            </div>
            <span className="text-[1.1rem] font-bold tracking-tight">Iconvert</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-500">
            <Link href="/tools" className="hover:text-black transition-colors">All Tools</Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center pt-32 pb-16 px-6">
        <div className="w-full max-w-4xl">
          {/* Tool Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">{title}</h1>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">{desc}</p>
          </div>

          {/* Dropzone */}
          <div className="premium-card p-1">
            <ToolDropzone toolId={resolvedParams.tool} color={color} />
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-12 text-sm font-medium text-gray-400">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} /> Files are encrypted
            </div>
            <div className="flex items-center gap-2">
              <Lock size={16} /> Auto-deleted in 1 hour
            </div>
          </div>

          {/* Feature highlights */}
          <div className="grid md:grid-cols-3 gap-8 w-full mt-24">
            {[
              { title: "High Quality", desc: "We use the best engines to ensure your files retain their original quality during conversion." },
              { title: "Fast Processing", desc: "No queues or long waits. Most files are processed and ready to download in just a few seconds." },
              { title: "100% Secure", desc: "Your files never leave our secure infrastructure and are purged immediately after processing." },
            ].map((f, i) => (
              <div key={i} className="text-center">
                <h4 className="font-semibold text-lg mb-2">{f.title}</h4>
                <p className="text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      
      {/* FOOTER */}
      <footer className="border-t border-gray-200 bg-white py-8 px-6 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} Iconvert Inc. All rights reserved.
      </footer>
    </div>
  );
}
