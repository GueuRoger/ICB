import type { Metadata } from "next";
import { metaCopy } from "@/lib/site-content";
import { PageMeta } from "@/components/page-meta";
import { WorldStageApplication } from "@/components/world-stage-application";

export async function generateMetadata(): Promise<Metadata> {
  const text = await metaCopy("world-stage-apply");
  return {
    title: text("title"),
    description: text("document_description"),
  };
}

export default function WorldStageApply() {
  return (
    <>
      <PageMeta page="world-stage-apply" />
      <WorldStageApplication />
    </>
  );
}
