import type { Metadata } from "next";
import { getConverter } from "@/lib/constants";
import { DocxToPdf } from "@/components/converters/DocxToPdf";
import { ConverterShell } from "@/components/ConverterShell";

export const metadata: Metadata = {
  title: "DOCX to PDF Converter",
  description: "Free online DOCX to PDF converter. Convert your Word documents to PDF format instantly. No upload needed, 100% client-side processing.",
};

export default function Page() {
  return (
    <ConverterShell info={getConverter("docx-to-pdf")}>
      <DocxToPdf />
    </ConverterShell>
  );
}
