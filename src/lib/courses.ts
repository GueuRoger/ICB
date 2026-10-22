import { cache } from "react";
import { connection } from "next/server";
import type { Locale } from "@/i18n/locale";
import { getLocale, getT } from "@/i18n/server";
import { courseRecords, type CourseRecord } from "@/lib/cms-records";
import { supabase } from "@/lib/supabase";

export type CourseModuleView = {
  position: number;
  title: string;
  description: string;
};

export type CourseView = {
  slug: string;
  name: string;
  description: string;
  shortDescription: string;
  price: number;
  currency: string;
  thumbnailUrl: string;
  pdfUrl: string;
  modules: CourseModuleView[];
};

type CourseRow = {
  id: string;
  name_en: string | null;
  name_fr: string | null;
  description_en: string | null;
  description_fr: string | null;
  short_description_en: string | null;
  short_description_fr: string | null;
  price: number | string | null;
  currency: string | null;
  thumbnail_url: string | null;
  pdf_url?: string | null;
};

type ModuleRow = {
  title_en: string | null;
  title_fr: string | null;
  description_en: string | null;
  description_fr: string | null;
  position: number | null;
};

function pick(locale: Locale, en: string | null | undefined, fr: string | null | undefined, fallback: string) {
  const stored = locale === "fr" ? fr : en;
  if (typeof stored === "string" && stored.trim() !== "") return stored;
  return fallback;
}

function asPrice(value: number | string | null | undefined, fallback: number) {
  const number = typeof value === "number" ? value : typeof value === "string" ? Number(value) : Number.NaN;
  return Number.isFinite(number) ? number : fallback;
}

export { formatMoney } from "@/lib/money";

const courseColumns =
  "id, name_en, name_fr, description_en, description_fr, short_description_en, short_description_fr, price, currency, thumbnail_url";

export function coursePdfHref(value: unknown) {
  if (typeof value !== "string") return "";
  const trimmed = value.trim();
  if (!trimmed) return "";
  try {
    const url = new URL(trimmed);
    if (url.protocol !== "https:" && url.protocol !== "http:") return "";
    return url.href;
  } catch {
    return "";
  }
}

async function courseView(record: CourseRecord, locale: Locale, translate: (text: string) => string): Promise<CourseView> {
  const withPdf = await supabase
    .from("courses")
    .select(`${courseColumns}, pdf_url`)
    .eq("slug", record.slug)
    .limit(1);
  const result =
    withPdf.error && (withPdf.error.code === "42703" || withPdf.error.code === "PGRST204")
      ? await supabase.from("courses").select(courseColumns).eq("slug", record.slug).limit(1)
      : withPdf;
  const row = (result.data?.[0] ?? null) as CourseRow | null;

  let moduleRows: ModuleRow[] = [];
  if (row?.id) {
    const modules = await supabase
      .from("course_modules")
      .select("title_en, title_fr, description_en, description_fr, position")
      .eq("course_id", row.id)
      .order("position");
    if (modules.data?.length) moduleRows = modules.data as ModuleRow[];
  }

  const modules = moduleRows.length
    ? moduleRows.map((item, index) => ({
        position: item.position ?? index + 1,
        title: pick(locale, item.title_en, item.title_fr, translate(record.modules[index]?.title_en ?? "")),
        description: pick(
          locale,
          item.description_en,
          item.description_fr,
          translate(record.modules[index]?.description_en ?? ""),
        ),
      }))
    : record.modules.map((item) => ({
        position: item.position,
        title: translate(item.title_en),
        description: translate(item.description_en),
      }));

  return {
    slug: record.slug,
    name: pick(locale, row?.name_en, row?.name_fr, translate(record.name_en)),
    description: pick(locale, row?.description_en, row?.description_fr, translate(record.description_en)),
    shortDescription: pick(
      locale,
      row?.short_description_en,
      row?.short_description_fr,
      translate(record.short_description_en),
    ),
    price: asPrice(row?.price, record.price),
    currency: row?.currency?.trim() || record.currency,
    thumbnailUrl: row?.thumbnail_url?.trim() || record.thumbnail_url,
    pdfUrl: coursePdfHref(row?.pdf_url),
    modules,
  };
}

async function readCourse(slug: string) {
  const record = courseRecords.find((item) => item.slug === slug) ?? courseRecords[0];
  const [locale, translate] = await Promise.all([getLocale(), getT()]);
  return courseView(record, locale, translate);
}

export const loadCourse = cache(async (slug: string) => {
  await connection();
  return readCourse(slug);
});

export const loadCatalog = cache(async () => {
  await connection();
  const [locale, translate] = await Promise.all([getLocale(), getT()]);
  return Promise.all(courseRecords.map((record) => courseView(record, locale, translate)));
});
