import localFont from "next/font/local";
import { DocumentTitle } from "@/components/document-title";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { formatMoney, loadCourse } from "@/lib/courses";
import { copy } from "@/lib/site-content";

const signature = localFont({
  src: "../fonts/great-vibes-400.woff2",
  weight: "400",
  style: "normal",
});

const sans = { fontFamily: "var(--font-montserrat)" } as const;
const condensed = { fontFamily: "var(--font-barlow-condensed)" } as const;
const inter = { fontFamily: "var(--font-inter)", letterSpacing: "0.04em" } as const;

const offerings = [
  ["offer_1_title", "offer_1_body"],
  ["offer_2_title", "offer_2_body"],
  ["offer_3_title", "offer_3_body"],
  ["offer_4_title", "offer_4_body"],
  ["offer_5_title", "offer_5_body"],
  ["offer_6_title", "offer_6_body"],
] as const;

const overview = [
  { icon: "/icons/calendar-blue.svg", title: "overview_1_title", body: "overview_1_body" },
  { icon: "/icons/user-blue.svg", title: "overview_2_title", body: "overview_2_body" },
  { icon: "/icons/globe-blue.svg", title: "overview_3_title", body: "overview_3_body" },
  { icon: "/icons/lock-blue.svg", title: "overview_4_title", body: "overview_4_body" },
] as const;

async function ApplyButton({ className, label }: { className: string; label: string }) {
  return (
    <a
      href="/courses/world-stage/apply"
      className={`flex items-center justify-center gap-[10px] bg-[#2251FF] text-[13px] leading-[16px] font-semibold tracking-[0.08em] text-white uppercase ${className}`}
      style={inter}
    >
      {label}
      <img src="/icons/arrow-right-white.svg" alt="" width={18} height={18} className="h-[18px] w-[18px]" />
    </a>
  );
}

