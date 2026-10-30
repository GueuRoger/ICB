import type { ReactNode } from "react";
import { DocumentTitle } from "@/components/document-title";
import { GlobalFluencyIntroMedia } from "@/components/global-fluency-intro-media";
import { GlobalFluencyWhyBody } from "@/components/global-fluency-why-body";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { formatMoney, loadCourse } from "@/lib/courses";
import { copy } from "@/lib/site-content";

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

/** Body copy: height follows content; never clip or clamp. */
const bodyClass =
  "m-0 h-auto max-h-none overflow-visible text-[16px] leading-[26px] font-normal text-[#333333]";

function HeaderFrame({ children }: { children: ReactNode }) {
  return (
    <div style={{ width: "min(1440px, 100%)", marginInline: "auto", containerType: "inline-size" }}>
      <div style={{ position: "relative", height: "calc(132px * (100cqw / 1440px))", overflow: "hidden" }}>
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 1440,
            height: 132,
            transform: "scale(calc(100cqw / 1440px))",
            transformOrigin: "top left",
            background: "#061E38",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

function ApplyButton({ className, label }: { className: string; label: string }) {
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

/** One CMS headline string; white prefix + blue remainder (EN: 3 words, FR: 4). */
function WorldStageHeadline({ text }: { text: string }) {
  const trimmed = text.trim();
  if (!trimmed) return null;
  const whiteCount = /^Donnez\b/i.test(trimmed) ? 4 : 3;
  const words = trimmed.split(/\s+/);
  const lead = words.slice(0, whiteCount).join(" ");
  const emphasis = words.slice(whiteCount).join(" ");
  return (
    <>
      <span className="block h-auto max-h-none overflow-visible break-words text-left">{lead}</span>
      {emphasis ? (
        <span className="block h-auto min-w-0 w-full overflow-visible break-words text-left text-[#1764FF]">
          {emphasis}
          <span
            className="ml-3 inline-block h-[2px] w-[37px] shrink-0 align-middle bg-[#1764FF]"
            aria-hidden="true"
          />
        </span>
      ) : null}
    </>
  );
}

export async function WorldStagePage() {
  const [course, text] = await Promise.all([loadCourse("world-stage"), copy("world-stage", "shared")]);
  const c = text;
  const apply = c("apply");
  const headline = c("sr_heading");
  const heroImageRaw = c("hero_image");
  // Prefer the text-free Figma extract until CMS hero_image is updated via SQL.
  const heroImage =
    heroImageRaw.endsWith("/world-stage-hero.png") || heroImageRaw === "/images/world-stage-hero.png"
      ? "/images/world-stage-hero-bg.png"
      : heroImageRaw;

  return (
    <>
      <HeaderFrame>
        <SiteHeader />
      </HeaderFrame>

      <div className="world-stage-page box-border mx-auto h-auto w-full max-w-[1440px] overflow-visible bg-white">
        <DocumentTitle title={course.name} description={c("document_description")} />
        <main className="flex h-auto flex-col overflow-visible">
          <section className="relative flex h-auto flex-col overflow-visible" aria-label={course.name}>
            <div className="relative isolate flex h-auto min-h-[518px] w-full flex-col overflow-visible">
              <img
                src={heroImage}
                alt={c("hero_alt")}
                width={1440}
                height={518}
                className="absolute inset-0 -z-10 h-full w-full object-cover object-center"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(6,20,40,0.72)_0%,rgba(6,20,40,0.35)_42%,rgba(6,20,40,0.2)_58%,rgba(6,20,40,0.55)_100%)]"
              />

              <div className="box-border flex h-auto min-h-[518px] w-full flex-col justify-between gap-10 overflow-visible px-5 py-10 sm:px-9 sm:py-12 lg:px-[35px] lg:py-10">
                <div className="flex h-auto w-full flex-col gap-10 overflow-visible lg:flex-row lg:items-end lg:justify-between lg:gap-10">
                  <div className="flex h-auto min-w-0 w-full max-w-[680px] flex-col gap-5 overflow-visible sm:gap-6 lg:max-w-[min(680px,calc(100%-300px))]">
                    <div className="flex h-auto items-center gap-3 overflow-visible">
                      <span className="h-[2px] w-[37px] shrink-0 bg-[#E5C45B]" aria-hidden="true" />
                      <p
                        className="m-0 h-auto max-h-none overflow-visible text-[11px] leading-[16px] font-semibold tracking-[0.24em] text-[#E5C45B]"
                        style={inter}
                      >
                        {c("hero_tagline")}
                      </p>
                    </div>

                    <h1
                      className="m-0 flex h-auto max-h-none w-full max-w-[600px] flex-col gap-3 overflow-visible text-left text-[36px] leading-[1.1] font-black text-white sm:text-[48px] sm:leading-[1.1]"
                      style={condensed}
                      aria-label={headline}
                    >
                      <WorldStageHeadline text={headline} />
                    </h1>

                    <p
                      className="m-0 h-auto max-h-none w-full max-w-[600px] overflow-visible text-[15px] leading-[24px] font-semibold text-[#F2F4F7] sm:text-[16px]"
                      style={inter}
                    >
                      {c("hero_body")}
                    </p>

                    <ApplyButton
                      className="mt-2 h-[40px] w-full max-w-[248px] shrink-0"
                      label={apply}
                    />
                  </div>

                  <div className="flex h-auto w-full max-w-[280px] shrink-0 flex-col items-start gap-3 overflow-visible lg:items-center">
                    <p
                      className="m-0 h-auto max-h-none overflow-visible text-left text-[13px] leading-[24px] font-semibold tracking-[0.22em] text-white uppercase sm:text-[14px] lg:text-center"
                      style={inter}
                    >
                      {c("hero_callout")}
                    </p>
                    <span className="h-[2px] w-[62px] bg-white lg:mx-auto" aria-hidden="true" />
                  </div>
                </div>

                <ul className="m-0 flex h-auto list-none flex-wrap items-center gap-x-4 gap-y-2 overflow-visible p-0">
                  {[c("hero_footer_1"), c("hero_footer_2"), c("hero_footer_3")].map((label, index) => (
                    <li key={label} className="flex h-auto items-center gap-4 overflow-visible">
                      {index > 0 ? (
                        <span className="h-[18px] w-px shrink-0 bg-[#E5C45B]" aria-hidden="true" />
                      ) : null}
                      <span
                        className="block h-auto overflow-visible text-[9px] leading-[12px] font-medium tracking-[0.05em] text-white uppercase"
                        style={inter}
                      >
                        {label}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex h-auto flex-col items-start gap-8 overflow-visible px-[20px] py-10 sm:px-[32px] lg:flex-row lg:gap-[32px] lg:px-[32px] lg:py-12">
              <GlobalFluencyIntroMedia
                imageSrc={c("intro_image")}
                imageAlt={c("intro_alt")}
                videoSrc={c("intro_video")}
                playLabel={c("intro_play")}
                className="relative w-full max-w-[698px] shrink-0 overflow-visible"
                mediaClassName="block h-auto w-full object-contain"
                playClassName="pointer-events-none absolute top-1/2 left-1/2 h-[72px] w-[72px] -translate-x-1/2 -translate-y-1/2"
              />

              <div className="flex h-auto w-full max-w-[620px] flex-col gap-4 overflow-visible">
                <div className="flex items-center gap-3">
                  <p
                    className="m-0 text-[12px] leading-[16px] font-semibold tracking-[0.16em] text-[#1764FF] uppercase"
                    style={sans}
                  >
                    {c("program_video")}
                  </p>
                  <span className="h-[2px] w-[48px] bg-[#1764FF]" />
                </div>
                <h2
                  className="m-0 h-auto max-h-none overflow-visible text-[36px] leading-[40px] font-extrabold text-[#061E38] uppercase sm:text-[46px] sm:leading-[42px]"
                  style={condensed}
                >
                  {c("intro_heading")}
                </h2>
                <p className={`${bodyClass} max-w-[430px]`} style={sans}>
                  {c("intro_body")}
                </p>
              </div>
            </div>
          </section>

          <section
            className="flex h-auto flex-col gap-10 overflow-visible bg-white px-[20px] py-12 sm:px-[48px] sm:py-16"
            aria-label={c("offerings")}
          >
            <div className="flex h-auto flex-wrap items-start justify-between gap-4 overflow-visible">
              <div className="flex items-center gap-3">
                <p
                  className="m-0 text-[12px] leading-[16px] font-semibold tracking-[0.18em] text-[#1764FF] uppercase"
                  style={sans}
                >
                  {c("offerings")}
                </p>
                <span className="h-[2px] w-[42px] bg-[#1764FF]" />
              </div>
              <p
                className="m-0 max-w-[280px] text-right text-[11px] leading-[16px] font-semibold tracking-[0.12em] text-[#1764FF] uppercase"
                style={sans}
              >
                {c("offerings_kicker_1")}
                <br />
                {c("offerings_kicker_2")}
              </p>
            </div>
            <div className="grid h-auto grid-cols-1 gap-8 overflow-visible sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
              {offerings.map((item) => (
                <div key={item[0]} className="flex h-auto flex-col items-center gap-2 overflow-visible text-center">
                  <h3
                    className="m-0 h-auto max-h-none overflow-visible text-[13px] leading-[17px] font-bold tracking-[0.04em] text-[#1764FF] uppercase"
                    style={sans}
                  >
                    {c(item[0])}
                  </h3>
                  <p
                    className="m-0 h-auto max-h-none overflow-visible text-[13px] leading-[18px] font-normal text-[#5c5c5c]"
                    style={sans}
                  >
                    {c(item[1])}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section
            className="flex h-auto flex-col gap-10 overflow-visible bg-[#D9D9D9] px-[20px] py-12 sm:px-[48px] sm:py-16 lg:px-[80px]"
            aria-label={c("program_description_label")}
          >
            <div className="flex h-auto max-h-none w-full max-w-[900px] flex-col gap-8 overflow-visible">
              <div className="flex items-center gap-3">
                <p
                  className="m-0 text-[12px] leading-[16px] font-semibold tracking-[0.16em] text-[#1764FF] uppercase"
                  style={sans}
                >
                  {c("program_description_label")}
                </p>
                <span className="h-[2px] w-[48px] bg-[#1764FF]" />
              </div>
              <div className="flex h-auto max-h-none flex-col gap-5 overflow-visible">
                <GlobalFluencyWhyBody text={c("description_1")} />
                <GlobalFluencyWhyBody text={c("description_2")} />
              </div>
              <h3
                className="m-0 h-auto max-h-none overflow-visible text-[20px] leading-[28px] font-normal text-[#333333]"
                style={sans}
              >
                {c("why_heading")}
              </h3>
              <GlobalFluencyWhyBody text={c("why_body")} />
              <span className="h-[2px] w-[56px] bg-[#1764FF]" />
            </div>

            <div className="flex h-auto flex-col gap-6 overflow-visible lg:flex-row lg:items-start lg:gap-6">
              <article className="box-border flex h-auto max-h-none w-full flex-col overflow-visible bg-white px-[28px] pt-[28px] pb-8 lg:max-w-[996px]">
                <p
                  className="m-0 text-[12px] leading-[16px] font-semibold tracking-[0.14em] text-[#1764FF] uppercase"
                  style={sans}
                >
                  {c("journey")}
                </p>
                <p className="mt-[8px] mb-[18px] h-auto max-w-[420px] overflow-visible text-[15px] leading-[22px] text-[#333333]" style={sans}>
                  {c("journey_intro")}
                </p>
                <ol className="m-0 flex h-auto list-none flex-col gap-[10px] overflow-visible p-0">
                  {course.modules.map((phase, index) => (
                    <li
                      key={phase.title}
                      className="flex h-auto min-h-[96px] items-center gap-0 overflow-visible bg-[#F1F2F4] py-3 pr-[20px]"
                    >
                      <span
                        className="w-[72px] shrink-0 text-center text-[28px] leading-none font-bold text-[#1764FF]"
                        style={sans}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="mr-[16px] h-[64px] w-px shrink-0 self-center bg-[#D0D3D8]" />
                      <span className="min-w-0 flex-1 overflow-visible py-1">
                        <span
                          className="block h-auto max-h-none overflow-visible text-[15px] leading-[20px] font-bold text-[#222222]"
                          style={sans}
                        >
                          {phase.title}
                        </span>
                        <span
                          className="mt-[2px] block h-auto max-h-none overflow-visible text-[13px] leading-[18px] font-normal text-[#5c5c5c]"
                          style={sans}
                        >
                          {phase.description}
                        </span>
                      </span>
                    </li>
                  ))}
                </ol>
              </article>

              <aside className="box-border flex h-auto max-h-none w-full flex-col overflow-visible bg-white px-[22px] pt-[28px] pb-8 lg:w-[310px] lg:shrink-0">
                <p
                  className="m-0 inline-block self-start bg-[#ECEDEF] px-[8px] py-[4px] text-[10px] leading-[14px] font-semibold tracking-[0.12em] text-[#1764FF] uppercase"
                  style={sans}
                >
                  {c("overview_label")}
                </p>
                <h2
                  className="mt-[18px] mb-0 block h-auto max-h-none w-full overflow-visible break-words text-[32px] leading-[1.2] font-extrabold text-[#061E38] sm:text-[40px]"
                  style={condensed}
                >
                  {course.name}
                </h2>
                <p
                  className="mt-[8px] mb-0 h-auto max-h-none overflow-visible text-[14px] leading-[18px] font-semibold text-[#222222]"
                  style={sans}
                >
                  {c("overview_subtitle")}
                </p>
                <p
                  className="mt-[10px] mb-0 h-auto max-h-none overflow-visible text-[13px] leading-[18px] text-[#5c5c5c]"
                  style={sans}
                >
                  {c("overview_audience")}
                </p>
                <ul className="mt-[22px] mb-0 flex h-auto list-none flex-col gap-[16px] overflow-visible p-0">
                  {overview.map((item) => (
                    <li key={item.title} className="flex h-auto items-start gap-[12px] overflow-visible">
                      <img src={item.icon} alt="" width={28} height={28} className="mt-[2px] h-[28px] w-[28px] shrink-0" />
                      <span className="min-w-0 overflow-visible">
                        <span
                          className="block h-auto overflow-visible text-[12px] leading-[16px] font-bold tracking-[0.06em] text-[#1764FF] uppercase"
                          style={sans}
                        >
                          {c(item.title)}
                        </span>
                        <span className="block h-auto overflow-visible text-[12px] leading-[16px] text-[#5c5c5c]" style={sans}>
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
            </div>
          </section>
        </main>
      </div>
      <SiteFooter />
    </>
  );
}
