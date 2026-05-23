import type { ReactNode } from "react";
import type { ConverterInfo } from "@/lib/constants";
import { SITE, categories } from "@/lib/constants";
import Link from "next/link";
import { RelatedConverters } from "./RelatedConverters";

export function ConverterShell({
  info,
  children,
}: {
  info?: ConverterInfo;
  children: ReactNode;
}) {
  if (!info) return null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: info.title,
    description: info.metaDescription,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    author: { "@type": "Organization", name: SITE.name },
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10 animate-fade-in">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 mb-5">
        <Link href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Home</Link>
        <span className="text-zinc-300 dark:text-zinc-800">/</span>
        <span className="text-zinc-500 dark:text-zinc-400 font-medium">{info.shortTitle}</span>
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl bg-zinc-100 dark:bg-zinc-900 w-11 h-11 rounded-xl flex items-center justify-center shadow-2xs border border-zinc-200/20 dark:border-zinc-800/20">{info.icon}</span>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
              {info.title}
            </h1>
            <div className="flex items-center gap-3 mt-1 flex-wrap text-[10px] text-zinc-400 dark:text-zinc-500 font-medium">
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Private (100% browser-based)
              </span>
              <span className="text-zinc-300 dark:text-zinc-800">&bull;</span>
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Instant Conversion
              </span>
              <span className="text-zinc-300 dark:text-zinc-800">&bull;</span>
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                No login required
              </span>
            </div>
          </div>
        </div>
        <p className="text-xs text-zinc-400 dark:text-zinc-500 max-w-2xl leading-relaxed pl-14">
          {info.description}. All processing happens locally. No data leaves your machine.
        </p>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl p-6 sm:p-8 shadow-2xs mb-10">
        {children}
      </div>

      <RelatedConverters category={info.category} currentSlug={info.slug} />
    </div>
  );
}
