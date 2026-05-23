"use client";

import { useState, useCallback } from "react";
import { PDFDocument } from "pdf-lib";
import { FileDropZone } from "../FileDropZone";
import { useToast } from "../Toast";

function dataUrlToArrayBuffer(dataUrl: string): ArrayBuffer {
  const base64 = dataUrl.split(",")[1];
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}

export function SplitPdf() {
  const [file, setFile] = useState<{ name: string; data: ArrayBuffer; pageCount: number } | null>(null);
  const [range, setRange] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleFile = useCallback(async (content: string, name: string) => {
    try {
      const data = dataUrlToArrayBuffer(content);
      const pdf = await PDFDocument.load(data);
      setFile({ name, data, pageCount: pdf.getPageCount() });
      setRange(`1-${pdf.getPageCount()}`);
      toast(`Loaded ${name} (${pdf.getPageCount()} pages)`, "success");
    } catch {
      toast("Failed to read PDF", "error");
    }
  }, [toast]);

  const parseRange = useCallback((r: string, max: number): number[] | null => {
    const pages: number[] = [];
    const parts = r.split(",");
    for (const part of parts) {
      const trimmed = part.trim();
      const m = trimmed.match(/^(\d+)(?:-(\d*))?$/);
      if (!m) return null;
      const start = parseInt(m[1], 10);
      if (start < 1 || start > max) return null;
      if (m[2] === "") {
        for (let i = start; i <= max; i++) pages.push(i);
      } else if (m[2] !== undefined) {
        const end = parseInt(m[2], 10);
        if (end < start || end > max) return null;
        for (let i = start; i <= end; i++) pages.push(i);
      } else {
        pages.push(start);
      }
    }
    return [...new Set(pages)].sort((a, b) => a - b);
  }, []);

  const convert = useCallback(async () => {
    if (!file) return;
    const indices = parseRange(range, file.pageCount);
    if (!indices || indices.length === 0) {
      toast("Invalid page range", "error");
      return;
    }

    setLoading(true);
    try {
      const pdf = await PDFDocument.load(file.data);
      const newPdf = await PDFDocument.create();
      const pages = await newPdf.copyPages(pdf, indices.map((i) => i - 1));
      for (const page of pages) newPdf.addPage(page);

      const bytes = await newPdf.save();
      const blob = new Blob([bytes.buffer as ArrayBuffer], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name.replace(/\.[^.]+$/, "_split.pdf") || "split.pdf";
      a.click();
      URL.revokeObjectURL(url);
      toast(`Extracted ${indices.length} page${indices.length !== 1 ? "s" : ""}`, "success");
    } catch {
      toast("Failed to split PDF", "error");
    }
    setLoading(false);
  }, [file, range, parseRange, toast]);

  if (!file) {
    return (
      <FileDropZone
        accept=".pdf"
        label="Upload a PDF file"
        description="Extract specific pages"
        readAs="dataurl"
        onFile={handleFile}
      />
    );
  }

  const valid = parseRange(range, file.pageCount);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <span className="text-xs text-zinc-500">{file.name} ({file.pageCount} pages)</span>
        <button onClick={() => setFile(null)} className="text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 underline">
          Upload another
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">
          Page range (e.g. 1-3, 5, 7-9)
        </label>
        <input type="text" value={range} onChange={(e) => setRange(e.target.value)}
          className={`input-base w-full max-w-md ${valid ? "" : "border-red-400"}`}
          placeholder={`1-${file.pageCount}`} />
        {valid && (
          <p className="text-xs text-zinc-400 mt-1">
            {valid.length} page{valid.length !== 1 ? "s" : ""} selected
          </p>
        )}
      </div>

      <button onClick={convert} disabled={loading || !valid}
        className="btn-primary flex items-center gap-2 mx-auto">
        {loading ? "Extracting..." : "Extract & Download"}
      </button>
    </div>
  );
}
