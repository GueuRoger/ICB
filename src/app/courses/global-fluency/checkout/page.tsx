import type { Metadata } from "next";
import { metaCopy } from "@/lib/site-content";
import { PageMeta } from "@/components/page-meta";
import { CheckoutPage } from "@/components/checkout-page";

export async function generateMetadata(): Promise<Metadata> {
  const text = await metaCopy("checkout");
  return {
    title: text("title"),
    description: text("document_description"),
  };
}

export default function GlobalFluencyCheckoutPage() {
  return (
    <>
      <PageMeta page="checkout" />
      <CheckoutPage />
    </>
  );
}
