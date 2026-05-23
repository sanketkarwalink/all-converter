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
      className="flex flex-col items-center justify-center gap-4 p-12 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-300 select-none"
      style={{
        borderColor: dragOver
          ? "rgb(99, 102, 241)"
          : hasFile
          ? "rgb(52, 211, 153)"
          : "rgb(209, 204, 198)",
        background: dragOver
          ? "rgba(99, 102, 241, 0.06)"
          : "transparent",
        transform: dragOver ? "scale(1.01)" : "scale(1)",
        opacity: loading ? 0.5 : 1,
        pointerEvents: loading ? "none" : undefined,
      }}
    >
      <div
        className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${
          hasFile
            ? "bg-emerald-100 dark:bg-emerald-900/30 animate-bounce-in"
            : dragOver
            ? "bg-indigo-100 dark:bg-indigo-900/30"
            : "bg-indigo-100 dark:bg-indigo-900/30"
        }`}
      >
        {loading ? (
          <svg className="animate-spin w-8 h-8 text-indigo-500" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : hasFile ? (
          <svg className="w-8 h-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ) : dragOver ? (
          <svg className="w-8 h-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
        ) : (
          <svg className="w-8 h-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
        )}
      </div>
      <div className="text-center">
        <p className={`font-medium transition-colors duration-300 ${
          hasFile ? "text-emerald-600 dark:text-emerald-400" : "text-zinc-700 dark:text-zinc-300"
        }`}>
          {loading ? "Processing..." : hasFile ? "File loaded!" : label}
        </p>
        <p className="text-sm text-zinc-500 mt-1">
          {description || `Click to browse or drag & drop`}
        </p>
        <p className="text-xs text-zinc-400 mt-3 flex items-center justify-center gap-1">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Your file stays on your device — nothing is uploaded
        </p>
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
