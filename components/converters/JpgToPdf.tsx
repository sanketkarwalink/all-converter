"use client";

import { useState, useCallback } from "react";
import jsPDF from "jspdf";
import { FileDropZone } from "../FileDropZone";
import { useToast } from "../Toast";

type PageSize = "fit" | "A4" | "letter";
type Orientation = "portrait" | "landscape";

const PAGE_SIZES: Record<PageSize, [number, number]> = {
  fit: [0, 0],
  A4: [210, 297],
  letter: [215.9, 279.4],
};

export function JpgToPdf() {
  const [file, setFile] = useState<{ name: string; dataUrl: string } | null>(null);
  const [orientation, setOrientation] = useState<Orientation>("portrait");
  const [pageSize, setPageSize] = useState<PageSize>("fit");
  const [margin, setMargin] = useState(0);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleFile = useCallback((content: string, name: string) => {
    setFile({ name, dataUrl: content });
    toast(`Loaded ${name}`, "success");
  }, [toast]);

  const convert = useCallback(async () => {
    if (!file) return;
    setLoading(true);

    try {
      const img = new Image();
      img.src = file.dataUrl;
      await new Promise((r) => { img.onload = r; img.onerror = r; });

      const isLandscape = orientation === "landscape";
      const [pw, ph] = PAGE_SIZES[pageSize];

      let pdf: jsPDF;
      if (pageSize === "fit") {
        const w = img.width;
        const h = img.height;
        const orient = w > h ? "l" : "p";
        pdf = new jsPDF(orient, "px", [w + margin * 2, h + margin * 2]);
        pdf.addImage(img, "JPEG", margin, margin, w, h);
      } else {
        pdf = new jsPDF(isLandscape ? "l" : "p", "mm", [pw, ph]);
        const maxW = pw - margin * 2;
        const maxH = ph - margin * 2;
        const scale = Math.min(maxW / img.width, maxH / img.height);
        const w = img.width * scale;
        const h = img.height * scale;
        const x = margin + (maxW - w) / 2;
        const y = margin + (maxH - h) / 2;
        pdf.addImage(img, "JPEG", x, y, w, h);
      }

      pdf.save(file.name.replace(/\.[^.]+$/, ".pdf") || "image.pdf");
      toast("PDF downloaded!", "success");
    } catch {
      toast("Failed to convert. Try again.", "error");
    }

    setLoading(false);
  }, [file, orientation, pageSize, margin, toast]);

  if (!file) {
    return (
      <FileDropZone
        accept=".jpg,.jpeg,.png,.webp,.gif,.bmp"
        label="Upload an image"
        description="Convert JPG, PNG, WebP to PDF"
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

      <div className="flex justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={file.dataUrl} alt="" className="max-h-64 rounded-xl shadow-sm" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-medium text-zinc-500 mb-1">Orientation</label>
          <select value={orientation} onChange={(e) => setOrientation(e.target.value as Orientation)}
            className="input-base w-full">
            <option value="portrait">Portrait</option>
            <option value="landscape">Landscape</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-zinc-500 mb-1">Page Size</label>
          <select value={pageSize} onChange={(e) => setPageSize(e.target.value as PageSize)}
            className="input-base w-full">
            <option value="fit">Fit (same as image)</option>
            <option value="A4">A4</option>
            <option value="letter">US Letter</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-zinc-500 mb-1">Margin (mm)</label>
          <input type="number" min={0} max={50} value={margin}
            onChange={(e) => setMargin(Number(e.target.value))}
            className="input-base w-full" />
        </div>
      </div>

      <button onClick={convert} disabled={loading}
        className="btn-primary flex items-center gap-2 mx-auto">
        {loading ? "Converting..." : "Convert to PDF"}
      </button>
    </div>
  );
}
