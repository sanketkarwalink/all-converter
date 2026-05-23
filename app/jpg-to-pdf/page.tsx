import type { Metadata } from "next";
import { getConverter } from "@/lib/constants";
import { JpgToPdf } from "@/components/converters/JpgToPdf";
import { ConverterShell } from "@/components/ConverterShell";

export const metadata: Metadata = {
  title: "JPG to PDF Converter",
  description: "Free online JPG to PDF converter. Turn your images into PDF documents instantly. No upload needed, 100% client-side processing.",
};

export default function Page() {
  return (
    <ConverterShell info={getConverter("jpg-to-pdf")}>
      <JpgToPdf />
    </ConverterShell>
  );
}
