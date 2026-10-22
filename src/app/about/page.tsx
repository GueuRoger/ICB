import type { Metadata } from "next";
import { AboutPage } from "@/components/about-page";
import { metaCopy } from "@/lib/site-content";

export async function generateMetadata(): Promise<Metadata> {
  const text = await metaCopy("about");
  return {
    title: text("title"),
    description: text("document_description"),
  };
}

export default function About() {
  return <AboutPage />;
}
