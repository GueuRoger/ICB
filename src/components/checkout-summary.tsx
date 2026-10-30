"use client";

import { useEffect, useState } from "react";
import { loadCart, type CartItem } from "@/lib/cart-store";
import { formatMoney } from "@/lib/money";

type Course = {
  slug: string;
  name: string;
  price: number;
};

const text = { fontFamily: "var(--font-montserrat)" } as const;
const condensed = { fontFamily: "var(--font-barlow-condensed)" } as const;

const FIRST_TOP = 112;
const STRIDE = 211;
const TOTAL_TOP = 596;

export function CheckoutSummary({
  courses,
  image,
  totalLabel,
  currencySymbol,
}: {
  courses: Course[];
  image: string;
  totalLabel: string;
  currencySymbol: string;
}) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    setItems(loadCart());
  }, []);

  const bySlug = new Map(courses.map((course) => [course.slug, course]));
  const lines = items.flatMap((item) => {
    const course = bySlug.get(item.slug);
    return course ? [{ item, course }] : [];
  });
  const total = lines.reduce((sum, line) => sum + line.course.price * line.item.quantity, 0);
  const totalTop = lines.length > 2 ? TOTAL_TOP + (lines.length - 2) * STRIDE : TOTAL_TOP;

  return (
    <>
      {lines.map((line, index) => {
        const top = FIRST_TOP + index * STRIDE;
        return (
          <div key={line.item.lineId}>
            <div className="absolute left-[74px] h-[160px] w-[112px] rounded-[16px] bg-white" style={{ top }} />
            <img
              src={image}
              alt=""
              className="absolute left-[82px] h-auto max-h-[144px] w-auto max-w-[96px] object-contain"
              style={{ top: top + 8 }}
            />
            <span
              className="absolute flex h-[22px] w-[22px] items-center justify-center rounded-full bg-black text-[12px] leading-[14px] font-semibold text-white"
              style={{ ...text, top: top - 6, left: 168 }}
            >
              {line.item.quantity}
            </span>
            <p
              className="absolute left-[208px] m-0 text-[24px] leading-[30px] font-semibold text-[#333333]"
              style={{ ...condensed, top: top + 52 }}
            >
              {line.course.name}
            </p>
            <p
              className="absolute left-[560px] m-0 w-[80px] text-right text-[16px] leading-[30px] font-semibold text-[#333333]"
              style={{ ...text, top: top + 52 }}
            >
              {formatMoney(line.course.price * line.item.quantity, currencySymbol)}
            </p>
          </div>
        );
      })}
      <p className="absolute left-[74px] m-0 text-[28px] leading-[34px] font-bold text-[#333333]" style={{ ...text, top: totalTop }}>
        {totalLabel}
      </p>
      <p
        className="absolute left-[560px] m-0 w-[80px] text-right text-[16px] leading-[30px] font-semibold text-[#333333]"
        style={{ ...text, top: totalTop + 4 }}
      >
        {formatMoney(total, currencySymbol)}
      </p>
    </>
  );
}
