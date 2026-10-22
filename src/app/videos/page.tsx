import type { Metadata } from "next";
import { metaCopy } from "@/lib/site-content";
import { PageMeta } from "@/components/page-meta";
import { StudentVideos } from "@/components/student-videos";

export async function generateMetadata(): Promise<Metadata> {
  const text = await metaCopy("videos");
  return {
    title: text("title"),
    description: text("document_description"),
  };
}

export default function VideosPage() {
  return (
    <>
      <PageMeta page="videos" />
      <StudentVideos />
    </>
  );
}
