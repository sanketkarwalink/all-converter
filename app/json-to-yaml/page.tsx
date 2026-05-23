import type { Metadata } from "next";
import { getConverter } from "@/lib/constants";
import { JsonToYaml } from "@/components/converters/JsonToYaml";
import { ConverterShell } from "@/components/ConverterShell";

export const metadata: Metadata = {
  title: "JSON to YAML Converter",
  description: "Free online JSON to YAML converter. Convert your JSON configuration to YAML format instantly. No data leaves your browser.",
};

export default function Page() {
  return (
    <ConverterShell info={getConverter("json-to-yaml")}>
      <JsonToYaml />
    </ConverterShell>
  );
}
