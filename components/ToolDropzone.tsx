"use client";

import React, { useRef, useState } from "react";
import { FileDown, Loader2, CheckCircle2, AlertCircle, X, Settings } from "@/components/icons";
import { Button } from "@/components/ui/button";

export function ToolDropzone({ toolId, color = "#2563eb" }: { toolId: string, color?: string }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<"idle" | "ready" | "uploading" | "processing" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Options State
  const [password, setPassword] = useState("");
  const [pageRange, setPageRange] = useState("");
  const [preset, setPreset] = useState("web"); // for compress

  const isMultiFile = toolId === "merge-pdf";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      if (isMultiFile) {
        setFiles(prev => [...prev, ...selectedFiles]);
      } else {
        setFiles([selectedFiles[0]]);
      }
      setStatus("ready");
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      if (isMultiFile) {
        setFiles(prev => [...prev, ...droppedFiles]);
      } else {
        setFiles([droppedFiles[0]]);
      }
      setStatus("ready");
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => {
      const newFiles = [...prev];
      newFiles.splice(index, 1);
      if (newFiles.length === 0) setStatus("idle");
      return newFiles;
    });
  };

  const simulateProgress = () => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 90) { clearInterval(interval); return 90; }
        return p + Math.random() * 12;
      });
    }, 400);
    return interval;
  };

  const startProcessing = async () => {
    if (files.length === 0) return;
    
    // Validation
    if (toolId === "protect-pdf" && !password) {
      alert("Please enter a password to protect the PDF.");
      return;
    }
    if (isMultiFile && files.length < 2) {
      alert("Please upload at least 2 files to merge.");
      return;
    }

    setStatus("uploading");
    const progInt = simulateProgress();

    try {
      const formData = new FormData();
      formData.append("tool", toolId);
      
      // Append files
      files.forEach(f => formData.append("file", f));

      // Append options
      if (toolId === "protect-pdf") formData.append("password", password);
      if (toolId === "split-pdf" && pageRange) formData.append("pageRange", pageRange);
      if (toolId.includes("compress")) formData.append("preset", preset);

      const uploadRes = await fetch("/api/direct-convert", {
        method: "POST",
        body: formData
      });

      if (!uploadRes.ok) {
        const errData = await uploadRes.json().catch(() => ({ error: "Conversion failed" }));
        throw new Error(errData.error || "Conversion failed");
      }

      const uploadData = await uploadRes.json();

      if (!uploadData.success || !uploadData.url) {
        throw new Error("Invalid response from API");
      }

      (window as any).downloadResultUrl = uploadData.url;
      (window as any).downloadFileName = uploadData.fileName || "converted-file";

      clearInterval(progInt);
      setProgress(100);
      setStatus("success");

    } catch (err: any) {
      console.error("Backend error:", err);
      setErrorMessage(err.message || "Something went wrong during conversion.");
      setStatus("error");
      clearInterval(progInt);
    }
  };

  const reset = () => {
    setFiles([]);
    setStatus("idle");
    setProgress(0);
    setErrorMessage("");
    setPassword("");
    setPageRange("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDownload = () => {
    const downloadUrl = (window as any).downloadResultUrl;
    const fileName = (window as any).downloadFileName || "converted-file";
    if (downloadUrl) {
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.target = "_blank";
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  // ── RENDER STATUSES ────────────────────────────────────────────────────────

  if (status === "error") {
    return (
      <div className="w-full bg-white rounded-xl border border-red-100 flex flex-col items-center justify-center p-12 text-center shadow-sm">
        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
          <AlertCircle size={32} className="text-red-500" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Task failed</h3>
        <p className="text-gray-500 mb-8 max-w-md text-sm">{errorMessage || "The API failed to process your file. Please try again."}</p>
        <Button onClick={reset} variant="outline" className="px-8 border-gray-300">
          Try Again
        </Button>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="w-full bg-white rounded-xl border border-gray-200 flex flex-col items-center justify-center p-12 text-center shadow-sm">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: `${color}15` }}>
          <CheckCircle2 size={32} style={{ color: color }} />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Success!</h3>
        <p className="text-gray-500 mb-8">Your file is ready to download.</p>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs justify-center">
          <Button size="lg" onClick={handleDownload} className="font-semibold gap-2 w-full text-white hover:opacity-90 shadow-md" style={{ backgroundColor: color }}>
            <FileDown size={18} /> Download
          </Button>
          <Button size="lg" variant="outline" onClick={reset} className="font-semibold border-gray-300 w-full">
            Convert Again
          </Button>
        </div>
      </div>
    );
  }

  if (status === "uploading" || status === "processing") {
    return (
      <div className="w-full bg-white rounded-xl border border-gray-200 flex flex-col items-center justify-center p-16 text-center shadow-sm">
        <Loader2 size={48} className="animate-spin mb-6" style={{ color: color }} />
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {status === "uploading" ? "Uploading..." : "Processing..."}
        </h3>
        <p className="text-gray-500 text-sm mb-8">Please wait, do not close this window.</p>
        
        <div className="w-full max-w-xs">
          <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
            <div
              className="h-full transition-all duration-300 ease-out rounded-full"
              style={{ width: `${Math.min(progress, 100)}%`, backgroundColor: color }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-2 text-right">{Math.round(Math.min(progress, 100))}%</p>
        </div>
      </div>
    );
  }

  if (status === "ready") {
    return (
      <div className="w-full bg-white rounded-xl border border-gray-200 p-8 shadow-sm flex flex-col md:flex-row gap-8">
        
        {/* Left: File List */}
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-4">Files to process ({files.length})</h3>
          <div className="space-y-3 mb-6 max-h-[300px] overflow-y-auto pr-2">
            {files.map((f, i) => (
              <div key={i} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-100">
                <div className="flex flex-col overflow-hidden">
                  <span className="text-sm font-medium text-gray-800 truncate">{f.name}</span>
                  <span className="text-xs text-gray-400">{(f.size / 1024 / 1024).toFixed(2)} MB</span>
                </div>
                <button onClick={() => removeFile(i)} className="text-gray-400 hover:text-red-500 p-1">
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>

          {isMultiFile && (
            <Button variant="outline" className="w-full border-dashed" onClick={() => fileInputRef.current?.click()}>
              + Add more files
            </Button>
          )}
        </div>

        {/* Right: Options & Action */}
        <div className="md:w-72 flex flex-col justify-between bg-gray-50 rounded-xl p-6 border border-gray-100">
          <div>
            <div className="flex items-center gap-2 mb-4 font-semibold text-gray-800 border-b border-gray-200 pb-2">
              <Settings size={18} /> Options
            </div>

            {/* Protect PDF Option */}
            {toolId === "protect-pdf" && (
              <div className="mb-4">
                <label className="block text-xs font-medium text-gray-600 mb-1">Set Password</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter secret password"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1"
                  style={{ focusRingColor: color }}
                />
              </div>
            )}

            {/* Split PDF Option */}
            {toolId === "split-pdf" && (
              <div className="mb-4">
                <label className="block text-xs font-medium text-gray-600 mb-1">Page Range (Optional)</label>
                <input 
                  type="text" 
                  value={pageRange}
                  onChange={e => setPageRange(e.target.value)}
                  placeholder="e.g. 1-5, 8, 11-13"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none"
                />
                <p className="text-[10px] text-gray-400 mt-1">Leave empty to split all pages.</p>
              </div>
            )}

            {/* Compress Options */}
            {toolId.includes("compress") && (
              <div className="mb-4">
                <label className="block text-xs font-medium text-gray-600 mb-1">Compression Level</label>
                <select 
                  value={preset}
                  onChange={e => setPreset(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white focus:outline-none"
                >
                  <option value="print">High Quality (Less compression)</option>
                  <option value="ebook">Balanced (Recommended)</option>
                  <option value="web">Smallest Size (Low quality)</option>
                </select>
              </div>
            )}
            
            {/* Fallback Option */}
            {!["protect-pdf", "split-pdf"].includes(toolId) && !toolId.includes("compress") && (
              <p className="text-sm text-gray-500 mb-4">No advanced options required for this tool. Click convert to start.</p>
            )}
          </div>

          <Button 
            size="lg" 
            onClick={startProcessing} 
            className="w-full text-white shadow-md font-bold mt-4 hover:opacity-90"
            style={{ backgroundColor: color }}
          >
            Start Conversion
          </Button>
        </div>

        <input ref={fileInputRef} type="file" multiple={isMultiFile} onChange={handleFileChange} className="hidden" />
      </div>
    );
  }

  // IDLE / DROP STATE
  return (
    <div
      className={`w-full bg-[#f8f9fa] rounded-2xl flex flex-col items-center justify-center py-24 px-4 text-center cursor-pointer transition-all duration-300 dropzone-premium ${isDragging ? "dragging" : ""}`}
      onClick={() => fileInputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      <Button
        className="rounded-full font-bold text-lg px-12 py-8 mb-6 shadow-xl transition-transform hover:scale-105"
        style={{ backgroundColor: color, color: 'white' }}
      >
        Select {isMultiFile ? "files" : "a file"}
      </Button>
      <p className="text-gray-400 font-medium tracking-wide">or drag and drop {isMultiFile ? "files" : "a file"} here</p>
      
      <input
        ref={fileInputRef}
        type="file"
        multiple={isMultiFile}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
