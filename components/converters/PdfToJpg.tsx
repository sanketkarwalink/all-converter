"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import * as pdfjs from "pdfjs-dist";
import { FileDropZone } from "../FileDropZone";
import { useToast } from "../Toast";

function dataUrlToArrayBuffer(dataUrl: string): ArrayBuffer {
  const base64 = dataUrl.split(",")[1];
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}

export function PdfToJpg() {
  const [file, setFile] = useState<{ name: string; dataUrl: string } | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const initRef = useRef(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!initRef.current) {
      pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
      initRef.current = true;
    }
  }, []);

  const handleFile = useCallback(async (content: string, name: string) => {
    setFile({ name, dataUrl: content });
    setImages([]);
    setLoading(true);

    try {
      const arrayBuffer = dataUrlToArrayBuffer(content);
      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
      setPageCount(pdf.numPages);

      const urls: string[] = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2 });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        await page.render({ canvas, viewport }).promise;
        urls.push(canvas.toDataURL("image/jpeg", 0.92));
      }
      setImages(urls);
      toast(`Extracted ${urls.length} page${urls.length > 1 ? "s" : ""}`, "success");
    } catch {
      toast("Failed to read PDF", "error");
    }

    setLoading(false);
  }, [toast]);

  const downloadAll = useCallback(() => {
    if (images.length === 0) return;
    const baseName = file!.name.replace(/\.[^.]+$/, "");

    images.forEach((url, i) => {
      const a = document.createElement("a");
      a.href = url;
      a.download = `${baseName}_page_${i + 1}.jpg`;
      a.click();
    });
  }, [images, file]);

  if (!file) {
    return (
      <FileDropZone
        accept=".pdf"
        label="Upload a PDF file"
        description="Convert PDF pages to JPG images"
        readAs="dataurl"
        loading={loading}
        onFile={handleFile}
      />
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <span className="text-xs text-zinc-500">{file.name} ({pageCount} pages)</span>
        <button onClick={() => { setFile(null); setImages([]); }}
          className="text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 underline">
          Upload another
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center gap-3 py-12">
          <svg className="animate-spin w-8 h-8 text-indigo-500" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-sm text-zinc-500">Rendering pages...</p>
        </div>
      ) : images.length > 0 && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {images.map((url, i) => (
              <div key={i} className="rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt={`Page ${i + 1}`} className="w-full" />
                <div className="p-2 text-center text-xs text-zinc-500">Page {i + 1}</div>
              </div>
            ))}
          </div>
          <button onClick={downloadAll}
            className="btn-primary flex items-center gap-2 mx-auto">
            Download All as JPG
          </button>
        </>
      )}
    </div>
  );
}
