import type { ReactNode } from "react";
import { DocumentTitle } from "@/components/document-title";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { loadNews, type NewsItem } from "@/lib/news";
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

function NewsCopy({ text, className }: { text: string; className: string }) {
  const lines = text.split("\n");
  return (
    <p className={className} style={body}>
      {lines.map((line, index) => (
        <span key={index}>
          {index > 0 ? <br /> : null}
          {line}
        </span>
      ))}
    </p>
  );
}

async function NewsArticle({ item }: { item: NewsItem }) {
  const title = item.title;
  const description = item.description;
  const content = item.content;
  const hasDate = item.date.trim().length > 0;
  const hasContent = content.trim().length > 0 && content.trim() !== description.trim();

  // Flow layout: image keeps its intrinsic aspect ratio; text follows image height.
  // Mobile: 20px gutters (site-consistent), image fills usable width.
  // Desktop: restore ~17.3% / 249px gutters and 943px image cap.
  return (
    <article className="mx-auto w-full max-w-[1440px] bg-white px-5 pb-16 sm:px-[clamp(20px,17.3vw,249px)]">
      <div className="mx-auto w-full max-w-none md:max-w-[943px]">
        <img
          src={item.image}
          alt={item.imageAlt}
          className="block h-auto w-full max-w-full object-contain"
        />
      </div>
      <h2
        className="m-0 mt-8 w-full text-center text-[32px] leading-[40px] font-bold text-[#08112E]"
        style={sans}
      >
        {title}
      </h2>
      {hasDate ? (
        <p
          className="m-0 mt-[10px] w-full text-center text-[16px] leading-[26px] font-normal text-[#4B4F58]"
          style={body}
        >
          <time dateTime={item.date}>{item.date}</time>
        </p>
      ) : null}
      <NewsCopy
        text={description}
        className={`mx-auto mb-0 w-full max-w-[500px] text-[16px] leading-[26px] font-normal text-[#4B4F58] ${hasDate ? "mt-[21px]" : "mt-8"}`}
      />
      {hasContent ? (
        <NewsCopy
          text={content}
          className="mx-auto mt-6 mb-0 w-full max-w-[500px] text-[16px] leading-[26px] font-normal text-[#4B4F58]"
        />
      ) : null}
    </article>
  );
}

export async function NewsContent() {
  const items = await loadNews();
  return (
    <>
      {items.map((item) => (
        <NewsArticle key={item.id} item={item} />
      ))}
    </>
  );
}

export async function NewsPage() {
  const text = await copy("news");
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
        <NewsContent />
      </main>
      <SiteFooter />
    </>
  );
}
