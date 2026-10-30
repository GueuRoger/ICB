import type { CSSProperties, ReactNode } from "react";
import { DocumentTitle } from "@/components/document-title";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { copy } from "@/lib/site-content";

const sans = { fontFamily: "var(--font-montserrat)" } as const;
const body = { fontFamily: "var(--font-barlow)" } as const;

function Frame({ height, children }: { height: number; children: ReactNode }) {
  return (
    <div style={{ width: "min(1440px, 100%)", marginInline: "auto", containerType: "inline-size" }}>
      <div style={{ position: "relative", height: `calc(${height}px * (100cqw / 1440px))`, overflow: "hidden" }}>
        {children}
      </div>
    </div>
  );
}

function canvas(height: number, background: string) {
  return {
    position: "absolute" as const,
    top: 0,
    left: 0,
    width: 1440,
    height,
    transform: "scale(calc(100cqw / 1440px))",
    transformOrigin: "top left" as const,
    background,
  };
}

type AboutCopy = {
  aboutLabel: string;
  speaker: string;
  speakerLine1: string;
  speakerLine2: string;
  speakerImage: string;
  speakerAlt: string;
  engineer: string;
  engineerLine1: string;
  engineerLine2: string;
  engineerImage: string;
  engineerAlt: string;
  inventor: string;
  inventorLine1: string;
  inventorLine2: string;
  inventorLine3: string;
  inventorLine4: string;
  inventorImage: string;
  inventorAlt: string;
};

async function loadAboutCopy(): Promise<AboutCopy> {
  const text = await copy("about");
  const [
    aboutLabel,
    speaker,
    speakerLine1,
    speakerLine2,
    speakerImage,
    speakerAlt,
    engineer,
    engineerLine1,
    engineerLine2,
    engineerImage,
    engineerAlt,
    inventor,
    inventorLine1,
    inventorLine2,
    inventorLine3,
    inventorLine4,
    inventorImage,
    inventorAlt,
  ] = await Promise.all([
    text("title"),
    text("speaker_heading"),
    text("speaker_line_1"),
    text("speaker_line_2"),
    text("speaker_image"),
    text("speaker_image_alt"),
    text("engineer_heading"),
    text("engineer_line_1"),
    text("engineer_line_2"),
    text("engineer_image"),
    text("engineer_image_alt"),
    text("inventor_heading"),
    text("inventor_line_1"),
    text("inventor_line_2"),
    text("inventor_line_3"),
    text("inventor_line_4"),
    text("inventor_image"),
    text("inventor_image_alt"),
  ]);
  return {
    aboutLabel,
    speaker,
    speakerLine1,
    speakerLine2,
    speakerImage,
    speakerAlt,
    engineer,
    engineerLine1,
    engineerLine2,
    engineerImage,
    engineerAlt,
    inventor,
    inventorLine1,
    inventorLine2,
    inventorLine3,
    inventorLine4,
    inventorImage,
    inventorAlt,
  };
}

/** Render only non-empty lines; height comes from content, never clipped. */
function BioParagraph({
  lines,
  className,
  style,
}: {
  lines: string[];
  className?: string;
  style?: CSSProperties;
}) {
  const parts = lines.map((line) => line.trim()).filter(Boolean);
  return (
    <p
      className={className}
      style={{
        height: "auto",
        maxHeight: "none",
        overflow: "visible",
        display: "block",
        ...style,
      }}
    >
      {parts.map((part, index) => (
        <span key={index}>
          {index > 0 ? <br /> : null}
          {part}
        </span>
      ))}
    </p>
  );
}

function AboutGrowing({ c }: { c: AboutCopy }) {
  const titleClass = "m-0 shrink-0 text-[32px] leading-[40px] font-bold text-[#08112E]";
  const textClass =
    "m-0 block h-auto max-h-none w-full shrink-0 overflow-visible text-[16px] leading-[26px] font-normal text-[#4B4F58]";
  // Natural aspect ratio; height follows width. Never crop with object-cover.
  const imageClass = "block h-auto w-full max-w-[700px] shrink-0 object-contain overflow-visible";
  const copyClass =
    "flex h-auto w-full max-w-[520px] shrink-0 flex-col gap-8 overflow-visible";

  return (
    <div style={{ width: "min(1440px, 100%)", marginInline: "auto" }}>
      <section
        aria-label={c.aboutLabel}
        className="box-border h-auto overflow-visible bg-white px-[20px] pt-[9px] pb-[80px] sm:px-[38px] sm:pb-[120px]"
      >
        <div className="flex h-auto flex-col gap-10 overflow-visible lg:gap-[40px]">
          <article className="flex h-auto flex-col items-start gap-6 overflow-visible lg:flex-row lg:justify-between lg:gap-[26px]">
            <img
              src={c.speakerImage}
              alt={c.speakerAlt}
              width={700}
              height={427}
              className={imageClass}
            />
            <div className={`${copyClass} max-w-[500px] lg:pt-[23px]`}>
              <h2 className={titleClass} style={sans}>
                {c.speaker}
              </h2>
              <BioParagraph
                className={textClass}
                style={body}
                lines={[c.speakerLine1, c.speakerLine2]}
              />
            </div>
          </article>

          <article className="flex h-auto flex-col-reverse items-start gap-6 overflow-visible lg:flex-row lg:justify-between lg:gap-[30px]">
            <div className={`${copyClass} max-w-[500px] lg:pt-[9px]`}>
              <h2 className={titleClass} style={sans}>
                {c.engineer}
              </h2>
              <BioParagraph
                className={textClass}
                style={body}
                lines={[c.engineerLine1, c.engineerLine2]}
              />
            </div>
            <img
              src={c.engineerImage}
              alt={c.engineerAlt}
              width={700}
              height={390}
              className={imageClass}
            />
          </article>

          <article className="flex h-auto flex-col items-start gap-6 overflow-visible lg:flex-row lg:justify-start lg:gap-[40px]">
            <img
              src={c.inventorImage}
              alt={c.inventorAlt}
              width={700}
              height={390}
              className={imageClass}
            />
            <div className={`${copyClass} max-w-[500px]`}>
              <h2 className={titleClass} style={sans}>
                {c.inventor}
              </h2>
              <BioParagraph
                className={textClass}
                style={body}
                lines={[c.inventorLine1, c.inventorLine2, c.inventorLine3, c.inventorLine4]}
              />
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}

export async function AboutContent() {
  const c = await loadAboutCopy();
  return <AboutGrowing c={c} />;
}

export async function AboutPage() {
  const text = await copy("about");
  const c = await loadAboutCopy();
  return (
    <>
      <Frame height={132}>
        <div style={canvas(132, "#061E38")}>
          <SiteHeader />
        </div>
      </Frame>
      <main>
        <DocumentTitle title={await text("title")} description={text("document_description")} />
        <h1 className="sr-only">{await text("title")}</h1>
        <AboutGrowing c={c} />
      </main>
      <SiteFooter />
    </>
  );
}
