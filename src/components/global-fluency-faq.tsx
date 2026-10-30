"use client";

import { useId, useState } from "react";

export type GlobalFluencyFaqItem = {
  question: string;
  answerLabel: string;
  answer: string;
};

const sans = { fontFamily: "var(--font-montserrat)" } as const;

export function GlobalFluencyFaq({ items }: { items: GlobalFluencyFaqItem[] }) {
  const baseId = useId();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  function toggle(index: number) {
    setOpenIndex((current) => (current === index ? null : index));
  }

  return (
    <div className="flex h-auto flex-col gap-6 overflow-visible">
      {items.map((item, index) => {
        const open = openIndex === index;
        const panelId = `${baseId}-panel-${index}`;
        const buttonId = `${baseId}-button-${index}`;

        return (
          <div key={`${item.question}-${index}`} className="flex h-auto flex-col overflow-visible">
            <button
              type="button"
              id={buttonId}
              aria-expanded={open}
              aria-controls={panelId}
              onClick={() => toggle(index)}
              className="flex w-full cursor-pointer items-start justify-between gap-4 border-0 bg-transparent p-0 text-left"
            >
              <span
                className="m-0 h-auto max-h-none overflow-visible text-[18px] leading-[24px] font-bold text-[#333333]"
                style={sans}
              >
                {item.question}
              </span>
              <img
                src={open ? "/icons/minus.svg" : "/icons/plus.svg"}
                alt=""
                width={28}
                height={28}
                className="mt-[2px] h-[28px] w-[28px] shrink-0"
                aria-hidden="true"
              />
            </button>

            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              aria-hidden={!open}
              className="grid transition-[grid-template-rows] duration-300 ease-out"
              style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
            >
              <div className={open ? "min-h-0 overflow-visible" : "min-h-0 overflow-hidden"}>
                <div
                  className={`flex h-auto flex-col gap-2 overflow-visible pt-6 sm:flex-row sm:gap-6 ${open ? "" : "invisible"}`}
                >
                  <p
                    className="m-0 shrink-0 text-[18px] leading-[24px] font-bold text-[#333333]"
                    style={sans}
                  >
                    {item.answerLabel}
                  </p>
                  <p
                    className="m-0 h-auto max-h-none max-w-[730px] overflow-visible text-[16px] leading-[24px] font-normal text-[#5c5c5c]"
                    style={sans}
                  >
                    {item.answer}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