export async function WorldStagePage() {
  const [course, text] = await Promise.all([loadCourse("world-stage"), copy("world-stage", "shared")]);
  const c = text;
  const apply = c("apply");
  return (
    <>
    <div style={{ width: "min(1440px, 100%)", marginInline: "auto", containerType: "inline-size" }}>
      <div style={{ position: "relative", height: "calc(3072px * (100cqw / 1440px))", overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 1440,
          height: 3072,
          transform: "scale(calc(100cqw / 1440px))",
          transformOrigin: "top left",
          background: "#ffffff",
        }}
      >
        <DocumentTitle title={course.name} description={c("document_description")} />
        <SiteHeader />
        <main>
          <section className="absolute top-0 left-0 h-[1024px] w-[1440px]" aria-label={course.name}>
            <img
              src={c("hero_image")}
              alt={c("hero_alt")}
              width={1440}
              height={512}
              className="absolute top-[132px] left-0 h-[512px] w-[1440px] object-cover"
            />
            <h1 className="sr-only">{c("sr_heading")}</h1>
            <a
              href="/courses/world-stage/apply"
              aria-label={apply}
              className="absolute top-[470px] left-[36px] h-[40px] w-[248px]"
            />

            <img
              src={c("intro_image")}
              alt={c("intro_alt")}
              width={1672}
              height={941}
              className="absolute top-[678px] left-[32px] h-[312px] w-[698px] object-cover"
            />
            <img
              src="/icons/circle-play.svg"
              alt=""
              width={72}
              height={72}
              className="pointer-events-none absolute top-[798px] left-[345px] h-[72px] w-[72px]"
            />
            <p
              className="absolute top-[688px] left-[762px] m-0 text-[12px] leading-[16px] font-semibold tracking-[0.16em] text-[#1764FF] uppercase"
              style={sans}
            >
              {c("program_video")}
            </p>
            <span className="absolute top-[695px] left-[888px] h-[2px] w-[48px] bg-[#1764FF]" />
            <h2
              className="absolute top-[718px] left-[762px] m-0 w-[620px] text-[46px] leading-[42px] font-extrabold text-[#061E38] uppercase"
              style={condensed}
            >
              {c("intro_heading")}
            </h2>
            <p
              className="absolute top-[828px] left-[762px] m-0 w-[430px] text-[16px] leading-[24px] font-normal text-[#333333]"
              style={sans}
            >
              {c("intro_body")}
            </p>
            <p
              className="absolute top-[910px] left-[762px] m-0 text-[42px] leading-[48px] text-[#061E38]"
              style={{ fontFamily: signature.style.fontFamily }}
            >
              {c("signature")}
            </p>
            <p
              className="absolute top-[962px] left-[762px] m-0 text-[11px] leading-[14px] font-semibold tracking-[0.14em] text-[#333333] uppercase"
              style={sans}
            >
              {c("signature")}
            </p>
            <p
              className="absolute top-[980px] left-[762px] m-0 text-[11px] leading-[14px] font-medium tracking-[0.14em] text-[#8A8F98] uppercase"
              style={sans}
            >
              {c("founder")}
            </p>
          </section>

          <section className="absolute top-[1024px] left-0 h-[330px] w-[1440px] bg-white" aria-label={c("offerings")}>
            <p
              className="absolute top-[64px] left-[110px] m-0 text-[12px] leading-[16px] font-semibold tracking-[0.18em] text-[#1764FF] uppercase"
              style={sans}
            >
              {c("offerings")}
            </p>
            <span className="absolute top-[71px] left-[214px] h-[2px] w-[42px] bg-[#1764FF]" />
            <p
              className="absolute top-[52px] right-[48px] m-0 w-[280px] text-right text-[11px] leading-[16px] font-semibold tracking-[0.12em] text-[#1764FF] uppercase"
              style={sans}
            >
              {c("offerings_kicker_1")}
              <br />
              {c("offerings_kicker_2")}
            </p>
            {offerings.map((item, index) => {
              const center = 173 + index * 210.4;
              return (
                <div
                  key={item[0]}
                  className="absolute w-[170px] text-center"
                  style={{ left: center - 85, top: 220 }}
                >
                  <h3
                    className="m-0 min-h-[51px] text-[13px] leading-[17px] font-bold tracking-[0.04em] text-[#1764FF] uppercase"
                    style={sans}
                  >
                    {c(item[0])}
                  </h3>
                  <p className="mt-[8px] mb-0 text-[13px] leading-[18px] font-normal text-[#5c5c5c]" style={sans}>
                    {c(item[1])}
                  </p>
                </div>
              );
            })}
          </section>

          <section
            className="absolute top-[1354px] left-0 h-[1718px] w-[1440px] bg-[#D9D9D9]"
            aria-label={c("program_description_label")}
          >
            <p
              className="absolute top-[48px] left-[80px] m-0 text-[12px] leading-[16px] font-semibold tracking-[0.16em] text-[#1764FF] uppercase"
              style={sans}
            >
              {c("program_description_label")}
            </p>
            <span className="absolute top-[55px] left-[308px] h-[2px] w-[48px] bg-[#1764FF]" />
            <p
              className="absolute top-[128px] left-[80px] m-0 w-[900px] text-[16px] leading-[26px] font-normal text-[#333333]"
              style={sans}
            >
              {c("description_1")}
            </p>
            <p
              className="absolute top-[232px] left-[80px] m-0 w-[900px] text-[16px] leading-[26px] font-normal text-[#333333]"
              style={sans}
            >
              {c("description_2")}
            </p>
            <h2
              className="absolute top-[430px] left-[80px] m-0 text-[22px] leading-[28px] font-bold text-[#061E38]"
              style={sans}
            >
              {c("why_heading")}
            </h2>
            <p
              className="absolute top-[478px] left-[80px] m-0 w-[880px] text-[16px] leading-[26px] font-normal text-[#333333]"
              style={sans}
            >
              {c("why_body")}
            </p>
            <span className="absolute top-[582px] left-[80px] h-[2px] w-[56px] bg-[#1764FF]" />

            <article className="absolute top-[796px] left-[72px] h-[782px] w-[996px] bg-white px-[28px] pt-[28px]">
              <p
                className="m-0 text-[12px] leading-[16px] font-semibold tracking-[0.14em] text-[#1764FF] uppercase"
                style={sans}
              >
                {c("journey")}
              </p>
              <p className="mt-[8px] mb-[18px] w-[420px] text-[15px] leading-[22px] text-[#333333]" style={sans}>
                {c("journey_intro")}
              </p>
              <ol className="m-0 flex list-none flex-col gap-[10px] p-0">
                {course.modules.map((phase, index) => (
                  <li key={phase.title} className="flex h-[96px] items-center bg-[#F1F2F4] pr-[20px]">
                    <span
                      className="w-[72px] shrink-0 text-center text-[28px] leading-none font-bold text-[#1764FF]"
                      style={sans}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="mr-[16px] h-[64px] w-px bg-[#D0D3D8]" />
                    <span>
                      <span className="block text-[15px] leading-[20px] font-bold text-[#222222]" style={sans}>
                        {phase.title}
                      </span>
                      <span className="mt-[2px] block text-[13px] leading-[18px] font-normal text-[#5c5c5c]" style={sans}>
                        {phase.description}
                      </span>
                    </span>
                  </li>
                ))}
              </ol>
            </article>

            <aside className="absolute top-[796px] left-[1090px] h-[782px] w-[310px] bg-white px-[22px] pt-[28px]">
              <p
                className="m-0 inline-block bg-[#ECEDEF] px-[8px] py-[4px] text-[10px] leading-[14px] font-semibold tracking-[0.12em] text-[#1764FF] uppercase"
                style={sans}
              >
                {c("overview_label")}
              </p>
              <h2
                className="mt-[18px] mb-0 text-[40px] leading-[42px] font-extrabold text-[#061E38]"
                style={condensed}
              >
                {course.name}
              </h2>
              <p className="mt-[8px] mb-0 text-[14px] leading-[18px] font-semibold text-[#222222]" style={sans}>
                {c("overview_subtitle")}
              </p>
              <p className="mt-[10px] mb-0 text-[13px] leading-[18px] text-[#5c5c5c]" style={sans}>
                {c("overview_audience")}
              </p>
              <ul className="mt-[22px] mb-0 flex list-none flex-col gap-[16px] p-0">
                {overview.map((item) => (
                  <li key={item.title} className="flex items-center gap-[12px]">
                    <img src={item.icon} alt="" width={28} height={28} className="h-[28px] w-[28px]" />
                    <span>
                      <span
                        className="block text-[12px] leading-[16px] font-bold tracking-[0.06em] text-[#1764FF] uppercase"
                        style={sans}
                      >
                        {c(item.title)}
                      </span>
                      <span className="block text-[12px] leading-[16px] text-[#5c5c5c]" style={sans}>
                        {c(item.body)}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
              <p
                className="mt-[28px] mb-0 text-[11px] leading-[14px] font-semibold tracking-[0.14em] text-[#8A8F98] uppercase"
                style={sans}
              >
                {c("investment")}
              </p>
              <p className="mt-[6px] mb-0 text-[36px] leading-[40px] font-extrabold text-[#061E38]" style={condensed}>
                {formatMoney(course.price, c("currency_symbol_us"))}
              </p>
              <ApplyButton className="mt-[16px] h-[44px] w-full" label={apply} />
            </aside>
          </section>
        </main>
      </div>
      </div>
    </div>
    <SiteFooter />
    </>
  );
}
