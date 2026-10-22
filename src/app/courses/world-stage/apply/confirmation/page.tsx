import type { Metadata } from "next";
import { metaCopy } from "@/lib/site-content";
import { PageMeta } from "@/components/page-meta";
import { WorldStageConfirmation } from "@/components/world-stage-confirmation";

export async function generateMetadata(): Promise<Metadata> {
  const text = await metaCopy("world-stage-confirmation");
  return {
    title: text("title"),
    description: text("document_description"),
  };
}

export default function WorldStageConfirmationPage() {
  return (
    <>
      <PageMeta page="world-stage-confirmation" />
      <WorldStageConfirmation />
    </>
  );
}
