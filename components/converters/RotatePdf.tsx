"use client";

import { useState, useCallback } from "react";
import { PDFDocument, degrees } from "pdf-lib";
import { FileDropZone } from "../FileDropZone";
import { useToast } from "../Toast";

function dataUrlToArrayBuffer(dataUrl: string): ArrayBuffer {
  const base64 = dataUrl.split(",")[1];
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}

type Angle = 0 | 90 | 180 | 270;

export function RotatePdf() {
  const [file, setFile] = useState<{ name: string; data: ArrayBuffer } | null>(null);
  const [angle, setAngle] = useState<Angle>(90);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleFile = useCallback((content: string, name: string) => {
    setFile({ name, data: dataUrlToArrayBuffer(content) });
    toast(`Loaded ${name}`, "success");
  }, [toast]);

  const convert = useCallback(async () => {
    if (!file) return;
    setLoading(true);

    try {
      const pdf = await PDFDocument.load(file.data);
      const pages = pdf.getPages();
      for (const page of pages) {
        page.setRotation(degrees(angle));
      }
      const bytes = await pdf.save();
      const blob = new Blob([bytes.buffer as ArrayBuffer], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name.replace(/\.[^.]+$/, "_rotated.pdf") || "rotated.pdf";
      a.click();
      URL.revokeObjectURL(url);
      toast("PDF rotated and downloaded!", "success");
    } catch {
      toast("Failed to rotate PDF. Try again.", "error");
    }

    setLoading(false);
  }, [file, angle, toast]);

  if (!file) {
    return (
      <FileDropZone
        accept=".pdf"
        label="Upload a PDF file"
        description="Rotate pages in your PDF"
        readAs="dataurl"
        onFile={handleFile}
      />
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <span className="text-xs text-zinc-500">{file.name}</span>
        <button onClick={() => setFile(null)} className="text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 underline">
          Upload another
        </button>
      </div>

      <div className="flex justify-center gap-3">
        {[90, 180, 270].map((a) => (
          <button key={a} onClick={() => setAngle(a as Angle)}
            className={`px-6 py-3 rounded-xl border text-sm font-medium transition-all ${
              angle === a
                ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400"
                : "border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300"
            }`}>
            Rotate {a}°
          </button>
        ))}
      </div>

      <button onClick={convert} disabled={loading}
        className="btn-primary flex items-center gap-2 mx-auto">
        {loading ? "Rotating..." : "Rotate & Download"}
      </button>
    </div>
  );
}
