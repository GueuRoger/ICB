import type { Metadata } from "next";
import { metaCopy } from "@/lib/site-content";
import { PageMeta } from "@/components/page-meta";
import { StudentSignup } from "@/components/student-signup";

export async function generateMetadata(): Promise<Metadata> {
  const text = await metaCopy("signup");
  return {
    title: text("title"),
    description: text("document_description"),
  };
}

export default function SignupPage() {
  return (
    <>
      <PageMeta page="signup" />
      <StudentSignup />
    </>
  );
}
