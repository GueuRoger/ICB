import type { Metadata } from "next";
import { metaCopy } from "@/lib/site-content";
import { PageMeta } from "@/components/page-meta";
import { PaymentConfirmation } from "@/components/payment-confirmation";

export async function generateMetadata(): Promise<Metadata> {
  const text = await metaCopy("order-confirmation");
  return {
    title: text("title"),
    description: text("document_description"),
  };
}

export default function PaymentConfirmationPage() {
  return (
    <>
      <PageMeta page="order-confirmation" />
      <PaymentConfirmation />
    </>
  );
}
