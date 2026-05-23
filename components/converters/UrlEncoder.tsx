"use client";

import { useState, useCallback } from "react";
import { FileDropZone } from "../FileDropZone";
import { useToast } from "../Toast";

export function UrlEncoder() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const { toast } = useToast();

  const handleFile = useCallback(
    (content: string, name: string) => {
      setInput(content);
      setOutput("");
      setError("");
      toast(`Loaded ${name}`, "success");
    },
    [toast]
  );

  const convert = useCallback(
    (toMode?: "encode" | "decode") => {
      const m = toMode || mode;
      setError("");
      try {
        setOutput(m === "encode" ? encodeURIComponent(input) : decodeURIComponent(input));
      } catch (e) {
        setError((e as Error).message);
        setOutput("");
      }
    },
    [input, mode]
  );

  const copyOutput = useCallback(() => {
    navigator.clipboard.writeText(output);
    toast("Copied!", "success");
  }, [output, toast]);

  if (!input) {
    return (
      <FileDropZone
        accept=".txt"
        label="Upload a text file"
        description="Accepts .txt files"
        onFile={handleFile}
      />
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => { setMode("encode"); setOutput(""); setError(""); }}
            className={`tab-btn ${mode === "encode" ? "tab-btn-active" : "tab-btn-inactive"}`}
          >
            Encode
          </button>
          <button
            onClick={() => { setMode("decode"); setOutput(""); setError(""); }}
            className={`tab-btn ${mode === "decode" ? "tab-btn-active" : "tab-btn-inactive"}`}
          >
            Decode
          </button>
        </div>
        <button onClick={() => { setInput(""); setOutput(""); setError(""); }} className="text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 underline">
          Upload another
        </button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Input</label>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} className="textarea-base h-48" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400 flex items-center justify-between">
            <span>Output</span>
            {output && (
              <button onClick={copyOutput} className="text-[10px] text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy
              </button>
            )}
          </label>
          <textarea value={output} readOnly className="output-base h-48" placeholder="Output..." />
        </div>
      </div>
      {error && <p className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-xl">{error}</p>}
      <button onClick={() => convert()} className="btn-primary">
        {mode === "encode" ? "Encode" : "Decode"}
      </button>
    </div>
  );
}
