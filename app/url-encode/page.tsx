import type { Metadata } from "next";
import { getConverter } from "@/lib/constants";
import { UrlEncoder } from "@/components/converters/UrlEncoder";
import { ConverterShell } from "@/components/ConverterShell";

export const metadata: Metadata = {
  title: "URL Encode Decode",
  description: "Free online URL encoder and decoder. Encode or decode URLs and query parameters instantly. Client-side tool with no data upload.",
};

export default function Page() {
  return (
    <ConverterShell info={getConverter("url-encode")}>
      <UrlEncoder />
    </ConverterShell>
  );
}
