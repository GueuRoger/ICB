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

  return (
    <Frame height={1535}>
      <article style={canvas(1535, "#ffffff")}>
        <img
          src={item.image}
          alt={item.imageAlt}
          width={943}
          height={1102}
          className="absolute top-0 left-[249px] h-[1102px] w-[943px]"
        />
        <h2
          className="absolute top-[1134px] left-0 m-0 w-[1440px] text-center text-[32px] leading-[40px] font-bold text-[#08112E]"
          style={sans}
        >
          {title}
        </h2>
        {hasDate ? (
          <p
            className="absolute top-[1184px] left-0 m-0 w-[1440px] text-center text-[16px] leading-[26px] font-normal text-[#4B4F58]"
            style={body}
          >
            <time dateTime={item.date}>{item.date}</time>
          </p>
        ) : null}
        <NewsCopy
          text={description}
          className={`absolute left-[470px] m-0 w-[500px] text-[16px] leading-[26px] font-normal text-[#4B4F58] ${hasDate ? "top-[1231px]" : "top-[1205px]"}`}
        />
        {hasContent ? (
          <NewsCopy
            text={content}
            className="absolute top-[1340px] left-[470px] m-0 w-[500px] text-[16px] leading-[26px] font-normal text-[#4B4F58]"
          />
        ) : null}
      </article>
    </Frame>
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
