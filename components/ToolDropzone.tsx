"use client";

import React, { useEffect, useRef, useState } from "react";
import { FileDown, Loader2, CheckCircle2, AlertCircle, X, Settings } from "@/components/icons";
import { Button } from "@/components/ui/button";

const TOOL_MAP: Record<string, { from: string; to: string }> = {
  "pdf-to-word":     { from: "pdf",  to: "docx" },
  "word-to-pdf":     { from: "docx", to: "pdf" },
  "compress-pdf":    { from: "pdf",  to: "compress" },
  "split-pdf":       { from: "pdf",  to: "extract" },
  "protect-pdf":     { from: "pdf",  to: "encrypt" },
  "jpg-to-png":      { from: "jpg",  to: "png" },
  "png-to-jpg":      { from: "png",  to: "jpg" },
  "compress-image":  { from: "jpg",  to: "compress" },
  "mp4-to-mp3":      { from: "mp4",  to: "mp3" },
  "wav-to-mp3":      { from: "wav",  to: "mp3" },
  "compress-video":  { from: "mp4",  to: "compress" },
};

function getExt(f: string) { return f.split(".").pop()?.toLowerCase() || ""; }
function fmtSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

// Confetti burst
function launchConfetti() {
  const colors = ["#f97316", "#3b82f6", "#22c55e", "#a855f7", "#ec4899", "#facc15"];
  for (let i = 0; i < 60; i++) {
    const el = document.createElement("div");
    el.className = "confetti-piece";
    el.style.left = `${Math.random() * 100}vw`;
    el.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    el.style.width = `${6 + Math.random() * 8}px`;
    el.style.height = `${6 + Math.random() * 8}px`;
    el.style.borderRadius = Math.random() > 0.5 ? "50%" : "2px";
    el.style.animationDuration = `${1.5 + Math.random() * 2}s`;
    el.style.animationDelay = `${Math.random() * 0.5}s`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 4000);
  }
}

const STEPS = ["Select file", "Uploading", "Converting", "Done!"];

