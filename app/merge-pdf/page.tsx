import type { Metadata } from "next";
import { getConverter } from "@/lib/constants";
import { MergePdf } from "@/components/converters/MergePdf";
import { ConverterShell } from "@/components/ConverterShell";

export const metadata: Metadata = {
  title: "Merge PDF Files",
  description: "Free online PDF merger. Combine multiple PDF files into a single document. No upload needed, all processing happens in your browser.",
};

export default function Page() {
  return (
    <ConverterShell info={getConverter("merge-pdf")}>
      <MergePdf />
    </ConverterShell>
  );
}
