import type { Metadata } from "next";
import { getConverter } from "@/lib/constants";
import { CsvToJson } from "@/components/converters/CsvToJson";
import { ConverterShell } from "@/components/ConverterShell";

export const metadata: Metadata = {
  title: "CSV to JSON Converter",
  description: "Free online CSV to JSON converter. Transform CSV files into JSON arrays instantly. Client-side processing keeps your data private.",
};

export default function Page() {
  return (
    <ConverterShell info={getConverter("csv-to-json")}>
      <CsvToJson />
    </ConverterShell>
  );
}
