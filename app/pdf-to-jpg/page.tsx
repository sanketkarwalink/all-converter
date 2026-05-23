import type { Metadata } from "next";
import { getConverter } from "@/lib/constants";
import { ConverterShell } from "@/components/ConverterShell";
import PdfToJpg from "@/components/PdfToJpgWrapper";

export const metadata: Metadata = {
  title: "PDF to JPG Converter",
  description: "Free online PDF to JPG converter. Extract pages from PDF as high-quality images. Client-side processing keeps your files private.",
};

export default function Page() {
  return (
    <ConverterShell info={getConverter("pdf-to-jpg")}>
      <PdfToJpg />
    </ConverterShell>
  );
}
