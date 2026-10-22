import { cookies } from "next/headers";
import { isLocale, LOCALE_COOKIE, type Locale } from "@/i18n/locale";
import { translate } from "@/i18n/messages";

export async function getLocale(): Promise<Locale> {
  const jar = await cookies();
  const value = jar.get(LOCALE_COOKIE)?.value;
  return isLocale(value) ? value : "en";
}

export async function getT() {
  const locale = await getLocale();
  return (text: string) => translate(locale, text);
}
