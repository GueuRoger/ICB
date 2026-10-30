import type { Metadata } from "next";
import { metaCopy, copy } from "@/lib/site-content";
import { PageMeta } from "@/components/page-meta";
import { ProgramVideoLibrary } from "@/components/program-video-library";

export async function generateMetadata(): Promise<Metadata> {
  const text = await metaCopy("global-fluency-videos");
  return {
    title: text("title"),
    description: text("document_description"),
  };
}

export default async function GlobalFluencyVideosPage() {
  const text = await copy("global-fluency-videos", "shared");

  return (
    <>
      <PageMeta page="global-fluency-videos" />
      <ProgramVideoLibrary
        program="global-fluency"
        playLabel={text("play")}
        loadingLabel={text("loading")}
        deniedLabel={text("denied")}
        myCourseLabel={text("nav_my_course")}
      />
    </>
  );
}
