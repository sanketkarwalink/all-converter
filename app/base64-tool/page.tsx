import type { Metadata } from "next";
import { getConverter } from "@/lib/constants";
import { Base64Tool } from "@/components/converters/Base64Tool";
import { ConverterShell } from "@/components/ConverterShell";

export const metadata: Metadata = {
  title: "Base64 Encode Decode",
  description: "Free online Base64 encoder and decoder. Encode text or files to Base64, or decode Base64 back to text. Instant client-side processing.",
};

export default function Page() {
  return (
    <ConverterShell info={getConverter("base64-tool")}>
      <Base64Tool />
    </ConverterShell>
  );
}
