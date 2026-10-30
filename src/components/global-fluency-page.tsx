import type { ReactNode } from "react";
import { DocumentTitle } from "@/components/document-title";
import { GlobalFluencyFaq } from "@/components/global-fluency-faq";
import { GlobalFluencyIntroMedia } from "@/components/global-fluency-intro-media";
import { GlobalFluencySidebar } from "@/components/global-fluency-sidebar";
import { GlobalFluencyWhyBody } from "@/components/global-fluency-why-body";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { loadCourse } from "@/lib/courses";
import { copy } from "@/lib/site-content";

const sans = { fontFamily: "var(--font-montserrat)" } as const;
const inter = { fontFamily: "var(--font-inter)" } as const;

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

/**
 * Two-tone CMS heading. Wording comes from CMS.
 * emphasize="rest" → first word black, remainder #061E38
 * emphasize="last" → all but last word black, last word #061E38
 */
function TwoToneHeading({ text, emphasize = "rest" }: { text: string; emphasize?: "rest" | "last" }) {
  const trimmed = text.trim();
  if (!trimmed) return null;
  const splitAt = emphasize === "last" ? trimmed.lastIndexOf(" ") : trimmed.indexOf(" ");
  if (splitAt === -1) {
    return <span className="text-[#333333]">{trimmed}</span>;
  }
  return (
    <>
      <span className="text-[#333333]">{trimmed.slice(0, splitAt)}</span>
      <span className="text-[#061E38]">{trimmed.slice(splitAt)}</span>
    </>
  );
}

const offerItems = [
  {
    icon: "/icons/calendar.svg",
    iconClass: "h-[64px] w-[64px]",
    titleKeys: ["offer_1_title_1", "offer_1_title_2"] as const,
    bodyKeys: ["offer_1_body_1", "offer_1_body_2", "offer_1_body_3"] as const,
  },
  {
    icon: "/icons/users.svg",
    iconClass: "h-[64px] w-[64px]",
    titleKeys: ["offer_2_title_1", "offer_2_title_2"] as const,
    bodyKeys: ["offer_2_body_1", "offer_2_body_2"] as const,
  },
  {
    icon: "/icons/globe.svg",
    iconClass: "h-[64px] w-[64px]",
    titleKeys: ["offer_3_title_1", "offer_3_title_2"] as const,
    bodyKeys: ["offer_3_body_1", "offer_3_body_2", "offer_3_body_3"] as const,
  },
] as const;

/** Body copy: height follows content; never clip or clamp. */
const bodyClass =
  "m-0 h-auto max-h-none overflow-visible text-[16px] leading-[24px] font-normal text-[#5c5c5c]";

