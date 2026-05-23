import type { Metadata } from "next";
import { getConverter } from "@/lib/constants";
import { HtmlMinifier } from "@/components/converters/Minifiers";
import { ConverterShell } from "@/components/ConverterShell";

export const metadata: Metadata = {
  title: "HTML Minifier",
  description: "Free online HTML minifier. Compress your HTML code by removing whitespace and comments. Reduce page load times with instant client-side minification.",
};

export default function Page() {
  return (
    <ConverterShell info={getConverter("html-minifier")}>
      <HtmlMinifier />
    </ConverterShell>
  );
}
