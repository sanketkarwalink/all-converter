"use client";

import { useState, useCallback } from "react";
import { FileDropZone } from "../FileDropZone";
import { useToast } from "../Toast";

export function JsonToXml() {
  const [input, setInput] = useState("");
  const [fileName, setFileName] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const { toast } = useToast();

  function jsonToXml(obj: unknown, rootName = "root", depth = 0): string {
    const indent = "  ".repeat(depth);
    if (obj == null) return `${indent}<${rootName}/>`;
    if (typeof obj === "string" || typeof obj === "number" || typeof obj === "boolean") {
      return `${indent}<${rootName}>${String(obj)}</${rootName}>`;
    }
    if (Array.isArray(obj)) {
      return obj.map((item) => jsonToXml(item, rootName, depth)).join("\n");
    }
    if (typeof obj === "object") {
      const entries = Object.entries(obj as Record<string, unknown>);
      const children = entries.map(([key, val]) => jsonToXml(val, key, depth + 1)).join("\n");
      return `${indent}<${rootName}>\n${children}\n${indent}</${rootName}>`;
    }
    return "";
  }

  const convert = useCallback((val: string) => {
    setError("");
    try {
      const data = JSON.parse(val);
      setOutput(jsonToXml(data));
    } catch (e) {
      setError((e as Error).message);
      setOutput("");
    }
  }, []);

  const handleFile = useCallback(
    (content: string, name: string) => {
      setInput(content);
      setFileName(name);
      convert(content);
      toast(`Loaded ${name}`, "success");
    },
    [convert, toast]
  );

  const copyOutput = useCallback(() => {
    navigator.clipboard.writeText(output);
    toast("Copied!", "success");
  }, [output, toast]);

  const download = useCallback(() => {
    const blob = new Blob([output], { type: "application/xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = fileName.replace(/\.[^.]+$/, ".xml");
    a.click(); URL.revokeObjectURL(url);
    toast("XML downloaded!", "success");
  }, [output, fileName, toast]);

  if (!input) {
    return <FileDropZone accept=".json" label="Upload a JSON file" description="Accepts .json files" onFile={handleFile} />;
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <span className="text-xs text-zinc-500 flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-medium">{fileName}</span>
          {input.length.toLocaleString()} chars
        </span>
        <button onClick={() => { setInput(""); setOutput(""); setFileName(""); }} className="text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 underline">
          Upload another
        </button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">JSON Input</label>
          <textarea value={input} readOnly className="output-base h-72" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400 flex items-center justify-between">
            <span>XML Output</span>
            {output && (
              <button onClick={copyOutput} className="text-[10px] text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy
              </button>
            )}
          </label>
          <textarea value={output} readOnly className="output-base h-72" placeholder="XML output..." />
        </div>
      </div>
      {error && <p className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-xl">{error}</p>}
      {output && (
        <button onClick={download} className="btn-success flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Download XML
        </button>
      )}
    </div>
  );
}
