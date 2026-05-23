import type { Metadata } from "next";
import { getConverter } from "@/lib/constants";
import { ConverterShell } from "@/components/ConverterShell";
import PdfToDocx from "@/components/PdfToDocxWrapper";

export const metadata: Metadata = {
  title: "PDF to DOCX Converter",
  description: "Free online PDF to DOCX converter. Turn your PDF files into editable Word documents. Client-side conversion keeps your data private.",
};

export default function Page() {
  return (
    <ConverterShell info={getConverter("pdf-to-docx")}>
      <PdfToDocx />
    </ConverterShell>
  );
}
