import type { Metadata } from "next";
import { getConverter } from "@/lib/constants";
import { CssMinifier } from "@/components/converters/Minifiers";
import { ConverterShell } from "@/components/ConverterShell";

export const metadata: Metadata = {
  title: "CSS Minifier",
  description: "Free online CSS minifier. Compress your CSS stylesheets by removing whitespace and comments. Client-side processing for instant results.",
};

export default function Page() {
  return (
    <ConverterShell info={getConverter("css-minifier")}>
      <CssMinifier />
    </ConverterShell>
  );
}
