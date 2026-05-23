"use client";

import { useState, useCallback, useRef } from "react";
import { PDFDocument } from "pdf-lib";
import { useToast } from "../Toast";

function dataUrlToArrayBuffer(dataUrl: string): ArrayBuffer {
  const base64 = dataUrl.split(",")[1];
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}

interface PdfFile {
  id: number;
  name: string;
  data: ArrayBuffer;
}

export function MergePdf() {
  const [files, setFiles] = useState<PdfFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const addFiles = useCallback(async (fileList: FileList | File[]) => {
    const newFiles: PdfFile[] = [];
    for (const f of Array.from(fileList)) {
      if (!f.name.toLowerCase().endsWith(".pdf")) {
        toast(`${f.name} is not a PDF`, "error");
        continue;
      }
      const text = await new Promise<string>((r) => {
        const reader = new FileReader();
        reader.onload = () => r(reader.result as string);
        reader.readAsDataURL(f);
      });
      newFiles.push({ id: Date.now() + Math.random(), name: f.name, data: dataUrlToArrayBuffer(text) });
    }
    setFiles((prev) => [...prev, ...newFiles]);
    if (newFiles.length > 0) toast(`Added ${newFiles.length} file${newFiles.length > 1 ? "s" : ""}`, "success");
  }, [toast]);

  const removeFile = useCallback((id: number) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const moveFile = useCallback((from: number, to: number) => {
    setFiles((prev) => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  }, []);

  const merge = useCallback(async () => {
    if (files.length < 2) {
      toast("Add at least 2 PDF files", "error");
      return;
    }
    setLoading(true);

    try {
      const merged = await PDFDocument.create();
      for (const f of files) {
        const pdf = await PDFDocument.load(f.data);
        const pages = await merged.copyPages(pdf, pdf.getPageIndices());
        for (const page of pages) merged.addPage(page);
      }
      const bytes = await merged.save();
      const blob = new Blob([bytes.buffer as ArrayBuffer], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "merged.pdf";
      a.click();
      URL.revokeObjectURL(url);
      toast(`Merged ${files.length} files into one PDF`, "success");
    } catch {
      toast("Failed to merge PDFs", "error");
    }

    setLoading(false);
  }, [files, toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) addFiles(e.dataTransfer.files);
  }, [addFiles]);

  if (files.length === 0) {
    return (
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className="flex flex-col items-center justify-center gap-4 p-12 rounded-2xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 cursor-pointer hover:border-indigo-400 transition-colors"
      >
        <div className="w-16 h-16 rounded-2xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
          <svg className="w-8 h-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
        </div>
        <div className="text-center">
          <p className="font-medium text-zinc-700 dark:text-zinc-300">Upload PDF files</p>
          <p className="text-sm text-zinc-500 mt-1">Click to browse or drag & drop multiple PDFs</p>
        </div>
        <input ref={inputRef} type="file" accept=".pdf" multiple
          className="hidden"
          onChange={(e) => { if (e.target.files) addFiles(e.target.files); e.target.value = ""; }} />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <span className="text-xs text-zinc-500">{files.length} file{files.length !== 1 ? "s" : ""}</span>
        <div className="flex gap-2">
          <button onClick={() => inputRef.current?.click()}
            className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline">
            Add more
          </button>
          <button onClick={() => { setFiles([]); }}
            className="text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 underline">
            Clear all
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {files.map((f, i) => (
          <div key={f.id}
            draggable
            onDragStart={() => setDraggedIdx(i)}
            onDragOver={(e) => { e.preventDefault(); }}
            onDrop={(e) => { e.preventDefault(); if (draggedIdx !== null && draggedIdx !== i) { moveFile(draggedIdx, i); setDraggedIdx(null); } }}
            onDragEnd={() => setDraggedIdx(null)}
            className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 cursor-grab active:cursor-grabbing"
          >
            <svg className="w-4 h-4 text-zinc-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M4 16h16" />
            </svg>
            <span className="text-xs text-zinc-400 w-6 shrink-0">{i + 1}.</span>
            <span className="text-sm flex-1 truncate">{f.name}</span>
            <button onClick={() => removeFile(f.id)}
              className="text-xs text-red-500 hover:text-red-700 shrink-0">
              Remove
            </button>
          </div>
        ))}
      </div>

      <button onClick={merge} disabled={loading || files.length < 2}
        className="btn-primary flex items-center gap-2 mx-auto">
        {loading ? "Merging..." : `Merge ${files.length} files`}
      </button>
    </div>
  );
}
