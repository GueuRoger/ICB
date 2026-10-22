import { copy } from "@/lib/site-content";

const text = { fontFamily: "var(--font-montserrat)" } as const;

export async function PasswordResetConfirmation() {
  const c = await copy("forgot-password-confirmation", "shared");
  return (
    <div style={{ width: "min(1440px, 100%)", marginInline: "auto", containerType: "inline-size" }}>
      <div style={{ position: "relative", height: "calc(283px * (100cqw / 1440px))", overflow: "hidden" }}>
        <main
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 1440,
            height: 283,
            transform: "scale(calc(100cqw / 1440px))",
            transformOrigin: "top left",
            background: "#ffffff",
          }}
        >
          <p
            className="absolute top-[60px] left-[202px] m-0 w-[900px] text-center text-[16px] leading-[22px] font-normal text-[#555B67]"
            style={text}
          >
            {c("received")}
          </p>
          <p
            className="absolute top-[98px] left-[202px] m-0 w-[900px] text-center text-[16px] leading-[22px] font-normal text-[#555B67]"
            style={text}
          >
            {c("sent")}
          </p>
          <a
            href="/"
            className="absolute top-[180px] left-[560px] flex h-[40px] w-[188px] items-center justify-center bg-[#2251FF] text-[16px] leading-[18px] font-semibold text-white"
            style={{ fontFamily: "var(--font-inter)", letterSpacing: "0.001em" }}
          >
            {c("return_home")}
          </a>
        </main>
      </div>
    </div>
  );
}
