"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { LogoMark } from "@/components/logo-mark";
import type { Locale } from "@/i18n/locale";
import { useCopy, useLocale, useSetLocale } from "@/i18n/provider";
import { supabase } from "@/lib/supabase";

const primaryLinks = [
  { key: "nav_about", href: "/about" },
  { key: "nav_products", href: "/courses" },
  { key: "nav_news", href: "/news" },
] as const;

const languages: { locale: Locale; label: string; flag: string }[] = [
  { locale: "en", label: "English", flag: "/images/flag.png" },
  { locale: "fr", label: "Français", flag: "/images/flag-fr.svg" },
];

const navLinkClass = "h-[18px] shrink-0 text-[16px] leading-[18px] font-semibold";
const navLinkStyle = { fontFamily: "var(--font-inter)", letterSpacing: "0.001em" } as const;
const MY_COURSE_LOGIN_HREF = `/login?next=${encodeURIComponent("/my-course")}`;

export function SiteHeader({ cart = false }: { cart?: boolean }) {
  const locale = useLocale();
  const text = useCopy("shared");
  const setLocale = useSetLocale();
  const router = useRouter();
  const [langOpen, setLangOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [langBox, setLangBox] = useState<{ top: number; left: number; scale: number } | null>(null);
  const [accountBox, setAccountBox] = useState<{ top: number; left: number; scale: number } | null>(
    null,
  );
  const langMenuRef = useRef<HTMLDivElement>(null);
  const langTriggerRef = useRef<HTMLButtonElement>(null);
  const langListRef = useRef<HTMLUListElement>(null);
  const accountMenuRef = useRef<HTMLDivElement>(null);
  const accountTriggerRef = useRef<HTMLButtonElement>(null);
  const accountListRef = useRef<HTMLUListElement>(null);
  const french = locale === "fr";

  useEffect(() => {
    let cancelled = false;
    void supabase.auth.getSession().then(({ data: { session } }) => {
      if (!cancelled) setAuthed(Boolean(session?.user));
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthed(Boolean(session?.user));
    });
    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!langOpen) return;
    function place() {
      const rect = langTriggerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const scale = rect.height / 24;
      setLangBox({ top: rect.bottom + 7 * scale, left: rect.left, scale });
    }
    place();
    function onPointerDown(event: PointerEvent) {
      const target = event.target as Node;
      if (langMenuRef.current?.contains(target) || langListRef.current?.contains(target)) return;
      setLangOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setLangOpen(false);
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
  }, [langOpen]);

  useEffect(() => {
    if (!accountOpen) return;
    function place() {
      const rect = accountTriggerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const scale = Math.max(rect.height / 18, 0.5);
      setAccountBox({ top: rect.bottom + 8 * scale, left: rect.left, scale });
    }
    place();
    function onPointerDown(event: PointerEvent) {
      const target = event.target as Node;
      if (accountMenuRef.current?.contains(target) || accountListRef.current?.contains(target)) {
        return;
      }
      setAccountOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setAccountOpen(false);
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
  }, [accountOpen]);

  function choose(next: Locale) {
    setLocale(next);
    setLangOpen(false);
  }

  async function logout() {
    setAccountOpen(false);
    setAuthed(false);
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
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
      <div ref={langMenuRef}>
        {french ? (
          <button
            ref={langTriggerRef}
            type="button"
            className="absolute top-[41px] left-[267px] flex h-[24px] items-center bg-transparent p-0 text-white"
            style={{ fontFamily: "var(--font-inter)", letterSpacing: "0.001em" }}
            aria-label={text("language_aria")}
            aria-haspopup="listbox"
            aria-expanded={langOpen}
            onClick={() => {
              setAccountOpen(false);
              setLangOpen((value) => !value);
            }}
          >
            <img src="/images/flag-fr.svg" alt="" width={39} height={20} className="h-[20px] w-[39px] object-cover" />
            <span className="ml-[8px] text-[16px] leading-[18px] font-semibold">{text("language_current")}</span>
            <img src="/images/chevron.svg" alt="" width={15} height={10} className="ml-[8px] h-[10px] w-[15px]" />
          </button>
        ) : (
          <button
            ref={langTriggerRef}
            type="button"
            className="absolute top-[41px] left-[267px] h-[24px] w-[128px] bg-transparent p-0 text-white"
            style={{ fontFamily: "var(--font-inter)", letterSpacing: "0.001em" }}
            aria-label={text("language_aria")}
            aria-haspopup="listbox"
            aria-expanded={langOpen}
            onClick={() => {
              setAccountOpen(false);
              setLangOpen((value) => !value);
            }}
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
        {langOpen && langBox
          ? createPortal(
              <ul
                ref={langListRef}
                role="listbox"
                aria-label={text("language_menu_label")}
                className="m-0 list-none bg-white text-[#061E38] shadow-[0_8px_24px_rgba(6,30,56,0.18)]"
                style={{
                  position: "fixed",
                  top: langBox.top,
                  left: langBox.left,
                  zIndex: 80,
                  width: 168 * langBox.scale,
                  padding: 4 * langBox.scale,
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
                        height: 36 * langBox.scale,
                        gap: 10 * langBox.scale,
                        paddingInline: 8 * langBox.scale,
                        fontSize: 16 * langBox.scale,
                        lineHeight: `${18 * langBox.scale}px`,
                      }}
                      onClick={() => choose(language.locale)}
                    >
                      <img
                        src={language.flag}
                        alt=""
                        width={39}
                        height={20}
                        className="object-cover"
                        style={{ height: 20 * langBox.scale, width: 39 * langBox.scale }}
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
        className="absolute top-[43px] left-[531px] flex h-[18px] items-center whitespace-nowrap"
        style={{ gap: french ? 20 : 49 }}
      >
        {primaryLinks.map((link) => (
          <a key={link.href} href={link.href} className={navLinkClass} style={navLinkStyle}>
            {text(link.key)}
          </a>
        ))}
        <div ref={accountMenuRef} className="relative shrink-0">
          <button
            ref={accountTriggerRef}
            type="button"
            className={`${navLinkClass} flex items-center gap-[6px] bg-transparent p-0 text-white`}
            style={navLinkStyle}
            aria-haspopup="menu"
            aria-expanded={accountOpen}
            aria-label={text("nav_account")}
            onClick={() => {
              setLangOpen(false);
              setAccountOpen((value) => !value);
            }}
          >
            <span>{text("nav_account")}</span>
            <img src="/images/chevron.svg" alt="" width={12} height={8} className="h-[8px] w-[12px]" />
          </button>
          {accountOpen && accountBox
            ? createPortal(
                <ul
                  ref={accountListRef}
                  role="menu"
                  aria-label={text("nav_account_menu_label")}
                  className="m-0 list-none bg-white text-[#061E38] shadow-[0_8px_24px_rgba(6,30,56,0.18)]"
                  style={{
                    position: "fixed",
                    top: accountBox.top,
                    left: accountBox.left,
                    zIndex: 80,
                    minWidth: 168 * accountBox.scale,
                    padding: 4 * accountBox.scale,
                  }}
                >
                  <li role="none">
                    <a
                      role="menuitem"
                      href={authed ? "/my-course" : MY_COURSE_LOGIN_HREF}
                      className="flex w-full items-center bg-transparent text-left font-semibold text-[#061E38]"
                      style={{
                        fontFamily: "var(--font-inter)",
                        letterSpacing: "0.001em",
                        height: 36 * accountBox.scale,
                        paddingInline: 12 * accountBox.scale,
                        fontSize: 16 * accountBox.scale,
                        lineHeight: `${18 * accountBox.scale}px`,
                      }}
                      onClick={() => setAccountOpen(false)}
                    >
                      {text("nav_my_course")}
                    </a>
                  </li>
                  <li role="none">
                    <a
                      role="menuitem"
                      href="/login"
                      className="flex w-full items-center bg-transparent text-left font-semibold text-[#061E38]"
                      style={{
                        fontFamily: "var(--font-inter)",
                        letterSpacing: "0.001em",
                        height: 36 * accountBox.scale,
                        paddingInline: 12 * accountBox.scale,
                        fontSize: 16 * accountBox.scale,
                        lineHeight: `${18 * accountBox.scale}px`,
                      }}
                      onClick={() => setAccountOpen(false)}
                    >
                      {text("nav_login")}
                    </a>
                  </li>
                  {authed ? (
                    <li role="none">
                      <button
                        type="button"
                        role="menuitem"
                        className="flex w-full items-center bg-transparent text-left font-semibold text-[#061E38]"
                        style={{
                          fontFamily: "var(--font-inter)",
                          letterSpacing: "0.001em",
                          height: 36 * accountBox.scale,
                          paddingInline: 12 * accountBox.scale,
                          fontSize: 16 * accountBox.scale,
                          lineHeight: `${18 * accountBox.scale}px`,
                        }}
                        onClick={() => void logout()}
                      >
                        {text("nav_logout")}
                      </button>
                    </li>
                  ) : null}
                </ul>,
                document.body,
              )
            : null}
        </div>
        {cart ? (
          <a
            href="/courses/global-fluency/payment"
            className={navLinkClass}
            style={navLinkStyle}
          >
            {text("nav_cart")}
          </a>
        ) : null}
      </nav>
    </header>
  );
}
