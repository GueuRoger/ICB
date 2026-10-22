import { DocumentTitle } from "@/components/document-title";
import { GlobalFluencySidebar } from "@/components/global-fluency-sidebar";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { loadCourse } from "@/lib/courses";
import { copy } from "@/lib/site-content";

const moduleCards = [
  { n: 1, left: 90, top: 600 },
  { n: 2, left: 621, top: 600 },
  { n: 3, left: 90, top: 1085 },
  { n: 4, left: 621, top: 1085 },
] as const;

export async function GlobalFluencyPage() {
  const [course, text] = await Promise.all([loadCourse("global-fluency"), copy("global-fluency", "shared")]);
  const c = text;
  return (
    <>
    <div className="course-viewport global-fluency-viewport">
      <div className="course-canvas global-fluency-canvas">
        <DocumentTitle title={course.name} description={c("document_description")} />
        <SiteHeader />
        <main>
          <p
            className="absolute top-[148px] left-[64px] text-[14px] leading-[18px] text-[#333333]"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            <a href="/">{c("breadcrumb_home")}</a>
            <span className="px-[6px]" aria-hidden="true">
              ›
            </span>
            <span aria-current="page">{course.name}</span>
          </p>

          <h1
            className="absolute top-[229px] left-[49px] w-[910px] text-[20px] leading-[36px] font-bold"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            <span className="text-[#333333]">{c("headline_lead")}</span>
            <span className="text-[#061E38] italic">
              {c("headline_emphasis")}
            </span>
          </h1>

          <p
            className="absolute top-[362px] left-[102px] w-[820px] text-[16px] leading-[22px] font-normal text-[#5c5c5c]"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            {c("hero_body")}
          </p>

          <h2
            className="absolute top-[484px] left-[102px] text-[16px] leading-[20px] font-bold text-[#222222]"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            {c("different_heading")}
          </h2>

          <img
            src="/icons/lightbulb.svg"
            alt=""
            width={24}
            height={24}
            className="absolute top-[526px] left-[98px] h-[18px] w-[18px]"
          />
          <p
            className="absolute top-[520px] left-[102px] w-[830px] text-[16px] leading-[24px] font-normal text-[#5c5c5c]"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            {c("different_body")}
          </p>

          <img
            src={c("intro_image")}
            alt={c("intro_alt")}
            width={1672}
            height={941}
            className="absolute top-[668px] left-[48px] h-[324px] w-[576px] object-cover"
          />
          <img
            src="/icons/circle-play.svg"
            alt=""
            width={24}
            height={24}
            className="pointer-events-none absolute top-[792px] left-[298px] h-[76px] w-[76px]"
          />

          <a
            href="#personal-introduction"
            className="absolute top-[674px] left-[658px] text-[16px] leading-[20px] font-semibold text-[#2251FF]"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            {c("discover")}
          </a>

          <h2
            id="personal-introduction"
            className="absolute top-[708px] left-[658px] text-[20px] leading-[28px] font-bold text-[#222222]"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            {c("intro_heading")}
          </h2>

          <p
            className="absolute top-[752px] left-[658px] w-[390px] text-[16px] leading-[22px] font-normal text-[#5c5c5c]"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            {c("intro_body")}
          </p>

          {course.pdfUrl ? (
            <a
              href={course.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute top-[906px] left-[658px] flex h-[40px] w-[254px] items-center justify-center bg-[#2251FF] text-[14px] leading-[18px] font-semibold tracking-[0.06em] text-white uppercase"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              {c("pdf_preview")}
            </a>
          ) : (
            <button
              type="button"
              aria-disabled="true"
              className="absolute top-[906px] left-[658px] flex h-[40px] w-[254px] items-center justify-center bg-[#2251FF] text-[14px] leading-[18px] font-semibold tracking-[0.06em] text-white uppercase"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              {c("pdf_preview")}
            </button>
          )}

          <section className="absolute top-[1024px] left-0 h-[541px] w-[1440px]" aria-label={c("offerings")}>
            <h2
              className="absolute top-[100px] left-[138px] text-[20px] leading-[24px] font-bold text-[#333333]"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              {c("offerings")}
            </h2>
            <div className="absolute top-[117px] left-[251px] h-[2px] w-[748px] bg-[#ABABAB]" />
            <img
              src="/icons/calendar.svg"
              alt=""
              width={24}
              height={24}
              className="absolute top-[246px] left-[256px] h-[64px] w-[64px]"
            />
            <img
              src="/icons/users.svg"
              alt=""
              width={24}
              height={24}
              className="absolute top-[254px] left-[512px] h-[64px] w-[64px]"
            />
            <img
              src="/icons/globe.svg"
              alt=""
              width={24}
              height={24}
              className="absolute top-[248px] left-[797px] h-[64px] w-[64px]"
            />
            {[
              {
                left: 213,
                width: 150,
                title: (
                  <>
                    {c("offer_1_title_1")}
                    <br />
                    {c("offer_1_title_2")}
                  </>
                ),
                body: (
                  <>
                    {c("offer_1_body_1")}
                    <br />
                    {c("offer_1_body_2")}
                    <br />
                    {c("offer_1_body_3")}
                  </>
                ),
              },
              {
                left: 449,
                width: 190,
                title: (
                  <>
                    {c("offer_2_title_1")}
                    <br />
                    {c("offer_2_title_2")}
                  </>
                ),
                body: (
                  <>
                    {c("offer_2_body_1")}
                    <br />
                    {c("offer_2_body_2")}
                  </>
                ),
              },
              {
                left: 734,
                width: 190,
                title: (
                  <>
                    {c("offer_3_title_1")}
                    <br />
                    {c("offer_3_title_2")}
                  </>
                ),
                body: (
                  <>
                    {c("offer_3_body_1")}
                    <br />
                    {c("offer_3_body_2")}
                    <br />
                    {c("offer_3_body_3")}
                  </>
                ),
              },
            ].map((item) => (
              <div key={item.left}>
                <h3
                  className="absolute top-[336px] text-center text-[16px] leading-[18px] font-bold text-[#333333]"
                  style={{ fontFamily: "var(--font-montserrat)", left: item.left, width: item.width }}
                >
                  {item.title}
                </h3>
                <p
                  className="absolute top-[404px] text-center text-[14px] leading-[18px] font-normal text-[#4c4c4c]"
                  style={{ fontFamily: "var(--font-montserrat)", left: item.left, width: item.width }}
                >
                  {item.body}
                </p>
              </div>
            ))}
          </section>

          <section className="absolute top-[1565px] left-0 h-[1549px] w-[1440px]" aria-label={`${c("course_word")} ${c("description_word")}`}>
            <h2
              id="course-description"
              className="absolute top-[104px] left-[48px] text-[20px] leading-[24px] font-bold"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              <span className="text-[#333333]">{c("course_word")} </span>
              <span className="text-[#061E38]">{c("description_word")}</span>
            </h2>
            <div className="absolute top-[122px] left-[288px] h-px w-[740px] bg-[#C6C6C6]" />
            <h3
              className="absolute top-[188px] left-[56px] text-[20px] leading-[28px] font-normal text-[#333333]"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              {c("why_heading")}
            </h3>
            <p
              className="absolute top-[274px] left-[68px] w-[860px] text-[16px] leading-[24px] font-normal text-[#5c5c5c]"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              {c("why_body")}
            </p>
            <h2
              id="course-breakdown"
              className="absolute top-[476px] left-[76px] text-[20px] leading-[24px] font-bold"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              <span className="text-[#333333]">{c("course_word")} </span>
              <span className="text-[#061E38]">{c("breakdown_word")}</span>
            </h2>
            {moduleCards.map((card, index) => {
              const module = course.modules[index];
              return (
              <div key={card.n}>
                <div
                  className="absolute h-[277px] w-[35px] bg-[#1764FF]"
                  style={{ left: card.left - 35, top: card.top + 139 }}
                >
                  <span
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[-90deg] text-[16px] leading-[18px] font-bold whitespace-nowrap text-white"
                    style={{ fontFamily: "var(--font-montserrat)" }}
                  >
                    {c("module_word")} {card.n}
                  </span>
                </div>
                <article
                  className="absolute h-[416px] w-[419px] bg-[#6A7888]"
                  style={{ left: card.left, top: card.top }}
                >
                  <h3
                    className="absolute top-[52px] left-0 w-full text-center text-[20px] leading-[26px] font-bold text-white"
                    style={{ fontFamily: "var(--font-montserrat)" }}
                  >
                    {module?.title}
                  </h3>
                  <p
                    className="absolute top-[116px] left-[30px] w-[360px] text-center text-[16px] leading-[24px] font-normal text-[#3E4144]"
                    style={{ fontFamily: "var(--font-montserrat)" }}
                  >
                    {module?.description}
                  </p>
                </article>
                <div
                  className="absolute flex h-[56px] w-[56px] items-center justify-center rounded-full border-[3px] border-[#1764FF] bg-[#061E38] text-[22px] leading-none font-bold text-white"
                  style={{
                    fontFamily: "var(--font-montserrat)",
                    left: card.left + 181,
                    top: card.top - 28,
                  }}
                >
                  {card.n}
                </div>
              </div>
              );
            })}
          </section>

          <section className="absolute top-[3114px] left-0 h-[1024px] w-[1440px]" aria-label={`${c("innovative")} ${c("technology")}`}>
            <h2
              id="innovative-technology"
              className="absolute top-[100px] left-[48px] text-[20px] leading-[28px] font-bold"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              <span className="text-[#333333]">{c("innovative")} </span>
              <span className="text-[#061E38]">{c("technology")}</span>
            </h2>
            <p
              className="absolute top-[190px] left-[48px] w-[860px] text-[16px] leading-[24px] font-normal text-[#5c5c5c]"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              {c("technology_body")}
            </p>
            <h2
              id="proven-content"
              className="absolute top-[337px] left-[48px] text-[20px] leading-[28px] font-bold"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              <span className="text-[#333333]">{c("proven")}</span>
              <span className="text-[#061E38]">{c("resources")}</span>
            </h2>
            <p
              className="absolute top-[477px] left-[48px] w-[860px] text-[16px] leading-[24px] font-normal text-[#5c5c5c]"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              {c("resources_body")}
            </p>
            <h2
              id="faqs"
              className="absolute top-[674px] left-[48px] text-[20px] leading-[28px] font-bold text-[#333333]"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              {c("faqs")}
            </h2>
            <div className="absolute top-[692px] left-[121px] h-px w-[729px] bg-[#B3B3B3]" />
            <p
              className="absolute top-[792px] left-[48px] text-[18px] leading-[24px] font-bold text-[#333333]"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              {c("faq_question")}
            </p>
            <img
              src="/icons/plus.svg"
              alt=""
              width={24}
              height={24}
              className="absolute top-[790px] left-[981px] h-[28px] w-[28px]"
            />
            <p
              className="absolute top-[886px] left-[48px] text-[18px] leading-[24px] font-bold text-[#333333]"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              {c("faq_answer_label")}
            </p>
            <p
              className="absolute top-[886px] left-[148px] w-[730px] text-[16px] leading-[24px] font-normal text-[#5c5c5c]"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              {c("faq_answer")}
            </p>
          </section>
        </main>
      </div>
    </div>
    <GlobalFluencySidebar name={course.name} price={course.price} />
    <SiteFooter />
    </>
  );
}
