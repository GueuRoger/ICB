"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { LogoMark } from "@/components/logo-mark";
import type { Locale } from "@/i18n/locale";
import { useCopy, useLocale, useSetLocale } from "@/i18n/provider";

const links = [
  { key: "nav_about", href: "/about", en: { left: 0, width: 56 }, fr: { left: 0, width: 96 } },
  { key: "nav_products", href: "/courses", en: { left: 105, width: 108 }, fr: { left: 116, width: 128 } },
  { key: "nav_news", href: "/news", en: { left: 262, width: 51 }, fr: { left: 264, width: 108 } },
  { key: "nav_login", href: "/login", en: { left: 362, width: 46 }, fr: { left: 392, width: 108 } },
] as const;

const languages: { locale: Locale; label: string; flag: string }[] = [
  { locale: "en", label: "English", flag: "/images/flag.png" },
  { locale: "fr", label: "Français", flag: "/images/flag-fr.svg" },
];

export function SiteHeader({ cart = false }: { cart?: boolean }) {
  const locale = useLocale();
  const text = useCopy("shared");
  const setLocale = useSetLocale();
  const [open, setOpen] = useState(false);
  const [menuBox, setMenuBox] = useState<{ top: number; left: number; scale: number } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const french = locale === "fr";

  useEffect(() => {
    if (!open) return;
    function place() {
      const rect = triggerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const scale = rect.height / 24;
      setMenuBox({ top: rect.bottom + 7 * scale, left: rect.left, scale });
    }
    place();
    function onPointerDown(event: PointerEvent) {
      const target = event.target as Node;
      if (menuRef.current?.contains(target) || listRef.current?.contains(target)) return;
      setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function choose(next: Locale) {
    setLocale(next);
    setOpen(false);
  }

  return (
    <header className="absolute top-0 left-0 z-10 h-[132px] w-[1440px] bg-[#061E38] text-white">
      <LogoMark />
      <a
        href="/"
        className="absolute top-[19px] left-[160px] w-[90px] text-[27px] leading-[33px] font-semibold"
        style={{ fontFamily: "var(--font-source-serif)" }}
      >
        {text("brand_first")}
        <br />
        {text("brand_last")}
      </a>
      <div ref={menuRef}>
        {french ? (
          <button
            ref={triggerRef}
            type="button"
            className="absolute top-[41px] left-[267px] flex h-[24px] items-center bg-transparent p-0 text-white"
            style={{ fontFamily: "var(--font-inter)", letterSpacing: "0.001em" }}
            aria-label={text("language_aria")}
            aria-haspopup="listbox"
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            <img src="/images/flag-fr.svg" alt="" width={39} height={20} className="h-[20px] w-[39px] object-cover" />
            <span className="ml-[8px] text-[16px] leading-[18px] font-semibold">{text("language_current")}</span>
            <img src="/images/chevron.svg" alt="" width={15} height={10} className="ml-[8px] h-[10px] w-[15px]" />
          </button>
        ) : (
          <button
            ref={triggerRef}
            type="button"
            className="absolute top-[41px] left-[267px] h-[24px] w-[128px] bg-transparent p-0 text-white"
            style={{ fontFamily: "var(--font-inter)", letterSpacing: "0.001em" }}
            aria-label={text("language_aria")}
            aria-haspopup="listbox"
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            <img
              src="/images/flag.png"
              alt=""
              width={39}
              height={20}
              className="absolute top-[2px] left-0 h-[20px] w-[39px] object-cover"
            />
            <span className="absolute top-0 left-[47px] h-[18px] w-[67px] text-left text-[16px] leading-[18px] font-semibold">
              {text("language_current")}
            </span>
            <img
              src="/images/chevron.svg"
              alt=""
              width={15}
              height={10}
              className="absolute top-[8px] left-[113px] h-[10px] w-[15px]"
            />
          </button>
        )}
        {open && menuBox
          ? createPortal(
              <ul
                ref={listRef}
                role="listbox"
                aria-label={text("language_menu_label")}
                className="m-0 list-none bg-white text-[#061E38] shadow-[0_8px_24px_rgba(6,30,56,0.18)]"
                style={{
                  position: "fixed",
                  top: menuBox.top,
                  left: menuBox.left,
                  zIndex: 80,
                  width: 168 * menuBox.scale,
                  padding: 4 * menuBox.scale,
                }}
              >
                {languages.map((language) => (
                  <li key={language.locale}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={locale === language.locale}
                      className="flex w-full items-center bg-transparent text-left font-semibold"
                      style={{
                        fontFamily: "var(--font-inter)",
                        letterSpacing: "0.001em",
                        height: 36 * menuBox.scale,
                        gap: 10 * menuBox.scale,
                        paddingInline: 8 * menuBox.scale,
                        fontSize: 16 * menuBox.scale,
                        lineHeight: `${18 * menuBox.scale}px`,
                      }}
                      onClick={() => choose(language.locale)}
                    >
                      <img
                        src={language.flag}
                        alt=""
                        width={39}
                        height={20}
                        className="object-cover"
                        style={{ height: 20 * menuBox.scale, width: 39 * menuBox.scale }}
                      />
                      {text(language.locale === "fr" ? "language_option_fr" : "language_option_en")}
                    </button>
                  </li>
                ))}
              </ul>,
              document.body,
            )
          : null}
      </div>
      <nav
        aria-label={text("nav_label")}
        className={`absolute top-[43px] left-[531px] h-[18px] ${cart ? (french ? "w-[600px]" : "w-[510px]") : french ? "w-[510px]" : "w-[408px]"}`}
      >
        {links.map((link) => {
          const place = french ? link.fr : link.en;
          return (
            <a
              key={link.href}
              href={link.href}
              className={`absolute top-0 h-[18px] text-[16px] leading-[18px] font-semibold ${french ? "whitespace-nowrap" : ""}`}
              style={{
                fontFamily: "var(--font-inter)",
                letterSpacing: "0.001em",
                left: place.left,
                width: place.width,
              }}
            >
              {text(link.key)}
            </a>
          );
        })}
        {cart ? (
          <a
            href="/courses/global-fluency/payment"
            className="absolute top-0 h-[18px] text-[16px] leading-[18px] font-semibold whitespace-nowrap"
            style={{
              fontFamily: "var(--font-inter)",
              letterSpacing: "0.001em",
              left: french ? 520 : 457,
              width: french ? 72 : 46,
            }}
          >
            {text("nav_cart")}
          </a>
        ) : null}
      </nav>
    </header>
  );
}
