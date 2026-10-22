"use client";

import { useEffect, useRef, useState } from "react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { loadCart, saveCart, type CartItem } from "@/lib/cart-store";
import { formatCartTotal, formatMoney } from "@/lib/money";
import { beginCheckout, hasPendingPayment, syncPaidCart, type PaymentCopy } from "@/lib/payments";

export type CartCourse = {
  slug: string;
  name: string;
  price: number;
};

export type CartLabels = {
  title: string;
  shopMore: string;
  products: string;
  price: string;
  quantity: string;
  total: string;
  delete: string;
  payWave: string;
  payCard: string;
  image: string;
};

const columns = [
  { key: "products", left: 102 },
  { key: "price", left: 854 },
  { key: "quantity", left: 1083 },
  { key: "total", left: 1312 },
] as const;

const ROW_TOP = 325.96;
const ROW_STRIDE = 216.04;
const TOTAL_TOP = 778;
const PAY_TOP = 928;
const CANVAS_HEIGHT = 1024;

const barlow = {
  fontFamily: "var(--font-barlow-condensed)",
  letterSpacing: "-0.056em",
} as const;

const inter = {
  fontFamily: "var(--font-inter)",
  letterSpacing: "0.001em",
} as const;

const payClass =
  "absolute left-[727px] flex h-[40px] w-[605px] items-center justify-center rounded-[10px] border-0 bg-[#2251FF] text-[16px] leading-[18px] font-semibold text-white";

export function CartPage({
  courses,
  labels,
  payment,
}: {
  courses: CartCourse[];
  labels: CartLabels;
  payment: PaymentCopy;
}) {
  const [items, setItems] = useState<CartItem[]>([]);
  const paying = useRef(false);

  useEffect(() => {
    let stopped = false;
    async function refresh() {
      await syncPaidCart();
      if (!stopped) setItems(loadCart());
    }
    refresh();
    const timer = window.setInterval(() => {
      if (hasPendingPayment()) refresh();
    }, 4000);
    return () => {
      stopped = true;
      window.clearInterval(timer);
    };
  }, []);

  const bySlug = new Map(courses.map((course) => [course.slug, course]));
  const lines = items.flatMap((item) => {
    const course = bySlug.get(item.slug);
    return course ? [{ item, course }] : [];
  });
  const totalAmount = lines.reduce((sum, line) => sum + line.course.price * line.item.quantity, 0);
  const extraRows = Math.max(0, lines.length - 2);
  const canvasHeight = CANVAS_HEIGHT + extraRows * ROW_STRIDE;

  function remove(lineId: string) {
    const next = items.filter((item) => item.lineId !== lineId);
    setItems(next);
    saveCart(next);
  }

  function pay(method: "wave" | "card") {
    if (paying.current || lines.length === 0) return;
    paying.current = true;
    beginCheckout(method, courses, payment).finally(() => {
      paying.current = false;
    });
  }

  return (
    <>
      <div
        className="course-viewport"
        style={canvasHeight === CANVAS_HEIGHT ? undefined : { aspectRatio: `1440 / ${canvasHeight}` }}
      >
        <div className="course-canvas" style={canvasHeight === CANVAS_HEIGHT ? undefined : { height: canvasHeight }}>
          <SiteHeader />
          <main>
            <h1
              className="absolute top-[158px] left-[656px] m-0 w-[129px] text-[40px] leading-[43px] font-extrabold whitespace-nowrap text-[#061E38]"
              style={barlow}
            >
              {labels.title}
            </h1>
            <a
              href="/courses"
              className="absolute top-[219px] left-[635px] flex h-[40px] w-[170px] items-center justify-center bg-[#2251FF] text-[16px] leading-[18px] font-semibold text-white"
              style={inter}
            >
              {labels.shopMore}
            </a>
            {columns.map((column) => (
              <p
                key={column.key}
                className="absolute top-[281px] m-0 w-[152px] text-[24px] leading-[43px] font-normal whitespace-nowrap text-[#333333]"
                style={{ ...barlow, left: column.left }}
              >
                {labels[column.key]}
              </p>
            ))}
            {lines.map((line, index) => (
              <div key={line.item.lineId} className="absolute left-[47px] h-[208px] w-[1347px]" style={{ top: ROW_TOP + index * ROW_STRIDE }}>
                <div className="absolute top-0 left-0 h-px w-[1347px] bg-black" />
                <img
                  src={labels.image}
                  alt=""
                  width={1060}
                  height={1484}
                  className="absolute top-[38.04px] left-[78px] h-[170px] w-[113px] object-cover"
                />
                <p
                  className="absolute top-[60.04px] left-[213px] m-0 w-[172px] text-[36px] leading-[43px] font-semibold whitespace-nowrap text-[#333333]"
                  style={barlow}
                >
                  {line.course.name}
                </p>
                <button
                  type="button"
                  className="absolute top-[122.04px] left-[213px] m-0 bg-transparent p-0 text-[24px] leading-[24px] font-semibold text-[#2251FF]"
                  style={inter}
                  onClick={() => remove(line.item.lineId)}
                >
                  {labels.delete}
                </button>
                <p
                  className="absolute top-[59.04px] left-[805px] m-0 w-[70px] text-[16px] leading-[24px] font-semibold whitespace-nowrap text-[#333333]"
                  style={inter}
                >
                  {formatMoney(line.course.price, payment.currencySymbol)}
                </p>
                <div
                  className="absolute top-[53.04px] left-[1035px] flex h-[30px] w-[70px] items-center justify-center border border-[#333333] bg-white text-[16px] leading-[24px] font-semibold text-black"
                  style={inter}
                >
                  {line.item.quantity}
                </div>
                <p
                  className="absolute top-[59.04px] left-[1250px] m-0 w-[70px] text-[16px] leading-[24px] font-semibold whitespace-nowrap text-[#333333]"
                  style={inter}
                >
                  {formatMoney(line.course.price * line.item.quantity, payment.currencySymbol)}
                </p>
              </div>
            ))}
            <p
              className="absolute left-[1297px] m-0 w-[70px] text-[16px] leading-[24px] font-semibold whitespace-nowrap text-[#333333]"
              style={{ ...inter, top: TOTAL_TOP + extraRows * ROW_STRIDE }}
              aria-live="polite"
            >
              {formatCartTotal(totalAmount, payment.currencySymbol)}
            </p>
            <button
              type="button"
              className="absolute left-[102px] flex h-[40px] w-[605px] items-center justify-center rounded-[10px] bg-[#2251FF] text-[16px] leading-[18px] font-semibold text-white"
              style={{ ...inter, top: PAY_TOP + extraRows * ROW_STRIDE }}
              onClick={() => pay("wave")}
            >
              {labels.payWave}
            </button>
            <button
              type="button"
              className={payClass}
              style={{ ...inter, top: PAY_TOP + extraRows * ROW_STRIDE }}
              onClick={() => pay("card")}
            >
              {labels.payCard}
            </button>
          </main>
        </div>
      </div>
      <SiteFooter />
    </>
  );
}
