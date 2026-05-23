import type { Metadata } from "next";
import { getConverter } from "@/lib/constants";
import { ImageConverter } from "@/components/converters/ImageConverter";
import { ConverterShell } from "@/components/ConverterShell";

export const metadata: Metadata = {
  title: "Image Format Converter",
  description: "Free online image converter. Convert PNG, JPG, WebP, GIF, and BMP images instantly. No upload required, 100% private client-side processing.",
};

export default function Page() {
  return (
    <ConverterShell info={getConverter("image-converter")}>
      <ImageConverter />
    </ConverterShell>
  );
}
