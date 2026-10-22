import type { Metadata } from "next";
import { getT } from "@/i18n/server";
import { GlobalFluencyPage } from "@/components/global-fluency-page";
import { metaCopy } from "@/lib/site-content";

export async function generateMetadata(): Promise<Metadata> {
  const [t, text] = await Promise.all([getT(), metaCopy("global-fluency")]);
  return {
    title: t("Global Fluency"),
    description: text("document_description"),
  };
}

export default function GlobalFluency() {
  return <GlobalFluencyPage />;
}
