import type { Metadata } from "next";
import { metaCopy } from "@/lib/site-content";
import { PageMeta } from "@/components/page-meta";
import { StudentPasswordReset } from "@/components/student-password-reset";

export async function generateMetadata(): Promise<Metadata> {
  const text = await metaCopy("forgot-password");
  return {
    title: text("title"),
    description: text("document_description"),
  };
}

export default function ForgotPasswordPage() {
  return (
    <>
      <PageMeta page="forgot-password" />
      <StudentPasswordReset />
    </>
  );
}
