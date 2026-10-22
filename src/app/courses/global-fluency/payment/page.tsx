import type { Metadata } from "next";
import { metaCopy } from "@/lib/site-content";
import { GlobalFluencyPayment } from "@/components/global-fluency-payment";

export async function generateMetadata(): Promise<Metadata> {
  const text = await metaCopy("cart");
  return {
    title: text("title"),
    description: text("document_description"),
  };
}

export default function GlobalFluencyPaymentPage() {
  return <GlobalFluencyPayment />;
}
