import { cache } from "react";
import { connection } from "next/server";
import { getLocale, getT } from "@/i18n/server";
import { newsRecord } from "@/lib/cms-records";
import { resolveCopy } from "@/lib/resolve-copy";
import { loadSiteContent } from "@/lib/site-content";
import { supabase } from "@/lib/supabase";

export type NewsItem = {
  id: string;
  image: string;
  imageAlt: string;
  title: string;
  date: string;
  description: string;
  content: string;
};

export const newsItems: NewsItem[] = [
  {
    id: "black-friday-sale",
    image: "/images/news-black-friday.png",
    imageAlt: newsRecord.image_alt_en,
    title: newsRecord.title_en,
    date: "",
    description: newsRecord.summary_en,
    content: "",
  },
];

type NewsRow = {
  slug: string;
  title_en: string | null;
  title_fr: string | null;
  summary_en: string | null;
  summary_fr: string | null;
  image_url: string | null;
  is_published: boolean | null;
  published_at: string | null;
};

export const loadNews = cache(async (): Promise<NewsItem[]> => {
  await connection();
  const [locale, t, rows] = await Promise.all([getLocale(), getT(), loadSiteContent()]);
  const imageAlt = resolveCopy(["news"], "image_alt", rows, locale, t);
  const fallback = newsItems.map((item) => ({
    ...item,
    title: t(item.title),
    description: t(item.description),
    imageAlt,
    content: t(item.content),
  }));

  const { data, error } = await supabase
    .from("news")
    .select("slug, title_en, title_fr, summary_en, summary_fr, image_url, is_published, published_at, created_at")
    .order("created_at", { ascending: true });

  if (error || !data?.length) return fallback;

  return (data as NewsRow[])
    .filter((row) => row.is_published !== false)
    .map((row) => {
      const storedTitle = locale === "fr" ? row.title_fr : row.title_en;
      const storedSummary = locale === "fr" ? row.summary_fr : row.summary_en;
      const known = newsItems.find((item) => item.id === row.slug);
      const title = storedTitle?.trim() || (known ? t(known.title) : "");
      return {
        id: row.slug,
        image: row.image_url?.trim() || known?.image || newsRecord.image_url,
        imageAlt: imageAlt || (known ? t(known.imageAlt) : title),
        title,
        date: row.published_at ? row.published_at.slice(0, 10) : "",
        description: storedSummary?.trim() || (known ? t(known.description) : ""),
        content: "",
      };
    });
});
