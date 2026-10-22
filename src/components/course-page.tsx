import { DocumentTitle } from "@/components/document-title";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { formatMoney, loadCatalog } from "@/lib/courses";
import { copy } from "@/lib/site-content";

const layout = [
  { slug: "world-stage", href: "/courses/world-stage", imageWidth: 133, imageHeight: 164, top: 450 },
  { slug: "global-fluency", href: "/courses/global-fluency", imageWidth: 140, imageHeight: 186, top: 766 },
] as const;

export async function CoursePage() {
  const [text, courses] = await Promise.all([copy("courses", "shared"), loadCatalog()]);
  const [title, home, coursesLabel, languages, learnMore, portrait, portraitAlt] = await Promise.all([
    text("title"),
    text("breadcrumb_home"),
    text("breadcrumb_courses"),
    text("languages"),
    text("learn_more"),
    text("portrait"),
    text("portrait_alt"),
  ]);
  return (
    <>
    <div className="course-viewport">
      <div className="course-canvas">
        <DocumentTitle title={title} description={text("document_description")} />
        <SiteHeader />
        <main>
          <section className="absolute top-[132px] left-0 h-[252px] w-[1440px] bg-[#6A7888]" aria-label={title}>
            <h1
              className="absolute top-[13px] left-0 w-[1440px] text-center text-[48px] leading-none font-bold text-white"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              {title}
            </h1>
            <img
              src={portrait}
              alt={portraitAlt}
              width={175}
              height={226}
              className="absolute top-[26px] left-[1010px] h-[226px] w-[175px]"
            />
          </section>
          <p
            className="absolute top-[431px] left-[174px] text-[14px] leading-[18px] text-[#222222]"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            <a href="/">{home}</a>
            <span className="px-[6px]" aria-hidden="true">
              ›
            </span>
            <a href="/courses" aria-current="page">
              {coursesLabel}
            </a>
          </p>
          {layout.map((place) => {
            const course = courses.find((item) => item.slug === place.slug);
            if (!course) return null;
            return (
            <article key={course.slug}>
              <h2
                className="absolute left-[175px] text-[32px] leading-[40px] font-semibold text-[#1a1a1a]"
                style={{ fontFamily: "var(--font-source-serif)", top: place.top }}
              >
                {course.name}
              </h2>
              <p
                className="absolute left-[174px] text-[16px] leading-[24px] font-normal text-[#222222]"
                style={{ fontFamily: "var(--font-montserrat)", top: place.top + 58 }}
              >
                {languages}
              </p>
              <p
                className="absolute left-[174px] w-[500px] text-[16px] leading-[22px] font-normal text-[#222222]"
                style={{ fontFamily: "var(--font-montserrat)", top: place.top + 110 }}
              >
                {course.shortDescription}
              </p>
              <img
                src={course.thumbnailUrl}
                alt=""
                width={place.imageWidth}
                height={place.imageHeight}
                className="absolute"
                style={{
                  left: 1146 + (170 - place.imageWidth) / 2,
                  top: place.top + 204 - 36 - 12 - place.imageHeight,
                  width: place.imageWidth,
                  height: place.imageHeight,
                }}
              />
              <p
                className="absolute left-[1146px] w-[170px] text-center text-[16px] leading-[20px] font-normal text-[#222222]"
                style={{ fontFamily: "var(--font-montserrat)", top: place.top + 204 - 36 }}
              >
                        {formatMoney(course.price, text("currency_symbol"))}
              </p>
              <a
                href={place.href}
                className="absolute left-[1146px] flex h-[40px] w-[170px] items-center justify-center bg-[#2251FF] text-[16px] leading-[18px] font-semibold text-white"
                style={{
                  fontFamily: "var(--font-inter)",
                  letterSpacing: "0.001em",
                  top: place.top + 204,
                }}
              >
                {learnMore}
              </a>
            </article>
            );
          })}
        </main>
      </div>
    </div>
    <SiteFooter />
    </>
  );
}
