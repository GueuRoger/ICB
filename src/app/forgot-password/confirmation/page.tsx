import type { Metadata } from "next";
import { metaCopy } from "@/lib/site-content";
import { PageMeta } from "@/components/page-meta";
import { PasswordResetConfirmation } from "@/components/password-reset-confirmation";

export async function generateMetadata(): Promise<Metadata> {
  const text = await metaCopy("forgot-password-confirmation");
  return {
    title: text("title"),
    description: text("document_description"),
  };
}

export default function PasswordResetConfirmationPage() {
  return (
    <>
      <PageMeta page="forgot-password-confirmation" />
      <PasswordResetConfirmation />
    </>
  );
}
