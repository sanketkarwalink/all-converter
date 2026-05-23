import type { Metadata } from "next";
import { getConverter } from "@/lib/constants";
import { CompressPdf } from "@/components/CompressPdfWrapper";
import { ConverterShell } from "@/components/ConverterShell";

export const metadata: Metadata = {
  title: "Compress PDF",
  description: "Free online PDF compressor. Reduce PDF file size for easier sharing. All processing happens in your browser with no upload needed.",
};

export default function Page() {
  return (
    <ConverterShell info={getConverter("compress-pdf")}>
      <CompressPdf />
    </ConverterShell>
  );
}
