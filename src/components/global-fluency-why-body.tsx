import type { ReactNode } from "react";

const sans = { fontFamily: "var(--font-montserrat)" } as const;

const bodyClass =
  "m-0 h-auto max-h-none overflow-visible text-[16px] leading-[24px] font-normal text-[#5c5c5c]";

const SECTION_HEADING = /^\s*(\d+)\.\s+(.+)$/;
const MARKDOWN_HEADING = /^\s*#{1,6}\s+(.+)$/;

type WhyBlock =
  | { type: "paragraph"; text: string }
  | { type: "section"; heading: string; paragraphs: string[] };

function parseWhyBody(raw: string): WhyBlock[] {
  const chunks = raw
    .replace(/\r\n/g, "\n")
    .split(/\n\s*\n/)
    .map((chunk) => chunk.trim())
    .filter(Boolean);

  const blocks: WhyBlock[] = [];
  let current: { type: "section"; heading: string; paragraphs: string[] } | null = null;

  for (const chunk of chunks) {
    if (!chunk.includes("\n")) {
      const md = chunk.match(MARKDOWN_HEADING);
      if (md) {
        current = { type: "section", heading: md[1].trim(), paragraphs: [] };
        blocks.push(current);
        continue;
      }
      const match = chunk.match(SECTION_HEADING);
      if (match) {
        current = { type: "section", heading: `${match[1]}. ${match[2].trim()}`, paragraphs: [] };
        blocks.push(current);
        continue;
      }
    }
    if (current) {
      current.paragraphs.push(chunk);
    } else {
      blocks.push({ type: "paragraph", text: chunk });
    }
  }

  return blocks;
}

function renderInline(text: string): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, index) => {
    const bold = part.match(/^\*\*([^*]+)\*\*$/);
    if (bold) {
      return (
        <strong key={index} className="font-semibold text-[#333333]">
          {bold[1]}
        </strong>
      );
    }
    return <span key={index}>{part}</span>;
  });
}

function Paragraph({ text, className }: { text: string; className: string }) {
  const lines = text.split("\n");
  return (
    <p className={className} style={sans}>
      {lines.map((line, index) => (
        <span key={index}>
          {index > 0 ? <br /> : null}
          {renderInline(line)}
        </span>
      ))}
    </p>
  );
}

export function GlobalFluencyWhyBody({ text }: { text: string }) {
  const blocks = parseWhyBody(text);
  if (!blocks.length) return null;

  return (
    <div className="flex h-auto max-h-none flex-col gap-5 overflow-visible">
      {blocks.map((block, index) => {
        if (block.type === "paragraph") {
          return <Paragraph key={`p-${index}`} text={block.text} className={bodyClass} />;
        }

        return (
          <section
            key={`s-${index}`}
            className={`flex h-auto max-h-none flex-col gap-5 overflow-visible ${index === 0 ? "mt-2" : "mt-8"}`}
          >
            <h4
              className="m-0 h-auto max-h-none overflow-visible text-[18px] leading-[26px] font-bold text-[#333333]"
              style={sans}
            >
              {block.heading}
            </h4>
            <div className="flex h-auto max-h-none flex-col gap-4 overflow-visible">
              {block.paragraphs.map((paragraph, pIndex) => (
                <Paragraph key={pIndex} text={paragraph} className={bodyClass} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
