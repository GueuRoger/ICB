import type { ReactNode } from "react";
import { DocumentTitle } from "@/components/document-title";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { formatMoney, loadCatalog, type CourseView } from "@/lib/courses";
import { copy } from "@/lib/site-content";

const catalog = [
  { slug: "world-stage", href: "/courses/world-stage", imageMaxWidth: 140 },
  { slug: "global-fluency", href: "/courses/global-fluency", imageMaxWidth: 140 },
] as const;

const serif = { fontFamily: "var(--font-source-serif)" } as const;
const sans = { fontFamily: "var(--font-montserrat)" } as const;
const inter = { fontFamily: "var(--font-inter)", letterSpacing: "0.001em" } as const;

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

function CourseRow({
  course,
  href,
  imageMaxWidth,
  languages,
  learnMore,
  currencySymbol,
  displayName,
}: {
  course: CourseView;
  href: string;
  imageMaxWidth: number;
  languages: string;
  learnMore: string;
  currencySymbol: string;
  displayName: string;
}) {
  return (
    <article className="box-border grid h-auto w-full grid-cols-1 items-start gap-x-16 gap-y-8 overflow-visible lg:grid-cols-[minmax(0,1fr)_170px]">
      <div className="box-border flex min-w-0 max-w-[720px] flex-col gap-8 overflow-visible">
        <h2
          className="m-0 block h-auto max-h-none w-full overflow-visible break-words text-[28px] leading-[1.25] font-semibold text-[#1a1a1a] sm:text-[32px]"
          style={serif}
        >
          {displayName}
        </h2>
        <p className="m-0 h-auto overflow-visible text-[16px] leading-[24px] font-normal text-[#222222]" style={sans}>
          {languages}
        </p>
        <p className="m-0 h-auto max-w-[500px] overflow-visible text-[16px] leading-[22px] font-normal text-[#222222]" style={sans}>
          {course.shortDescription}
        </p>
      </div>

      <div className="box-border flex w-full shrink-0 flex-col items-center gap-3 justify-self-center overflow-visible lg:w-[170px] lg:justify-self-end">
        <img
          src={course.thumbnailUrl}
          alt=""
          className="block h-auto w-full max-w-full object-contain"
          style={{ maxWidth: imageMaxWidth }}
        />
        <p className="m-0 w-full text-center text-[16px] leading-[20px] font-normal text-[#222222]" style={sans}>
          {formatMoney(course.price, currencySymbol)}
        </p>
        <a
          href={href}
          className="flex h-[40px] w-full max-w-[170px] items-center justify-center bg-[#2251FF] text-[16px] leading-[18px] font-semibold text-white"
          style={inter}
        >
          {learnMore}
        </a>
      </div>
    </article>
  );
}

export async function CoursePage() {
  const [text, courses] = await Promise.all([copy("courses", "shared"), loadCatalog()]);
  const [title, home, coursesLabel, languages, learnMore, portrait, portraitAlt, currencySymbol] = await Promise.all([
    text("title"),
    text("breadcrumb_home"),
    text("breadcrumb_courses"),
    text("languages"),
    text("learn_more"),
    text("portrait"),
    text("portrait_alt"),
    text("currency_symbol"),
  ]);

  return (
    <>
      <HeaderFrame>
        <SiteHeader />
      </HeaderFrame>

      <div className="box-border mx-auto h-auto w-full max-w-[1440px] overflow-visible bg-white">
        <DocumentTitle title={title} description={text("document_description")} />
        <main className="flex h-auto flex-col overflow-visible">
          <section className="relative flex h-[252px] w-full items-start justify-center overflow-visible bg-[#6A7888]" aria-label={title}>
            <h1 className="m-0 pt-[13px] text-center text-[48px] leading-none font-bold text-white" style={sans}>
              {title}
            </h1>
            <img
              src={portrait}
              alt={portraitAlt}
              width={175}
              height={226}
              className="absolute top-[26px] right-[255px] hidden h-[226px] w-[175px] object-cover md:block"
            />
          </section>

          <div className="box-border flex h-auto flex-col gap-16 overflow-visible px-[20px] pt-[47px] pb-20 sm:px-[48px] lg:px-[174px]">
            <p className="m-0 text-[14px] leading-[18px] text-[#222222]" style={sans}>
              <a href="/">{home}</a>
              <span className="px-[6px]" aria-hidden="true">
                ›
              </span>
              <a href="/courses" aria-current="page">
                {coursesLabel}
              </a>
            </p>

            <div className="flex h-auto flex-col gap-16 overflow-visible lg:gap-20">
              {catalog.map((place) => {
                const course = courses.find((item) => item.slug === place.slug);
                if (!course) return null;

                return (
                  <CourseRow
                    key={course.slug}
                    course={course}
                    href={place.href}
                    imageMaxWidth={place.imageMaxWidth}
                    languages={languages}
                    learnMore={learnMore}
                    currencySymbol={currencySymbol}
                    displayName={course.name}
                  />
                );
              })}
            </div>
          </div>
        </main>
      </div>
      <SiteFooter />
    </>
  );
}
