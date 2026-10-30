import type { Metadata } from "next";
import { metaCopy } from "@/lib/site-content";
import { PageMeta } from "@/components/page-meta";
import { MyCoursePage } from "@/components/my-course-page";

export async function generateMetadata(): Promise<Metadata> {
  const text = await metaCopy("my-course");
  return {
    title: text("title"),
    description: text("document_description"),
  };
}

export default function MyCourseRoute() {
  return (
    <>
      <PageMeta page="my-course" />
      <MyCoursePage />
    </>
  );
}
