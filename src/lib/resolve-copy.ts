import type { Locale } from "@/i18n/locale";
import { entryFrench, findEntry } from "@/lib/cms-catalog";

export type SiteContentRow = {
  page: string;
  section: string | null;
  content_key: string;
  value_en: string | null;
  value_fr: string | null;
};

export function resolveCopy(
  pages: string[],
  key: string,
  rows: SiteContentRow[],
  locale: Locale,
  translate: (text: string) => string,
) {
  const entry = findEntry(pages, key);
  for (const page of pages) {
    const row = rows.find((item) => item.page === page && item.content_key === key);
    const stored = row ? (locale === "fr" ? row.value_fr : row.value_en) : null;
    if (typeof stored === "string" && stored.trim() !== "") return stored;
  }
  if (!entry) return translate(key);
  return locale === "fr" ? entryFrench(entry) : entry.en;
}
