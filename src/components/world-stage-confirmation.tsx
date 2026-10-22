import { copy } from "@/lib/site-content";

const text = { fontFamily: "var(--font-montserrat)" } as const;

export async function WorldStageConfirmation() {
  const c = await copy("world-stage-confirmation", "shared");
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
            className="absolute top-[86px] left-0 m-0 w-[1440px] text-center text-[40px] leading-[44px] font-bold text-[#061E38]"
            style={text}
          >
            {c("heading")}
          </h1>
          <p
            className="absolute top-[176px] left-0 m-0 w-[1440px] text-center text-[16px] leading-[24px] font-normal text-[#555B67]"
            style={text}
          >
            {c("received")}
          </p>
          <p
            className="absolute top-[208px] left-0 m-0 w-[1440px] text-center text-[16px] leading-[24px] font-normal text-[#555B67]"
            style={text}
          >
            {c("followup")}
          </p>
          <a
            href="/"
            className="absolute top-[256px] left-[613px] flex h-[40px] w-[214px] items-center justify-center bg-[#2251FF] text-[16px] leading-[18px] font-semibold text-white"
            style={{ fontFamily: "var(--font-inter)", letterSpacing: "0.001em" }}
          >
            {c("return_home")}
          </a>
        </main>
      </div>
    </div>
  );
}
