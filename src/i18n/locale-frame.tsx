import type { ReactNode } from "react";
import { LocaleProvider } from "@/i18n/provider";
import { getLocale } from "@/i18n/server";
import { loadSiteContent } from "@/lib/site-content";

export async function LocaleFrame({ children }: { children: ReactNode }) {
  const [locale, content] = await Promise.all([getLocale(), loadSiteContent()]);
  return (
    <LocaleProvider locale={locale} content={content}>
      {children}
    </LocaleProvider>
  );
}
