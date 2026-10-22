import type { Metadata } from "next";
import { StudentLogin } from "@/components/student-login";
import { metaCopy } from "@/lib/site-content";

export async function generateMetadata(): Promise<Metadata> {
  const text = await metaCopy("login");
  return {
    title: text("title"),
    description: text("document_description"),
  };
}

export default function LoginPage() {
  return <StudentLogin />;
}
