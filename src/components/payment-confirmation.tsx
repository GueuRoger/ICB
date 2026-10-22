import { copy } from "@/lib/site-content";

const text = { fontFamily: "var(--font-montserrat)" } as const;

export async function PaymentConfirmation() {
  const c = await copy("order-confirmation", "shared");
  return (
    <div style={{ width: "min(1440px, 100%)", marginInline: "auto", containerType: "inline-size" }}>
      <div style={{ position: "relative", height: "calc(320px * (100cqw / 1440px))", overflow: "hidden" }}>
        <main
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 1440,
            height: 320,
            transform: "scale(calc(100cqw / 1440px))",
            transformOrigin: "top left",
            background: "#ffffff",
          }}
        >
          <h1
            className="absolute top-[25px] left-0 m-0 w-[1440px] text-center text-[32px] leading-[34px] font-bold text-[#061E38]"
            style={text}
          >
            {c("heading")}
          </h1>
          <p
            className="absolute top-[107px] left-[408px] m-0 w-[630px] text-[18px] leading-[26px] font-normal text-[#555B67]"
            style={{ fontFamily: "var(--font-barlow-condensed)" }}
          >
            {c("received")}
          </p>
          <p
            className="absolute top-[137px] left-[408px] m-0 w-[630px] text-[18px] leading-[26px] font-normal text-[#555B67]"
            style={{ fontFamily: "var(--font-barlow-condensed)" }}
          >
            {c("details")}
            <br />
            {c("email")}
          </p>
          <a
            href="/"
            className="absolute top-[235px] left-[613px] flex h-[40px] w-[214px] items-center justify-center bg-[#2251FF] text-[16px] leading-[18px] font-semibold text-white"
            style={{ fontFamily: "var(--font-inter)", letterSpacing: "0.001em" }}
          >
            {c("return_home")}
          </a>
        </main>
      </div>
    </div>
  );
}
