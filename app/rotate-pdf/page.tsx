import type { Metadata } from "next";
import { getConverter } from "@/lib/constants";
import { RotatePdf } from "@/components/converters/RotatePdf";
import { ConverterShell } from "@/components/ConverterShell";

export const metadata: Metadata = {
  title: "Rotate PDF Pages",
  description: "Free online PDF rotator. Rotate pages in your PDF document to the correct orientation. 100% client-side processing.",
};

export default function Page() {
  return (
    <ConverterShell info={getConverter("rotate-pdf")}>
      <RotatePdf />
    </ConverterShell>
  );
}
