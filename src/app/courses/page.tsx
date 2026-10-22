import type { Metadata } from "next";
import { CoursePage } from "@/components/course-page";
import { metaCopy } from "@/lib/site-content";

export async function generateMetadata(): Promise<Metadata> {
  const text = await metaCopy("courses");
  return {
    title: text("title"),
    description: text("document_description"),
  };
}

export default function Courses() {
  return <CoursePage />;
}
