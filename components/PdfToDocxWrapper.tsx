"use client";

import dynamic from "next/dynamic";

const PdfToDocxInner = dynamic(
  () => import("@/components/converters/PdfToDocx").then((m) => m.PdfToDocx),
  { ssr: false }
);

export default function PdfToDocxWrapper() {
  return <PdfToDocxInner />;
}
