"use client";

import { useState, useRef, useCallback } from "react";

interface FileDropZoneProps {
  accept: string;
  label: string;
  description?: string;
  readAs?: "text" | "dataurl";
  loading?: boolean;
  onFile: (content: string, fileName: string) => void;
}

function acceptLabel(accept: string): string {
  if (accept.includes("pdf")) return "PDF";
  if (accept.includes("image") || accept.includes("jpg") || accept.includes("png")) return "Image";
  if (accept.includes("docx") || accept.includes("doc")) return "Word";
  if (accept.includes("json")) return "JSON";
  if (accept.includes("csv")) return "CSV";
  if (accept.includes("yaml") || accept.includes("yml")) return "YAML";
  if (accept.includes("xml")) return "XML";
  if (accept.includes("html") || accept.includes("htm")) return "HTML";
  if (accept.includes("css")) return "CSS";
  if (accept.includes("js")) return "JavaScript";
  return "File";
}

export function FileDropZone({ accept, label, description, readAs = "text", loading, onFile }: FileDropZoneProps) {
  const [dragOver, setDragOver] = useState(false);
  const [hasFile, setHasFile] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setHasFile(true);
        onFile(ev.target?.result as string, file.name);
      };
      if (readAs === "dataurl") {
        reader.readAsDataURL(file);
      } else {
        reader.readAsText(file);
      }
    },
    [onFile, readAs]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleContainerClick = useCallback(() => {
    if (!loading) inputRef.current?.click();
  }, [loading]);

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      onClick={handleContainerClick}
      className={`flex flex-col items-center justify-center gap-4 p-8 sm:p-12 rounded-3xl border border-dashed transition-all duration-300 select-none cursor-pointer outline-none ${
        loading
          ? "opacity-50 pointer-events-none"
          : ""
      } ${
        dragOver
          ? "border-indigo-500 bg-indigo-50/10 dark:bg-indigo-950/10 scale-[1.005]"
          : hasFile
          ? "border-emerald-500/50 bg-emerald-50/5 dark:bg-emerald-950/5"
          : "border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/20 hover:border-zinc-300 dark:hover:border-zinc-700"
      }`}
    >
      <div
        className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
          hasFile
            ? "bg-emerald-100/50 dark:bg-emerald-900/30 text-emerald-500 success-check"
            : dragOver
            ? "bg-indigo-100/50 dark:bg-indigo-900/30 text-indigo-500"
            : "bg-zinc-100 dark:bg-zinc-900 text-zinc-400 dark:text-zinc-500"
        }`}
      >
        {loading ? (
          <svg className="animate-spin w-5 h-5 text-indigo-500" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : hasFile ? (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
        )}
      </div>
      <div className="text-center">
        <p className={`text-sm font-semibold transition-colors duration-300 ${
          hasFile ? "text-emerald-600 dark:text-emerald-400" : "text-zinc-700 dark:text-zinc-300"
        }`}>
          {loading ? "Processing..." : hasFile ? "File loaded!" : label}
        </p>
        <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
          {description || `Click to browse or drag & drop`}
        </p>
        <div className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-3 flex items-center justify-center gap-1.5 font-medium">
          <svg className="w-3.5 h-3.5 text-zinc-400/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Your file stays on your device — nothing is uploaded
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}
