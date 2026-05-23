import Link from "next/link";
import { converters, categories, SITE } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {Object.entries(categories).map(([key, cat]) => (
            <div key={key}>
              <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 mb-3">
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
                        className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                      >
                        {c.shortTitle}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-zinc-200 dark:border-zinc-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-zinc-500 dark:text-zinc-500">
          <p>
            &copy; {new Date().getFullYear()} {SITE.name}. All conversions run
            in your browser — zero server uploads.
          </p>
        </div>
      </div>
    </footer>
  );
}
