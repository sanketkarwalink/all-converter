"use client";

import { useState, useCallback } from "react";
import mammoth from "mammoth";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { FileDropZone } from "../FileDropZone";
import { useToast } from "../Toast";

function dataUrlToArrayBuffer(dataUrl: string): ArrayBuffer {
  const base64 = dataUrl.split(",")[1];
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}

export function DocxToPdf() {
  const [fileName, setFileName] = useState("");
  const [html, setHtml] = useState("");
  const [loading, setLoading] = useState(false);
  const [converting, setConverting] = useState(false);
  const { toast } = useToast();

  const handleFile = useCallback(
    async (content: string, name: string) => {
      setFileName(name);
      setConverting(true);
      try {
        const result = await mammoth.convertToHtml({
          arrayBuffer: dataUrlToArrayBuffer(content),
        });
        setHtml(result.value);
        toast(`Loaded ${name}`, "success");
      } catch {
        toast("Failed to parse DOCX file", "error");
      }
      setConverting(false);
    },
    [toast]
  );

  const downloadPdf = useCallback(async () => {
    if (!html) return;
    setLoading(true);

    const iframe = document.createElement("iframe");
    iframe.style.position = "absolute";
    iframe.style.left = "-9999px";
    iframe.style.top = "0";
    iframe.style.width = "210mm";
    iframe.style.border = "none";
    document.body.appendChild(iframe);

    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!iframeDoc) {
      document.body.removeChild(iframe);
      setLoading(false);
      toast("Failed to generate PDF", "error");
      return;
    }

    iframeDoc.open();
    iframeDoc.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Georgia, serif; padding: 28px; line-height: 1.7; font-size: 12pt; color: #1a1a1a; background: #fff; margin: 0; }
          h1 { font-size: 24pt; margin: 0 0 12px 0; border-bottom: 1px solid #ddd; padding-bottom: 6px; }
          h2 { font-size: 20pt; margin: 24px 0 8px 0; }
          h3 { font-size: 16pt; margin: 20px 0 6px 0; }
          p { margin: 8px 0; }
          table { border-collapse: collapse; width: 100%; margin: 12px 0; }
          th, td { border: 1px solid #ccc; padding: 8px 12px; text-align: left; }
          th { background: #f0f0f0; }
          img { max-width: 100%; }
          ul, ol { padding-left: 24px; margin: 8px 0; }
          li { margin: 4px 0; }
        </style>
      </head>
      <body>
        ${html}
      </body>
      </html>
    `);
    iframeDoc.close();

    await new Promise((r) => setTimeout(r, 200));

    try {
      const canvas = await html2canvas(iframeDoc.body, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        width: iframeDoc.body.scrollWidth,
        height: iframeDoc.body.scrollHeight,
        windowWidth: iframeDoc.body.scrollWidth,
        windowHeight: iframeDoc.body.scrollHeight,
      });

      const imgData = canvas.toDataURL("image/jpeg", 0.95);
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfW = 190;
      const pdfH = (canvas.height * pdfW) / canvas.width;
      const pageH = 277;

      if (pdfH <= pageH) {
        pdf.addImage(imgData, "JPEG", 10, 10, pdfW, pdfH);
      } else {
        const srcH = canvas.height * (pageH / pdfH);
        let y = 0;
        while (y < canvas.height) {
          const chunkH = Math.min(srcH, canvas.height - y);
          const chunk = document.createElement("canvas");
          chunk.width = canvas.width;
          chunk.height = chunkH;
          const ctx = chunk.getContext("2d")!;
          ctx.drawImage(canvas, 0, y, canvas.width, chunkH, 0, 0, chunk.width, chunkH);
          if (y > 0) pdf.addPage();
          pdf.addImage(chunk, "PNG", 10, 10, pdfW, pageH * (chunkH / srcH));
          y += srcH;
        }
      }

      pdf.save(fileName.replace(/\.[^.]+$/, ".pdf") || "document.pdf");
      toast("PDF downloaded!", "success");
    } catch {
      toast("Failed to generate PDF. Try again.", "error");
    }

    if (iframe.parentNode) iframe.parentNode.removeChild(iframe);
    setLoading(false);
  }, [html, fileName, toast]);

  if (!html) {
    return (
      <FileDropZone
        accept=".docx"
        label="Upload a Word document"
        description="Convert .docx files to PDF"
        readAs="dataurl"
        loading={converting}
        onFile={handleFile}
      />
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <span className="text-xs text-zinc-500 flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-medium">
            {fileName}
          </span>
        </span>
        <button onClick={() => { setHtml(""); setFileName(""); }} className="text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 underline">
          Upload another
        </button>
      </div>

      <div className="h-64 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-2">&#x1F4C4;</div>
          <p className="text-sm text-zinc-500">{fileName} loaded</p>
          <p className="text-xs text-zinc-400 mt-1">
            Ready to convert to PDF
          </p>
        </div>
      </div>

      <button
        onClick={downloadPdf}
        disabled={loading}
        className="btn-primary flex items-center gap-2 mx-auto"
      >
        {loading ? (
          <>
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Generating PDF...
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download PDF
          </>
        )}
      </button>
    </div>
  );
}
