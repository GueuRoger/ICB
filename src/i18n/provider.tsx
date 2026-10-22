"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { LOCALE_COOKIE, type Locale } from "@/i18n/locale";
import { translate } from "@/i18n/messages";
import { resolveCopy, type SiteContentRow } from "@/lib/resolve-copy";

type LocaleContextValue = {
  locale: Locale;
  t: (text: string) => string;
  setLocale: (locale: Locale) => void;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);
const ContentContext = createContext<SiteContentRow[]>([]);

function persistLocale(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale}; Path=/; Max-Age=31536000; SameSite=Lax`;
  try {
    localStorage.setItem(LOCALE_COOKIE, locale);
  } catch {
    // Storage can be blocked. The cookie still keeps the language.
  }
  document.documentElement.lang = locale;
}

export function LocaleProvider({
  locale,
  content,
  children,
}: {
  locale: Locale;
  content: SiteContentRow[];
  children: ReactNode;
}) {
  const router = useRouter();
  const [current, setCurrent] = useState(locale);

  useEffect(() => {
    setCurrent(locale);
    document.documentElement.lang = locale;
  }, [locale]);

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale: current,
      t: (text: string) => translate(current, text),
      setLocale: (next) => {
        persistLocale(next);
        setCurrent(next);
        router.refresh();
      },
    }),
    [current, router],
  );

  return (
    <LocaleContext.Provider value={value}>
      <ContentContext.Provider value={content}>{children}</ContentContext.Provider>
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  return useContext(LocaleContext)?.locale ?? "en";
}

export function useT() {
  const context = useContext(LocaleContext);
  return context?.t ?? ((text: string) => text);
}

export function useSetLocale() {
  return useContext(LocaleContext)?.setLocale ?? (() => {});
}

export function useCopy(...pages: string[]) {
  const rows = useContext(ContentContext);
  const locale = useLocale();
  const t = useT();
  return (key: string) => resolveCopy(pages, key, rows, locale, t);
}
