import type { ReactNode } from "react";
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

export async function AboutContent() {
  const text = await copy("about");
  const [
    aboutLabel,
    international,
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
    text("speaker_kicker"),
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
  return (
      <Frame height={1535}>
        <section aria-label={aboutLabel} style={canvas(1535, "#ffffff")}>
          <img
            src={speakerImage}
            alt={speakerAlt}
            width={700}
            height={427}
            className="absolute top-[9px] left-[38px] h-[427px] w-[700px]"
          />
          <h2
            className="absolute top-[32px] left-[764px] m-0 text-[32px] leading-[40px] font-bold"
            style={sans}
          >
            <span className="text-black">{international}</span> <span className="text-[#08112E]">{speaker}</span>
          </h2>
          <p
            className="absolute top-[104px] left-[762px] m-0 w-[500px] text-[16px] leading-[26px] font-normal text-[#4B4F58]"
            style={body}
          >
            {speakerLine1}
            <br />
            {speakerLine2}
          </p>

          <h2
            className="absolute top-[474px] left-[187px] m-0 text-[32px] leading-[40px] font-bold text-[#08112E]"
            style={sans}
          >
            {engineer}
          </h2>
          <p
            className="absolute top-[546px] left-[39px] m-0 w-[500px] text-[16px] leading-[26px] font-normal text-[#4B4F58]"
            style={body}
          >
            {engineerLine1}
            <br />
            {engineerLine2}
          </p>
          <img
            src={engineerImage}
            alt={engineerAlt}
            width={700}
            height={390}
            className="absolute top-[465px] left-[730px] h-[390px] w-[700px]"
          />

          <img
            src={inventorImage}
            alt={inventorAlt}
            width={700}
            height={390}
            className="absolute top-[907px] left-[20px] h-[390px] w-[700px]"
          />
          <h2
            className="absolute top-[906px] left-[1019px] m-0 text-[32px] leading-[40px] font-bold text-[#08112E]"
            style={sans}
          >
            {inventor}
          </h2>
          <p
            className="absolute top-[991px] left-[870px] m-0 w-[520px] text-[16px] leading-[26px] font-normal text-[#4B4F58]"
            style={body}
          >
            {inventorLine1}
            <br />
            {inventorLine2}
            <br />
            {inventorLine3}
            <br />
            {inventorLine4}
          </p>
        </section>
      </Frame>
  );
}

export async function AboutPage() {
  const text = await copy("about");
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
        <AboutContent />
      </main>
      <SiteFooter />
    </>
  );
}
