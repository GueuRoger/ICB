"use client";

import { useCopy } from "@/i18n/provider";

export function LogoMark() {
  const text = useCopy("shared");
  return (
    <img
      src={text("logo")}
      alt=""
      width={100}
      height={50}
      className="absolute top-[27px] left-[34px] h-[50px] w-[100px]"
    />
  );
}
