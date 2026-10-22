import { DocumentTitle } from "@/components/document-title";
import { copy } from "@/lib/site-content";

export async function PageMeta({ page, titleKey = "title" }: { page: string; titleKey?: string }) {
  const text = await copy(page);
  return <DocumentTitle title={text(titleKey)} description={text("document_description")} />;
}
