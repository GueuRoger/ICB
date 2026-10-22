import type { Metadata } from "next";
import { getT } from "@/i18n/server";
import { WorldStagePage } from "@/components/world-stage-page";
import { metaCopy } from "@/lib/site-content";

export async function generateMetadata(): Promise<Metadata> {
  const [t, text] = await Promise.all([getT(), metaCopy("world-stage")]);
  return {
    title: t("World Stage"),
    description: text("document_description"),
  };
}

export default function WorldStage() {
  return <WorldStagePage />;
}
