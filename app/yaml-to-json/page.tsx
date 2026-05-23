import type { Metadata } from "next";
import { getConverter } from "@/lib/constants";
import { YamlToJson } from "@/components/converters/YamlToJson";
import { ConverterShell } from "@/components/ConverterShell";

export const metadata: Metadata = {
  title: "YAML to JSON Converter",
  description: "Free online YAML to JSON converter. Transform YAML configuration files to JSON format instantly. All processing done client-side.",
};

export default function Page() {
  return (
    <ConverterShell info={getConverter("yaml-to-json")}>
      <YamlToJson />
    </ConverterShell>
  );
}
