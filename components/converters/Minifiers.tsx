"use client";

import { useState, useCallback } from "react";
import { FileDropZone } from "../FileDropZone";
import { useToast } from "../Toast";

interface MinifierProps {
  lang: string;
  ext: string;
}

export function HtmlMinifier() {
  return <Minifier lang="HTML" ext="html" />;
}

export function CssMinifier() {
  return <Minifier lang="CSS" ext="css" />;
}

export function JsMinifier() {
  return <Minifier lang="JavaScript" ext="js" />;
}

function Minifier({ lang, ext }: MinifierProps) {
  const [input, setInput] = useState("");
  const [fileName, setFileName] = useState("");
  const [output, setOutput] = useState("");
  const [stats, setStats] = useState<{ original: number; minified: number } | null>(null);
  const { toast } = useToast();

  const minify = useCallback((val: string) => {
    const noComments = val
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/\/\/.*$/gm, "");
    const minified = noComments
      .replace(/>\s+</g, "><")
      .replace(/\s{2,}/g, " ")
      .replace(/\n\s*/g, "")
      .replace(/\s*([{}:;,()])\s*/g, "$1")
      .trim();
    setOutput(minified);
    setStats({
      original: new Blob([val]).size,
      minified: new Blob([minified]).size,
    });
  }, []);

  const handleFile = useCallback(
    (content: string, name: string) => {
      setInput(content);
      setFileName(name);
      minify(content);
      toast(`Loaded ${name}`, "success");
    },
    [minify, toast]
  );

  const copyOutput = useCallback(() => {
    navigator.clipboard.writeText(output);
    toast("Copied!", "success");
  }, [output, toast]);

  const download = useCallback(() => {
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName.replace(/\.[^.]+$/, `.min.${ext}`);
    a.click();
    URL.revokeObjectURL(url);
    toast("Downloaded!", "success");
  }, [output, fileName, ext, toast]);

  const savings = stats ? ((1 - stats.minified / stats.original) * 100).toFixed(1) : "0";

  if (!input) {
    return (
      <FileDropZone
        accept={`.${ext}`}
        label={`Upload a ${ext.toUpperCase()} file`}
        description={`Accepts .${ext} files`}
        onFile={handleFile}
      />
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <span className="text-xs text-zinc-500 flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-medium">{fileName}</span>
          {stats && `${stats.original.toLocaleString()} B → ${stats.minified.toLocaleString()} B`}
        </span>
        <button onClick={() => { setInput(""); setOutput(""); setStats(null); setFileName(""); }} className="text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 underline">
          Upload another
        </button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Original</label>
          <textarea value={input} readOnly className="output-base h-64" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400 flex items-center justify-between">
            <span>Minified{stats ? ` (${stats.minified.toLocaleString()} B)` : ""}</span>
            {output && (
              <button onClick={copyOutput} className="text-[10px] text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy
              </button>
            )}
          </label>
          <textarea value={output} readOnly className="output-base h-64" placeholder="Minified output..." />
        </div>
      </div>

      {stats && (
        <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex gap-4">
              <span className="text-zinc-500">
                Saved: <strong className="text-indigo-600">{savings}%</strong>
              </span>
            </div>
            <button onClick={download} className="btn-success text-xs px-3 py-1.5">
              Download .min.{ext}
            </button>
          </div>
          <div className="w-full h-2 rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-indigo-500 transition-all duration-500"
              style={{ width: `${100 - parseFloat(savings)}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