export async function GlobalFluencyPage() {
  const [course, text] = await Promise.all([loadCourse("global-fluency"), copy("global-fluency", "shared")]);
  const c = text;

  return (
    <>
      <HeaderFrame>
        <SiteHeader />
      </HeaderFrame>

      <div
        className="global-fluency-page global-fluency-canvas box-border mx-auto h-auto w-full max-w-[1440px] overflow-visible bg-white px-[20px] pt-[16px] pb-[80px] sm:px-[48px] sm:pb-[120px] lg:pr-[340px]"
      >
        <DocumentTitle title={course.name} description={c("document_description")} />
        <main className="flex h-auto max-w-[910px] flex-col gap-10 overflow-visible">
          <p className="m-0 text-[14px] leading-[18px] text-[#333333]" style={sans}>
            <a href="/">{c("breadcrumb_home")}</a>
            <span className="px-[6px]" aria-hidden="true">
              ›
            </span>
            <span aria-current="page">{course.name}</span>
          </p>

          <section className="flex h-auto flex-col gap-6 overflow-visible" aria-label={course.name}>
            <h1 className="m-0 h-auto max-h-none overflow-visible text-[20px] leading-[36px] font-bold" style={sans}>
              {c("headline_lead").trim() ? (
                <span className="text-[#333333]">{c("headline_lead")}</span>
              ) : null}
              {c("headline_emphasis").trim() ? (
                <span className="text-[#061E38] italic">{c("headline_emphasis")}</span>
              ) : null}
            </h1>

            <p className={`${bodyClass} leading-[22px]`} style={sans}>
              {c("hero_body")}
            </p>

            <h2 className="m-0 text-[16px] leading-[20px] font-bold text-[#222222]" style={sans}>
              {c("different_heading")}
            </h2>

            <div className="flex h-auto items-start gap-2 overflow-visible">
              <img
                src="/icons/lightbulb.svg"
                alt=""
                width={24}
                height={24}
                className="mt-[3px] h-[18px] w-[18px] shrink-0"
              />
              <p className={bodyClass} style={sans}>
                {c("different_body")}
              </p>
            </div>
          </section>

          <section
            className="flex h-auto flex-col items-start gap-8 overflow-visible lg:flex-row lg:gap-[34px]"
            aria-label={c("intro_heading")}
          >
            <GlobalFluencyIntroMedia
              imageSrc={c("intro_image")}
              imageAlt={c("intro_alt")}
              videoSrc={c("intro_video")}
              playLabel={c("intro_play")}
            />

            <div className="flex h-auto w-full max-w-[390px] flex-col gap-4 overflow-visible">
              <a
                href="#personal-introduction"
                className="text-[16px] leading-[20px] font-semibold text-[#2251FF]"
                style={sans}
              >
                {c("discover")}
              </a>
              <h2
                id="personal-introduction"
                className="m-0 h-auto text-[20px] leading-[28px] font-bold text-[#222222]"
                style={sans}
              >
                {c("intro_heading")}
              </h2>
              <p className={`${bodyClass} leading-[22px]`} style={sans}>
                {c("intro_body")}
              </p>
              {course.pdfUrl ? (
                <a
                  href={course.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex h-[40px] w-[254px] items-center justify-center bg-[#2251FF] text-[14px] leading-[18px] font-semibold tracking-[0.06em] text-white uppercase"
                  style={inter}
                >
                  {c("pdf_preview")}
                </a>
              ) : (
                <button
                  type="button"
                  aria-disabled="true"
                  className="mt-2 inline-flex h-[40px] w-[254px] items-center justify-center bg-[#2251FF] text-[14px] leading-[18px] font-semibold tracking-[0.06em] text-white uppercase"
                  style={inter}
                >
                  {c("pdf_preview")}
                </button>
              )}
            </div>
          </section>

          <section className="flex h-auto flex-col gap-10 overflow-visible pt-6" aria-label={c("offerings")}>
            <div className="flex items-center gap-4">
              <h2 className="m-0 shrink-0 text-[20px] leading-[24px] font-bold text-[#333333]" style={sans}>
                {c("offerings")}
              </h2>
              <div className="h-[2px] min-w-0 flex-1 bg-[#ABABAB]" />
            </div>
            <div className="grid h-auto grid-cols-1 gap-10 overflow-visible sm:grid-cols-3 sm:gap-6">
              {offerItems.map((item) => (
                <div key={item.titleKeys[0]} className="flex h-auto flex-col items-center gap-4 overflow-visible text-center">
                  <img src={item.icon} alt="" width={64} height={64} className={item.iconClass} />
                  <h3 className="m-0 h-auto max-h-none overflow-visible text-[16px] leading-[18px] font-bold text-[#333333]" style={sans}>
                    {item.titleKeys
                      .map((key) => {
                        const line = c(key).trim();
                        // Obsolete DB value until scripts/fix-offer-3-title.sql is run.
                        if (key === "offer_3_title_1" && line === "Access to international environment") {
                          return "Access to an international environment";
                        }
                        return line;
                      })
                      .filter(Boolean)
                      .map((line, i) => (
                        <span key={`${item.titleKeys[0]}-${i}`}>
                          {i > 0 ? <br /> : null}
                          {line}
                        </span>
                      ))}
                  </h3>
                  <p className="m-0 h-auto max-h-none overflow-visible text-[14px] leading-[18px] font-normal text-[#4c4c4c]" style={sans}>
                    {item.bodyKeys
                      .map((key) => c(key).trim())
                      .filter(Boolean)
                      .map((line, i) => (
                        <span key={`${item.bodyKeys[0]}-${i}`}>
                          {i > 0 ? <br /> : null}
                          {line}
                        </span>
                      ))}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section
            className="flex h-auto flex-col gap-8 overflow-visible pt-6"
            aria-label={c("description_word")}
          >
            <div className="flex items-center gap-4">
              <h2
                id="course-description"
                className="m-0 shrink-0 text-[20px] leading-[24px] font-bold"
                style={sans}
              >
                <TwoToneHeading text={c("description_word")} />
              </h2>
              <div className="h-px min-w-0 flex-1 bg-[#C6C6C6]" />
            </div>

            <h3 className="m-0 text-[20px] leading-[28px] font-normal text-[#333333]" style={sans}>
              {c("why_heading")}
            </h3>
            <GlobalFluencyWhyBody text={c("why_body")} />

            <h2 id="course-breakdown" className="m-0 text-[20px] leading-[24px] font-bold" style={sans}>
              <TwoToneHeading text={c("breakdown_word")} />
            </h2>

            <div className="grid h-auto grid-cols-1 gap-10 overflow-visible md:grid-cols-2 md:gap-x-[70px] md:gap-y-12">
              {course.modules.slice(0, 4).map((module, index) => {
                const n = index + 1;
                return (
                  <div key={n} className="relative flex h-auto overflow-visible pt-7">
                    <div className="flex h-auto min-h-[277px] w-[35px] shrink-0 items-center justify-center self-stretch bg-[#1764FF]">
                      <span
                        className="rotate-[-90deg] text-[16px] leading-[18px] font-bold whitespace-nowrap text-white"
                        style={sans}
                      >
                        {c("module_word")} {n}
                      </span>
                    </div>
                    <article className="relative box-border flex h-auto min-h-[416px] w-full flex-col gap-6 overflow-visible bg-[#6A7888] px-[30px] pt-[52px] pb-10">
                      <div
                        className="absolute top-0 left-1/2 flex h-[56px] w-[56px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-[3px] border-[#1764FF] bg-[#061E38] text-[22px] leading-none font-bold text-white"
                        style={sans}
                      >
                        {n}
                      </div>
                      <h3
                        className="m-0 h-auto max-h-none overflow-visible text-center text-[20px] leading-[26px] font-bold text-white"
                        style={sans}
                      >
                        {module.title}
                      </h3>
                      <p
                        className="m-0 h-auto max-h-none overflow-visible text-center text-[16px] leading-[24px] font-normal text-[#3E4144]"
                        style={sans}
                      >
                        {module.description}
                      </p>
                    </article>
                  </div>
                );
              })}
            </div>
          </section>

          <section
            className="flex h-auto flex-col gap-8 overflow-visible pt-6"
            aria-label={c("technology")}
          >
            <h2 id="innovative-technology" className="m-0 text-[20px] leading-[28px] font-bold" style={sans}>
              <TwoToneHeading text={c("technology")} />
            </h2>
            <p className={bodyClass} style={sans}>
              {c("technology_body")}
            </p>

            <h2 id="proven-content" className="m-0 text-[20px] leading-[28px] font-bold" style={sans}>
              <TwoToneHeading text={c("resources")} emphasize="last" />
            </h2>
            <p className={bodyClass} style={sans}>
              {c("resources_body")}
            </p>

            <div className="flex items-center gap-4 pt-4">
              <h2 id="faqs" className="m-0 shrink-0 text-[20px] leading-[28px] font-bold text-[#333333]" style={sans}>
                {c("faqs")}
              </h2>
              <div className="h-px min-w-0 flex-1 bg-[#B3B3B3]" />
            </div>

            <GlobalFluencyFaq
              items={[
                {
                  question: c("faq_question"),
                  answerLabel: c("faq_answer_label"),
                  answer: c("faq_answer"),
                },
              ]}
            />
          </section>
        </main>
      </div>

      <GlobalFluencySidebar name={course.name} price={course.price} coverImage={course.thumbnailUrl} />
      <SiteFooter />
    </>
  );
}
