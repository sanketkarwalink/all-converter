"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import * as pdfjs from "pdfjs-dist";
import { createWorker } from "tesseract.js";
import { Document, Packer, Paragraph, TextRun, AlignmentType } from "docx";
import { FileDropZone } from "../FileDropZone";
import { useToast } from "../Toast";

function dataUrlToArrayBuffer(dataUrl: string): ArrayBuffer {
  const base64 = dataUrl.split(",")[1];
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}

export function PdfToDocx() {
  const [fileName, setFileName] = useState("");
  const [pages, setPages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [converting, setConverting] = useState(false);
  const [status, setStatus] = useState("");
  const [ocrProgress, setOcrProgress] = useState(0);
  const [usingOcr, setUsingOcr] = useState(false);
  const workerRef = useRef<Awaited<ReturnType<typeof createWorker>> | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  const handleFile = useCallback(
    async (content: string, name: string) => {
      setFileName(name);
      setConverting(true);
      setStatus("Reading PDF...");
      setOcrProgress(0);
      setUsingOcr(false);

      try {
        const arrayBuffer = dataUrlToArrayBuffer(content);
        const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;

        // Step 1: try text extraction
        setStatus("Extracting text...");
        const textPages: string[] = [];
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const text = textContent.items
            .map((item: any) => item.str)
            .join(" ");
          textPages.push(text);
        }

        const totalChars = textPages.reduce((s, p) => s + p.trim().length, 0);

        // Step 2: if text is too sparse, use OCR
        if (totalChars < 80) {
          setUsingOcr(true);
          setStatus("No text layer found. Running OCR...");
          workerRef.current = await createWorker("eng");

          const ocrPages: string[] = [];
          for (let i = 1; i <= pdf.numPages; i++) {
            setStatus(
              `Running OCR on page ${i}/${pdf.numPages}...`
            );
            setOcrProgress(Math.round(((i - 1) / pdf.numPages) * 100));

            const page = await pdf.getPage(i);
            const viewport = page.getViewport({ scale: 2.5 });
            const canvas = document.createElement("canvas");
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            await page.render({ canvas, viewport }).promise;

            const { data } = await workerRef.current.recognize(canvas);
            ocrPages.push(data.text);
          }

          await workerRef.current.terminate();
          workerRef.current = null;
          setPages(ocrPages);
          toast(
            `OCR complete — ${pdf.numPages} page${pdf.numPages !== 1 ? "s" : ""}`,
            "success"
          );
          setOcrProgress(100);
        } else {
          setPages(textPages);
          toast(
            `Loaded ${name} (${pdf.numPages} page${pdf.numPages !== 1 ? "s" : ""})`,
            "success"
          );
        }
      } catch (e) {
        toast("Failed to read PDF file. Try again.", "error");
      }

      setConverting(false);
      setStatus("");
    },
    [toast]
  );

  const downloadDocx = useCallback(async () => {
    if (!pages.length) return;
    setLoading(true);

    try {
      const children: Paragraph[] = [];

      for (let i = 0; i < pages.length; i++) {
        if (i > 0) {
          children.push(
            new Paragraph({
              children: [new TextRun({ text: "", size: 200 })],
              spacing: { before: 400 },
            })
          );
        }

        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `Page ${i + 1}`,
                bold: true,
                size: 24,
                color: "666666",
              }),
            ],
            spacing: { after: 200 },
            alignment: AlignmentType.CENTER,
          })
        );

        const lines = pages[i].split("\n");
        for (const line of lines) {
          if (line.trim()) {
            children.push(
              new Paragraph({
                children: [new TextRun(line.trim())],
                spacing: { after: 120 },
              })
            );
          }
        }
      }

      const doc = new Document({
        title: fileName.replace(/\.[^.]+$/, ""),
        description: usingOcr ? "Converted from PDF via OCR" : "Converted from PDF",
        sections: [{ children }],
      });

      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName.replace(/\.[^.]+$/, ".docx") || "document.docx";
      a.click();
      URL.revokeObjectURL(url);
      toast("DOCX downloaded!", "success");
    } catch {
      toast("Failed to create DOCX", "error");
    }

    setLoading(false);
  }, [pages, fileName, usingOcr, toast]);

  if (!pages.length && !converting) {
    return (
      <FileDropZone
        accept=".pdf"
        label="Upload a PDF file"
        description="Convert PDF documents to editable Word files"
        readAs="dataurl"
        loading={converting}
        onFile={handleFile}
      />
    );
  }

  if (converting) {
    return (
      <div className="space-y-6 animate-fade-in py-12">
        <div className="flex flex-col items-center gap-4">
          <svg className="animate-spin w-10 h-10 text-indigo-500" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">{status}</p>
          {usingOcr && (
            <div className="w-64 h-2 rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden">
              <div
                className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                style={{ width: `${ocrProgress}%` }}
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <span className="text-xs text-zinc-500 flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-medium">
            {fileName}
          </span>
          {usingOcr && (
            <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-[10px] font-medium">
              OCR
            </span>
          )}
        </span>
        <button onClick={() => { setPages([]); setFileName(""); setUsingOcr(false); setOcrProgress(0); }} className="text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 underline">
          Upload another
        </button>
      </div>

      <div className="h-64 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-2">&#x1F4C4;</div>
          <p className="text-sm text-zinc-500">{fileName}</p>
          <p className="text-xs text-zinc-400 mt-1">
            {pages.length} page{pages.length !== 1 ? "s" : ""} extracted
            {usingOcr ? " via OCR" : ""}
          </p>
          <p className="text-xs text-zinc-400 mt-1">
            {pages.reduce((s, p) => s + p.trim().length, 0).toLocaleString()} characters
          </p>
        </div>
      </div>

      <button
        onClick={downloadDocx}
        disabled={loading}
        className="btn-primary flex items-center gap-2 mx-auto"
      >
        {loading ? (
          <>
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Generating DOCX...
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download DOCX
          </>
        )}
      </button>
    </div>
  );
}
