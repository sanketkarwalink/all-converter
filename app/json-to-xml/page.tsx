import type { Metadata } from "next";
import { getConverter } from "@/lib/constants";
import { JsonToXml } from "@/components/converters/JsonToXml";
import { ConverterShell } from "@/components/ConverterShell";

export const metadata: Metadata = {
  title: "JSON to XML Converter",
  description: "Free online JSON to XML converter. Convert your JSON data structures to XML format instantly. 100% private client-side conversion.",
};

export default function Page() {
  return (
    <ConverterShell info={getConverter("json-to-xml")}>
      <JsonToXml />
    </ConverterShell>
  );
}
