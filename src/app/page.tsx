import type { Metadata } from "next";
import { HomepageFrame } from "@/components/homepage-frame";
import { metaCopy } from "@/lib/site-content";

export async function generateMetadata(): Promise<Metadata> {
  const text = await metaCopy("home");
  return {
    title: text("document_title"),
    description: text("document_description"),
  };
}

export default function Home() {
  return <HomepageFrame />;
}
