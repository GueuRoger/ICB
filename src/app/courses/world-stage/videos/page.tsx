import type { Metadata } from "next";
import { metaCopy, copy } from "@/lib/site-content";
import { PageMeta } from "@/components/page-meta";
import { ProgramVideoLibrary } from "@/components/program-video-library";

export async function generateMetadata(): Promise<Metadata> {
  const text = await metaCopy("world-stage-videos");
  return {
    title: text("title"),
    description: text("document_description"),
  };
}

export default async function WorldStageVideosPage() {
  const text = await copy("world-stage-videos", "shared");

  return (
    <>
      <PageMeta page="world-stage-videos" />
      <ProgramVideoLibrary
        program="world-stage"
        playLabel={text("play")}
        loadingLabel={text("loading")}
        deniedLabel={text("denied")}
        myCourseLabel={text("nav_my_course")}
      />
    </>
  );
}
