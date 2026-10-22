import { cache } from "react";
import { connection } from "next/server";
import { getLocale, getT } from "@/i18n/server";
import { resolveCopy, type SiteContentRow } from "@/lib/resolve-copy";
import { supabase } from "@/lib/supabase";

export type { SiteContentRow };

async function readSiteContent(): Promise<SiteContentRow[]> {
  const { data, error } = await supabase
    .from("site_content")
    .select("page, section, content_key, value_en, value_fr");

  if (error || !data) return [];
  return data;
}

export const loadSiteContent = cache(async (): Promise<SiteContentRow[]> => {
  await connection();
  return readSiteContent();
});

export async function copy(...pages: string[]) {
  const [rows, locale, translate] = await Promise.all([loadSiteContent(), getLocale(), getT()]);
  return (key: string) => resolveCopy(pages, key, rows, locale, translate);
}

export async function metaCopy(...pages: string[]) {
  const [locale, translate] = await Promise.all([getLocale(), getT()]);
  return (key: string) => resolveCopy(pages, key, [], locale, translate);
}

export async function siteText(
  page: string,
  contentKey: string,
  fallback: string,
  translate: (text: string) => string,
) {
  const [rows, locale] = await Promise.all([loadSiteContent(), getLocale()]);
  const row = rows.find((item) => item.page === page && item.content_key === contentKey);
  const stored = row ? (locale === "fr" ? row.value_fr : row.value_en) : null;
  if (typeof stored === "string" && stored.trim() !== "") return stored;
  return translate(fallback);
}
