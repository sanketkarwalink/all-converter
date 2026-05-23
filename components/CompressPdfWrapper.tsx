"use client";

import dynamic from "next/dynamic";

export const CompressPdf = dynamic(
  () => import("@/components/converters/CompressPdf").then((m) => m.CompressPdf),
  { ssr: false }
);
