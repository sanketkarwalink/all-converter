import type { Metadata } from "next";
import { getConverter } from "@/lib/constants";
import { MarkdownToPdf } from "@/components/converters/MarkdownToPdf";
import { ConverterShell } from "@/components/ConverterShell";

export const metadata: Metadata = {
  title: "Markdown to PDF Converter",
  description:
    "Free online Markdown to PDF converter. Convert your MD files to professional PDF documents instantly. No upload needed, works in your browser.",
  openGraph: {
    title: "Markdown to PDF Converter - All Converter",
    description:
      "Convert Markdown to PDF online for free. No upload required, 100% client-side.",
  },
};

export default function Page() {
  return (
    <ConverterShell info={getConverter("md-to-pdf")}>
      <MarkdownToPdf />
    </ConverterShell>
  );
}
