"use client";

import { useState, useCallback, useEffect } from "react";
import { PDFDocument } from "pdf-lib";
import jsPDF from "jspdf";
import { FileDropZone } from "../FileDropZone";
import { useToast } from "../Toast";

function dataUrlToBytes(dataUrl: string): Uint8Array {
  const base64 = dataUrl.split(",")[1];
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

type Level = "light" | "recommended" | "extreme";

const LEVELS: Record<Level, { label: string; desc: string; dpi: number; quality: number }> = {
  light: { label: "Light", desc: "Structural optimization only", dpi: 0, quality: 0 },
  recommended: { label: "Recommended", desc: "Recompress images at 85% quality", dpi: 150, quality: 0.85 },
  extreme: { label: "Extreme", desc: "More compression, lower quality", dpi: 100, quality: 0.6 },
};

export function CompressPdf() {
  const [file, setFile] = useState<{ name: string; dataUrl: string; size: number } | null>(null);
  const [level, setLevel] = useState<Level>("recommended");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ size: number; blob: Blob } | null>(null);
  const [pdfjs, setPdfjs] = useState<typeof import("pdfjs-dist") | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    import("pdfjs-dist").then((m) => {
      m.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
      setPdfjs(m);
    });
  }, []);

  const handleFile = useCallback((content: string, name: string) => {
    const base64 = content.split(",")[1];
    const size = Math.round(base64.length * 3 / 4);
    setFile({ name, dataUrl: content, size });
    setResult(null);
    setError(null);
    toast(`Loaded ${name}`, "success");
  }, [toast]);

  const getBytes = useCallback(() => {
    if (!file) return null;
    return dataUrlToBytes(file.dataUrl);
  }, [file]);

  const compressLight = useCallback(async () => {
    const bytes = getBytes();
    if (!bytes) return null;
    const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
    const saved = await pdf.save({ useObjectStreams: true });
    return new Blob([saved.buffer as ArrayBuffer], { type: "application/pdf" });
  }, [getBytes]);

  const compressHeavy = useCallback(async (dpi: number, quality: number) => {
    const bytes = getBytes();
    if (!bytes || !pdfjs) return null;

    const pdf = await pdfjs.getDocument({ data: bytes }).promise;
    const newPdf = new jsPDF();
    let first = true;

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const scale = dpi / 72;
      const viewport = page.getViewport({ scale });
      const canvas = document.createElement("canvas");
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      await page.render({ canvas, viewport }).promise;

      const imgData = canvas.toDataURL("image/jpeg", quality);
      const pdfW = 190;
      const pdfH = (viewport.height / viewport.width) * pdfW;

      if (first) {
        newPdf.addImage(imgData, "JPEG", 10, 10, pdfW, pdfH);
        first = false;
      } else {
        newPdf.addPage();
        newPdf.addImage(imgData, "JPEG", 10, 10, pdfW, pdfH);
      }
    }

    return newPdf.output("blob");
  }, [getBytes, pdfjs]);

  const convert = useCallback(async () => {
    if (!file) return;
    setLoading(true);
    setError(null);

    try {
      let blob: Blob | null = null;

      if (level === "light") {
        blob = await compressLight();
      } else {
        const cfg = LEVELS[level];
        try {
          blob = await compressHeavy(cfg.dpi, cfg.quality);
        } catch (e) {
          console.error("Heavy compression failed, falling back to light:", e);
          blob = await compressLight();
        }
        if (!blob || (file.size > 0 && blob.size >= file.size)) {
          const fallback = await compressLight();
          if (fallback) {
            blob = fallback;
          }
        }
      }

      if (blob) {
        setResult({ size: blob.size, blob });
        toast("PDF compressed successfully", "success");
      } else {
        setError("No output produced");
        toast("Failed to compress PDF", "error");
      }
    } catch (e) {
      console.error("Compress PDF error:", e);
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg);
      toast("Failed to compress PDF. Try again.", "error");
    }

    setLoading(false);
  }, [file, level, compressLight, compressHeavy, toast]);

  const download = useCallback(() => {
    if (!result || !file) return;
    const url = URL.createObjectURL(result.blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name.replace(/\.[^.]+$/, "_compressed.pdf") || "compressed.pdf";
    a.click();
    URL.revokeObjectURL(url);
  }, [result, file]);

  if (!file) {
    return (
      <FileDropZone
        accept=".pdf"
        label="Upload a PDF file"
        description="Reduce PDF file size"
        readAs="dataurl"
        onFile={handleFile}
      />
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <span className="text-xs text-zinc-500">{file.name} ({fmt(file.size)})</span>
        <button onClick={() => { setFile(null); setResult(null); setError(null); }}
          className="text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 underline">
          Upload another
        </button>
      </div>

      <div className="flex justify-center gap-3 flex-wrap">
        {(Object.keys(LEVELS) as Level[]).map((l) => (
          <button key={l} onClick={() => setLevel(l)}
            className={`px-5 py-3 rounded-xl border text-sm font-medium transition-all text-left ${
              level === l
                ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400"
                : "border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300"
            }`}>
            <div className="font-semibold">{LEVELS[l].label}</div>
            <div className="text-xs opacity-70 mt-0.5">{LEVELS[l].desc}</div>
          </button>
        ))}
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 text-sm text-red-600 dark:text-red-400 text-center">
          {error}
        </div>
      )}
      {result ? (
        <div className="text-center space-y-4">
          <div className="p-6 rounded-xl bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800">
            <p className="text-sm text-zinc-500">Original: {fmt(file.size)}</p>
            <p className="text-sm text-zinc-500">Compressed: {fmt(result.size)}</p>
            {result.size < file.size && (
              <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-2">
                -{Math.round((1 - result.size / file.size) * 100)}%
              </p>
            )}
          </div>
          <button onClick={download}
            className="btn-primary flex items-center gap-2 mx-auto">
            Download Compressed PDF
          </button>
          <button onClick={() => setResult(null)}
            className="text-xs text-zinc-500 hover:underline block mx-auto">
            Try a different level
          </button>
        </div>
      ) : (
        <button onClick={convert} disabled={loading || !pdfjs}
          className="btn-primary flex items-center gap-2 mx-auto">
          {loading ? "Compressing..." : "Compress PDF"}
        </button>
      )}
    </div>
  );
}

function fmt(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
