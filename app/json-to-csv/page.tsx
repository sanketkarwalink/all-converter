import type { Metadata } from "next";
import { getConverter } from "@/lib/constants";
import { JsonToCsv } from "@/components/converters/JsonToCsv";
import { ConverterShell } from "@/components/ConverterShell";

export const metadata: Metadata = {
  title: "JSON to CSV Converter",
  description: "Free online JSON to CSV converter. Transform your JSON arrays into CSV spreadsheets instantly. No server upload, all processing in your browser.",
};

export default function Page() {
  return (
    <ConverterShell info={getConverter("json-to-csv")}>
      <JsonToCsv />
    </ConverterShell>
  );
}
