import type { Metadata } from "next";
import { getConverter } from "@/lib/constants";
import { SplitPdf } from "@/components/converters/SplitPdf";
import { ConverterShell } from "@/components/ConverterShell";

export const metadata: Metadata = {
  title: "Split PDF Files",
  description: "Free online PDF splitter. Extract specific pages from a PDF into a new file. Client-side processing keeps your data private.",
};

export default function Page() {
  return (
    <ConverterShell info={getConverter("split-pdf")}>
      <SplitPdf />
    </ConverterShell>
  );
}
