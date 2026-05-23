"use client";

import { useState, useCallback, useRef } from "react";
import { marked } from "marked";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { FileDropZone } from "../FileDropZone";
import { useToast } from "../Toast";

export function MarkdownToPdf() {
  const [md, setMd] = useState("");
  const [fileName, setFileName] = useState("");
  const [html, setHtml] = useState("");
  const [loading, setLoading] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const { toast } = useToast();

  const handleFile = useCallback(
    (content: string, name: string) => {
      setMd(content);
      setFileName(name);
      setHtml(marked.parse(content) as string);
      toast(`Loaded ${name}`, "success");
    },
    [toast]
  );

  const downloadPdf = useCallback(async () => {
    if (!md.trim()) return;
    setLoading(true);

    const iframe = document.createElement("iframe");
    iframeRef.current = iframe;
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
          pre { background: #f4f4f4; padding: 12px 16px; border-radius: 4px; font-family: 'Courier New', monospace; font-size: 10pt; border: 1px solid #e0e0e0; overflow: hidden; }
          code { background: #f4f4f4; padding: 2px 6px; border-radius: 3px; font-family: 'Courier New', monospace; font-size: 10pt; }
          pre code { background: none; padding: 0; border-radius: 0; }
          table { border-collapse: collapse; width: 100%; margin: 12px 0; }
          th, td { border: 1px solid #ccc; padding: 8px 12px; text-align: left; }
          th { background: #f0f0f0; }
          img { max-width: 100%; }
          blockquote { border-left: 4px solid #ccc; margin: 0 0 0 0; padding-left: 16px; color: #555; }
          ul, ol { padding-left: 24px; margin: 8px 0; }
          li { margin: 4px 0; }
          hr { border: none; border-top: 1px solid #ddd; margin: 20px 0; }
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
      let remaining = pdfH;

      const singlePage = pdfH <= pageH;
      if (singlePage) {
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
          const chunkData = chunk.toDataURL("image/jpeg", 0.95);
          const renderH = pageH * (chunkH / srcH);
          if (y > 0) pdf.addPage();
          pdf.addImage(chunkData, "JPEG", 10, 10, pdfW, renderH);
          y += srcH;
        }
      }

      pdf.save(fileName.replace(/\.[^.]+$/, ".pdf") || "document.pdf");
      toast("PDF downloaded!", "success");
    } catch {
      toast("Failed to generate PDF. Try again.", "error");
    }

    if (iframe.parentNode) iframe.parentNode.removeChild(iframe);
    iframeRef.current = null;
    setLoading(false);
  }, [md, html, fileName, toast]);

  if (!md) {
    return (
      <FileDropZone
        accept=".md,.markdown"
        label="Upload a Markdown file"
        description="Convert .md files to PDF instantly"
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
        <button onClick={() => { setMd(""); setHtml(""); setFileName(""); }} className="text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 underline">
          Upload another
        </button>
      </div>

      <div className="h-64 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-2">&#x1F4C4;</div>
          <p className="text-sm text-zinc-500">{fileName} loaded</p>
          <p className="text-xs text-zinc-400 mt-1">
            {md.length.toLocaleString()} chars &middot; {md.trim().split(/\s+/).length} words &middot; {md.split("\n").length} lines
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
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Download PDF
          </>
        )}
      </button>
    </div>
  );
}
