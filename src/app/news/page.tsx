import type { Metadata } from "next";
import { NewsPage } from "@/components/news-page";
import { metaCopy } from "@/lib/site-content";

export async function generateMetadata(): Promise<Metadata> {
  const text = await metaCopy("news");
  return {
    title: text("title"),
    description: text("document_description"),
  };
}

export default function News() {
  return <NewsPage />;
}
