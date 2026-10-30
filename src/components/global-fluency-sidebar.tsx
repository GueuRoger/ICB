"use client";

import { useLayoutEffect, useState, type MouseEvent } from "react";
import { useCopy } from "@/i18n/provider";
import { addCartItem } from "@/lib/cart-store";
import { formatMoney } from "@/lib/money";

/** Same CMS keys as section headings, except resources (shorter nav label). */
const links = [
  { key: "description_word", id: "course-description" },
  { key: "breakdown_word", id: "course-breakdown" },
  { key: "technology", id: "innovative-technology" },
  { key: "link_resources", id: "proven-content" },
  { key: "faqs", id: "faqs" },
] as const;

const HEADER_HEIGHT = 132;

function scrollToSection(event: MouseEvent<HTMLAnchorElement>, id: string) {
  const target = document.getElementById(id);
  if (!target) return;
  event.preventDefault();
  const page = document.querySelector(".global-fluency-page");
  const scale = page instanceof HTMLElement ? Math.min(1, page.getBoundingClientRect().width / 1440) : 1;
  const top = target.getBoundingClientRect().top + window.scrollY - HEADER_HEIGHT * scale;
  window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  history.pushState(null, "", `#${id}`);
}

const SIDEBAR_WIDTH = 308;
const SIDEBAR_HEIGHT = 884;
const SIDEBAR_LEFT = 1112;

export function GlobalFluencySidebar({
  name,
  price,
  coverImage,
}: {
  name: string;
  price: number;
  /** Same course product image as the courses catalog (`courses.thumbnail_url`). */
  coverImage: string;
}) {
  const text = useCopy("global-fluency", "shared");
  const [box, setBox] = useState({ top: 16, left: SIDEBAR_LEFT, scale: 1 });

  useLayoutEffect(() => {
    const page = document.querySelector(".global-fluency-page");
    if (!(page instanceof HTMLElement)) return;

    const update = () => {
      const rect = page.getBoundingClientRect();
      const scale = Math.min(1, rect.width / 1440);
      const margin = 16 * scale;
      const visualHeight = SIDEBAR_HEIGHT * scale;
      const belowHeader = 132 * scale;
      const topPin =
        belowHeader + visualHeight + margin <= window.innerHeight ? belowHeader : margin;
      const bottomPin = Math.min(topPin, window.innerHeight - visualHeight - margin);
      const pageBottom = rect.bottom + window.scrollY;
      const pageEndScroll = Math.max(0, pageBottom - window.innerHeight);
      const reveal = Math.max(1, Math.min(window.innerHeight, pageEndScroll));
      const intoEnd = Math.min(1, Math.max(0, (window.scrollY - (pageEndScroll - reveal)) / reveal));
      let top = topPin + (bottomPin - topPin) * intoEnd;

      const footer = document.querySelector("footer");
      const footerHeight =
        footer instanceof HTMLElement ? footer.getBoundingClientRect().height : visualHeight;
      const entered = Math.max(0, window.innerHeight - rect.bottom);
      if (entered > 0) {
        const travel = Math.max(1, Math.min(footerHeight, window.innerHeight));
        top -= (top + visualHeight) * Math.min(1, entered / travel);
      }

      // Keep the purchase card in the right gutter; fall back to padding edge on narrow viewports.
      const left = Math.max(rect.left + 16, rect.right - SIDEBAR_WIDTH * scale - 16);

      setBox({
        top,
        left,
        scale,
      });
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(page);
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update);
    };
  }, []);

  return (
    <aside
      className="global-fluency-sidebar"
      aria-label={text("sidebar_label")}
      style={{
        position: "fixed",
        zIndex: 30,
        top: box.top,
        left: box.left,
        width: SIDEBAR_WIDTH,
        height: SIDEBAR_HEIGHT,
        transform: `scale(${box.scale})`,
        transformOrigin: "top left",
        background: "transparent",
      }}
    >
      <div className="absolute top-[83px] left-0 h-[801px] w-[308px] bg-[#EFF0F0]" />
      <img
        src={coverImage}
        alt={name}
        className="absolute top-0 left-[102px] h-auto w-[104px] max-w-[104px] object-contain"
      />
      <img
        src={coverImage}
        alt=""
        className="absolute top-[146px] left-[34px] h-auto w-[42px] max-w-[42px] object-contain"
      />
      <img
        src={coverImage}
        alt=""
        className="absolute top-[146px] left-[116px] h-auto w-[42px] max-w-[42px] object-contain"
      />
      <h2
        className="absolute top-[210px] left-0 w-[308px] text-center text-[24px] leading-[30px] font-bold text-[#333333]"
        style={{ fontFamily: "var(--font-montserrat)" }}
      >
        {name}
      </h2>
      <p
        className="absolute top-[246px] left-0 w-[308px] text-center text-[16px] leading-[22px] font-normal text-[#333333]"
        style={{ fontFamily: "var(--font-montserrat)" }}
      >
            {formatMoney(price, text("currency_symbol"))}
      </p>
      <p
        className="absolute top-[276px] left-[32px] flex h-[28px] items-center gap-[8px] bg-white px-[8px] text-[14px] leading-[18px] text-[#222222]"
        style={{ fontFamily: "var(--font-montserrat)" }}
      >
        <img src={text("flag_image")} alt="" width={28} height={14} className="h-[14px] w-[28px] object-cover" />
        {text("course_language")}
        <img src="/images/chevron.svg" alt="" width={12} height={8} className="h-[8px] w-[12px]" />
      </p>
      <a
        href="/courses/global-fluency/payment"
        onClick={() => addCartItem("global-fluency")}
        className="absolute top-[332px] left-[69px] flex h-[40px] w-[170px] items-center justify-center bg-[#2251FF] text-[16px] leading-[18px] font-semibold text-white"
        style={{ fontFamily: "var(--font-inter)", letterSpacing: "0.001em" }}
      >
        {text("buy_now")}
      </a>
      <ul
        className="absolute top-[610px] left-[50px] m-0 flex list-none flex-col gap-[14px] p-0 text-[16px] leading-[22px] font-bold whitespace-nowrap text-[#333333]"
        style={{ fontFamily: "var(--font-montserrat)" }}
      >
        {links.map((item) => (
          <li key={item.id}>
            <a href={`#${item.id}`} onClick={(event) => scrollToSection(event, item.id)}>
              {text(item.key)}
            </a>
          </li>
        ))}
      </ul>
      <a
        href="/courses/global-fluency/payment"
        onClick={() => addCartItem("global-fluency")}
        className="absolute top-[790px] left-[69px] flex h-[40px] w-[170px] items-center justify-center bg-[#2251FF] text-[16px] leading-[18px] font-semibold text-white"
        style={{ fontFamily: "var(--font-inter)", letterSpacing: "0.001em" }}
      >
        {text("buy_now")}
      </a>
    </aside>
  );
}
