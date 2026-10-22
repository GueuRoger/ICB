import { DocumentTitle } from "@/components/document-title";
import { CartPage } from "@/components/cart-page";
import { loadCatalog } from "@/lib/courses";
import { readPaymentCopy } from "@/lib/payments";
import { copy } from "@/lib/site-content";

export async function GlobalFluencyPayment() {
  const [courses, text] = await Promise.all([loadCatalog(), copy("cart", "payments", "shared")]);
  return (
    <>
      <DocumentTitle title={text("title")} description={text("document_description")} />
      <CartPage
        courses={courses.map((course) => ({
          slug: course.slug,
          name: course.name,
          price: course.price,
        }))}
        labels={{
          title: text("title"),
          shopMore: text("shop_more"),
          products: text("column_products"),
          price: text("column_price"),
          quantity: text("column_quantity"),
          total: text("column_total"),
          delete: text("delete"),
          payWave: text("pay_wave"),
          payCard: text("pay_card"),
          image: text("product_image"),
        }}
        payment={readPaymentCopy(text)}
      />
    </>
  );
}
