"use client";

import React, { useEffect, useRef, useState } from "react";
import { FileDown, Loader2, CheckCircle2, AlertCircle, X, Settings } from "@/components/icons";
import { Button } from "@/components/ui/button";

// Tools that go through /api/convert (Cloudmersive engine)
const SUPPORTED_TOOLS = new Set([
  "pdf-to-word", "word-to-pdf", "compress-pdf",
  "protect-pdf",
  "jpg-to-png", "png-to-jpg", "compress-image",
  "mp4-to-mp3", "wav-to-mp3",
]);

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
  const [step, setStep] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [resultSize, setResultSize] = useState<number | null>(null);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [eta, setEta] = useState<number | null>(null);
  const etaRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const downloadRef = useRef<{ blob: Blob; name: string } | null>(null);

  // Options
  const [password, setPassword] = useState("");
  const [preset, setPreset] = useState("ebook");

  const isMultiFile = false; // merge not supported in this version

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles([e.target.files[0]]);
      setStatus("ready");
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFiles([e.dataTransfer.files[0]]);
      setStatus("ready");
    }
  };

  const removeFile = (i: number) => {
    setFiles(prev => { const n = [...prev]; n.splice(i, 1); if (n.length === 0) setStatus("idle"); return n; });
  };

  const startProcessing = async () => {
    if (files.length === 0) return;
    if (toolId === "protect-pdf" && !password) { alert("Please enter a password."); return; }

    if (!SUPPORTED_TOOLS.has(toolId)) {
      setErrorMessage(`Tool "${toolId}" is not available in this version.`);
      setStatus("error");
      return;
    }

    const file = files[0];
    setOriginalSize(file.size);
    setStatus("uploading");
    setStep(1);
    setProgress(0);

    // ETA countdown
    let etaSecs = 20;
    setEta(etaSecs);
    etaRef.current = setInterval(() => {
      etaSecs = Math.max(1, etaSecs - 1);
      setEta(etaSecs);
    }, 1000);

    // Animate progress bar up to 85% while waiting
    const pid = setInterval(() => {
      setProgress(p => {
        if (p >= 45) setStep(2);
        if (p >= 85) { clearInterval(pid); return 85; }
        return p + Math.random() * 5;
      });
    }, 500);

    try {
      const fd = new FormData();
      fd.append("toolId", toolId);
      fd.append("file", file, file.name);
      if (toolId === "protect-pdf" && password) fd.append("password", password);
      if (toolId.includes("compress")) fd.append("preset", preset);

      const res = await fetch("/api/convert", { method: "POST", body: fd });

      clearInterval(pid);
      if (etaRef.current) clearInterval(etaRef.current);
      setEta(null);

      if (!res.ok) {
        // Try to parse JSON error from our API
        let errMsg = `Server error (${res.status})`;
        const ct = res.headers.get("content-type") || "";
        if (ct.includes("application/json")) {
          const j = await res.json().catch(() => null);
          if (j?.error) errMsg = j.error;
        } else {
          errMsg = await res.text().catch(() => errMsg);
        }
        throw new Error(errMsg);
      }

      const blob = await res.blob();
      if (!blob || blob.size === 0) throw new Error("Received empty file from server. Please try again.");

      const rawName = res.headers.get("X-Output-Filename");
      const outName = rawName ? decodeURIComponent(rawName) : file.name.replace(/\.[^.]+$/, "") + "_converted";

      downloadRef.current = { blob, name: outName };
      setResultSize(blob.size);
      setProgress(100);
      setStep(3);

      setTimeout(() => {
        setStatus("success");
        launchConfetti();
      }, 400);

    } catch (err: any) {
      clearInterval(pid);
      if (etaRef.current) clearInterval(etaRef.current);
      setEta(null);
      setErrorMessage(err.message || "Something went wrong. Please try again.");
      setStatus("error");
    }
  };

  const reset = () => {
    setFiles([]); setStatus("idle"); setProgress(0); setStep(0);
    setErrorMessage(""); setPassword("");
    setResultSize(null); setOriginalSize(0); setEta(null);
    downloadRef.current = null;
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDownload = () => {
    if (!downloadRef.current) return;
    const { blob, name } = downloadRef.current;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = name;
    document.body.appendChild(a); a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
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
      {eta !== null && <p className="text-gray-400 text-sm mb-6">~ {eta} seconds remaining</p>}
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
        <h3 className="font-semibold text-lg mb-4">File to convert</h3>
        <div className="space-y-3 mb-6">
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
          {toolId !== "protect-pdf" && !toolId.includes("compress") && (
            <p className="text-sm text-gray-500 mb-4">No extra options needed. Click convert to start.</p>
          )}
        </div>
        <Button size="lg" onClick={startProcessing} className="w-full text-white font-bold mt-4 hover:opacity-90" style={{ backgroundColor: color }}>
          Start Conversion ⚡
        </Button>
      </div>
      <input ref={fileInputRef} type="file" onChange={handleFileChange} className="hidden" />
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
        Select a file
      </Button>
      <p className="text-gray-400 font-medium tracking-wide">or drag and drop a file here</p>
      <p className="text-gray-300 text-sm mt-2">No account needed · Files never stored on our servers</p>
      <input ref={fileInputRef} type="file" onChange={handleFileChange} className="hidden" />
    </div>
  );
}
