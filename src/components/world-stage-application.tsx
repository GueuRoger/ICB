import { copy } from "@/lib/site-content";

const sans = { fontFamily: "var(--font-montserrat)" } as const;

const fields = [
  [
    { name: "firstName", label: "first_name" },
    { name: "lastName", label: "last_name" },
  ],
  [
    { name: "email", label: "email", type: "email" },
    { name: "phone", label: "phone", type: "tel" },
  ],
  [
    { name: "company", label: "company" },
    { name: "title", label: "job" },
  ],
] as const;

function Field({
  name,
  label,
  type = "text",
}: {
  name: string;
  label: string;
  type?: string;
}) {
  return (
    <label className="block w-[315px]">
      <span className="block text-[15px] leading-[20px] text-white" style={sans}>
        {label}
      </span>
      <input
        name={name}
        type={type}
        className="mt-[12px] h-[28px] w-full border-0 border-b border-[#C1C7CD] bg-transparent text-[15px] text-white outline-none"
        style={sans}
      />
    </label>
  );
}

export async function WorldStageApplication() {
  const c = await copy("world-stage-apply");
  return (
    <div style={{ width: "min(1440px, 100%)", marginInline: "auto", containerType: "inline-size" }}>
      <div style={{ position: "relative", height: "calc(1024px * (100cqw / 1440px))", overflow: "hidden" }}>
        <main
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 1440,
            height: 1024,
            transform: "scale(calc(100cqw / 1440px))",
            transformOrigin: "top left",
            background: "#ffffff",
          }}
        >
          <form className="absolute top-0 left-[316px] h-[900px] w-[808px] bg-[#061E38]">
            <h1
              className="absolute top-[48px] left-0 m-0 w-[808px] text-center text-[42px] leading-[48px] font-bold text-white"
              style={sans}
            >
              {c("title")}
            </h1>

            {fields.map((row, index) => (
              <div key={row[0].name} className="absolute left-[69px] flex w-[671px] justify-between" style={{ top: 140 + index * 84 }}>
                <Field name={row[0].name} label={c(row[0].label)} type={"type" in row[0] ? row[0].type : "text"} />
                <Field name={row[1].name} label={c(row[1].label)} type={"type" in row[1] ? row[1].type : "text"} />
              </div>
            ))}

            <label className="absolute top-[392px] left-[69px] block w-[315px]">
              <span className="block text-[15px] leading-[20px] text-white" style={sans}>
                {c("industry")}
              </span>
              <span className="relative mt-[12px] block h-[28px] border-b border-[#C1C7CD]">
                <select
                  name="industry"
                  defaultValue=""
                  className="h-full w-full appearance-none bg-transparent text-[15px] text-white outline-none"
                  style={sans}
                  aria-label={c("industry")}
                >
                  <option value="" disabled hidden />
                </select>
                <img
                  src="/images/chevron.svg"
                  alt=""
                  width={15}
                  height={10}
                  className="pointer-events-none absolute top-[8px] right-[8px] h-[10px] w-[15px]"
                />
              </span>
            </label>
            <div className="absolute top-[392px] left-[425px] w-[315px]">
              <Field name="assignments" label={c("assignments")} />
            </div>

            <label className="absolute top-[500px] left-[69px] flex w-[670px] gap-[12px]">
              <input
                type="checkbox"
                name="phoneConsent"
                className="mt-[2px] h-[16px] w-[16px] shrink-0 appearance-none border border-white bg-transparent checked:bg-white"
              />
              <span className="text-[13px] leading-[18px] text-white" style={sans}>
                {c("phone_consent")}
              </span>
            </label>

            <label className="absolute top-[610px] left-[69px] flex w-[670px] gap-[12px]">
              <input
                type="checkbox"
                name="termsConsent"
                className="mt-[2px] h-[16px] w-[16px] shrink-0 appearance-none border border-white bg-transparent checked:bg-white"
              />
              <span className="text-[13px] leading-[18px] text-white" style={sans}>
                {c("terms_intro")}{" "}
                <span className="underline">{c("terms")}</span> {c("terms_and")}{" "}
                <span className="underline">{c("privacy")}</span>
                {c("terms_end")}
              </span>
            </label>

            <a
              href="/courses/world-stage/apply/confirmation"
              className="absolute top-[777px] left-[310px] flex h-[40px] w-[188px] items-center justify-center bg-[#2251FF] text-[16px] leading-[20px] font-semibold text-white"
              style={sans}
            >
              {c("submit")}
            </a>
          </form>
        </main>
      </div>
    </div>
  );
}
