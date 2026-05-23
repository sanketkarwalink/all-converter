"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useToast } from "../Toast";

interface MinifierProps {
  lang: string;
  example: string;
  ext: string;
}

const FORMATS = [
  { value: "image/png", label: "PNG", ext: "png" },
  { value: "image/jpeg", label: "JPEG", ext: "jpg" },
  { value: "image/webp", label: "WebP", ext: "webp" },
  { value: "image/gif", label: "GIF", ext: "gif" },
  { value: "image/bmp", label: "BMP", ext: "bmp" },
];

export function ImageConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [format, setFormat] = useState(FORMATS[0]);
  const [quality, setQuality] = useState(0.8);
  const [convertedUrl, setConvertedUrl] = useState<string | null>(null);
  const [convertedSize, setConvertedSize] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [dimensions, setDimensions] = useState<{ w: number; h: number } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const drawToCanvas = useCallback((img: HTMLImageElement) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(img, 0, 0);
    setDimensions({ w: img.naturalWidth, h: img.naturalHeight });
  }, []);

  const handleFile = useCallback((f: File) => {
    if (!f.type.startsWith("image/")) {
      toast("Please select an image file.", "error");
      return;
    }
    setFile(f);
    setConvertedUrl(null);
    const url = URL.createObjectURL(f);
    setPreview(url);
    const img = new Image();
    img.onload = () => {
      imgRef.current = img;
      drawToCanvas(img);
    };
    img.src = url;
  }, [drawToCanvas, toast]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const f = e.dataTransfer.files[0];
      if (f) handleFile(f);
    },
    [handleFile]
  );

  const convert = useCallback(async () => {
    if (!imgRef.current || !canvasRef.current) return;
    setLoading(true);
    try {
      const blob = await new Promise<Blob | null>((resolve) => {
        const q = format.value === "image/png" || format.value === "image/bmp" ? undefined : quality;
        canvasRef.current!.toBlob(resolve, format.value, q);
      });
      if (!blob) throw new Error("Conversion failed");
      const url = URL.createObjectURL(blob);
      setConvertedUrl(url);
      setConvertedSize(blob.size);
      toast(`Converted to ${format.label}!`, "success");
    } catch {
      toast("Conversion failed. Please try again.", "error");
    }
    setLoading(false);
  }, [format, toast]);

  const reset = useCallback(() => {
    setFile(null);
    setPreview(null);
    setConvertedUrl(null);
    setConvertedSize(null);
    setDimensions(null);
    setQuality(0.8);
    imgRef.current = null;
  }, []);

  return (
    <div className="space-y-5">
      {!file ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`flex flex-col items-center justify-center gap-4 p-8 sm:p-12 rounded-2xl border-2 border-dashed cursor-pointer transition-all ${
            dragOver
              ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
              : "border-zinc-300 dark:border-zinc-700 hover:border-indigo-400 dark:hover:border-indigo-600 bg-zinc-50 dark:bg-zinc-800/30"
          }`}
        >
          <div className="w-16 h-16 rounded-2xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
            <svg className="w-8 h-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
          </div>
          <div className="text-center">
            <p className="font-medium text-zinc-700 dark:text-zinc-300">
              Drop an image here
            </p>
            <p className="text-sm text-zinc-500 mt-1">
              or click to browse · PNG, JPG, WebP, GIF, BMP
            </p>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
            }}
          />
        </div>
      ) : (
        <div className="space-y-5">
          <div className="flex items-center gap-4 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800">
            <div className="w-14 h-14 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0">
              {preview && (
                <img src={preview} alt="" className="w-full h-full object-cover" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{file.name}</p>
              <p className="text-xs text-zinc-500">
                {(file.size / 1024).toFixed(1)} KB
                {dimensions && ` · ${dimensions.w} × ${dimensions.h}px`}
              </p>
            </div>
            <button
              onClick={reset}
              className="p-2 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-500 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex flex-col gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                Output Format
              </label>
              <div className="flex flex-wrap gap-2">
                {FORMATS.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => setFormat(f)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      format.value === f.value
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {(format.value === "image/jpeg" || format.value === "image/webp") && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  Quality: {Math.round(quality * 100)}%
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.05"
                  value={quality}
                  onChange={(e) => setQuality(parseFloat(e.target.value))}
                  className="w-full max-w-xs accent-indigo-600"
                />
                <p className="text-xs text-zinc-400">
                  Lower = smaller file, higher = better quality
                </p>
              </div>
            )}

            {(format.value === "image/png") && (
              <p className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1">
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                PNG is lossless — file will be larger than JPEG/WebP
              </p>
            )}

            {format.value === "image/bmp" && (
              <p className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                BMP is uncompressed — file size will be significantly larger
              </p>
            )}

            <button
              onClick={convert}
              disabled={loading}
              className="btn-primary flex items-center gap-2 self-start"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Converting...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Convert
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {convertedUrl && convertedSize !== null && (
        <div className="flex items-center justify-between p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 animate-slide-up">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <span className="text-sm font-medium text-emerald-800 dark:text-emerald-200">
                Converted to {format.label}
              </span>
              <p className="text-xs text-emerald-600 dark:text-emerald-400">
                {(file!.size / 1024).toFixed(1)} KB → {(convertedSize / 1024).toFixed(1)} KB
                {convertedSize > file!.size && (
                  <span className="text-amber-600 dark:text-amber-400 ml-1">
                    ({(convertedSize / file!.size * 100 - 100).toFixed(0)}% larger)
                  </span>
                )}
              </p>
            </div>
          </div>
          <a
            href={convertedUrl}
            download={`converted.${format.ext}`}
            className="btn-success flex items-center gap-2 shrink-0"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download
          </a>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
