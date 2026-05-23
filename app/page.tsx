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
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-900 text-white">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="hidden sm:block absolute top-20 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="hidden sm:block absolute bottom-10 right-1/4 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl" />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 py-20 sm:py-28 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-sm text-white/80 mb-6 backdrop-blur-sm border border-white/10 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            100% Free · No Sign-up · Your Data Never Leaves
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4 animate-slide-up">
            Your Files Stay
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-300 to-pink-300">
              Yours. Always.
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-indigo-200 max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up" style={{ animationDelay: "0.1s" }}>
            Convert documents, images, and data formats privately in your browser.
            No uploads. No servers. No account needed.
          </p>

          <div className="max-w-xl mx-auto relative animate-slide-up" style={{ animationDelay: "0.15s" }}>
            <div className="flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white/90 transition-all duration-200 focus-within:bg-white/15 focus-within:border-white/30">
              <svg className="w-5 h-5 shrink-0 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref={searchRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search converters... (e.g. PDF to Word)"
                className="flex-1 bg-transparent text-white placeholder-indigo-300 outline-none text-sm"
              />
              <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-md bg-white/10 text-[10px] font-medium text-indigo-300">
                ⌘K
              </kbd>
            </div>
            {filtered && (
              <div className="absolute mt-2 inset-x-0 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl max-h-72 overflow-y-auto z-10 animate-scale-in">
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
                      className="flex items-center gap-3 px-5 py-3.5 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
                    >
                      <span className="text-xl">{c.icon}</span>
                      <div className="text-left">
                        <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                          {c.shortTitle}
                        </p>
                        <p className="text-xs text-zinc-500">{c.description}</p>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 -mt-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Free Tools", value: "20", sub: "and counting", icon: "🛠️" },
            { label: "Processing", value: "100%", sub: "client-side private", icon: "🔒" },
            { label: "Server Uploads", value: "Zero", sub: "your data stays yours", icon: "✅" },
            { label: "Cost", value: "Free", sub: "no sign-up needed", icon: "🎉" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 text-center shadow-sm card-hover"
            >
              <span className="text-2xl block mb-1">{stat.icon}</span>
              <p className="text-2xl sm:text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                {stat.value}
              </p>
              <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 mt-1">
                {stat.label}
              </p>
              <p className="text-xs text-zinc-500 mt-0.5">{stat.sub}</p>
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
                <h2 className="text-2xl font-bold">{cat.label}</h2>
                <div className="flex-1 h-px bg-gradient-to-r from-zinc-200 dark:from-zinc-800 to-transparent" />
                <span className="text-sm text-zinc-500">{items.length} tools</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((c, i) => (
                  <Link
                    key={c.slug}
                    href={`/${c.slug}`}
                    className="group relative p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 card-hover overflow-hidden"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    {popular.includes(c.slug) && (
                      <span className="absolute top-3 right-3 text-[10px] font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-2 py-0.5 rounded-full">
                        Popular
                      </span>
                    )}
                    <div className="text-3xl mb-3 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300">
                      {c.icon}
                    </div>
                    <h3 className="font-semibold text-lg mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {c.shortTitle}
                    </h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                      {c.description}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </section>

      <section className="bg-gradient-to-b from-zinc-50 dark:from-zinc-900/30 to-transparent border-t border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">
              Designed for Peace of Mind
            </h2>
            <p className="text-zinc-500 max-w-xl mx-auto">
              Every tool is built with privacy, speed, and simplicity at its core.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                ),
                title: "Your Files Never Leave",
                desc: "Every conversion runs right here in your browser. No uploads, no servers, no copies sitting on some cloud. Your documents stay on your machine — always.",
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                  </svg>
                ),
                title: "Blazing Fast",
                desc: "Static pages load instantly. No waiting for servers to spin up. Just click, convert, and download — it happens in seconds, not minutes.",
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: "Always Free, No Catch",
                desc: "No sign-ups, no daily limits, no premium tiers. Every tool is yours to use, as much as you want, forever. This is how the web should work.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="text-center p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm card-hover"
              >
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
