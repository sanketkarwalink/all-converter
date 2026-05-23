"use client";

import dynamic from "next/dynamic";

const PdfToJpgInner = dynamic(
  () => import("@/components/converters/PdfToJpg").then((m) => m.PdfToJpg),
  { ssr: false }
);

export default function PdfToJpgWrapper() {
  return <PdfToJpgInner />;
}
