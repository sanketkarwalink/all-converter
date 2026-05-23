import Link from "next/link";
import { converters, categories, type Category } from "@/lib/constants";

export function RelatedConverters({
  category,
  currentSlug,
}: {
  category: Category;
  currentSlug: string;
}) {
  const related = converters.filter(
    (c) => c.category === category && c.slug !== currentSlug
  );
  if (related.length === 0) return null;

  return (
    <section>
      <h2 className="text-xl font-bold mb-4">More {categories[category].label}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {related.map((c) => (
          <Link
            key={c.slug}
            href={`/${c.slug}`}
            className="flex items-center gap-3 p-4 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-sm hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all group"
          >
            <span className="text-2xl shrink-0">{c.icon}</span>
            <div>
              <p className="font-medium text-sm group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {c.shortTitle}
              </p>
              <p className="text-xs text-zinc-500 mt-0.5">{c.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
