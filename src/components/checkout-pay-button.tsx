"use client";

import { useRef } from "react";
import { beginCheckout, type PaymentCopy, type PaymentCourse } from "@/lib/payments";

const text = { fontFamily: "var(--font-montserrat)" } as const;

export function CheckoutPayButton({
  label,
  courses,
  payment,
}: {
  label: string;
  courses: PaymentCourse[];
  payment: PaymentCopy;
}) {
  const paying = useRef(false);

  return (
    <button
      type="button"
      className="absolute top-[741px] left-[23px] flex h-[56px] w-[665px] items-center justify-center rounded-[10px] border-0 bg-[#FF9900] text-[16px] leading-[20px] font-bold text-black"
      style={text}
      onClick={() => {
        if (paying.current) return;
        paying.current = true;
        beginCheckout("card", courses, payment).finally(() => {
          paying.current = false;
        });
      }}
    >
      {label}
    </button>
  );
}
