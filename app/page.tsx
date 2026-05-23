"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { converters, categories, type Category } from "@/lib/constants";

export default function Home() {
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const filtered = query
    ? converters.filter(
        (c) =>
          c.title.toLowerCase().includes(query.toLowerCase()) ||
          c.shortTitle.toLowerCase().includes(query.toLowerCase()) ||
          c.description.toLowerCase().includes(query.toLowerCase())
      )
    : null;

  const grouped = Object.keys(categories).reduce(
    (acc, key) => {
      acc[key as Category] = converters.filter((c) => c.category === key);
      return acc;
    },
    {} as Record<Category, typeof converters>
  );

  const popular = ["md-to-pdf", "json-to-csv", "image-converter", "compress-pdf", "merge-pdf", "pdf-to-docx"];

  return (
    <div className="animate-fade-in">
      <section className="relative overflow-hidden bg-zinc-50 dark:bg-zinc-950/40 border-b border-zinc-200/30 dark:border-zinc-900/30">
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 py-20 sm:py-24 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-[11px] font-medium text-indigo-600 dark:text-indigo-400 border border-indigo-100/60 dark:border-indigo-900/30 mb-6 backdrop-blur-sm animate-fade-in">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            100% Free &middot; Client-Side Processing &middot; No Uploads
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 text-zinc-900 dark:text-white animate-slide-up">
            Your Files Stay
            <span className="block text-indigo-600 dark:text-indigo-400">
              Yours. Always.
            </span>
          </h1>
          <p className="text-base text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto mb-8 leading-relaxed animate-slide-up" style={{ animationDelay: "0.1s" }}>
            Convert documents, images, and data formats privately in your browser.
            No data ever leaves your device.
          </p>

          <div className="max-w-xl mx-auto relative animate-slide-up" style={{ animationDelay: "0.15s" }}>
            <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm transition-all duration-200 focus-within:ring-4 focus-within:ring-indigo-500/10 focus-within:border-indigo-500/50">
              <svg className="w-5 h-5 shrink-0 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref={searchRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search converters... (e.g. PDF to Word)"
                className="flex-1 bg-transparent text-zinc-950 dark:text-white placeholder-zinc-400 outline-none text-sm"
              />
              <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-[10px] font-medium text-zinc-400">
                ⌘K
              </kbd>
            </div>
            {filtered && (
              <div className="absolute mt-2 inset-x-0 rounded-2xl border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 shadow-xl max-h-72 overflow-y-auto z-10 animate-scale-in divide-y divide-zinc-100 dark:divide-zinc-800/55">
                {filtered.length === 0 ? (
                  <p className="p-6 text-sm text-zinc-500 text-center">
                    No converters found
                  </p>
                ) : (
                  filtered.map((c) => (
                    <Link
                      key={c.slug}
                      href={`/${c.slug}`}
                      onClick={() => setQuery("")}
                      className="flex items-center gap-3.5 px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors"
                    >
                      <span className="text-xl bg-zinc-100 dark:bg-zinc-800 w-9 h-9 rounded-xl flex items-center justify-center">{c.icon}</span>
                      <div className="text-left flex-1 min-w-0">
                        <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                          {c.shortTitle}
                        </p>
                        <p className="text-xs text-zinc-400 dark:text-zinc-500 truncate">{c.description}</p>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 -mt-10 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Free Tools", value: "20", sub: "always client-side", icon: "🛠️" },
            { label: "Processing", value: "100%", sub: "fully in-browser", icon: "🔒" },
            { label: "Server Uploads", value: "Zero", sub: "data stays yours", icon: "✅" },
            { label: "Cost", value: "Free", sub: "no limits or login", icon: "🎉" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 p-5 text-center shadow-xs card-hover"
            >
              <span className="w-10 h-10 rounded-xl bg-zinc-50 dark:bg-zinc-800/55 flex items-center justify-center mx-auto mb-3 text-xl">{stat.icon}</span>
              <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                {stat.value}
              </p>
              <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 mt-1.5">
                {stat.label}
              </p>
              <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5">{stat.sub}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
        {Object.entries(grouped).map(([key, items]) => {
          const cat = categories[key as Category];
          return (
            <section key={key} id={key} className="mb-14 last:mb-0">
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-lg font-bold text-zinc-800 dark:text-zinc-100">{cat.label}</h2>
                <div className="flex-1 h-px bg-zinc-200/60 dark:bg-zinc-800/60" />
                <span className="text-[11px] font-medium text-zinc-400 dark:text-zinc-500 bg-zinc-100/60 dark:bg-zinc-800/40 px-2 py-0.5 rounded-full">{items.length} tools</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {items.map((c, i) => (
                  <Link
                    key={c.slug}
                    href={`/${c.slug}`}
                    className="group relative p-6 rounded-2xl border border-zinc-200/40 dark:border-zinc-800/40 bg-white dark:bg-zinc-900 card-hover overflow-hidden"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    {popular.includes(c.slug) && (
                      <span className="absolute top-4 right-4 text-[9px] font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100/40 dark:border-indigo-900/30 px-2 py-0.5 rounded-full">
                        Popular
                      </span>
                    )}
                    <div className="text-2xl bg-zinc-50 dark:bg-zinc-800/50 w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-105">
                      {c.icon}
                    </div>
                    <h3 className="font-semibold text-zinc-800 dark:text-zinc-200 text-sm mb-1 transition-colors group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                      {c.shortTitle}
                    </h3>
                    <p className="text-xs text-zinc-400 dark:text-zinc-500 leading-relaxed">
                      {c.description}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </section>

      <section className="bg-zinc-50/50 dark:bg-zinc-950/20 border-t border-zinc-200/40 dark:border-zinc-800/40">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
          <div className="text-center mb-12">
            <h2 className="text-xl font-bold mb-2 text-zinc-800 dark:text-zinc-100">
              Designed for Privacy & Speed
            </h2>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 max-w-xl mx-auto">
              Every tool is engineered with simplicity and browser security at its core.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                ),
                title: "Your Files Never Leave",
                desc: "Every conversion runs right here in your browser. No uploads, no servers, no copies sitting on some cloud. Your documents stay on your machine — always.",
              },
              {
                icon: (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                  </svg>
                ),
                title: "Blazing Fast",
                desc: "Static pages load instantly. No waiting for servers to spin up. Just click, convert, and download — it happens in seconds, not minutes.",
              },
              {
                icon: (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: "Always Free, No Catch",
                desc: "No sign-ups, no daily limits, no premium tiers. Every tool is yours to use, as much as you want, forever. This is how the web should work.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="text-center p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/40 dark:border-zinc-800/40 shadow-xs card-hover"
              >
                <div className="w-10 h-10 mx-auto mb-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-sm mb-2 text-zinc-800 dark:text-zinc-200">{feature.title}</h3>
                <p className="text-xs text-zinc-400 dark:text-zinc-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