export function ToolDropzone({ toolId, color = "#2563eb" }: { toolId: string; color?: string }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles]   = useState<File[]>([]);
  const [status, setStatus] = useState<"idle" | "ready" | "uploading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState(0);         // 0=select, 1=upload, 2=convert, 3=done
  const [isDragging, setIsDragging] = useState(false);
  const [resultSize, setResultSize] = useState<number | null>(null);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [eta, setEta] = useState<number | null>(null);
  const etaRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Options
  const [password, setPassword] = useState("");
  const [pageRange, setPageRange] = useState("");
  const [preset, setPreset] = useState("ebook");

  const isMultiFile = toolId === "merge-pdf";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selected = Array.from(e.target.files);
      setFiles(prev => isMultiFile ? [...prev, ...selected] : [selected[0]]);
      setStatus("ready");
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const dropped = Array.from(e.dataTransfer.files);
      setFiles(prev => isMultiFile ? [...prev, ...dropped] : [dropped[0]]);
      setStatus("ready");
    }
  };

  const removeFile = (i: number) => {
    setFiles(prev => { const n = [...prev]; n.splice(i, 1); if (n.length === 0) setStatus("idle"); return n; });
  };

  const startProcessing = async () => {
    if (files.length === 0) return;
    if (toolId === "protect-pdf" && !password) { alert("Please enter a password."); return; }
    if (isMultiFile && files.length < 2) { alert("Please upload at least 2 files to merge."); return; }

    const totalOriginal = files.reduce((s, f) => s + f.size, 0);
    setOriginalSize(totalOriginal);
    setStatus("uploading");
    setStep(1);
    setProgress(0);

    // ETA countdown (estimate 15s total)
    let etaSecs = 15;
    setEta(etaSecs);
    etaRef.current = setInterval(() => {
      etaSecs = Math.max(1, etaSecs - 1);
      setEta(etaSecs);
    }, 1000);

    // Animate progress
    const pid = setInterval(() => {
      setProgress(p => {
        if (p >= 45) { setStep(2); }
        if (p >= 90) { clearInterval(pid); return 90; }
        return p + Math.random() * 7;
      });
    }, 400);

    try {
      const sigRes = await fetch("/api/sign");
      if (!sigRes.ok) throw new Error("Could not get API credentials.");
      const { secret } = await sigRes.json();
      if (!secret) throw new Error("API secret not configured on server.");

      let resultUrl = "";
      let resultFileName = "";
      let resultBytes: number | null = null;

      if (toolId === "merge-pdf") {
        const fd = new FormData();
        files.forEach(f => fd.append("Files", f, f.name));
        const res = await fetch(`https://v2.convertapi.com/convert/pdf/to/merge?Secret=${secret}&StoreFile=true`, { method: "POST", body: fd });
        const data = await res.json();
        if (!res.ok || !data.Files?.[0]) throw new Error(`ConvertAPI Error ${data.Code || res.status}: ${data.Message || "Merge failed"}`);
        resultUrl = data.Files[0].Url;
        resultFileName = data.Files[0].FileName;
        resultBytes = data.Files[0].FileSize ?? null;
      } else {
        const file = files[0];
        const ext = getExt(file.name);
        const map = TOOL_MAP[toolId];
        if (!map) throw new Error(`Tool "${toolId}" not supported.`);
        let from = map.from;
        if (toolId === "word-to-pdf") from = ext === "doc" ? "doc" : "docx";
        if (toolId === "compress-image") from = ["jpg","jpeg"].includes(ext) ? "jpg" : ext || "jpg";
        if (toolId === "compress-video") from = ext || "mp4";

        const fd = new FormData();
        fd.append("File", file, file.name);
        if (toolId === "protect-pdf") fd.append("UserPassword", password);
        if (toolId === "split-pdf" && pageRange) fd.append("PageRange", pageRange);
        if (toolId.includes("compress")) fd.append("Preset", preset);
        if (toolId === "png-to-jpg") fd.append("BackgroundColor", "white");

        const res = await fetch(`https://v2.convertapi.com/convert/${from}/to/${map.to}?Secret=${secret}&StoreFile=true`, { method: "POST", body: fd });
        const data = await res.json();
        if (!res.ok || !data.Files?.[0]) throw new Error(`ConvertAPI Error ${data.Code || res.status}: ${data.Message || "Conversion failed"}`);
        resultUrl = data.Files[0].Url;
        resultFileName = data.Files[0].FileName;
        resultBytes = data.Files[0].FileSize ?? null;
      }

      clearInterval(pid);
      if (etaRef.current) clearInterval(etaRef.current);
      setEta(null);
      setProgress(100);
      setStep(3);
      if (resultBytes !== null) setResultSize(resultBytes);
      (window as any).__downloadUrl = resultUrl;
      (window as any).__downloadName = resultFileName;

      setTimeout(() => {
        setStatus("success");
        launchConfetti();
      }, 400);

    } catch (err: any) {
      clearInterval(pid);
      if (etaRef.current) clearInterval(etaRef.current);
      setEta(null);
      setErrorMessage(err.message || "Something went wrong.");
      setStatus("error");
    }
  };

  const reset = () => {
    setFiles([]); setStatus("idle"); setProgress(0); setStep(0);
    setErrorMessage(""); setPassword(""); setPageRange("");
    setResultSize(null); setOriginalSize(0); setEta(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDownload = () => {
    const url = (window as any).__downloadUrl;
    const name = (window as any).__downloadName || "converted-file";
    if (url) { const a = document.createElement("a"); a.href = url; a.download = name; a.target = "_blank"; document.body.appendChild(a); a.click(); document.body.removeChild(a); }
  };

  // ── ERROR ─────────────────────────────────────────────────────────────────
  if (status === "error") return (
    <div className="w-full bg-white rounded-xl border border-red-100 flex flex-col items-center justify-center p-12 text-center shadow-sm">
      <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
        <AlertCircle size={32} className="text-red-500" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">Conversion failed</h3>
      <p className="text-gray-500 mb-8 max-w-md text-sm">{errorMessage}</p>
      <Button onClick={reset} variant="outline" className="px-8 border-gray-300">Try Again</Button>
    </div>
  );

  // ── SUCCESS ───────────────────────────────────────────────────────────────
  if (status === "success") {
    const saved = resultSize !== null && originalSize > 0 ? Math.round((1 - resultSize / originalSize) * 100) : null;
    return (
      <div className="w-full bg-white rounded-xl border border-gray-200 flex flex-col items-center justify-center p-12 text-center shadow-sm">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6 success-icon-anim" style={{ backgroundColor: `${color}18` }}>
          <CheckCircle2 size={40} style={{ color }} />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Done! 🎉</h3>
        <p className="text-gray-500 mb-2">Your file is ready to download.</p>

        {/* File size comparison */}
        {resultSize !== null && originalSize > 0 && (
          <div className="flex items-center gap-3 text-sm mb-8 bg-gray-50 rounded-xl px-5 py-3 border border-gray-100">
            <span className="text-gray-500">{fmtSize(originalSize)}</span>
            <span className="text-gray-400">→</span>
            <span className="font-semibold text-gray-800">{fmtSize(resultSize)}</span>
            {saved !== null && saved > 0 && (
              <span className="badge-hot ml-1">{saved}% smaller</span>
            )}
          </div>
        )}
        {(!resultSize || !originalSize) && <div className="mb-8" />}

        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs justify-center">
          <Button size="lg" onClick={handleDownload} className="font-semibold gap-2 w-full text-white hover:opacity-90" style={{ backgroundColor: color }}>
            <FileDown size={18} /> Download
          </Button>
          <Button size="lg" variant="outline" onClick={reset} className="font-semibold border-gray-300 w-full">Convert Again</Button>
        </div>
      </div>
    );
  }

  // ── UPLOADING ─────────────────────────────────────────────────────────────
  if (status === "uploading") return (
    <div className="w-full bg-white rounded-xl border border-gray-200 flex flex-col items-center justify-center p-16 text-center shadow-sm">
      <Loader2 size={48} className="animate-spin mb-6" style={{ color }} />

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-6">
        {STEPS.map((s, i) => (
          <React.Fragment key={i}>
            <div className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full transition-all duration-300 ${i === step ? "text-white" : i < step ? "text-green-700 bg-green-50" : "text-gray-400 bg-gray-100"}`}
              style={i === step ? { backgroundColor: color } : {}}>
              {i < step ? "✓" : i + 1}. {s}
            </div>
            {i < STEPS.length - 1 && <div className={`w-6 h-0.5 ${i < step ? "bg-green-400" : "bg-gray-200"}`} />}
          </React.Fragment>
        ))}
      </div>

      <h3 className="text-xl font-bold text-gray-900 mb-1">
        {step === 1 ? "Uploading file..." : "Converting..."}
      </h3>
      {eta !== null && (
        <p className="text-gray-400 text-sm mb-6">~ {eta} seconds remaining</p>
      )}
      {eta === null && <p className="text-gray-400 text-sm mb-6">Almost there...</p>}

      <div className="w-full max-w-sm">
        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
          <div className="h-full step-bar-fill rounded-full relative overflow-hidden" style={{ width: `${Math.min(progress, 100)}%`, backgroundColor: color }}>
            <div className="absolute inset-0 bg-white/20 animate-pulse" />
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-2 text-right">{Math.round(Math.min(progress, 100))}%</p>
      </div>
    </div>
  );

  // ── READY ─────────────────────────────────────────────────────────────────
  if (status === "ready") return (
    <div className="w-full bg-white rounded-xl border border-gray-200 p-8 shadow-sm flex flex-col md:flex-row gap-8">
      <div className="flex-1">
        <h3 className="font-semibold text-lg mb-4">Files to process ({files.length})</h3>
        <div className="space-y-3 mb-6 max-h-[300px] overflow-y-auto pr-2">
          {files.map((f, i) => (
            <div key={i} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-100">
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-medium text-gray-800 truncate">{f.name}</span>
                <span className="text-xs text-gray-400">{fmtSize(f.size)}</span>
              </div>
              <button onClick={() => removeFile(i)} className="text-gray-400 hover:text-red-500 p-1 flex-shrink-0"><X size={16} /></button>
            </div>
          ))}
        </div>
        {isMultiFile && (
          <Button variant="outline" className="w-full border-dashed" onClick={() => fileInputRef.current?.click()}>+ Add more files</Button>
        )}
      </div>

      <div className="md:w-72 flex flex-col justify-between bg-gray-50 rounded-xl p-6 border border-gray-100">
        <div>
          <div className="flex items-center gap-2 mb-4 font-semibold text-gray-800 border-b border-gray-200 pb-2">
            <Settings size={18} /> Options
          </div>
          {toolId === "protect-pdf" && (
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-600 mb-1">Set Password *</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password" className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none" />
            </div>
          )}
          {toolId === "split-pdf" && (
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-600 mb-1">Page Range (Optional)</label>
              <input type="text" value={pageRange} onChange={e => setPageRange(e.target.value)} placeholder="e.g. 1-5, 8, 11-13" className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none" />
              <p className="text-[10px] text-gray-400 mt-1">Leave empty to split all pages.</p>
            </div>
          )}
          {toolId.includes("compress") && (
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-600 mb-1">Compression Level</label>
              <select value={preset} onChange={e => setPreset(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white focus:outline-none">
                <option value="print">High Quality</option>
                <option value="ebook">Balanced (Recommended)</option>
                <option value="web">Smallest Size</option>
              </select>
            </div>
          )}
          {!["protect-pdf","split-pdf"].includes(toolId) && !toolId.includes("compress") && (
            <p className="text-sm text-gray-500 mb-4">No extra options needed. Click convert to start.</p>
          )}
        </div>
        <Button size="lg" onClick={startProcessing} className="w-full text-white font-bold mt-4 hover:opacity-90" style={{ backgroundColor: color }}>
          Start Conversion ⚡
        </Button>
      </div>
      <input ref={fileInputRef} type="file" multiple={isMultiFile} onChange={handleFileChange} className="hidden" />
    </div>
  );

  // ── IDLE ──────────────────────────────────────────────────────────────────
  return (
    <div
      className={`w-full bg-[#f8f9fa] rounded-2xl flex flex-col items-center justify-center py-24 px-4 text-center cursor-pointer transition-all duration-300 dropzone-premium ${isDragging ? "dragging" : ""}`}
      onClick={() => fileInputRef.current?.click()}
      onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      <Button className="dropzone-pulse-btn rounded-full font-bold text-lg px-12 py-8 mb-6 shadow-xl transition-transform hover:scale-105" style={{ backgroundColor: color, color: "white" }}>
        Select {isMultiFile ? "files" : "a file"}
      </Button>
      <p className="text-gray-400 font-medium tracking-wide">or drag and drop {isMultiFile ? "files" : "a file"} here</p>
      <p className="text-gray-300 text-sm mt-2">No account needed · Files deleted after 1 hour</p>
      <input ref={fileInputRef} type="file" multiple={isMultiFile} onChange={handleFileChange} className="hidden" />
    </div>
  );
}
