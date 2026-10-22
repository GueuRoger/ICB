import { CheckoutPayButton } from "@/components/checkout-pay-button";
import { CheckoutSummary } from "@/components/checkout-summary";
import { loadCatalog } from "@/lib/courses";
import { readPaymentCopy } from "@/lib/payments";
import { copy } from "@/lib/site-content";

const text = { fontFamily: "var(--font-montserrat)" } as const;

const field = {
  height: 56,
  border: "none",
  borderRadius: 10,
  background: "#D9D9D9",
  color: "#333333",
  fontSize: 16,
  padding: "0 16px",
  ...text,
} as const;

function TextField({
  top,
  left,
  width,
  placeholder,
  type = "text",
}: {
  top: number;
  left: number;
  width: number;
  placeholder: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      aria-label={placeholder}
      className="absolute"
      style={{ ...field, top, left, width }}
    />
  );
}

export async function CheckoutPage() {
  const [courses, c] = await Promise.all([loadCatalog(), copy("checkout", "cart", "payments", "shared")]);
  const payment = readPaymentCopy(c);
  return (
    <>
      <div style={{ width: "50%", containerType: "inline-size" }}>
        <div style={{ position: "relative", height: "calc(1755px * (100cqw / 720px))" }}>
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: 720,
              height: 1755,
              transform: "scale(calc(100cqw / 720px))",
              transformOrigin: "top left",
              background: "#061E38",
            }}
          >
            <section className="absolute top-0 left-0 h-[1024px] w-[720px]" aria-label={c("contact_payment")}>
              <h1 className="absolute top-[23px] left-[19px] m-0 text-[24px] leading-[30px] font-bold text-white" style={text}>
                {c("contact")}
              </h1>
              <input
                type="email"
                placeholder={c("email")}
                aria-label={c("email")}
                className="absolute top-[78px] left-[17px] w-[665px]"
                style={field}
              />
              <label className="absolute top-[172px] left-[18px] flex w-[670px] gap-[12px] text-[14px] leading-[20px] text-white" style={text}>
                <input type="checkbox" className="mt-[2px] h-[16px] w-[16px] flex-none accent-white" />
                <span>
                  {c("terms_intro")}{" "}
                  <span className="underline">{c("terms")}</span> {c("terms_and")}{" "}
                  <span className="underline">{c("privacy")}</span>
                  {c("terms_end")}
                </span>
              </label>
              <h2 className="absolute top-[340px] left-[19px] m-0 text-[24px] leading-[30px] font-bold text-white" style={text}>
                {c("payment")}
              </h2>
              <p className="absolute top-[391px] left-[18px] m-0 text-[14px] leading-[18px] font-semibold text-white" style={text}>
                {c("secure")}
              </p>
              <div className="absolute top-[433px] left-[17px] h-[319px] w-[665px] rounded-[10px] bg-[#D9D9D9]">
                <p className="absolute top-[20px] left-[16px] m-0 text-[14px] leading-[18px] text-[#333333]" style={text}>
                  {c("credit_card")}
                </p>
                <img src={c("card_mastercard_image")} alt={c("card_mastercard_alt")} width={69} height={43} className="absolute top-[16px] left-[454px] h-[43px] w-[69px]" />
                <img src={c("card_visa_image")} alt={c("card_visa_alt")} width={90} height={48} className="absolute top-[14px] left-[557px] h-[48px] w-[90px]" />
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="cc-number"
                  placeholder={c("card_number")}
                  aria-label={c("card_number")}
                  className="absolute top-[85px] left-[12px] w-[635px]"
                  style={{ ...field, background: "#FFFFFF", paddingRight: 40 }}
                />
                <img src="/icons/lock.svg" alt="" width={16} height={18} className="absolute top-[104px] left-[604px] h-[18px] w-[16px]" />
                <input
                  type="text"
                  autoComplete="cc-exp"
                  placeholder={c("expiration")}
                  aria-label={c("expiration")}
                  className="absolute top-[161px] left-[12px] w-[396px]"
                  style={{ ...field, background: "#FFFFFF" }}
                />
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="cc-csc"
                  placeholder={c("security")}
                  aria-label={c("security")}
                  className="absolute top-[161px] left-[438px] w-[209px]"
                  style={{ ...field, background: "#FFFFFF" }}
                />
                <input
                  type="text"
                  autoComplete="cc-name"
                  placeholder={c("name_on_card")}
                  aria-label={c("name_on_card")}
                  className="absolute top-[237px] left-[12px] w-[635px]"
                  style={{ ...field, background: "#FFFFFF" }}
                />
              </div>
            </section>

            <section className="absolute left-0 h-[1024px] w-[720px]" style={{ top: 731 }} aria-label={c("billing")}>
              <h2 className="absolute top-[42px] left-[25px] m-0 text-[28px] leading-[34px] font-bold text-white" style={text}>
                {c("billing")}
              </h2>
              <div className="absolute top-[96px] left-[23px] flex h-[56px] w-[665px] items-center rounded-[10px] bg-[#D9D9D9] px-[16px]" style={text}>
                <span className="flex flex-col">
                  <span className="text-[12px] leading-[14px] text-[#555555]">{c("region")}</span>
                  <span className="text-[16px] leading-[20px] text-[#333333]">{c("country")}</span>
                </span>
                <img src="/images/chevron.svg" alt="" width={12} height={8} className="ml-auto h-[8px] w-[12px]" />
              </div>
              <TextField top={177} left={23} width={306} placeholder={c("first_name")} />
              <TextField top={177} left={382} width={306} placeholder={c("last_name")} />
              <TextField top={258} left={23} width={665} placeholder={c("address")} />
              <TextField top={339} left={23} width={665} placeholder={c("apartment")} />
              <TextField top={420} left={23} width={665} placeholder={c("city")} />
              <TextField top={501} left={23} width={665} placeholder={c("phone")} type="tel" />
              <label className="absolute top-[612px] left-[24px] flex w-[660px] gap-[12px] text-[14px] leading-[20px] text-white" style={text}>
                <input type="checkbox" className="mt-[2px] h-[16px] w-[16px] flex-none accent-white" />
                <span>
                  {c("phone_consent")}
                </span>
              </label>
              <CheckoutPayButton
                label={c("pay_now")}
                courses={courses.map((course) => ({ slug: course.slug, name: course.name }))}
                payment={payment}
              />
            </section>
          </div>
        </div>
      </div>

      <aside
        aria-label={c("summary")}
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          zIndex: 20,
          width: "50%",
          height: "100vh",
          overflow: "hidden",
          containerType: "inline-size",
          background: "#D9D9D9",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 720,
            height: 1024,
            transform: "scale(calc(100cqw / 720px))",
            transformOrigin: "top left",
            background: "#D9D9D9",
          }}
        >
          <CheckoutSummary courses={courses.map((course) => ({ slug: course.slug, name: course.name, price: course.price }))} image={c("product_image")} totalLabel={c("total")} currencySymbol={payment.currencySymbol} />
        </div>
      </aside>
    </>
  );
}
