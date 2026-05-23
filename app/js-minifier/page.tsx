import type { Metadata } from "next";
import { getConverter } from "@/lib/constants";
import { JsMinifier } from "@/components/converters/Minifiers";
import { ConverterShell } from "@/components/ConverterShell";

export const metadata: Metadata = {
  title: "JavaScript Minifier",
  description: "Free online JavaScript minifier. Compress your JS code by removing whitespace and comments. Reduce bundle sizes instantly in your browser.",
};

export default function Page() {
  return (
    <ConverterShell info={getConverter("js-minifier")}>
      <JsMinifier />
    </ConverterShell>
  );
}
