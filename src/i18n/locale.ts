export const LOCALE_COOKIE = "icb-lang";

export type Locale = "en" | "fr";

export function isLocale(value: string | undefined | null): value is Locale {
  return value === "en" || value === "fr";
}
