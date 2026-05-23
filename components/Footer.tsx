import Link from "next/link";
import { converters, categories, SITE } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-zinc-200/40 dark:border-zinc-800/40 bg-zinc-50/20 dark:bg-zinc-950/20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {Object.entries(categories).map(([key, cat]) => (
            <div key={key}>
              <h3 className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-3">
                {cat.label}
              </h3>
              <ul className="space-y-2">
                {converters
                  .filter((c) => c.category === key)
                  .slice(0, 5)
                  .map((c) => (
                    <li key={c.slug}>
                      <Link
                        href={`/${c.slug}`}
                        className="text-xs text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"
                      >
                        {c.shortTitle}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-zinc-200/40 dark:border-zinc-800/40 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-400 dark:text-zinc-500">
          <p>
            &copy; {new Date().getFullYear()} {SITE.name}. All conversions run
            privately in your browser. Zero server uploads.
          </p>
        </div>
      </div>
    </footer>
  );
}
